import Slot from "../models/Slot.js";
import User from "../models/User.js";
import Device from "../models/Device.js";

// post: api/slot/add
const addSlot = async (req, res) => {
     try {
          const userId = req.user.id;
          const { room, location, deviceId } = req.body;

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
                    message: "You do not have permission to add slot",
               })
          }

          // check slot exist
          const existedSlot = await Slot.findOne({ room: room, location: location, deviceId: deviceId });
          if (existedSlot) {
               return res.status(400).json({
                    success: false,
                    message: "Slot already existed"
               })
          }

          // check device exist
          const device = await Device.findOne({ _id: deviceId, isDeleted: false });
          if (!device) {
               return res.status(400).json({
                    success: false,
                    message: "Device not found or deleted",
               })
          }

          // check number device
          const numberOfDevices = await Slot.countDocuments({ deviceId: deviceId, isDeleted: false });
          if (numberOfDevices >= device.number) {
               return res.status(400).json({
                    success: false,
                    message: "Cannot add slot. Number of devices exceeded",
               })
          }

          // create new slot
          const newSlot = new Slot({
               room: room,
               location: location,
               deviceId: deviceId,
               status: "INACTIVE",
               isDeleted: false,
          });

          await newSlot.save();

          res.status(200).json({
               success: true,
               message: "Add slot successfully",
               data: {
                    slot: newSlot
               }
          })
     }
     catch (error) {
          console.log("[addSlot] Error: ", error.message);
          res.status(500).json({
               success: false,
               message: error.message,
          })
     }
}

// put: api/slot/update/:id
const updateSlot = async (req, res) => {
     try {
          const userId = req.user.id;
          const slotId = req.params.id;
          const { status } = req.body;

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
                    message: "You do not have permission to update slot",
               })
          }

          // check slot exist
          const slot = await Slot.findOne({ _id: slotId, isDeleted: false });
          if (!slot) {
               return res.status(400).json({
                    success: false,
                    message: "Slot not found",
               })
          }
          // check field null
          if (!status) {
               return res.status(400).json({
                    success: false,
                    message: "Missing required fields",
               })
          }

          // check update
          if (status === slot.status) {
               return res.status(400).json({
                    message: "Nothing to update",
                    success: false,
               })
          }
          // update slot
          slot.status = status;

          await slot.save();

          res.status(200).json({
               success: true,
               message: "Update slot successfully",
               data: {
                    slot: slot,
               }
          })
     }
     catch (error) {
          console.log("[updateSlot] Error: ", error.message);
          return res.status(500).json({
               success: false,
               message: error.message,
          })
     }
}

// get: api/slot/get-all
const getAllSlots = async (req, res) => {
     try {
          const userId = req.user.id;
          const limit = parseInt(req.query.limit) || 10;
          const page = parseInt(req.query.page) || 1;
          const skip = (page - 1) * limit;
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
                    message: "You do not have permission to get all slots"
               })
          }

          const slots = await Slot.find({ isDeleted: false }).skip(skip).limit(limit).sort({ createdAt: -1 });

          res.status(200).json({
               success: true,
               message: "Get slots successfully",
               data: {
                    slots: slots
               }
          });
     }
     catch (error) {
          console.log("[getAllSlots] Error: ", error.message);
          return res.status(500).json({
               success: false,
               message: error.message,
          })
     }
}

// get: api/slot/get-follow-device/:deviceId
const getSlotFollowDevice = async (req, res) => {
     try {
          const userId = req.user.id;
          const deviceId = req.params.deviceId;

          // check user exist
          const user = await User.findOne({ _id: userId, isDeleted: false });
          if (!user) {
               return res.status(400).json({
                    success: false,
                    message: "User not found",
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

          // get slots (all active slot for device)
          const slots = await Slot.find({ deviceId: deviceId, isDeleted: false, status: "ACTIVE" });

          res.status(200).json({
               success: true,
               message: "Get slot successfully",
               data: {
                    slots: slots,
               }
          })
     }
     catch (error) {
          console.log("[getSlotFollowDevice] Error: ", error.message);
          return res.status(500).json({
               success: false,
               message: error.message,
          })
     }
}

// delete: api/slot/delete/:id
const deleteSlot = async (req, res) => {
     try {
          const userId = req.user.id;
          const slotId = req.params.id;

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
                    message: "You do not have permission to delete slot",
               })
          }

          // check slot exist 
          const slot = await Slot.findOne({ _id: slotId, isDeleted: false });
          if (!slot) {
               return res.status(400).json({
                    success: false,
                    message: "Slot not found"
               })
          }

          // delete slot + update number device
          const device = await Device.findOne({ _id: slot.deviceId, isDeleted: false });
          if (!device) {
               return res.status(400).json({
                    success: false,
                    message: "Device not found",
               })
          }

          // delete slot
          slot.isDeleted = true;

          await slot.save();

          res.status(200).json({
               success: true,
               message: "Delete slot successfully",
          })

     }
     catch (error) {
          console.log("[deleteSlot] Error: ", error.message);
          return res.status(500).json({
               success: false,
               message: error.message,
          })
     }
}


// get: api/slot/get-available-slot-follow-device/:deviceId
const getAvailableSlotFollowService = async (req, res) => {
     try {

     }
     catch (error) {
          console.log("[getAvailableSlotFollowDevice] Error: ", error.message);
          return res.status(500).json({
               success: false,
               message: error.message,
          })
     }
}

export {
     addSlot,
     updateSlot,
     getAllSlots,
     getSlotFollowDevice,
     deleteSlot,
     getAvailableSlotFollowService,
}