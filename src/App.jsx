import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth, AuthProvider } from "./auth/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/DashBoard";
import Navbar from "./pages/Navbar";
import Product from "./pages/Product";
import "./App.css";

function AppContent() {
  const { userData } = useAuth();
  const isLoggedIn = !!userData;

  return (
    <>
      {isLoggedIn && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Login />} />
        <Route path="/product" element={isLoggedIn ? <Product /> : <Login />} />
      </Routes>
    </>
  );
}

function App() {
  return (
   
      <BrowserRouter>
       <AuthProvider>  <AppContent /></AuthProvider>
      
      </BrowserRouter>
   
  );
}

export default App;
