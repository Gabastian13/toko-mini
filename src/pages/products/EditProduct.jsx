import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

const EditProduct = () => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchProduct();
    }, []);

    const fetchProduct = async () => {
        const res = await api.get(`/products/${id}`);
        setName(res.data.name);
        setPrice(res.data.price);
    };

    const updateProduct = async (e) => {
        e.preventDefault();
        await api.put(`/products/${id}`, { name, price });
        navigate("/");
    };

    return (
        <div>
            <h1>Edit Product</h1>
            <form onSubmit={updateProduct}>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
                <button type="submit">Update</button>
            </form>
        </div>
    );
};

export default EditProduct;
