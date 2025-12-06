import { verifyToken } from "../utils/jwt.js";

// check authentication middleware for user
const requiredUser = (req, res, next) => {
     try {
          const authHeader = req.headers.authorization;
          if (!authHeader && !authHeader.startsWith("Bearer ")) {
               return res.status(401).json({
                    success: false,
                    message: "Token missing",
               })
          }


          //verify token 
          const token = authHeader.replace("Bearer ", "");
          const user = verifyToken(token);

          if (!user) {
               return res.status(401).json({
                    success: false,
                    message: "Token invalid",
               })
          }

          // invalid token type
          if (user.type === "refresh") {
               return res.status(401).json({
                    success: false,
                    message: "Invalid token type",
               })
          }

          // get user from token
          req.user = user;
          console.log("[auth.js] User from token:", req.user);

          next();
     } catch (error) {
          console.log("[auth.js] requiredUser error: ", error);
          res.status(500).json({
               success: false,
               message: "Authentication Failed",
          })
     }
}

// check authentication middleware for admin
const requiredAdmin = (req, res, next) => {
     try {
          const authHeader = req.headers.authorization;
          if (!authHeader && !authHeader.startsWith("Bearer ")) {
               return res.status(401).json({
                    success: false,
                    message: "Token missing",
               })
          }

          // verify token
          const token = authHeader.replace("Bearer ", "");
          const user = verifyToken(token);

          if (!user) {
               return res.status({
                    success: false,
                    message: "Token invalid",
               })
          }

          // invalid token type
          if (user.type === "refresh") {
               return res.status(401).json({
                    success: false,
                    message: "Invalid token type",
               })
          }

          // check if user is admin
          if (user.role.type !== "ADMIN") {
               return res.status(403).json({
                    success: false,
                    message: "Access denied, admin only",
               })
          }

          // get user from token
          req.user = user;
          console.log("[auth.js] Admin from token: ", req.user);

          next();
     }
     catch (error) {
          console.log("[auth.js] requiredAdmin error: ", error);
          res.status(500).json({
               success: false,
               message: "Authentication Failed",
          })
     }
}

export {
     requiredUser,
     requiredAdmin,
}