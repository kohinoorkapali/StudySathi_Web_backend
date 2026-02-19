import jwt from "jsonwebtoken";

export const generateToken=(payload)=>{
    const options={
        expiresIn: "1hr"
    }
    return jwt.sign(payload,"secret-key",options);
}

