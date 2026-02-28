import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate, Link } from "react-router-dom";
import {
  IndianRupee,
  Truck,
  Search,
  ShoppingCart,
  X,
  Menu,
  ChevronDown,
  User,
  LogOut,
  FileText,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import PageWrapper from "./PageWrapper";

const Navbar = () => {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  const { currentUser, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  // Search State
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = React.useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  
  // Focus input when search opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
        searchInputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuOpen && !event.target.closest(".user-menu-container")) {
        setUserMenuOpen(false);
      }
      // Close search if clicking outside
      if (searchOpen && !event.target.closest(".search-container")) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen, searchOpen]);

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

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
        navigate(`/shop?query=${encodeURIComponent(searchQuery.trim())}`);
        setSearchOpen(false);
        setSearchQuery("");
    }
  };

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "About Us", path: "/about" },
    { name: "Policies", path: "/policies" },
    { name: "Contact Us", path: "/contact" },
  ];

  return (
    <>
      {/* MAIN NAVBAR (dark header theme) */}
      <nav
        className={`sticky top-0 left-0 w-full z-50 bg-gradient-to-r from-black to-gray-900 text-white transition-transform duration-300 ${showNavbar ? "translate-y-0" : "-translate-y-full"
          }`}
      >
        <PageWrapper className="py-5 lg:py-7">
          <div className="flex items-center justify-between gap-3">
            {/* Logo */}
            <div className="flex items-center gap-4 flex-none">
              <NavLink
                to="/"
                className="flex items-center gap-2 select-none"
                aria-label="Mitsuki Home"
              >
                {/* Logo Icon */}
                <div className="w-8 h-8 sm:w-9 sm:h-9 border border-white/60 text-white font-bold text-lg sm:text-xl flex items-center justify-center tracking-tight">
                  M
                </div>

                {/* Logo Text: full white, clean sans font, small-caps for both 'i' letters */}
                <span
                  className="font-semibold text-2xl sm:text-3xl md:text-4xl tracking-tight text-white"
                  style={{
                    fontFamily:
                      "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
                  }}
                >
                  M
                  <span style={{ fontVariantCaps: "small-caps" }}>i</span>
                  TSUK
                  <span style={{ fontVariantCaps: "small-caps" }}>i</span>
                </span>
              </NavLink>

              {/* Tagline */}
              <div className="hidden md:flex flex-col pl-4 border-l border-white/20 leading-tight">
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/60">
                  Your vision
                </span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/60">
                  Our priority
                </span>
              </div>
            </div>



            {/* Desktop Menu - Compact */}
            <ul className="hidden xl:flex gap-8 text-[17px] font-medium text-white/80">
              {menuItems.map((item) => (
                <li key={item.name} className="whitespace-nowrap">
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `hover:text-white transition-colors ${isActive ? "text-white font-bold" : ""}`
                    }
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Search Input (Expandable - Desktop) */}
            <div className="hidden lg:flex justify-end flex-initial search-container">
               <div className={`relative flex items-center transition-all duration-300 ease-in-out ${searchOpen ? 'w-64' : 'w-10'}`}>
                  {searchOpen ? (
                    <form onSubmit={handleSearchSubmit} className="w-full">
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search..."
                            className="w-full bg-gray-800 border border-gray-600 rounded-full py-2 pl-4 pr-10 text-sm text-white focus:outline-none focus:border-yellow-500 placeholder-gray-400"
                        />
                        <button 
                            type="submit" 
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-yellow-400 rounded-full hover:bg-gray-700 transition-colors"
                        >
                            <Search size={16} />
                        </button>
                    </form>
                  ) : (
                    <button
                        onClick={() => setSearchOpen(true)}
                        className="w-10 h-10 flex items-center justify-center rounded-full text-gray-300 hover:bg-gray-800 hover:text-white transition-all"
                        aria-label="Open search"
                    >
                        <Search size={22} />
                    </button>
                  )}
               </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-none justify-end">
              {/* Mobile Search Icon - Toggles Search Bar */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="lg:hidden bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition-colors flex items-center justify-center"
              >
                <Search size={22} />
              </button>

              {/* User */}
              {currentUser ? (
                <div className="relative user-menu-container">
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="bg-gray-800 rounded-full p-2.5 sm:px-4 sm:py-2.5 flex items-center gap-2 hover:bg-gray-700 transition-colors"
                    aria-label="Account"
                  >
                    <User size={20} />
                    <span className="hidden sm:block text-base md:text-[17px] max-w-[100px] md:max-w-[160px] truncate">
                      {currentUser.name || currentUser.email}
                    </span>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-xl">
                      <NavLink
                        to="/orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors"
                      >
                        <FileText className="w-5 h-5" />
                        <span className="text-sm">My Orders</span>
                      </NavLink>
                      <NavLink
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors"
                      >
                        <User className="w-5 h-5" />
                        <span className="text-sm">My Profile</span>
                      </NavLink>
                      <NavLink
                        to="/orders?tab=quotes"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors"
                      >
                        <FileText className="w-5 h-5" />
                        <span className="text-sm">My Quotes</span>
                      </NavLink>
                      <button
                        onClick={async () => {
                          await handleLogout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors"
                      >
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm">Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  to="/login"
                  className="bg-gray-800 rounded-full p-2.5 sm:px-4 sm:py-2.5 flex items-center gap-2 hover:bg-gray-700 transition-colors"
                >
                  <User size={20} />
                  <span className="hidden sm:inline text-base md:text-[17px] whitespace-nowrap">Sign in</span>
                </NavLink>
              )}

              {/* Cart */}
              <Link
                to="/cart"
                state={{ returnTo: location.pathname + location.search }}
                className="relative bg-gray-800 rounded-full p-2.5 hover:bg-gray-700 transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="xl:hidden bg-gray-800 rounded-full p-2.5 hover:bg-gray-700 transition-colors"
                aria-label="Menu"
              >
                {menuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

        </PageWrapper>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="xl:hidden border-t border-gray-800 bg-black max-h-[calc(100vh-70px)] overflow-y-auto shadow-2xl">
            <PageWrapper className="py-4 space-y-2">
              {menuItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-xl font-semibold transition-colors ${isActive
                      ? "bg-gray-900 text-white"
                      : "text-gray-200 hover:bg-gray-900"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}

              {/* Mobile Auth */}
              {currentUser ? (
                <>
                  <div className="px-4 py-3 text-gray-200 font-semibold">
                    {currentUser.name || currentUser.email}
                  </div>
                  <NavLink
                    to="/orders"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl font-semibold text-gray-200 hover:bg-gray-900 transition-colors"
                  >
                    My Orders
                  </NavLink>
                      <NavLink
                        to="/profile"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-3 rounded-xl font-semibold text-gray-200 hover:bg-gray-900 transition-colors"
                      >
                        My Profile
                      </NavLink>
                  <NavLink
                    to="/orders?tab=quotes"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl font-semibold text-gray-200 hover:bg-gray-900 transition-colors"
                  >
                    My Quotes
                  </NavLink>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 rounded-xl font-semibold text-red-300 hover:bg-gray-900 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl font-semibold text-gray-200 hover:bg-gray-900 transition-colors"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl font-semibold bg-gray-900 text-white hover:bg-gray-800 transition-colors text-center"
                  >
                    Sign Up
                  </NavLink>
                </>
              )}
            </PageWrapper>
          </div>
        )}
      </nav>
      
      {/* Mobile Search Overlay */}
      {searchOpen && (
        <div className="lg:hidden fixed top-[72px] left-0 w-full bg-black/95 backdrop-blur-sm p-4 border-b border-gray-800 z-40 animate-fadeIn">
            <form onSubmit={handleSearchSubmit} className="relative w-full max-w-lg mx-auto">
                <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products, categories..."
                    className="w-full bg-gray-900 border border-gray-700 rounded-full py-3.5 pl-5 pr-12 text-white text-base focus:outline-none focus:border-yellow-500 placeholder-gray-500"
                />
                <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 p-2">
                    <Search size={20} />
                </button>
            </form>
            {/* Overlay background to close */}
            <div className="fixed inset-0 -z-10" onClick={() => setSearchOpen(false)}></div>
        </div>
      )}

      <div className="bg-gray-50 border-b border-gray-200/80 shadow-sm relative z-40">
        <PageWrapper className="py-2 sm:py-2.5 text-left text-xs sm:text-sm">
          <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2 text-gray-700">
            <span className="inline-flex items-center gap-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-[11px] font-semibold text-white flex-none">
                ₹
              </span>
              <span>
                <span className="font-semibold">Low Price Guarantee</span>
                <span className="hidden sm:inline text-gray-500"> · Best value on industrial components</span>
              </span>
            </span>
          </div>
        </PageWrapper>
      </div>
    </>
  );
};

export default Navbar;
