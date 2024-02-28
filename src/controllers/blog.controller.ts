import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Blog } from "../entity/Blog.entity";
import { User } from "../entity/User.entity";
import { BlogList, BlogResponse } from "../dto/blog.dto";
import * as cache from "memory-cache";

export class BlogController {
    static async createBlog(req: Request, res: Response){
        const { title, content } = req.body;
        const user = req["currentUser"];
        console.log(user);
        if(!user){
            return res.status(401).json({ message: "Unauthorized" });
        }
        const blog = new Blog();
        blog.title = title;
        blog.content = content;
        blog.userId = user.id;
        blog.createdAt = new Date();
        blog.updatedAt = new Date();
        const blogRepository = AppDataSource.getRepository(Blog);
        const savedBlog = await blogRepository.save(blog);
        return res.status(201).json({ message: "Blog created successfully", blog: savedBlog });
    }

    static async getBlogs(req: Request, res: Response){
        const data = cache.get("blogsTitles");
        if(data){
            return res.status(200).json(data);
        }
        else
        {
            const blogRepository = AppDataSource.getRepository(Blog);
            const blogs = await blogRepository.find();
            const blogResponse = blogs.map(blog => {
                const blogRes = new BlogList();
                blogRes.id = blog.id;
                blogRes.title = blog.title;
                blogRes.user = blog.userId;
                blogRes.updatedAt = blog.updatedAt;

                return blogRes;
            });
            cache.put("blogsTitles", blogResponse, 60000);
            return res.status(200).json({blogs: blogResponse});
        }
    }

    static async getBlog(req: Request, res: Response){
        const { id } = req.params;
        console.log(id);
        const blogRepository = AppDataSource.getRepository(Blog);
        const blog = await blogRepository.findOne({ where: { id } });
        return res.status(200).json({blog: blog});
    }

    static async getUserBlogs(req: Request, res: Response){
        const { name } = req.params;
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { name } });
        const userId = user.id;
        const blogRepository = AppDataSource.getRepository(Blog);
        const blogs = await blogRepository.find({ where: { userId } });
        return res.status(200).json({blogs: blogs});
    }

    static async updateBlog(req: Request, res: Response){
        const currentUser = req["currentUser"];
        if(currentUser.role !== "admin"){
            return res.status(403).json({ message: "Forbidden" });
        }
        const { id } = req.params;
        const { title, content } = req.body;
        const blogRepository = AppDataSource.getRepository(Blog);
        const blog = await blogRepository.findOne({ where: { id } });
        blog.title = title;
        blog.content = content;
        await blogRepository.save(blog);
        return res.status(200).json({ message: "Blog updated successfully" });
    }

    static async deleteBlog(req: Request, res: Response){
        const currentUser = req["currentUser"];
        if(currentUser.role !== "admin"){
            return res.status(403).json({ message: "Forbidden" });
        }
        const { id } = req.params;
        const blogRepository = AppDataSource.getRepository(Blog);
        await blogRepository.delete({ id });
        return res.status(200).json({ message: "Blog deleted successfully" });
    }

    static async adminUpdateBlog(req: Request, res: Response){
        const { id } = req.params;
        const { title, content } = req.body;
        const blogRepository = AppDataSource.getRepository(Blog);
        const blog = await blogRepository.findOne({ where: { id } });
        blog.title = title;
        blog.content = content;
        await blogRepository.save(blog);
        return res.status(200).json({ message: "Blog updated successfully" });
    }

    static async adminDeleteBlog(req: Request, res: Response){
        const { id } = req.params;
        const blogRepository = AppDataSource.getRepository(Blog);
        await blogRepository.delete({ id });
        return res.status(200).json({ message: "Blog deleted successfully" });
    }
}