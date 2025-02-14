import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.token) {
      navigate("/");
    }
  }, [user, navigate]);
  console.log(user.data)
  if (!user) {
    return <p>Loading...</p>; 
  }


  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Toko Mini</h2>
        <ul>
          <li><a href="/home">Dashboard</a></li>
          <li><a href="/product">Product</a></li>
          <li><a href="#">Settings</a></li>
          <li><button onClick={logout}>Logout</button></li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="content">
        <h1>Selamat Datang, {user?.data.name}!</h1>
        <p>Email: {user?.data.email}</p>
        <p>Role: {user?.data.role}</p>
      </main>
    </div>
  );
};

export default Home;
