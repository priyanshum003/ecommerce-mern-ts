import { Product } from "../models/product.model";
import { OrderItemType } from "../types/types";

export const reduceStock = async (orderItems: OrderItemType[]) => {

    for (let i = 0; i < orderItems.length; i++) {
        const item = orderItems[i];
        const product = await Product.findById(item.productId);
        if (!product) throw new Error('Product not found');
        product.stock = product.stock - item.quantity;

        await product.save();
    }
}