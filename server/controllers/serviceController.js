import Service from "../models/Service.js";
import User from "../models/User.js";
import Device from "../models/Device.js";
import { textNormalize } from "../services/textService.js";

// post: api/service/add (requiredUser)
const addService = async (req, res) => {
     try {
          const userId = req.user.id;
          let { name, description, deviceId } = req.body;

          // check user exist
          const user = await User.findOne({ _id: userId, isDeleted: false });
          if (!user) {
               return res.status(400).json({
                    success: false,
                    message: "User not found",
               })
          }

          // check permission
          if (user.role.type === "USER" && user.role.position !== "MANAGER") {
               return res.status(400).json({
                    success: false,
                    message: "You do not have permission to add service",
               })
          }

          // check device exist
          const device = await Device.findOne({ _id: deviceId, isDeleted: false });
          if (!device) {
               return res.status(400).json({
                    success: false,
                    message: "Device not found",
               })
          }

          // check null fields
          if (!name || !deviceId) {
               return res.status(400).json({
                    success: false,
                    message: "Missing required fields",
               })
          }

          // check service exist
          name = textNormalize(name);
          description = description ? textNormalize(description) : "";
          const existedService = await Service.findOne({
               $or: {
                    name: name,
                    deviceId: deviceId
               }
          })

          if (existedService) {
               return res.status(400).json({
                    success: false,
                    message: "Service already exist",
               })
          }

          // create new service
          const newService = new Service({
               name: name,
               description: description || "",
               deviceId: deviceId,
               isDeleted: false,
               status: "INACTIVE",
               price: 0,
          })

          await newService.save();

          res.status(200).json({
               success: true,
               message: "Add service successfully",
               data: {
                    service: newService,
               }
          })

     }
     catch (error) {
          console.log("[addService] Error: ", error.message);
          return res.status(500).json({
               success: false,
               message: error.message,
          })
     }
}

// put: api/service/update/:id (requiredUser)
const updateService = async (req, res) => {
     try {
          const userId = req.user.id;
          const serviceId = req.params.id;
          let { description, status, price } = req.body;

          // check user exist
          const user = await User.findOne({ _id: userId, isDeleted: false });
          if (!user) {
               return res.status(400).json({
                    success: false,
                    message: 'User not found',
               })
          }

          // check permission
          if (user.role.type === "USER" && user.role.position !== "MANAGER") {
               return res.status(400).json({
                    success: false,
                    message: "You do not have permission to update service",
               })
          }

          // check service exist
          const service = await Service.findOne({ _id: serviceId, isDeleted: false });
          if (!service) {
               return res.status(400).json({
                    success: false,
                    message: 'Service not found',
               })
          }

          description = description ? textNormalize(description) : "";
          // check update fields
          if (!price || !status) {
               return res.status(400).json({
                    success: false,
                    message: "Missing required fields",
               })
          }

          if (status === service.status && description === service.description && Number(price) === service.price) {
               return res.status(400).json({
                    success: false,
                    message: "Nothing to update",
               })
          }

          service.description = description;
          service.status = status;
          service.price = Number(price);

          await service.save();

          res.status(200).json({
               success: true,
               message: 'Update service successfully',
               data: {
                    service: service,
               }
          })
     }
     catch (error) {
          console.log("[updateService] Error: ", error.message);
          return res.status(500).json({
               success: false,
               message: error.message,
          })
     }
}

// get: api/service/get-all
const getAllServices = async (req, res) => {
     try {
          const limit = parseInt(req.query.limit) || 10;
          const page = parseInt(req.query.page) || 1;

          const skip = (page - 1) * limit;

          const services = await Service.find({ isDeleted: false })
     }
     catch (error) {
          console.log("[getAllServices] Error:", error.message);
          return res.status(500).json({
               success: false,
               message: error.message,
          })
     }
}

// get: api/service/get-follow-device/:deviceId
const getServiceFollowDevice = async (req, res) => {
     try {
          const deviceId = req.query.deviceI;
          const limit = parseInt(req.query.limit) || 10;
          const page = parseInt(req.query.page) || 1;
          const skip = (page - 1) * limit;

          // check device exist
          const device = await Device.find({
               _id: deviceId,
               isDeleted: false,
          })

          if (!device) {
               return res.status(400).json({
                    success: false,
                    message: "Device not found",
               })
          }

          // get Services
          const services = await Service.find({
               deviceId: deviceId,
               isDeleted: false,
               status: "ACTIVE",
          }).skip(skip).limit(limit).sort({ createdAt: -1 });

          res.status(200).json({
               success: true,
               message: "Get services successfully",
               data: {
                    services: services,
               }
          })
     }
     catch (error) {
          console.log("[getServiceFollowDevice] Error: ", error.message);
          return res.status(500).json({
               success: false,
               message: error.message,
          })
     }
}

export {
     addService,
     updateService,
     getAllServices,
     getServiceFollowDevice,
}