import Device from "../models/Device.js";
import User from "../models/User.js";
import Slot from "../models/Slot.js";
import { searchFunc } from "../services/searchService.js";

import { deleteFiles } from "../services/uploadService.js"
import { textNormalize } from "../services/textService.js";


// post: api/device/add (requiredUser)
const addDevice = async (req, res) => {
     const images = req.files ? req.files.map(file => `uploads/device/${file.filename}`) : [];
     try {
          const userId = req.user.id;
          const { name, type, number, description } = req.body;
          

          // check user exist
          const user = await User.findOne({ _id: userId, isDeleted: false });
          if (!user) {
               deleteFiles(images);
               return res.status(400).json({
                    success: false,
                    message: "User not found",
               })
          }

          // check permission
          if (user.role.type === "USER" && user.role.position !== "MANAGER") {
               deleteFiles(images);
               return res.status(400).json({
                    success: false,
                    message: "You do not have permission to add device",
               })
          }

          // check null fields
          if (!name || !type || images.length === 0) {
               deleteFiles(images);
               return res.status(400).json({
                    success: false,
                    message: "Missing required fields",
               })
          }

          // check device exist
          const existedDevice = await Device.findOne({ name: name });
          if (existedDevice) {
               deleteFiles(images);
               return res.status(400).json({
                    success: false,
                    message: "Device already exist",
               })
          }

          // create new device
          const newDevice = new Device({
               name: textNormalize(name, "name"),
               type: textNormalize(type, "type"),
               number: number || 0,
               description: description ? textNormalize(description, "des") : "",
               images: images,
               isDeleted: false,
          })

          await newDevice.save();


          res.status(200).json({
               success: true,
               message: "Add device successfully",
               data: {
                    device: {
                         id: newDevice._id,
                         name: newDevice.name,
                         type: newDevice.type,
                         number: newDevice.number,
                         description: newDevice.description,
                         images: newDevice.images,
                         isDeleted: newDevice.isDeleted,
                    }
               }
          })

     }
     catch (error) {
          deleteFiles(images);
          console.log("[addDevice] Error: ", error.message);
          return res.status(500).json({
               success: false,
               message: error.message,
          })
     }
}

// put: api/device/update/:id (requiredUser)
const updateDevice = async (req, res) => {
     const newImage = req.files ? req.files.map(f => `uploads/device/${f.filename}`) : [];
     try {
          const userId = req.user.id;
          const deviceId = req.params.id;
          let { type, number, description, currentImage } = req.body;
          currentImage = typeof currentImage === "string" ? JSON.parse(currentImage) : currentImage;
          

          // check user exist
          const user = await User.findOne({ _id: userId, isDeleted: false });
          if (!user) {
               deleteFiles(newImage);
               return res.status(400).jsom({
                    success: false,
                    message: "User not found",
               })
          }


          // check permission 
          if (user.role.type === 'USER' && user.role.position !== "MANAGER") {
               deleteFiles(newImage);
               return res.status(400).json({
                    success: false,
                    message: "You do not have permission to update device",
               })
          }

          // check null fields
          if (!type || !number || !description || (currentImage.length === 0 && newImage.length === 0)) {
               deleteFiles(newImage);
               return res.status(400).json({
                    success: false,
                    message: "Missing required fields",
               })
          }

          // check device exist
          const device = await Device.findOne({ _id: deviceId, isDeleted: false });
          if (!device) {
               deleteFiles(newImage);
               return res.status(400).json({
                    success: false,
                    message: "Device not found",
               })
          }

          // check new info
          const updatedType = textNormalize(type, "type");
          const updatedDescription = textNormalize(description, "description");
          const removeFile = device.images.length !== 0 ? device.images.filter(img => !currentImage.includes(img)) : [];
          if (updatedType === device.type && Number(number) === device.number && device.description === updatedDescription && removeFile.length === 0 && newImage.length === 0) {
               deleteFiles(newImage);
               return res.status(400).json({
                    success: false,
                    message: "Nothing to update",
               })
          }

          // remove deleted images
          if (removeFile.length > 0) {
               deleteFiles(removeFile);
          }
          // update device
          device.type = updatedType;
          device.number = Number(number);
          device.description = updatedDescription;
          device.images = [...currentImage, ...newImage];

          await device.save();

          res.status(200).json({
               success: true,
               message: "Update device successfully",
               data: {
                    device: device
               }
          })
     }
     catch (error) {
          deleteFiles(newImage);
          console.log("[updateDevice] Error: ", error.message);
          return res.status(500).json({
               success: false,
               message: error.message,
          })
     }
}

// get: api/device/get-all
const getAllDevices = async (req, res) => {
     try {
          const limit = parseInt(req.query.limit) || 10;
          const page = parseInt(req.query.page) || 1;
          const skip = (page - 1) * limit;

          const devices = await Device.find({ isDeleted: false }).skip(skip).limit(limit).sort({ createdAt: -1 });

          res.status(200).json({
               success: true,
               message: "Get all devices successfully",
               data: {
                    devices: devices,
               }
          })
     }
     catch (error) {
          console.log("[getAllDevices] Error: ", error.message);
          return res.status(500).json({
               success: false,
               message: error.message,
          })
     }
}


// get: api/device/search
const searchDevice = async (req, res) => {
     try {
          const search = req.query.search || "";
          const limit = parseInt(req.query.limit) || 10;
          const page = parseInt(req.query.page) || 1;
          const skip = (page - 1) * limit;
          console.log("search: ", search);

          const filter = await searchFunc(search, Device, "name", limit, skip);

          res.status(200).json({
               success: true,
               message: "Search devices successfully",
               data: {
                    devices: filter,
               }
          })
     }
     catch (error) {
          console.log("[searchDevice] Error: ", error.message);
          return res.status(500).json({
               success: false,
               message: error.message,
          })
     }
}

// delete: api/device/delete/:id (requiredUser)
const deleteDevice = async (req, res) => {
     try {
          const userId = req.user.id;
          const deviceId = req.params.id;
          console.log("deviceId: ", deviceId);

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
                    message: "You do not have permission to delete device",
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

          // inactive device
          device.isDeleted = true;

          // inactive all slots of device
          await Slot.updateMany(
               { deviceId: deviceId },
               {
                    $set: {
                         isDeleted: true,
                    }
               }
          )

          await device.save();

          res.status(200).json({
               success: true,
               message: "Delete device successfully",
          })
     }
     catch (error) {
          console.log("[deleteDevice] Error: ", error.message);
          return res.status(500).json({
               success: false,
               message: error.message,
          })
     }
}

export {
     addDevice,
     updateDevice,
     getAllDevices,
     searchDevice,
     deleteDevice,
}
