import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User.entity';
import { encrypt } from '../helpers/encrypt';
import { UserResponse } from '../dto/user.dto';

export class AuthContoller {
    static async login(req: Request, res: Response){
        const { email, password } = req.body;
        if(!email || !password){
            console.log("Email and password are required");
            return res.status(400).json({ message: "Email and password are required" });
        }
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { email } });
        if(!user){
            console.log("No user found");
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const isPasswordValid = await encrypt.comparepassword(password, user.password);
        if(isPasswordValid === false){
            console.log("Invalid email or password");
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const token = encrypt.generateToken({ id: user.id });
        const userData = new UserResponse();
        userData.name = user.name;
        userData.email = user.email;
        userData.role = user.role;
        return res.status(200).json({ message: "Login successful", token, userData});
    }
}