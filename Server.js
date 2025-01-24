import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import colors from 'colors';
import userroutes from './Routes/UserRoutes.js'
import ProductRoutes from './Routes/ProductRoutes.js'
import OrderRoutes from './Routes/OrderRoutes.js'
const app=express();
app.use(express.json());
app.use(cors());
dotenv.config();

app.use("/products",ProductRoutes);
app.use("/users",userroutes);
app.use("/Orders",OrderRoutes);


mongoose.connect("mongodb+srv://SAN3005:SAN3005@cluster0.9coqr.mongodb.net/Project?authSource=admin&replicaSet=atlas-mfdnmj-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true",{ 
})
.then(()=>console.log('im connected to atlas  database ' .underline.blue))
.catch(err=>console.log(`${err}`.underline.red ));



app.listen(process.env.PORT ,console.log(`Hi im up and Running good and running on ${process.env.PORT}`.blue))


