import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import PlayersView from "./pages/PlayersView"; // Note: This will be broken until refactored!
import UsersView from "./pages/UsersView";
import UserDetails from "./pages/UserDetails";
import ProductDetails from "./pages/ProductDetails";
import AboutUs from "./pages/AboutUs";
import MyProfile from "./pages/MyProfile";
import AdminPanel from "./pages/AdminPanel";
import LiveAuctionRoom from "./pages/LiveAuctionRoom";

// --- NEW IMPORTS ---
import CreateTeam from "./pages/CreateTeam";
import AddPlayer from "./pages/AddPlayer";
import AuctioneerDashboard from "./pages/AuctioneerDashboard";
import TeamsSummary from "./pages/TeamsSummary";

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
        <Header userId={user?.id} username={user?.username} role={user?.role} onLogout={handleLogout} />
        <main className="flex-grow">{children}</main>
        {/*<Footer />*/}
      </div>
    );
  };

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Public Views */}
          <Route path="/" element={<PlayersView isAuthenticated={isAuthenticated}/>} />
          <Route path="/players" element={<PlayersView isAuthenticated={isAuthenticated}/>} />
          <Route path="/teams" element={<TeamsSummary />} />
          <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/user-view" element={<UsersView />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/live-auction" element={<LiveAuctionRoom />} />

          {/* Protected Routes */}
          <Route path="/my-profile" element={isAuthenticated ? <MyProfile /> : <LoginForm onLogin={handleLogin} />} />
          <Route
            path="/user-profile/:userId"
            element={isAuthenticated ? <UserDetails /> : <LoginForm onLogin={handleLogin} />}
          />
          <Route
            path="/product-details/:productId"
            element={isAuthenticated ? <ProductDetails /> : <LoginForm onLogin={handleLogin} />}
          />

          {/* ADMIN ROUTES */}
          <Route 
            path="/admin-panel" 
            element={user?.role === "ADMIN" ? <AdminPanel /> : <LoginForm onLogin={handleLogin} />} 
          />
          <Route 
            path="/create-team" 
            element={user?.role === "ADMIN" ? <CreateTeam /> : <LoginForm onLogin={handleLogin} />} 
          />
          <Route 
            path="/add-player" 
            element={user?.role === "ADMIN" ? <AddPlayer /> : <LoginForm onLogin={handleLogin} />} 
          />
          <Route 
            path="/auctioneer" 
            element={user?.role === "ADMIN" ? <AuctioneerDashboard /> : <LoginForm onLogin={handleLogin} />} 
          />

        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;