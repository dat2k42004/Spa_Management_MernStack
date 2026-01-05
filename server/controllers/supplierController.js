import Supplier from "../models/Supplier.js";
import User from "../models/User.js";
import { textNormalize } from "../services/textService.js";
import { searchFunc } from "../services/searchService.js";
import { deleteFile, deleteFiles } from "../services/uploadService.js";


// get: api/supplier/add (requiredUser)
const addSupplier = async (req, res) => {
     const qr = req.file && req.file.filename ? "uploads/qr/" + req.file.filename : null;
     try {
          const userId = req.user.id;
          let { name, email, tel, address, paymentInfo } = req.body;
          paymentInfo = paymentInfo && typeof paymentInfo === "string" ? JSON.parse(paymentInfo) : null;

          // check user exists
          const user = await User.findOne({ _id: userId, isDeleted: false });

          if (!user) {
               deleteFile(qr);
               return res.status(400).json({
                    success: false,
                    message: "User not found",
               })
          }

          // check permission
          if (user.role.type === "USER" && user.role.position !== "MANAGER" && user.role.position !== "WAREHOUSE") {
               deleteFile(qr);
               return res.status(400).json({
                    success: false,
                    message: "You do not have permission to add supplier",
               })
          }

          // check null fields
          if (!name || !email || !tel || !address) {
               deleteFile(qr);
               return res.status(400).json({
                    success: false,
                    message: "Missing required fields",
               })
          }

          name = textNormalize(name, "name");
          address = textNormalize(address, "address");
          paymentInfo = paymentInfo ? {
               ...paymentInfo,
               qrCode: qr,
          } : null;



          // check supplier exists
          const supplier = await Supplier.findOne(
               {
                    $or: [
                         { name: name },
                         { email: email },
                         { tel: tel },
                    ]
               }
          )

          if (supplier) {
               deleteFile(qr);
               return res.status(400).json({
                    success: false,
                    message: "Supplier existed"
               })
          }

          const newSupplier = new Supplier({
               name: name,
               email: email,
               address: address,
               tel: tel,
               paymentInfo: paymentInfo,
               isDeleted: false,
          })

          await newSupplier.save();

          return res.status(200).json({
               success: true,
               message: "Add supplier successfully",
               data: {
                    supplier: newSupplier,
               }
          })
     }
     catch (error) {
          deleteFile(qr);
          console.log("[addSupplier] Error: ");
          return res.status(500).json({
               success: false,
               message: error.message,
          })
     }
}


// put: api/supplier/update/:id (requiredUser)
const updateSupplier = async (req, res) => {
     const qr = req.file && req.file.filename ? 'uploads/qr/' + req.file.filename : null;
     try {
          const userId = req.user.id;
          const supplierId = req.params.id;
          let { address, paymentInfo } = req.body;

          paymentInfo = paymentInfo && typeof paymentInfo === "string" ? JSON.parse(paymentInfo) : null;

          // check user exists
          const user = await User.findOne({
               _id: userId,
               isDeleted: false,
          });

          if (!user) {
               deleteFile(qr);
               return res.status(400).json({
                    success: false,
                    message: "User not found",
               })
          }

          // check permission
          if (user.role.type === "USER" && user.role.position !== "MANAGER" && user.role.position !== "WAREHOUSE") {
               deleteFile(qr);
               return res.status(400).json({
                    success: false,
                    message: "You do not have permission to update supplier",
               })
          }

          // check null fields
          if (!address) {
               deleteFile(qr);
               return res.status(400).json({
                    success: false,
                    message: "Missing required fields",
               })
          }

          // check supplier exists
          const supplier = await Supplier.findOne({
               _id: supplierId,
               isDeleted: false,
          });

          if (!supplier) {
               deleteFile(qr);
               return res.status(400).json({
                    success: false,
                    message: "Supplier not found",
               })
          }

          // check new info
          address = textNormalize(address, "address");
          console.log(paymentInfo === supplier.paymentInfo);
          if (address === supplier.address && paymentInfo && paymentInfo === supplier.paymentInfo && !qr) {
               deleteFile(qr);
               console.log("[updateSupplier] no change detected");
               return res.status(400).json({
                    success: false,
                    message: "Nothing to update",
               })
          }

          if (!paymentInfo) {
               deleteFile(qr);
               return res.status(400).json({
                    success: false,
                    message: "Missing required fields",
               })
          }

          if (qr) {
               // deleted old qr code
               if (supplier.paymentInfo) {
                    deleteFile(supplier.paymentInfo.qrCode);
               }
               paymentInfo = {
                    ...paymentInfo,
                    qrCode: qr,
               }
          }


          // update supplier
          supplier.address = address;
          supplier.paymentInfo = paymentInfo;

          await supplier.save();
          return res.status(200).json({
               success: true,
               message: "Update supplier successfully",
               data: {
                    supplier: supplier,
               }
          })
     }
     catch (error) {
          deleteFile(qr);
          console.log("[updateSupplier] Error: ", error)
          return res.status(500).json({
               success: false,
               message: error.message,
          })
     }
}


// get: api/supplier/get-all (requiredUser)
const getAllSuppliers = async (req, res) => {
     try {
          const userId = req.user.id;
          const limit = parseInt(req.query.limit) || 10;
          const page = parseInt(req.query.page) || 1;
          const skip = (page - 1) * limit;

          // check user exists
          const user = await User.findOne({ _id: userId, isDeleted: false });
          if (!user) {
               return res.status(400).json({
                    success: false,
                    message: "User not found",
               })
          }

          // check permission
          if (user.role.type === "USER" && user.role.position !== "MANAGER" && user.role.position !== "WAREHOUSE") {
               return res.status(400).json({
                    success: false,
                    message: "You do not have permission to get all suppliers",
               })
          }

          // get all suppliers
          const suppliers = await Supplier.find({
               isDeleted: false,
          }).skip(skip).limit(limit).sort({ createAt: -1 });

          return res.status(200).json({
               success: true,
               message: "Get all suppliers successfully",
               data: {
                    suppliers: suppliers,
               }
          })
     }
     catch (error) {
          console.log("[getAllSuppliers] Error: ", error);
          return res.status(500).json({
               success: false,
               message: error.message
          })
     }
}


// get: api/supplier/search (requiredUser)
const searchSupplier = async (req, res) => {
     try {
          const userId = req.user.id;
          const search = req.query.search || "";
          const limit = parseInt(req.query.limit) || 10;
          const page = parseInt(req.query.page) || 1;
          const skip = (page - 1) * limit;


          // check user exists
          const user = await User.findOne({ _id: userId, iseDeleted: false });
          if (!user) {
               return res.status(400).json({
                    success: false,
                    message: "User not found",
               })
          }

          // check permission
          if (user.role.type === "USER" && user.role.position !== "MANAGER" & user.role.position !== "WAREHOUSE"); {
               return res.status(400).json({
                    success: false,
                    message: "You do not have permission to search supplier"
               })
          }

          const result = await searchFunc(search, Supplier, "name", limit, skip,)

          if (result.length === 0) {
               return res.status(200).json({
                    success: true,
                    message: "No supplier found",
               })
          }

          return res.status(200).json({
               success: true,
               message: "Search Supplier successfully",
          })
     }
     catch (error) {
          console.log('[searchSupplier] Error: ', error);
          return res.status(500).json({
               success: false,
               message: error.message,
          })
     }
}


// delete: api/supplier/delete/:id (requiredUser)
const deleteSupplier = async (req, res) => {
     try {
          const userId = req.user.id;
          const id = req.params.id;

          // check user exists
          const user = await User.findOne({
               _id: userId,
               isDeleted: false,
          })

          if (!user) {
               return res.status(400).json({
                    success: false,
                    message: "User not found",
               })
          }

          // check permission
          if (user.role.type === "USER" && user.role.position !== "MANAGER" && user.role.position !== "WAREHOUSE") {
               return res.status(400).json({
                    success: false,
                    message: "You do not have permission to delete supplier",
               })
          }

          // check supplier exists
          const supplier = await Supplier.findOne({
               _id: id,
               isDeleted: false,
          })

          if (!supplier) {
               return res.status(400).json({
                    success: false,
                    message: "Supplier not found",
               })
          }

          // delete supplier
          supplier.isDeleted = true;
          await supplier.save();

          return res.status(200).json({
               success: true,
               message: "Delete supplier successfully",
          })
     }
     catch (error) {
          console.log("[deleteSupplier] Error: ", error);
          return res.status(500).json({
               success: false,
               message: error.message,
          })
     }
}


export {
     addSupplier,
     updateSupplier,
     getAllSuppliers,
     searchSupplier,
     deleteSupplier,
}