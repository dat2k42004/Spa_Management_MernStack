import Promotion from "../models/Promotion.js";
import User from "../models/User.js";
import { textNormalize } from "../services/textService.js";
import { searchFunc } from "../services/searchService.js";

// post: api/promotion/add (requiredUser)
const addPromotion = async (req, res) => {
     try {
          const userId = req.user.id;
          let { name, startTime, endTime, percent, quantity, limitPrice } = req.body;

          // check user exists
          const user = await User.findOne({
               _id: userId,
               isDeleted: false,
          })

          if (!user) {
               return res.status(400).json({
                    success: false,
                    message: "User not found"
               })
          }

          // check permission
          if (user.role.type === "USER" && user.role.position !== "MANAGER") {
               return res.status(400).json({
                    success: false,
                    message: "You do not have permission to add promotion",
               })
          }

          // check null value
          if (!name || !startTime || !endTime || !percent || !quantity || !limitPrice) {
               res.status(400).json({
                    success: false,
                    message: "Missing required fields"
               })
          }
          name = textNormalize(name, "name");
          // check promotion exists
          const existed = await Promotion.findOne({
               name: name
          })
          if (existed) {
               return res.status(400).json({
                    success: false,
                    message: "Promotion name already exists",
               })
          }

          const newPromotion = new Promotion({
               name: name,
               startTime: startTime,
               endTime: endTime,
               percent: percent,
               quantity: quantity,
               limitPrice: limitPrice,
               isDeleted: false,
          })

          await newPromotion.save();
          res.status(200).json({
               success: true,
               message: "Add promotion successfully",
               data: {
                    promotion: newPromotion,
               }
          })
     }
     catch (error) {
          res.status(500).json({
               message: error.message,
               success: false,
          })
     }
}


// put: api/promotion/update/:id (requiredUser)
const updatePromotion = async (req, res) => {
     try {
          const promotionId = req.params.id;
          const userId = req.user.id;
          const { startTime, endTime, percent, quantity, limitPrice } = req.body;

          // check user exists
          const user = await User.findOne({
               _id: userId,
               isDeleted: false,
          });

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
                    message: "You do not have permission to update promotion",
               })
          }

          // check promotion exists
          const promotion = await Promotion.findOne({
               _id: promotionId,
               isDeleted: false,
          })

          if (!promotion) {
               return res.status(400).json({
                    success: false,
                    message: "Promotion not found",
               })
          }

          // check null value
          if (!startTime && !endTime && !percent && !quantity && !limitPrice) {
               return res.status(400).json({
                    success: false,
                    message: "Missing required fields"
               })
          }

          // check change
          if (startTime === promotion.startTime && endTime === promotion.endTime &&
               percent === promotion.percent && quantity === promotion.quantity &&
               limitPrice === promotion.limitPrice) {
               return res.status(400).json({
                    success: false,
                    message: "Nothing to update",
               })
          }

          promotion.startTime = startTime || promotion.startTime;
          promotion.endTime = endTime || promotion.endTime;
          promotion.percent = percent || promotion.percent;
          promotion.quantity = quantity || promotion.quantity;
          promotion.limitPrice = limitPrice || promotion.limitPrice;

          await promotion.save();
          return res.status(200).json({
               success: true,
               message: "Update promotion successfully",
               data: {
                    promotion: promotion,
               }
          })
     }
     catch (error) {
          console.log("[updatePromotion] Error: ", error.message);
          return res.status(500).json({
               success: false,
               message: error.message,
          })
     }
}


// get: api/promotion/get-all
const getAllPromotions = async (req, res) => {
     try {
          const limit = parseInt(req.query.limit) || 10;
          const page = parseInt(req.query.page) || 1;
          const skip = (page - 1) * limit;


          const promotions = await Promotion.find({ isDeleted: false }).skip(skip).limit(limit).sort({ createdAt: -1 });

          return res.status(200).json({
               success: true,
               message: "Get all promotions successfully",
               data: {
                    promotion: promotions,
               }
          })
     }
     catch (error) {
          console.log("[getAllPromotions] Error: ", error.message);
          return res.status(500).json({
               success: false,
               message: error.message,
          })
     }
}


// get: api/promotion/search
const searchPromotion = async (req, res) => {
     try {
          const search = req.query.search || "";
          const limit = parseInt(req.query.limit) || 10;
          const page = parseInt(req.query.page) || 1;
          const skip = (page - 1) * limit;

          const promotions = await searchFunc(Promotion, "name", limit, skip);

          return res.status(200).json({
               success: true,
               message: "Search promotion successfully",
               data: {
                    promotion: promotions,
               }
          })
     }
     catch (error) {
          console.log("[searchPromotion] Error: ", error.message);
          return res.status(500).json({
               success: false,
               message: error.message,
          })
     }
}

// delete: api/promotion/delete/:id (requiredUser)
const deletePromotion = async (req, res) => {
     try {
          const promotionId = req.params.id;
          const userId = req.user.id;

          // check user exists
          const user = await User.findOne({
               _id: promotionId,
               isDeleted: false,
          });

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
                    message: "You do not have permission to delete promotion",
               })
          }

          // check promotion exists 
          const promotion = await Promotion.findOne({
               _id: promotionId,
               isDeleted: false,
          })

          if (!promotion) {
               return res.status(400).json({
                    success: false,
                    message: "Promotion not found",
               })
          }

          promotion.isDeleted = true;
          await promotion.save();

          return res.status(200).json({
               success: true,
               message: "Delete promotion successfully",
          })
     }
     catch (error) {
          console.log("[deletePromotion] Error: ", error.message);
          return res.status(500).json({
               success: false,
               message: error.message,
          })
     }
}

export {
     addPromotion,
     updatePromotion,
     getAllPromotions,
     searchPromotion,
     deletePromotion
}