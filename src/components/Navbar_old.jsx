import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  Phone,
  Mail,
  X,
  Moon,
  Sun,
  Menu,
  ChevronDown,
  Package,
  Settings,
  Wrench,
  User,
  LogOut,
  FileText,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  const { currentUser, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY < 50) {
        setShowNavbar(true);
      } else if (currentY > lastScrollY) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "About Us", path: "/about" },
    { name: "Blog", path: "/blog" },
  ];

  const categories = [
    { name: "Bearings", icon: Settings, path: "/category/bearings" },
    { name: "Linear Motion", icon: Package, path: "/category/linear-motion" },
    { name: "Bushings", icon: Wrench, path: "/category/bushings" },
    { name: "Caster Wheels", icon: Package, path: "/category/caster-wheels" },
    { name: "Conveyor Parts", icon: Settings, path: "/category/conveyor" },
    { name: "Automation", icon: Wrench, path: "/category/automation" },
  ];

  return (
    <>
      {/* TOP INFO BAR */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-900 dark:to-indigo-900 text-white text-xs py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 md:gap-6 flex-wrap">
            <span className="flex items-center gap-1.5 font-medium">
              <Phone className="w-3.5 h-3.5" />
              <a href="tel:+911234567890" className="hover:underline">
                +91 123 456 7890
              </a>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Mail className="w-3.5 h-3.5" />
              <a href="mailto:info@mitsuki.in" className="hover:underline">
                info@mitsuki.in
              </a>
            </span>
          </div>
          <div className="flex items-center gap-3 font-medium">
            <span className="hidden md:inline">🕒 24/7 Customer Support</span>
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <nav
        className={`sticky top-0 left-0 w-full z-50 bg-white dark:bg-gray-900 shadow-lg transition-transform duration-300 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Main Nav Row */}
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-2.5 group">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2.5 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <Settings className="w-6 h-6 md:w-7 md:h-7 text-white animate-spin-slow" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                  Mitsuki India
                </span>
                <span className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 -mt-1 hidden sm:block font-medium">
                  Engineering Solutions
                </span>
              </div>
            </NavLink>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-8 xl:gap-10 ml-8 xl:ml-12">
              {menuItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `text-[15px] font-semibold transition-colors relative group ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                    }`
                  }
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </NavLink>
              ))}

              {/* Categories Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1.5 text-[15px] font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Categories
                  <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                </button>
                <div className="absolute top-full left-0 mt-3 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-200 dark:border-gray-700">
                  <div className="p-3">
                    {categories.map((category) => (
                      <NavLink
                        key={category.name}
                        to={category.path}
                        className="flex items-center gap-3 px-4 py-3.5 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors group/item"
                      >
                        <category.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span className="text-[15px] font-medium text-gray-700 dark:text-gray-300 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400">
                          {category.name}
                        </span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>

              {/* User Account */}
              {currentUser ? (
                <div className="relative group">
                  <button className="flex items-center gap-1.5 text-[15px] font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <User className="w-4 h-4" />
                    {currentUser.name || currentUser.email}
                    <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                  </button>
                  <div className="absolute top-full right-0 mt-3 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-200 dark:border-gray-700">
                    <div className="p-3">
                      <NavLink
                        to="/orders"
                        className="flex items-center gap-3 px-4 py-3.5 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors group/item"
                      >
                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span className="text-[15px] font-medium text-gray-700 dark:text-gray-300 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400">
                          My Orders
                        </span>
                      </NavLink>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3.5 rounded-lg hover:bg-red-50 dark:hover:bg-gray-700 transition-colors group/item w-full text-left"
                      >
                        <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
                        <span className="text-[15px] font-medium text-gray-700 dark:text-gray-300 group-hover/item:text-red-600 dark:group-hover/item:text-red-400">
                          Logout
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <NavLink
                    to="/login"
                    className="text-[15px] font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/signup"
                    className="text-[15px] font-semibold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Sign Up
                  </NavLink>
                </div>
              )}
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for bearings, bushings..."
                  className="w-full pl-11 pr-4 py-2.5 rounded-full border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium placeholder:text-gray-400 transition-all duration-300"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Search - Mobile */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="md:hidden p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
              >
                <Search className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700" />
                )}
              </button>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 group"
              >
                <ShoppingCart className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:scale-110 transition-transform" />
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg">
                  {cartCount}
                </span>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
              >
                {menuOpen ? (
                  <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {searchOpen && (
            <div className="md:hidden py-3 border-t border-gray-200 dark:border-gray-700 animate-fadeIn">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for bearings, bushings..."
                  className="w-full pl-11 pr-4 py-2.5 rounded-full border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 max-h-[calc(100vh-80px)] overflow-y-auto animate-fadeIn">
            <div className="px-4 py-4 space-y-2">
              {menuItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-5 py-3.5 rounded-lg font-semibold text-base transition-all duration-300 ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}

              {/* Mobile Auth */}
              {currentUser ? (
                <>
                  <div className="px-5 py-3.5 text-gray-700 dark:text-gray-300 font-semibold">
                    {currentUser.name || currentUser.email}
                  </div>
                  <NavLink
                    to="/orders"
                    onClick={() => setMenuOpen(false)}
                    className="block px-5 py-3.5 rounded-lg font-semibold text-base text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                  >
                    My Orders
                  </NavLink>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="block w-full text-left px-5 py-3.5 rounded-lg font-semibold text-base text-red-600 hover:bg-red-50 dark:hover:bg-gray-800 transition-all duration-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block px-5 py-3.5 rounded-lg font-semibold text-base text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="block px-5 py-3.5 rounded-lg font-semibold text-base bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 text-center"
                  >
                    Sign Up
                  </NavLink>
                </>
              )}

              {/* Categories - Mobile */}
              <div className="pt-2">
                <button
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                  className="w-full flex items-center justify-between px-5 py-3.5 rounded-lg font-semibold text-base text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                >
                  Categories
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-300 ${
                      categoriesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {categoriesOpen && (
                  <div className="mt-2 space-y-1 pl-4 animate-fadeIn">
                    {categories.map((category) => (
                      <NavLink
                        key={category.name}
                        to={category.path}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-5 py-3 rounded-lg text-[15px] font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                      >
                        <category.icon className="w-5 h-5" />
                        {category.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>

              {/* Contact Info - Mobile */}
              <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                <a
                  href="tel:+911234567890"
                  className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  +91 123 456 7890
                </a>
                <a
                  href="mailto:info@mitsuki.in"
                  className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  info@mitsuki.in
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for sticky navbar */}
      <div className="h-0"></div>
    </>
  );
};

export default Navbar;
