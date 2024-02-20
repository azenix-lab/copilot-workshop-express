import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User.entity';
import { encrypt } from '../helpers/encrypt';

export class AuthContoller {
    static async login(req: Request, res: Response){
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({ message: "Email and password are required" });
        }
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { email } });

        const isPasswordValid = encrypt.comparepassword(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const token = encrypt.generateToken({ id: user.id });
        return res.status(200).json({ message: "Login successful", token });
    }
}