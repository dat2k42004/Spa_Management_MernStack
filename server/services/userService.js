import { generateToken, refreshToken } from "../utils/jwt.js";

const createAccessToken = async (user) => {
     const access = await generateToken(user);

     return access;
}

const createRefreshToken = async (user) => {
     const refresh = await refreshToken(user);

     return refresh;
}



export {
     createAccessToken,
     createRefreshToken,
}