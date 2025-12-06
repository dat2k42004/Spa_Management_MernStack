import { Server } from "socket.io";

import jwt from "jsonwebtoken";

let io, authIo, publicIo;
const init = (httpServer) => {
     io = new Server(httpServer, {
          cors: {
               origin: "*",
               methods: ["GET", "POST"],
          },
          maxHttpBufferSize: 1e6
     })

     // auth io: localhost:5173/auth
     authIo = io.of("/auth");
     authIo.use((socket, next) => {
          try {
               const token = socket.handshake.auth.token;
               if (!token) {
                    return next(new Error("Token missing"));
               }

               // verify token
               const user = jwt.verify(token.process.env.JWT_SECRET);
               if (!user) {
                    return next(new Error("Invalid token"));
               }

               socket.userId = user.id;

               next();
          } catch (error) {
               return next(new Error("[socket.js] Authentication Socket error: ", error));
          }
     })

     // handle connection
     authIo.on("connection", (socket) => {
          console.log("[socket.js] New client connected to auth: ", socket.id);

          const userId = socket.userId;
          console.log(`client ${userId} join into room: ${socket.id}`);

          if (userId) {
               socket.join(userId);
          }

          socket.on("disconnect", () => {
               console.log("[socket.js]Client disconnected from auth: ", socket.id);
          })
     })


     // public io: localhost:5173/public
     publicIo = io.of("/public");
     publicIo.on("connection", (socket) => {
          console.log("[socket.js] New client connected to public: ", socket.id);

          socket.on("disconnect", () => {
               console.log("[socket.js]Client disconnected from public: ", socket.id);
          })
     })

     // error handing
     io.on("error", (error) => {
          console.log("[socket.js] Socket error: ", error);
     })
}


const getAuthIo = () => {
     if (!authIo) {
          throw new Error("[socket.js] Auth io not initialized");
     }
     return authIo;
}

const getPublicIo = () => {
     if (!publicIo) {
          throw new Error("[socket.js] Public io not initialized");
     }
     return publicIo;
}

export default {
     getAuthIo,
     getPublicIo,
}
