import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import Spinner from "../components/Spinner";
import { withSwal } from "react-sweetalert2";

 function SettingPage({swal}) {
  const [products, setProducts] = useState([]);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const [featuredLoading, setFeaturedLoading] = useState(false);
  const [featuredProductId, setFeaturedProductId] = useState("");

  useEffect(() => {
    setIsLoadingProduct(true);
    
    axios.get("/api/products").then((res) => {
      setProducts(res.data);
      setIsLoadingProduct(false);
    });
    
     axios.get('/api/settings?name=featuredProductId').then(res => {
      setFeaturedProductId(res.data.value);
      setFeaturedLoading(false);
    });
  }, []);

  async function saveSettings() {
      
    await axios.put("/api/settings", {
      name: "featuredProductId",
      value: featuredProductId,
    }).then(() => {
        swal.fire({
            title: "Settings saved",
            icon: "success"
        })
    })
  }

  return (
    <Layout>
      <h1>Settings</h1>
      {(isLoadingProduct || featuredLoading )&& (<Spinner></Spinner>)}
      {!isLoadingProduct && !featuredLoading &&(
        <>
          <label>Featured Product</label>
          <select value={featuredProductId} onChange={(ev) => setFeaturedProductId(ev.target.value)}>
            {products.length > 0 &&
              products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.title}
                </option>
              ))}
          </select>
          <div>
            <button onClick={saveSettings} className="btn-primary">
              Save settings
            </button>
          </div>
        </>
      )}
    </Layout>
  );
}


export default withSwal(({swal})=> (
    <SettingPage swal={swal}/>
))