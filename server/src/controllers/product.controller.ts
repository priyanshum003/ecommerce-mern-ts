import { Request, Response } from "express";
import { Product } from "../models/product.model";
import { BaseQueryType, NewProductBody, SearchProductsQuery } from "../types/types";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { deleteImage } from "../utils/cloudinary";
import { faker } from "@faker-js/faker";
// import { faker } from "@faker-js/faker";


export const getLatestProducts = asyncHandler(
    async (req: Request, res: Response, next) => {

        const products = await Product.find().sort({ createdAt: -1 }).limit(5);

        return res.status(200).json({
            success: true,
            products
        });
    }
)

export const getAllCategories = asyncHandler(
    async (req: Request, res: Response, next) => {

        const categories = await Product.distinct('category');

        return res.status(200).json({
            success: true,
            categories
        });

    }
);

export const getAllProducts = asyncHandler(async (req: Request, res: Response, next) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy ? JSON.parse(req.query.sortBy as string) : { id: '', desc: false };
    let sort: any = {};

    if (sortBy.id) {
        sort[sortBy.id] = sortBy.desc ? -1 : 1;
    }

    const totalProducts = await Product.countDocuments();
    const products = await Product.find().sort(sort).skip(skip).limit(limit);

    return res.status(200).json({
        success: true,
        products,
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: page
    });
});


export const getProductDetails = asyncHandler(
    async (req: Request, res: Response, next) => {

        const product = await Product.findById(req.params.id);

        if (!product) {
            return next(new ApiError(404, "Product not found"));
        }

        return res.status(200).json({
            success: true,
            product
        });
    }
);

export const createNewProduct = asyncHandler(
    async (req: Request<{}, {}, NewProductBody>, res: Response, next) => {

        const { name, category, price, stock, description } = req.body;
        console.log(req.body);

        if (!name || !category || !price || !stock || !description) {
            return next(new ApiError(400, "Please fill all fields"));
        }

        const file = req.file;

        if (!file) {
            return next(new ApiError(400, "Please upload a photo"));
        }

        const product = await Product.create({
            name,
            category: category.toLowerCase(),
            description,
            price,
            stock,
            photo: file.path,
            photoPublicId: file.filename
        });

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            product
        });
    }
);

export const updateProduct = asyncHandler(
    async (req: Request, res: Response, next) => {
        const id = req.params.id;
        const { name, category, price, stock, description } = req.body;

        const product = await Product.findById(id);

        if (!product) {
            return next(new ApiError(404, "Product not found"));
        }

        const file = req.file;

        if (file) {
            // Delete the old image from Cloudinary
            if (product.photoPublicId) {
                await deleteImage(product.photoPublicId);
            }

            // Update the product with new image data
            product.photo = file.path;
            product.photoPublicId = file.filename;
        }

        if (name) product.name = name;
        if (category) product.category = category.toLowerCase();
        if (price) product.price = price;
        if (stock) product.stock = stock;
        if (description) product.description = description;

        const updatedProduct = await product.save();

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product: updatedProduct
        });
    }
);

export const searchProducts = asyncHandler(
    async (req: Request<{}, {}, {}, SearchProductsQuery>, res: Response, next) => {
        const { search, category, sort, price, page = '1' } = req.query;

        const limit = Number(process.env.PRODUCTS_PER_PAGE) || 6;
        const skip = (Number(page) - 1) * limit;

        const baseQuery: BaseQueryType = {};

        if (search) {
            baseQuery.name = { $regex: search, $options: 'i' };
        }

        if (category) {
            baseQuery.category = category;
        }

        if (price) {
            const [min, max] = price.split(',').map(Number);
            baseQuery.price = {};
            if (min !== undefined) baseQuery.price.$gte = min;
            if (max !== undefined) baseQuery.price.$lte = max;
        }

        let sortOption: { [key: string]: 1 | -1 } = {};
        if (sort && sort !== 'relevance') {
            sortOption.price = sort === 'asc' ? 1 : -1;
        }

        const [products, totalProducts] = await Promise.all([
            Product.find(baseQuery).sort(sortOption).limit(limit).skip(skip),
            Product.countDocuments(baseQuery),
        ]);

        const totalPage = Math.ceil(totalProducts / limit);

        return res.status(200).json({
            success: true,
            products,
            totalPage,
        });
    }
);

export const deleteProduct = asyncHandler(
    async (req: Request, res: Response, next) => {

        const id = req.params.id;

        const product = await Product.findById(id);

        if (!product) {
            return next(new ApiError(404, "Product not found"));
        }

        // delete the photo from cloudinary
        await deleteImage(product.photoPublicId);

        await product.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    }
);

export const toggleFeaturedStatus = asyncHandler(
    async (req: Request, res: Response, next) => {
        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            return next(new ApiError(404, "Product not found"));
        }

        // Toggle the featured status
        product.featured = !product.featured;
        await product.save();

        return res.status(200).json({
            success: true,
            message: "Product featured status updated successfully",
            product,
        });
    }
);

// Controller to get all featured products
export const getFeaturedProducts = asyncHandler(
    async (req: Request, res: Response) => {
        const products = await Product.find({ featured: true });

        return res.status(200).json({
            success: true,
            products,
        });
    }
);



// You can add more product details in a similar fashion.


// const generateRandomProducts = async (count = 20) => {
//     const products = [
//         {
//             _id: "665e5d7add90f0b862757752",
//             name: "Sleek Wooden Watch",
//             photo: "https://res.cloudinary.com/dfddqp6av/image/upload/v1718042311/shopspot/sleek-wooden-watch.jpg",
//             price: 12000, // INR
//             stock: 30,
//             category: "Accessories",
//             createdAt: "2024-05-20T14:22:30.000Z",
//             updatedAt: "2024-06-12T15:35:22.000Z",
//             __v: 0,
//             featured: true,
//             photoPublicId: "shopspot/sleek-wooden-watch",
//             description: "Elegant wooden watch with leather straps, perfect for all occasions."
//         },
//         {
//             _id: "665e5d7add90f0b862757753",
//             name: "Organic Cotton T-Shirt",
//             photo: "https://res.cloudinary.com/dfddqp6av/image/upload/v1718042311/shopspot/organic-cotton-tshirt.jpg",
//             price: 3500, // INR
//             stock: 50,
//             category: "Clothing",
//             createdAt: "2024-05-21T11:13:45.000Z",
//             updatedAt: "2024-06-12T16:42:11.000Z",
//             __v: 0,
//             featured: false,
//             photoPublicId: "shopspot/organic-cotton-tshirt",
//             description: "Soft, durable, and eco-friendly cotton T-shirt available in various sizes."
//         },
//         {
//             _id: "665e5d7add90f0b862757754",
//             name: "Luxury Leather Wallet",
//             photo: "https://res.cloudinary.com/dfddqp6av/image/upload/v1718042311/shopspot/luxury-leather-wallet.jpg",
//             price: 8500, // INR
//             stock: 45,
//             category: "Accessories",
//             createdAt: "2024-06-01T10:15:30.000Z",
//             updatedAt: "2024-06-10T18:25:45.000Z",
//             __v: 0,
//             featured: true,
//             photoPublicId: "shopspot/luxury-leather-wallet",
//             description: "Handcrafted leather wallet, designed to carry essentials with elegance."
//         },
//         {
//             _id: "665e5d7add90f0b862757755",
//             name: "High-Performance Running Shoes",
//             photo: "https://res.cloudinary.com/dfddqp6av/image/upload/v1718042311/shopspot/high-performance-shoes.jpg",
//             price: 7600, // INR
//             stock: 60,
//             category: "Footwear",
//             createdAt: "2024-05-22T09:34:11.000Z",
//             updatedAt: "2024-06-13T12:30:00.000Z",
//             __v: 0,
//             featured: false,
//             photoPublicId: "shopspot/high-performance-shoes",
//             description: "Boost your running performance with these lightweight, durable sneakers."
//         },
//         {
//             _id: "665e5d7add90f0b862757756",
//             name: "Ergonomic Office Chair",
//             photo: "https://res.cloudinary.com/dfddqp6av/image/upload/v1718042311/shopspot/ergonomic-office-chair.jpg",
//             price: 15000, // INR
//             stock: 15,
//             category: "Furniture",
//             createdAt: "2024-05-24T15:50:29.000Z",
//             updatedAt: "2024-06-12T17:45:33.000Z",
//             __v: 0,
//             featured: true,
//             photoPublicId: "shopspot/ergonomic-office-chair",
//             description: "Stay comfortable during long work hours with our adjustable ergonomic chair."
//         },
//         {
//             _id: "665e5d7add90f0b862757757",
//             name: "Stainless Steel Water Bottle",
//             photo: "https://res.cloudinary.com/dfddqp6av/image/upload/v1718042311/shopspot/stainless-steel-water-bottle.jpg",
//             price: 1200, // INR
//             stock: 85,
//             category: "Outdoor Gear",
//             createdAt: "2024-05-25T13:22:10.000Z",
//             updatedAt: "2024-06-12T19:36:47.000Z",
//             __v: 0,
//             featured: false,
//             photoPublicId: "shopspot/stainless-steel-water-bottle",
//             description: "Eco-friendly and durable water bottle for everyday hydration."
//         },
//         {
//             _id: "665e5d7add90f0b862757758",
//             name: "Designer Ceramic Vase",
//             photo: "https://res.cloudinary.com/dfddqp6av/image/upload/v1718042311/shopspot/designer-ceramic-vase.jpg",
//             price: 3200, // INR
//             stock: 40,
//             category: "Home Decor",
//             createdAt: "2024-05-26T16:17:50.000Z",
//             updatedAt: "2024-06-11T22:10:24.000Z",
//             __v: 0,
//             featured: true,
//             photoPublicId: "shopspot/designer-ceramic-vase",
//             description: "Beautifully designed vase, perfect to enhance any room's aesthetics."
//         },
//         {
//             _id: "665e5d7add90f0b862757759",
//             name: "Bluetooth Wireless Earphones",
//             photo: "https://res.cloudinary.com/dfddqp6av/image/upload/v1718042311/shopspot/bluetooth-earphones.jpg",
//             price: 5500, // INR
//             stock: 70,
//             category: "Electronics",
//             createdAt: "2024-05-27T18:55:35.000Z",
//             updatedAt: "2024-06-12T20:39:11.000Z",
//             __v: 0,
//             featured: true,
//             photoPublicId: "shopspot/bluetooth-earphones",
//             description: "High-quality sound and noise cancellation for an immersive audio experience."
//         },
//         {
//             _id: "665e5d7add90f0b862757760",
//             name: "Smart LED Light Bulb",
//             photo: "https://res.cloudinary.com/dfddqp6av/image/upload/v1718042311/shopspot/smart-led-bulb.jpg",
//             price: 900, // INR
//             stock: 90,
//             category: "Smart Home",
//             createdAt: "2024-05-28T21:20:42.000Z",
//             updatedAt: "2024-06-13T23:50:55.000Z",
//             __v: 0,
//             featured: false,
//             photoPublicId: "shopspot/smart-led-bulb",
//             description: "Control your lighting from anywhere with this energy-efficient smart bulb."
//         },
//         {
//             _id: "665e5d7add90f0b862757761",
//             name: "Premium Yoga Mat",
//             photo: "https://res.cloudinary.com/dfddqp6av/image/upload/v1718042311/shopspot/premium-yoga-mat.jpg",
//             price: 2000, // INR
//             stock: 50,
//             category: "Fitness",
//             createdAt: "2024-05-29T07:42:30.000Z",
//             updatedAt: "2024-06-11T14:10:22.000Z",
//             __v: 0,
//             featured: true,
//             photoPublicId: "shopspot/premium-yoga-mat",
//             description: "Extra thick and durable yoga mat for optimal comfort during yoga sessions."
//         },
//         {
//             _id: "665e5d7add90f0b862757762",
//             name: "Gourmet Coffee Beans",
//             photo: "https://res.cloudinary.com/dfddqp6av/image/upload/v1718042311/shopspot/gourmet-coffee-beans.jpg",
//             price: 1100, // INR
//             stock: 75,
//             category: "Gourmet Foods",
//             createdAt: "2024-05-30T11:33:28.000Z",
//             updatedAt: "2024-06-12T15:21:33.000Z",
//             __v: 0,
//             featured: false,
//             photoPublicId: "shopspot/gourmet-coffee-beans",
//             description: "Rich and aromatic coffee beans sourced from the best plantations."
//         },
//         {
//             _id: "665e5d7add90f0b862757763",
//             name: "Electric Skateboard",
//             photo: "https://res.cloudinary.com/dfddqp6av/image/upload/v1718042311/shopspot/electric-skateboard.jpg",
//             price: 25500, // INR
//             stock: 20,
//             category: "Outdoor Gear",
//             createdAt: "2024-06-01T13:14:11.000Z",
//             updatedAt: "2024-06-12T17:25:49.000Z",
//             __v: 0,
//             featured: true,
//             photoPublicId: "shopspot/electric-skateboard",
//             description: "High-performance electric skateboard for the urban environment."
//         },
//         {
//             _id: "665e5d7add90f0b862757764",
//             name: "Compact Drone with Camera",
//             photo: "https://res.cloudinary.com/dfddqp6av/image/upload/v1718042311/shopspot/compact-drone.jpg",
//             price: 18900, // INR
//             stock: 15,
//             category: "Electronics",
//             createdAt: "2024-06-02T14:59:20.000Z",
//             updatedAt: "2024-06-13T18:46:31.000Z",
//             __v: 0,
//             featured: true,
//             photoPublicId: "shopspot/compact-drone",
//             description: "Capture stunning aerial footage with this easy-to-use compact drone."
//         },
//         {
//             _id: "665e5d7add90f0b862757765",
//             name: "Handmade Clay Pottery Set",
//             photo: "https://res.cloudinary.com/dfddqp6av/image/upload/v1718042311/shopspot/clay-pottery-set.jpg",
//             price: 6800, // INR
//             stock: 30,
//             category: "Arts & Crafts",
//             createdAt: "2024-06-03T16:18:24.000Z",
//             updatedAt: "2024-06-12T19:12:58.000Z",
//             __v: 0,
//             featured: false,
//             photoPublicId: "shopspot/clay-pottery-set",
//             description: "Beautifully crafted pottery set, ideal for both practical use and decoration."
//         },
//         {
//             _id: "665e5d7add90f0b862757766",
//             name: "Organic Herbal Tea Collection",
//             photo: "https://res.cloudinary.com/dfddqp6av/image/upload/v1718042311/shopspot/herbal-tea-collection.jpg",
//             price: 1450, // INR
//             stock: 40,
//             category: "Gourmet Foods",
//             createdAt: "2024-06-04T17:40:22.000Z",
//             updatedAt: "2024-06-13T20:33:15.000Z",
//             __v: 0,
//             featured: true,
//             photoPublicId: "shopspot/herbal-tea-collection",
//             description: "A soothing collection of organic herbal teas for relaxation and health."
//         },
//     ];

//     try {
//         await Product.create(products);
//         console.log("Products Created Successfully");
//     } catch (error) {
//         console.error("Error creating products:", error);
//     }
// }

// generateRandomProducts();

//  For generating random products
// const genrateRandomProducts = async (count: number = 10) => {
//     const products = [];

//     for (let i = 0; i < count; i++) {
//         const product = {
//             name: faker.commerce.productName(),
//             price: faker.commerce.price(),
//             stock: faker.commerce.price({ min: 0, max: 100, dec: 0 }),
//             category: faker.commerce.department(),
//             photo: faker.image.url(),
//             createdAt: faker.date.recent(),
//             updatedAt: faker.date.recent(),
//             description: faker.commerce.productDescription(),
//             __v: 0
//         }
//         products.push(product);
//     }

//     await Product.create(products);

//     console.log("Products Created Successfully");
// }

// genrateRandomProducts(20);

// const deleteAllProducts = async (count: number = 10) => {
//     const Products = await Product.find({}).skip(2);

//     for(let i = 0; i < Products.length; i++) {
//         await Products[i].deleteOne();
//     }

//     console.log("Products Deleted Successfully");

// }
