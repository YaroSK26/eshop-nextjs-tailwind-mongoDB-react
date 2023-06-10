import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({_id,title:existingTitle,description:existingDescription,price:existingPrice,images:existingImages,}){
    const [title,setTitle] = useState(existingTitle || "")
    const [description,setDescription] = useState(existingDescription || "")
    const [price,setPrice] = useState(existingPrice || "")
    const [images,setImages] = useState(existingImages || [])
    const [goToProducts , setGoToProducts] = useState(false)
    const [isUploding,setIsUploading ] = useState(false)
    const router = useRouter()
    async function saveProduct(ev) {
        ev.preventDefault()
        const data = {title,description,price,images}
        if (_id) {
            //update
            await axios.put("/api/products", {...data,_id})
           
        }else{
            //create
            await axios.post("/api/products",data)
           
        }
       setGoToProducts(true)
    }
    if (goToProducts) {
         router.push('/products')
    }

    async function uploadImages(ev){
        const files = ev.target?.files
        console.log(files)
        if (files?.length > 0) {
            setIsUploading (true)

            const data = new FormData()
            for (const file of files){
                data.append("file", file)
            }
            const res = await axios.post("/api/upload", data)
                console.log(res.data)

            setImages(oldImages => {
                return [...oldImages, ...res.data.links]
            })
            setIsUploading(false)
        }
    }

    function updatedImagesOrder(newImagesOrder) {
        setImages(newImagesOrder);
    }

    return (
   
        <form onSubmit={saveProduct} action="">
             
        <label htmlFor="1">Product name</label>
        <input id="1" type="text" placeholder="product name"  value={title} onChange={ev => setTitle (ev.target.value)}/>
        <label htmlFor="">Photos</label>
       <div className="mb-2 flex flex-wrap gap-1">
        <ReactSortable className="flex flex-wrap gap-1" list={images} setList={updatedImagesOrder} swapThreshold={1}>
            {!!images?.length && images.map((link, index) => (
            <div key={index} className=" h-24">
                <img src={link} alt="" className="rounded-lg" />
            </div>
            ))}
        </ReactSortable>
        {isUploding && (
            <div className="h-24  p-1 flex items-center ">
            <Spinner/>
            </div>
        )}
        <label className="cursor-pointer text-gray-500 rounded-lg bg-gray-200 gap-1 w-24 h-24  flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <div>Upload</div>
            <input  type="file" className="hidden " onChange={uploadImages} />
        </label>
        </div>

         <label htmlFor="2">Description</label>
        <textarea id="2" placeholder="description" value={description} onChange={ev => setDescription (ev.target.value)}></textarea>
         <label htmlFor="3">Price (in USD)</label>
        <input id="3" type="number" placeholder="price" value={price} onChange={ev => setPrice (ev.target.value)} />

        <button type="submit"  className="btn-primary">Save</button>
        </form>
       
   
    )
}