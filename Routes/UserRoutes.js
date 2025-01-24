import express from 'express';
 import {Authenticatingusers,deleteusers,singleuser,updatinguser,  allusers,
    RegisteringUsers,Profileofusers} from '../Controllers/UserControllers.js'
 import { checkrole,protectede } from '../Middleware/Middleware.js';
 const router=express.Router();

router.post("/loginuser",Authenticatingusers) 
router.get("/userprofile",protectede,Profileofusers)
router.post("/Registration",RegisteringUsers);
//admin routes


router.get("/allusers", protectede, checkrole("admin"), allusers);
router.delete("/delete/:id", protectede, checkrole("admin"), deleteusers);
router.get("/singleuser/:id", protectede, checkrole("admin"), singleuser);
router.put("/updateuser/:id", protectede, checkrole("admin"), updatinguser);


export default router;