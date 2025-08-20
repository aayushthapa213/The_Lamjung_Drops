import jwt from "jsonwebtoken";

     const generateTokenAndSetCookie = async (res, userId, role) => {
       console.log("Generating token for userId:", userId, "with role:", role);
       const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
         expiresIn: "7d",
       });
       res.cookie("token", token, {
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         sameSite: "strict",
         maxAge: 7 * 24 * 60 * 60 * 1000,
       });
       console.log("Token set successfully for userId:", userId);
       return token;
     };

     export default generateTokenAndSetCookie;