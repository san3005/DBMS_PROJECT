import express from 'express';
const router=express.Router();
 import {deleteproduct, getProduct,getProducts,sellerproducts,updatedproduct,sellerSinglePublishedProduct,createproduct} from '../Controllers/ProductControllers.js'
 import {protectede,checkrole} from '../Middleware/Middleware.js'

import { addReview } from '../Controllers/ReviewController.js';


router.post('/create', protectede, checkrole('seller'), createproduct);
router.get("/allseller",protectede,checkrole('seller'),sellerproducts);
router.get('/sellerpublished/:id', protectede, checkrole('seller'), sellerSinglePublishedProduct);

router.delete("/delete/:id",protectede,checkrole("seller"),deleteproduct)
router.put("/update/:id",protectede,checkrole("seller"),updatedproduct)
router.get("/",getProducts);
router.get("/:id",getProduct);
router.post('/:productId/reviews', protectede, addReview);
export default router;