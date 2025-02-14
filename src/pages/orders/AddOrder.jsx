import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import AuthContext from "../../../context/AuthContext";

const AddOrder = () => {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const [orderData, setOrderData] = useState({
        product_id: "",
        quantity: "",
    });

    const [product, setProduct] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get("/products");
                setProduct(response.data.data || []);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

   
    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrderData({ ...orderData, [name]: value });
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("product_id", orderData.product_id);
            formData.append("quantity", orderData.quantity);

            await api.post("/products", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            navigate("/orders"); 
        } catch (error) {
            console.error("Error adding orders:", error);
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
                    
                    <label>Category:</label>
                    <select name="product_id" value={orderData.product_id} onChange={handleChange} required>
                        <option value="">Select Product</option>
                        {product.map(prod => (
                            <option key={prod.id} value={prod.id}>
                                {prod.name}
                            </option>
                        ))}
                    </select>

                    <label>Quantity:</label>
                    <input type="quantity" name="stock" value={orderData.quantity} onChange={handleChange} required />


                    <button type="submit" className="submit-btn">Add Orders</button>
                </form>
            </main>
        </div>
    );
};

export default AddOrder;
