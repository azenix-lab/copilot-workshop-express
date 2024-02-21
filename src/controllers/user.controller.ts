import { Request, Response, RequestHandler } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User.entity";
import { encrypt } from "../helpers/encrypt";
import { UserList, UserResponse } from "../dto/user.dto";
import * as cache from "memory-cache";

export class UserController {
    static async signup(req: Request, res: Response){
        const { name, email, password, role } = req.body;
        const encrypedPassword = await encrypt.encryptpass(password);
        const user = new User();
        user.name = name;
        user.email = email;
        user.password = encrypedPassword;
        user.role = role;

        const userRepository = AppDataSource.getRepository(User);
        //check if user exists
        const userExists = await userRepository.findOne({ where: { email } });
        if(userExists){
            return res.status(400).json({ message: "User already exists" });
        }
        await userRepository.save(user);

        const userData = new UserResponse();
        userData.name = user.name;
        userData.email = user.email;
        userData.role = user.role;

        const token = encrypt.generateToken({ id: user.id });

        return res.status(201).json({ message:"User created successfully", user: userData, token });
    }

    static async listUsers(req: Request, res: Response){
        const userRepository = AppDataSource.getRepository(User);
        const users = await userRepository.find();
        const userResponse = users.map(user => {
            const userRes = new UserList();
            userRes.name = user.name;
            return userRes;
        });
        return res.status(200).json(userResponse);
    }

    static async getUsers(req: Request, res: Response){
        const data = cache.get("users");
        if(data){
            return res.status(200).json(data);
        }
        else
        {
            const userRepository = AppDataSource.getRepository(User);
            const users = await userRepository.find();
            //convert user to userResponse
            const userResponse = users.map(user => {
                const userRes = new UserResponse();
                userRes.name = user.name;
                userRes.email = user.email;
                userRes.role = user.role;
                return userRes;
            });
            cache.put("users", userResponse, 60000);
            return res.status(200).json(userResponse);
        }
    }

    static async getUserById(req: Request, res: Response){
        const currentUser = req["currentUser"];
        if(currentUser.id !== req.params.id){
            return res.status(403).json({ message: "Forbidden" });
        }
        const { id } = req.params;
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id } });
        const userResponse = new UserResponse();
        userResponse.name = user.name;
        userResponse.email = user.email;
        userResponse.role = user.role;
        return res.status(200).json(userResponse);
    }

    static async updateUser(req: Request, res: Response){
        const currentUser = req["currentUser"];
        if(currentUser.id !== req.params.id){
            return res.status(403).json({ message: "Forbidden" });
        }
        const { id } = req.params;
        const { name, email } = req.body;
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id } });
        user.name = name;
        user.email = email;
        await userRepository.save(user);
        return res.status(200).json({ message: "User updated successfully" });
    }

    static async deleteUser(req: Request, res: Response){
        const currentUser = req["currentUser"];
        if(currentUser.id !== req.params.id){
            return res.status(403).json({ message: "Forbidden" });
        }
        const { id } = req.params;
        const userRepository = AppDataSource.getRepository(User);
        await userRepository.delete(id);
        return res.status(200).json({ message: "User deleted successfully" });
    }

    static async adminGetUsers(req: Request, res: Response){
        const userRepository = AppDataSource.getRepository(User);
        const users = await userRepository.find();
        const userResponse = users.map(user => {
            const userRes = new UserResponse();
            userRes.name = user.name;
            userRes.email = user.email;
            userRes.role = user.role;
            return userRes;
        });
        return res.status(200).json(userResponse);
    }

    static async adminUpdateUser(req: Request, res: Response){
        const { id } = req.params;
        const { name, email, role } = req.body;
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id } });
        user.name = name;
        user.email = email;
        user.role = role;
        await userRepository.save(user);
        return res.status(200).json({ message: "User updated successfully" });
    }

    static async adminDeleteUser(req: Request, res: Response){
        const { id } = req.params;
        const userRepository = AppDataSource.getRepository(User);
        await userRepository.delete(id);
        return res.status(200).json({ message: "User deleted successfully" });
    }
}