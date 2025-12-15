import { User } from "../model/UserSchema.js";
import bcrypt from "bcrypt"


export const register = async (req,res) => {
    try {

        const {name,email,password} = req.body;

        if(!name || !email || !password){
            return res.status(401).json({
                success:false,
                message:"All fields are required"
            })
        }

        const existUser = await User.findOne({email})

        if(existUser){
            return res.status(401).json({
                success:false,
                message:"User Already exist,Please login"
            })
        }

        const hashedPassword = await bcrypt.hash(password,10)

        const user = await User.create({
            name:name,
            email:email,
            password:hashedPassword
        })

        return res.status(201).json({
            success:true,
            message:"User created Successfully",
            user
        })
        
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:error.message
        })
        
    }
}