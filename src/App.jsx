import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProductList from "./pages/products/ProductList";
import AddProduct from "./pages/products/AddProduct";
import OrderList from "./pages/orders/OrderList";
import AddOrder from "./pages/orders/AddOrder";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/home" element={<Home />} />
        <Route path="/product" element={<ProductList/>} />
        <Route path="/product/add" element={<AddProduct/>} />
        <Route path="/order" element={<OrderList/>} />
        <Route path="/order/add" element={<AddOrder/>} />
      </Routes>
    </Router>
  );
};

export default App;
