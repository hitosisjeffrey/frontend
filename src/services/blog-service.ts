// src/services/blogService.js
import { apiService } from './api'

export interface PayLoad {
    title?: string;
    content?: string;
    status: 'PUBLISHED' | 'DRAFT'
};

export const blogService = {
    async getBlogs() {
        try {
            const blogs = await apiService.request('GET', '/api/blogs')
            console.log(blogs);

            return blogs
        } catch (error) {
            console.error('Error fetching blogs:', error)
            throw error
        }
    },

    async getBlog(id: number) {
        try {
            const blogs = await apiService.request('GET', '/api/blogs/' + id)
            return blogs
        } catch (error) {
            console.error('Error fetching blogs:', error)
            throw error
        }
    },


    async createBlog(payload: PayLoad) {
        try {

            if (!payload)
                throw new Error("Invalid");

            const blog = await apiService.request('POST', '/api/blogs', payload)
            return blog
        } catch (error) {
            console.error('Error creating blog:', error)
            throw error
        }
    },

    async updateBlog(id: number, payload: PayLoad) {
        try {
            const blog = await apiService.request('PUT', `/api/blogs/${id}`, payload)
            return blog
        } catch (error) {
            console.error('Error updating blog:', error)
            throw error
        }
    },

    async updateStatus(id: number, status: "PUBLISHED" | "DRAFT") {
        try {
            const payload: PayLoad = {
                status
            }
            const blog = await apiService.request('PATCH', `/api/blogs/status/${id}`, payload)
            return blog
        } catch (error) {
            console.error('Error updating blog:', error)
            throw error
        }
    },

    async deleteBlog(id: number) {
        try {
            await apiService.request('DELETE', `/api/blogs/${id}`)  // Call the generalized request method with DELETE
        } catch (error) {
            console.error('Error deleting blog:', error)
            throw error
        }
    }
}
