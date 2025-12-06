import bcrypt from "bcryptjs";

const hash = async (object) => {
     return bcrypt.hash(object, 10);
}

const compare = async (object, expectedHash) => {
     return bcrypt.compare(object, expectedHash);
}

export {
     compare,
     hash,
}