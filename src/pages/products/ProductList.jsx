import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import AuthContext from "../../../context/AuthContext";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa"; // Import icons

const ProductList = () => {
    const IMAGE_API = import.meta.env.VITE_IMAGE_API;
    const [products, setProducts] = useState([]);
    const { user, logout } = useContext(AuthContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [perPage, setPerPage] = useState(10);

    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage]);

    const fetchProducts = (page) => {
        api.get(`/products?page=${page}`)
            .then(response => {
                setProducts(response.data.data || []);
                setCurrentPage(response.data.current_page);
                setTotalPages(response.data.last_page);
                setPerPage(response.data.per_page);
            })
            .catch(error => console.error("Error fetching products:", error));
    };

    const deleteProduct = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            await api.delete(`/products/${id}`);
            fetchProducts();
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

          
            <main className="content">
                <h1>Product List</h1>

              
                {user && (
                    <div className="add-product">
                        <Link to="/product/add" className="btn-add">
                            <FaPlus /> Add Product
                        </Link>
                    </div>
                )}

                {/* Table */}
                <div className="table-container">
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Product</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Category</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length > 0 ? (
                                products.map((product, index) => (
                                    <tr key={product.id}>
                                        <td>{(currentPage - 1) * perPage + index + 1}</td>
                                        <td>
                                            <img 
                                                src={`${IMAGE_API}/${product.image}`} 
                                                alt={product.name} 
                                                className="product-image"
                                            />
                                        </td>
                                        <td>{product.name}</td>
                                        <td>Rp {product.price}</td>
                                        <td>{product.stock}</td>
                                        <td>{product.category?.name || "No Category"}</td>
                                        <td className="actions">
                                            {user && (
                                                <>
                                                    <Link to={`edit/${product.id}`} className="btn-edit">
                                                        <FaEdit />
                                                    </Link>
                                                    <button onClick={() => deleteProduct(product.id)} className="btn-delete">
                                                        <FaTrash />
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="no-data">No products available.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="pagination">
                    <button 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Prev
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </main>
        </div>
    );
};

export default ProductList;
