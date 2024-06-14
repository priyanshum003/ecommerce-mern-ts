import express from 'express';
import {
    createNewProduct,
    deleteProduct,
    getAllCategories,
    getAllProducts,
    getFeaturedProducts,
    getLatestProducts,
    getProductDetails,
    searchProducts,
    toggleFeaturedStatus,
    updateProduct
} from '../controllers/product.controller';
import { uploadImage } from '../utils/cloudinary';
import { adminOnly, authenticateUser } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Products route');
});


// Admin-only routes
router.post('/new', authenticateUser, adminOnly, uploadImage('photo'), createNewProduct);
router.put('/:id', authenticateUser, adminOnly, uploadImage('photo'), updateProduct);
router.delete('/:id', authenticateUser, adminOnly, deleteProduct);
router.patch('/feature/:id', authenticateUser, adminOnly, toggleFeaturedStatus);

// Public routes
router.get('/all', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/latest', getLatestProducts);
router.get('/categories', getAllCategories);
router.get('/search', searchProducts);
router.get('/:id', getProductDetails);


export default router;