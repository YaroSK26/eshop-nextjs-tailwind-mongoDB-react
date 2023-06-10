/* aby neparsov data json cez next js , pouzivame multiparty */

import multiparty from "multiparty"
import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3"
import fs from "fs"
import mime from "mime-types"
const bucketName = "jaro-next-ecommerce"


export default async function handle(req,res){
            const {fields,files} = await new Promise((resolve,reject) =>{
            const form = new multiparty.Form()
            form.parse(req,async (err,fields,files) =>{
            if (err) reject (err)
            resolve(files,fields)       
    })
    })
    console.log("length:", files.file.length)

    const client = new S3Client({
    region: "us-east-1",
    credentials:{
        accessKey: "proccess.env.S3_ACCESS_KEY",
        secretAccessKey: "proccess.env.S3_SECRET_ACCESS_KEY",

        },
    })
    const links = []
    for (const file of files.file){
        const ext = file.originalFilename.split(".").pop()
        const newFilename = Date.now() + "." + ext
        await  client.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: newFilename,
        Body: fs.readFileSync(file.path),
        ACL: "public-read",
        ContentType: mime.lookup(file.path),
    }));
    const link = `https://${bucketName}.s3.amazonaws.com/${newFilename}`
    links.push(link)
    }

   
         return   res.json({links})
}

export const config = {
    api: {bodyParser: false},
}