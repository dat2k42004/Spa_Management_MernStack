import Shift from "../models/Shift.js";
import User from "../models/User.js";
// post: api/shift/add
const addShift = async (req, res) => {
     try {
          // console.log(req.body);
          let { type, date } = req.body;
          const userId = req.user.id;

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
                    message: "You do not have permission to add shift",
               })
          }

          // check required fields
          if (!type || !date) {
               return res.status(400).json({
                    success: false,
                    message: "Missing required fields"
               })
          }

          type = type.toUpperCase();
          // check shift exist
          const existedShift = await Shift.findOne({ type: type, date: date })
          if (existedShift) {
               return res.status(400).json({
                    success: false,
                    message: "Shift already existed"
               })
          }

          const newShift = new Shift({
               type: type,
               date: date,
               startTime: type === "MORNING" ? "08:00" : "13:30",
               endTime: type === "MORNING" ? "12:00" : "17:30",
          })

          await newShift.save();

          res.status(200).json({
               success: true,
               message: "Add shift successfully",
               data: {
                    shift: newShift,
               }
          })


     }
     catch (error) {
          console.log("[addShift] Error: ", error.message);
          res.status(500).send({
               success: false,
               message: error.message,
          })
     }
}


export {
     addShift,
}