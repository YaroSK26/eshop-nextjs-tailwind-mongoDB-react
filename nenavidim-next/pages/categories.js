/* eslint-disable react/jsx-key */

  import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import Swal from "sweetalert2";






function Categories(){ 

  const [editedCategory, setEditedCategory] = useState(null)
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState("");
  const [properties, setProperties]  = useState([])

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }

async function saveCategory(ev) {
  ev.preventDefault();
  const data = { name,parentCategory,properties };
  if (parentCategory !== "") {
    data.parentCategory = parentCategory;
  }

  if (editedCategory) {
    data._id = editedCategory._id;
    setEditedCategory(null);
    await axios.put("/api/categories", data);
  } else {
    await axios.post("/api/categories", data);
  }
  setName("");
  fetchCategories();
}


function editCategory(category) {
  setEditedCategory(category);
  setName(category.name)
 setParentCategory(category.parent && category.parent._id !== "" ? category.parent._id : null);


}

function removeProperty(indexToRemove) {
  setProperties(prev => {
     return [...prev].filter((p,pIndex) => {
        return pIndex !== indexToRemove
    })
  })
}

function deleteCategory(category) {
  Swal.fire({
    title: "Are you sure?", 
    text: `Do you want to delete ${category.name}?`,
    showCancelButton: true,
    cancelButtonText: "Cancel",
    confirmButtonText: "Yes, Delete!",
    confirmButtonColor: "#d55",
    reverseButtons: true,
      
  }).then(async result => {
    if (result.isConfirmed) {
      const {_id} = category
      await axios.delete("/api/categories?_id="+_id)
        fetchCategories()
    }
  })
}

 function addProperty() {
    setProperties(prev => {
      return [...prev, {name: "",values: ""}]
    })
 }

 function handlePropertyNameChange(index,property,newName) {
  setProperties(prev => {
    const properties = [...prev]
    properties[index].name = newName
    return properties
  })
 }
  function handlePropertyValuesChange(index,property,newValues) {
  setProperties(prev => {
    const properties = [...prev]
    properties[index].values = newValues
    return properties
  })
 }


  return (
    <Layout>
      <h1>Categories</h1>
      <label htmlFor="categories">{editedCategory ? `Edit category ${editedCategory.name}` : "Create new category" }</label>

      <form onSubmit={saveCategory} >
          <div className="flex gap-1">
                      <input
          value={name}
          onChange={(ev) => setName(ev.target.value)}
          type="text"
          id="categories"
          placeholder={"Category name"}
        />
        <select
          value={parentCategory}
          onChange={(ev) => setParentCategory(ev.target.value)}
        >
          <option value="">No parent category</option>
          {categories.length > 0 &&
            categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
        </select>
          </div>
          <div className="mb-2">
            
            <label className="block " >Properties</label>
            <button type="button" className="btn-default text-sm" onClick={addProperty}>Add new property</button>
            {properties.length > 0 && properties.map((property, index) => (
              <div className="flex gap-1 mt-2">
                <input className="mb-0" type="text" value={property.name} onChange={ev => handlePropertyNameChange(index,property, ev.target.value)} placeholder="property name (exmaple:color)" />
                <input className="mb-0" type="text" value={property.values} onChange={ev => handlePropertyValuesChange(index,property, ev.target.value)} placeholder="values, comma separated " />
                <button type="button" className="btn-default" onClick={ () => removeProperty(index)}>Remove</button>
              </div>
            ))}
          </div>
          <div className="flex gap-1">
                      {editedCategory && (
              <button type="button" className="btn-default" onClick={() => {setEditedCategory(null); setName(""); setParentCategory("");}}> Cancel </button>
          )}
          
        <button type="submit" className="btn-primary py-1" > Save </button>
          </div>

      </form>
              {!editedCategory && (
                        <table className="basic mt-4">
        <thead>
          <tr>
            <td>Category name</td>
            <td>Parent category</td>
             <td></td>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 &&
            categories.map((category) => (
              <tr key={category._id}>
                <td>{category.name}</td>
                <td>{category?.parent?.name}</td>
                <td>
                  
                    <button onClick={() => editCategory(category)} className="btn-primary mr-1">Edit</button>
                  <button className="btn-primary" onClick={() =>deleteCategory(category)}>Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
              )}

    </Layout>
  );
}
 
export default Categories