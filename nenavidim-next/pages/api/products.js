import  {Product}  from "../../models/Product"
import { mongooseConnect } from "../../lib/mongoose"

export default async function handle(req,res) {
    const {method} = req
    await mongooseConnect()

    if (method === "GET") {
        if(req.query?.id){
            res.json(await Product.findOne({_id: req.query.id}))
        }else{
             res.json(await Product.find())
        }
       
    }
    if (method === "POST") {
    const {title, description, price, images, category} = req.body;
    const productData = {title, description, price, images};
    if (category && category !== "") {
        productData.category = category;
    }
    const productDoc = await Product.create(productData);
    res.json(productDoc);
}

if (method === "PUT") {
    const {title, description, price, images, category, _id} = req.body;
    const productData = {title, description, price, images};
    if (category && category !== "") {
        productData.category = category;
    } else {
        productData.category = null;
    }
    await Product.updateOne({_id}, productData);
    res.json(true);
}


﻿

    if(method === "DELETE"){
        if (req.query?.id) {
            await Product.deleteOne({_id:req.query?.id})
            res.json(true)
        }
    }
}
