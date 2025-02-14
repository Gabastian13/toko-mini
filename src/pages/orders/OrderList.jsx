import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import AuthContext from "../../../context/AuthContext";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa"; // Import icons

const OrderList = () => {
    const IMAGE_API = import.meta.env.VITE_IMAGE_API;
    const [products, setOrders] = useState([]);
    const { user, logout } = useContext(AuthContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [perPage, setPerPage] = useState(10);

    useEffect(() => {
        fetchOrders(currentPage);
    }, [currentPage]);

    const fetchOrders = (page) => {
        api.get(`/orders?page=${page}`)
            .then(response => {
                setOrders(response.data.data || []);
                setCurrentPage(response.data.current_page);
                setTotalPages(response.data.last_page);
                setPerPage(response.data.per_page);
            })
            .catch(error => console.error("Error fetching products:", error));
    };

    const deleteOrder = async (id) => {
        if (window.confirm("Are you sure you want to delete this Order?")) {
            await api.delete(`/products/${id}`);
            fetchOrders();
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
                <h1>Order List</h1>

                {/* Add Order Button */}
                {user && (
                    <div className="add-order">
                        <Link to="/order/add" className="btn-add">
                            <FaPlus /> Add Order
                        </Link>
                    </div>
                )}

                {/* Table */}
                <div className="table-container">
                    <table className="order-table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Order</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Category</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length > 0 ? (
                                products.map((order, index) => (
                                    <tr key={order.id}>
                                        <td>{(currentPage - 1) * perPage + index + 1}</td>
                                        <td>
                                            <img 
                                                src={`${IMAGE_API}/${order.image}`} 
                                                alt={order.name} 
                                                className="order-image"
                                            />
                                        </td>
                                        <td>{order.name}</td>
                                        <td>Rp {order.price}</td>
                                        <td>{order.stock}</td>
                                        <td>{order.category?.name || "No Category"}</td>
                                        <td className="actions">
                                            {user && (
                                                <>
                                                    <Link to={`edit/${order.id}`} className="btn-edit">
                                                        <FaEdit />
                                                    </Link>
                                                    <button onClick={() => deleteOrder(order.id)} className="btn-delete">
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

export default OrderList;
