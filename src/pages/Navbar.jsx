import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { Logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await Logout();
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-md">
      <div className="flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-bold">
          <Link to="/dashboard">JEWELLERY</Link>
        </h1>

        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        <ul className="hidden md:flex gap-6 items-center">
          <li className="font-bold text-xl">
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li className="font-bold text-xl">
            <Link to="/product">Product</Link>
          </li>
          <li
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-xl font-bold px-4 py-2 rounded-md cursor-pointer"
          >
            Logout
          </li>
        </ul>
      </div>

      {isOpen && (
        <ul className="md:hidden flex flex-col gap-4 px-6 pb-4">
          <li>
            <Link to="/dashboard" onClick={toggleMenu}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/product" onClick={toggleMenu}>
              Product
            </Link>
          </li>
          <li
            onClick={() => {
              handleLogout();
              toggleMenu();
            }}
            className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-md cursor-pointer w-max"
          >
            Logout
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
