import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";

export default function Categories() {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState("");

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
  const requestData = { name };
  if (parentCategory) {
    requestData.parentCategory = parentCategory;
  }

  await axios.post("/api/categories", requestData);
  setName("");
  fetchCategories();
}


  return (
    <Layout>
      <h1>Categories</h1>
      <label htmlFor="categories">New category name</label>

      <form onSubmit={saveCategory} className="flex gap-1">
        <input
          className="mb-0"
          value={name}
          onChange={(ev) => setName(ev.target.value)}
          type="text"
          id="categories"
          placeholder={"Category name"}
        />
        <select
          className="mb-0"
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
        <button type="submit" className="btn-primary py-1">
          Save
        </button>
      </form>

      <table className="basic mt-4">
        <thead>
          <tr>
            <td>Category name</td>
            <td>Parent category</td>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 &&
            categories.map((category) => (
              <tr key={category._id}>
                <td>{category.name}</td>
                <td>{category?.parent?.name}</td>

              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}
