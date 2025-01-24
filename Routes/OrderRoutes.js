import {
    createOrder,singleorder,myorders,totalorders,deleteOrder,deliveredorder} from '../Controllers/OrderController.js';
  import { protectede, checkrole } from '../Middleware/Middleware.js';

  const router = express.Router();
  import express from 'express';

router.get('/totalorders', protectede, checkrole('admin'), totalorders);//checked
router.delete('/delete/:id', protectede, checkrole('admin'), deleteOrder);//checked
router.put('/delivered/:id', protectede, checkrole('admin'), deliveredorder);//checked
router.get("/:id",protectede,checkrole('admin'),singleorder)


router.post("/",protectede,  createOrder,)//checked
router.get("/myorders",protectede,myorders)//checked


export default router;