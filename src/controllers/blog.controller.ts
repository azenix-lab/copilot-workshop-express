import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Blog } from "../entity/Blog.entity";
import { BlogList, BlogResponse } from "../dto/blog.dto";
import * as cache from "memory-cache";

export class BlogController {
    static async createBlog(req: Request, res: Response){
        const { title, content } = req.body;
        const blog = new Blog();
        blog.title = title;
        blog.content = content;
        const blogRepository = AppDataSource.getRepository(Blog);
        await blogRepository.save(blog);
        const blogDataSent = new BlogResponse();
        blogDataSent.title = blog.title;
        blogDataSent.content = blog.content;
        return res.status(201).json({ message: "Blog created successfully", blog: blogDataSent });
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
                blogRes.title = blog.title;
                return blogRes;
            });
            cache.put("blogsTitles", blogResponse, 60000);
            return res.status(200).json(blogResponse);
        }
    }

    static async getBlog(req: Request, res: Response){
        const { id } = req.params;
        const blogRepository = AppDataSource.getRepository(Blog);
        const blog = await blogRepository.findOne({ where: { id } });
        const blogDataSent = new BlogResponse();
        blogDataSent.title = blog.title;
        blogDataSent.content = blog.content;
        return res.status(200).json(blogDataSent);
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