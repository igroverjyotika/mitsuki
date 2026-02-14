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

  const navigate = useNavigate();
  const location = useLocation();

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

  const handleSearchCTA = () => {
    const params =
      location.pathname === "/shop"
        ? new URLSearchParams(location.search)
        : new URLSearchParams();
    params.set("searchOpen", "1");
    navigate({
      pathname: "/shop",
      search: params.toString(),
    });
    setMenuOpen(false);
    setUserMenuOpen(false);
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
        <PageWrapper className="py-6">
          <div className="flex items-center gap-3">
            {/* Logo */}
           {/* Logo */}
<div className="flex items-center gap-4 flex-none">
  <NavLink
    to="/"
    className="flex items-center gap-2 select-none"
    aria-label="Mitsuki Home"
  >
    {/* Logo Icon */}
    <div className="w-9 h-9 border border-white/60 text-white font-bold text-xl flex items-center justify-center tracking-tight">
      M
    </div>

    {/* Logo Text */}
    <span className="font-semibold text-3xl md:text-4xl tracking-tight text-white">
      Mi<span className="text-yellow-400">TSU</span>Ki
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



            {/* Desktop Menu */}
            <ul className="hidden lg:flex gap-6 xl:gap-8 text-[17px] flex-1 justify-center flex-nowrap">
              {menuItems.map((item) => (
                <li key={item.name} className="whitespace-nowrap">
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `transition-opacity ${isActive
                        ? "opacity-100 font-semibold"
                        : "opacity-80 hover:opacity-100"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Right actions */}
            <div className="flex items-center gap-3 md:gap-4 flex-none justify-end">
              {/* Search icon to open overlay */}
              <button
                onClick={handleSearchCTA}
                className="bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition-colors flex items-center justify-center"
                aria-label="Shop search"
              >
                <Search size={18} />
              </button>

              {/* User */}
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="bg-gray-800 rounded-full px-3 py-2 flex items-center gap-2 hover:bg-gray-700 transition-colors"
                    aria-label="Account"
                  >
                    <User size={18} />
                    <span className="text-[17px] max-w-[160px] truncate">
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
                  className="bg-gray-800 rounded-full px-3 py-2 flex items-center gap-2 hover:bg-gray-700 transition-colors"
                >
                  <User size={18} />
                  <span className="text-[17px]">Sign in</span>
                </NavLink>
              )}

              {/* Cart */}
              <Link
                to="/cart"
                state={{ returnTo: location.pathname + location.search }}
                className="relative bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Language (UI only) */}
              <div className="hidden md:flex items-center gap-2 bg-gray-800 rounded-full px-3 py-2 hover:bg-gray-700 transition-colors cursor-default">
                <span className="text-[17px]">English (IN)</span>
                <ChevronDown className="w-4 h-4 opacity-80" />
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition-colors"
                aria-label="Menu"
              >
                {menuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

        </PageWrapper>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-gray-800 bg-black max-h-[calc(100vh-80px)] overflow-y-auto">
            <PageWrapper className="py-6 space-y-2">
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
      <div className="bg-gray-50 border-b border-gray-200/80 shadow-sm relative z-40">
        <PageWrapper className="py-2.5 text-left text-xs sm:text-sm">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-gray-700">
            <span className="inline-flex items-center gap-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-[11px] font-semibold text-white">
                ₹
              </span>
              <span>
                <span className="font-semibold">Low Price Guarantee</span>
                <span className="hidden sm:inline text-gray-500"> · Best value on industrial components</span>
              </span>
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-[11px] font-semibold text-white">
                <Truck className="w-3 h-3" />
              </span>
              <span>
                <span className="font-semibold">Standard Shipping</span>
                <span className="hidden sm:inline text-gray-500"> · Reliable delivery across India</span>
              </span>
            </span>
          </div>
        </PageWrapper>
      </div>
    </>
  );
};

export default Navbar;
