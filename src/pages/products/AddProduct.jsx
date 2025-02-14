import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import AuthContext from "../../../context/AuthContext";

const AddProduct = () => {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const [productData, setProductData] = useState({
        name: "",
        price: "",
        stock: "",
        category_id: "",
        image: null,
    });

    const [categories, setCategories] = useState([]); 
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get("/category");
                setCategories(response.data.data || []);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

   
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData({ ...productData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setProductData({ ...productData, image: file });

        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("name", productData.name);
            formData.append("price", productData.price);
            formData.append("stock", productData.stock);
            formData.append("category_id", productData.category_id);
            formData.append("image", productData.image);

            await api.post("/products", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            navigate("/product"); 
        } catch (error) {
            console.error("Error adding product:", error);
        }
    };

    return (
        <div className="dashboard">
            {/* Sidebar */}
            <aside className="sidebar">
                <h2>Menu</h2>
                <ul>
                    <li><a href="/home">Dashboard</a></li>
                    <li><a href="/product">Product</a></li>
                    <li><a href="/order">Order</a></li>
                    <li><button onClick={logout}>Logout</button></li>
                </ul>
            </aside>

            {/* Main Content */}
            <main className="content">
                <h1>Add New Product</h1>

                <form onSubmit={handleSubmit} className="product-form">
                    <label>Name:</label>
                    <input type="text" name="name" value={productData.name} onChange={handleChange} required />

                    <label>Price:</label>
                    <input type="number" name="price" value={productData.price} onChange={handleChange} required />

                    <label>Stock:</label>
                    <input type="number" name="stock" value={productData.stock} onChange={handleChange} required />

                    <label>Category:</label>
                    <select name="category_id" value={productData.category_id} onChange={handleChange} required>
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    <label>Image:</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} required />
                    {imagePreview && <img src={imagePreview} alt="Preview" className="preview-image" />}

                    <button type="submit" className="submit-btn">Add Product</button>
                </form>
            </main>
        </div>
    );
};

export default AddProduct;
