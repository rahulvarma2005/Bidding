import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ProductsView from "./pages/ProductsView";
import UsersView from "./pages/UsersView";
import UserDetails from "./pages/UserDetails";
import ProductDetails from "./pages/ProductDetails";
import AboutUs from "./pages/AboutUs";
import MyProfile from "./pages/MyProfile";
import CreateProduct from "./pages/CreateProduct";
import AdminPanel from "./pages/AdminPanel";

function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (err) {
        handleLogout();
      }
    }
  }, []);

  const handleLogin = (user, token) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    setUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  const Layout = ({ children }) => {
    return (
      <div className="flex flex-col min-h-screen">
        {/* Header on top */}
        <Header userId={user?.id} username={user?.username} role={user?.role} onLogout={handleLogout} />


        {/* Main content */}
        <main className="flex-grow">{children}</main>

        {/* Footer at bottom */}
        <Footer />
      </div>
    );
  };

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<ProductsView isAuthenticated={isAuthenticated}/>} />
          <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/user-view" element={<UsersView />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/admin-panel" element={user?.role === "ADMIN" ? (<AdminPanel />):(<LoginForm />)} />
          <Route
            path="/user-profile/:userId"
            element={
              isAuthenticated ? (
                <UserDetails />
              ) : (
                <LoginForm onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/add-product"
            element={
              isAuthenticated ? (
                <CreateProduct />
              ) : (
                <LoginForm onLogin={handleLogin} />
              )
            }
          />*
          <Route
            path="/product-details/:productId"
            element={
              isAuthenticated ? (
                <ProductDetails />
              ) : (
                <LoginForm onLogin={handleLogin} />
              )
            }
          />
          <Route path="/about-us" element={<AboutUs />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
