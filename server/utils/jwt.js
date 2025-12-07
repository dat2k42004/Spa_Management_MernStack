import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;


// generate JWT token
const generateToken = (user) => {
     try {
          const token = jwt.sign(
               {
                    id: user._id,
                    role: user.role,
               },
               JWT_SECRET,
               { expiresIn: JWT_EXPIRES_IN }
          );
          console.log("Generated Token: ", token);
          return token;
     }
     catch (error) {
          console.log("[jwt] generateToken error: ", error);
     }
}


// refresh JWT token
const refreshToken = (user) => {
     try {
          const token = jwt.sign(
               {
                    id: user._id,
                    role: user.role,
                    type: "refresh",
               },
               JWT_SECRET,
               { expiresIn: JWT_REFRESH_SECRET }
          );
          console.log("Refreshed token: ", token);
          return token;
     } catch (error) {
          console.log("[jwt] RefreshToken error: ", error);
     }
}


// verify token
const verifyToken = (token) => {
     try {
          const user = jwt.verify(token, JWT_SECRET);
          console.log("Verified user: ", user);
          return user;
     }
     catch (error) {
          console.log("[jwt] verifyToken error: ", error);
     }
}


export {
     generateToken,
     verifyToken,
     refreshToken
}