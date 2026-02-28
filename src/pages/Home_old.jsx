// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BannerCarousel from "../components/BannerCarousel";
import FeaturedProducts from "../components/FeaturedProducts";
import PageWrapper from "../components/PageWrapper";
import certificateImage from "../assets/certificate.png";
import { useAuth } from "../context/AuthContext";

// Import product images
import product1 from "../assets/products/1.png";
import product2 from "../assets/products/2.png";
import product3 from "../assets/products/3.png";
import product4 from "../assets/products/4.png";

export default function Home() {
  const { currentUser } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentProductPage, setCurrentProductPage] = useState(0);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [displayedHeading, setDisplayedHeading] = useState("");
  const [isHeadingVisible, setIsHeadingVisible] = useState(false);
  const fullHeading = "The Innovation Behind Our Products";

  // Product showcase images (rotating display) - NOW WITH REAL IMAGES
  const showcaseProducts = [
    {
      name: "Industrial Bearings",
      image: product1,
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Precision Components",
      image: product2,
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "Motion Control Parts",
      image: product3,
      color: "from-orange-500 to-red-500",
    },
    {
      name: "Automation Components",
      image: product4,
      color: "from-green-500 to-emerald-500",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % showcaseProducts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const categories = [
    {
      name: "Bearings",
      icon: "⚙️",
      count: "500+ Products",
      color: "bg-blue-500",
    },
    {
      name: "Linear Motion",
      icon: "➡️",
      count: "300+ Products",
      color: "bg-purple-500",
    },
    {
      name: "Bushings",
      icon: "🔩",
      count: "200+ Products",
      color: "bg-green-500",
    },
    {
      name: "Caster Wheels",
      icon: "🛞",
      count: "150+ Products",
      color: "bg-orange-500",
    },
    {
      name: "Conveyor Parts",
      icon: "📦",
      count: "250+ Products",
      color: "bg-red-500",
    },
    {
      name: "Pulleys & Belts",
      icon: "⚡",
      count: "180+ Products",
      color: "bg-yellow-500",
    },
    {
      name: "Pneumatics",
      icon: "💨",
      count: "220+ Products",
      color: "bg-cyan-500",
    },
    {
      name: "Automation",
      icon: "🤖",
      count: "400+ Products",
      color: "bg-indigo-500",
    },
  ];

  const features = [
    {
      icon: "🚚",
      title: "On Time Delivery",
      desc: "It's Our Commitment, Not Just a Tagline",
      highlight: true,
    },
    { icon: "✓", title: "Genuine Components", desc: "100% Authentic Products" },
    { icon: "🏭", title: "Factory Automation", desc: "Complete Solutions" },
    { icon: "💬", title: "Expert Support", desc: "Technical Assistance" },
  ];

  const stats = [
    { number: "10,000+", label: "Products" },
    { number: "500+", label: "Brands" },
    { number: "5,000+", label: "Happy Clients" },
    { number: "24/7", label: "Support" },
  ];

  const productRanges = [
    [
      { icon: product2, name: "Bearings", count: "500+" },
      { icon: product2, name: "Bushings", count: "200+" },
      { icon: product2, name: "Caster Wheels", count: "150+" },
      { icon: product2, name: "Conveyors", count: "250+" },
      { icon: product2, name: "Pulleys", count: "180+" },
      { icon: product2, name: "Automation", count: "400+" },
    ],
    [
      { icon: product2, name: "Linear Motion", count: "300+" },
      { icon: product2, name: "Pneumatics", count: "220+" },
      { icon: product2, name: "Ball Screws", count: "160+" },
      { icon: product2, name: "Gearboxes", count: "190+" },
      { icon: product2, name: "Fasteners", count: "350+" },
      { icon: product2, name: "Tool Holders", count: "280+" },
    ],
    [
      { icon: product2, name: "Sensors", count: "240+" },
      { icon: product2, name: "Cables", count: "320+" },
      { icon: product2, name: "Controllers", count: "170+" },
      { icon: product2, name: "Switches", count: "290+" },
      { icon: product2, name: "Power Supply", count: "150+" },
      { icon: product2, name: "HMI Panels", count: "130+" },
    ],
  ];

  // Auto-scroll for product ranges
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProductPage((prev) => (prev + 1) % productRanges.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const nextProductPage = () => {
    setCurrentProductPage((prev) => (prev + 1) % productRanges.length);
  };

  const prevProductPage = () => {
    setCurrentProductPage(
      (prev) => (prev - 1 + productRanges.length) % productRanges.length,
    );
  };

  const faqs = [
    {
      question: "What types of industrial components do you supply?",
      answer:
        "We supply a comprehensive range including bearings, linear motion systems, bushings, caster wheels, conveyor parts, pulleys & belts, pneumatics, sensors, controllers, and complete automation solutions. Our inventory includes over 10,000+ products from 500+ trusted brands.",
    },
    {
      question: "Do you guarantee on-time delivery?",
      answer:
        "Yes! 'On Time Delivery' is our commitment, not just a tagline. We offer same-day dispatch for in-stock items and maintain a 99.5% on-time delivery rate. We understand that production delays are costly, which is why we prioritize prompt delivery.",
    },
    {
      question: "Are your products genuine and authentic?",
      answer:
        "Absolutely. We are authorized distributors of premium international brands including YIHEDA, HB FULLER, and SICK. All our products come with 100% authenticity guarantee and manufacturer warranties. We never compromise on quality.",
    },
    {
      question: "What industries do you serve?",
      answer:
        "We serve a diverse range of industries including manufacturing, automotive, packaging, food processing, pharmaceuticals, textiles, and general automation sectors. We're trusted by 5,000+ industries across India.",
    },
    {
      question: "Do you provide technical support and consultation?",
      answer:
        "Yes, our expert team provides comprehensive technical support backed by brand expertise. We offer product selection assistance, installation guidance, troubleshooting, and ongoing support to ensure optimal performance of your equipment.",
    },
    {
      question: "What is your minimum order quantity?",
      answer:
        "We cater to both bulk and small orders. There's no strict minimum order quantity - whether you need a single component or large-scale industrial supplies, we're here to help. Contact us for specific requirements.",
    },
    {
      question: "Do you offer customized automation solutions?",
      answer:
        "Yes! Beyond selling components, we engineer complete automation solutions tailored to your specific needs. Our team can design, supply, and support end-to-end factory automation and motion control systems.",
    },
    {
      question: "How can I get a quotation?",
      answer:
        "Getting a quote is easy! Click the 'Request Quote' button, fill in your requirements, or call us directly at +91 123 456 7890. Our team will respond within 24 hours with competitive pricing and product availability.",
    },
  ];

  // Typing animation for hero heading - Fixed
  useEffect(() => {
    // First fade in the container
    setTimeout(() => setIsHeadingVisible(true), 500);

    // Then start typing after fade in
    setTimeout(() => {
      let index = 0;
      const timer = setInterval(() => {
        if (index <= fullHeading.length) {
          setDisplayedHeading(fullHeading.slice(0, index));
          index++;
        } else {
          clearInterval(timer);
        }
      }, 60); // Smooth typing speed

      return () => clearInterval(timer);
    }, 800);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-950">
      {/* Hero Section with Product Showcase */}
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 text-gray-900 dark:text-white overflow-hidden min-h-[calc(100vh-120px)] flex items-center">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-400/20 dark:bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-400/20 dark:bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Floating Badges */}
        <div className="absolute top-8 right-8 bg-yellow-400 text-gray-900 px-6 py-3 rounded-full font-bold text-sm shadow-2xl animate-bounce hidden lg:block">
          🔥 10,000+ Products In Stock
        </div>
        <div className="absolute bottom-8 left-8 bg-green-400 text-gray-900 px-6 py-3 rounded-full font-bold text-sm shadow-2xl animate-pulse hidden lg:block">
          ✓ Same Day Dispatch Available
        </div>

        <PageWrapper>
          <div className="relative py-8 md:py-12">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-6">
                <div className="space-y-3">
                  {/* Trust Badge - Fade in */}
                  <div
                    className={`inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-500/20 backdrop-blur-sm border border-blue-300 dark:border-blue-400/30 rounded-full px-4 py-2 text-sm font-medium transition-all duration-700 ${isHeadingVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Trusted by 5,000+ Industries Across India
                  </div>

                  {/* Personalized Welcome Message */}
                  {currentUser && (
                    <div
                      className={`bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 backdrop-blur-sm border border-green-300 dark:border-green-600/30 rounded-xl px-6 py-4 transition-all duration-700 delay-300 ${isHeadingVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          👋
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            Welcome back,{" "}
                            {currentUser.name ||
                              currentUser.displayName ||
                              "Valued Customer"}
                            !
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Ready to explore our latest industrial solutions?
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Heading with typing effect */}
                  <div
                    className={`transition-all duration-700 ${isHeadingVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                  >
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 dark:text-white min-h-[120px] md:min-h-[140px]">
                      {displayedHeading}
                      {displayedHeading.length < fullHeading.length && (
                        <span className="inline-block w-1 h-12 md:h-16 bg-blue-600 dark:bg-blue-400 ml-2 animate-pulse"></span>
                      )}
                    </h1>
                  </div>

                  <div
                    className={`h-1 w-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-1000 delay-500 ${displayedHeading.length >= fullHeading.length ? "w-20" : "w-0"}`}
                  ></div>
                </div>

                <div className="space-y-4 text-base md:text-lg text-gray-700 dark:text-blue-100">
                  <p className="text-lg md:text-xl font-medium text-gray-900 dark:text-white">
                    <span className="text-blue-600 dark:text-blue-300 font-bold">
                      Mitsuki India
                    </span>{" "}
                    - We Don't Just Provide Components; We Engineer Solutions.
                  </p>
                  <p className="text-sm md:text-base text-gray-600 dark:text-blue-100">
                    Excellence In{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Factory Automation
                    </span>{" "}
                    and{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Motion Control Technology
                    </span>
                    .
                  </p>

                  {/* Highlighted Promise */}
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 border-l-4 border-yellow-600 p-4 rounded-lg shadow-xl">
                    <p className="text-base md:text-lg font-bold flex items-center gap-2">
                      <span className="text-2xl">🚚</span>
                      "On Time Delivery" - It's Our Commitment!
                    </p>
                  </div>
                </div>

                {/* CTAs with Urgency */}
                <div className="space-y-4 pt-2">
                  <div className="flex flex-wrap gap-3">
                    <Link
                      to="/shop"
                      className="group relative px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 rounded-lg font-bold hover:from-yellow-500 hover:to-orange-500 transform hover:scale-105 transition-all duration-300 shadow-2xl overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        🛒 Shop Now - Save Up to 30%
                        <span className="group-hover:translate-x-1 transition-transform">
                          →
                        </span>
                      </span>
                      <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                    </Link>
                    <Link
                      to="/contact"
                      className="px-6 md:px-8 py-3 md:py-4 bg-blue-600 dark:bg-white/10 text-white dark:text-white backdrop-blur-sm border-2 border-blue-600 dark:border-white rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-white dark:hover:text-blue-900 transition-all duration-300"
                    >
                      Get Quote
                    </Link>
                  </div>

                  {/* Quick Contact */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700 dark:text-white">
                    <a
                      href="tel:+911234567890"
                      className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
                    >
                      <div className="bg-blue-100 dark:bg-white/10 p-2 rounded-full">
                        📞
                      </div>
                      <span className="font-medium">
                        Call: +91 123 456 7890
                      </span>
                    </a>
                    <span className="text-blue-600 dark:text-blue-300">|</span>
                    <span className="text-gray-600 dark:text-blue-200">
                      Monday - Saturday: 9 AM - 6 PM
                    </span>
                  </div>
                </div>
              </div>

              {/* Right - Animated Product Showcase */}
              <div className="relative hidden md:block">
                <div className="relative w-full h-[400px] lg:h-[500px] flex items-center justify-center">
                  {/* Rotating background circles */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-full bg-gradient-to-r from-blue-300/30 to-purple-300/30 dark:from-blue-500/20 dark:to-purple-500/20 animate-spin-slow"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 lg:w-64 lg:h-64 rounded-full bg-gradient-to-r from-purple-300/30 to-pink-300/30 dark:from-purple-500/20 dark:to-pink-500/20 animate-spin-slow-reverse"></div>
                  </div>

                  {/* Main product display - NOW SHOWING REAL IMAGES */}
                  <div className="relative z-10 bg-white/90 dark:bg-white/10 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border-2 border-blue-200 dark:border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-500">
                    <div className="w-[220px] h-[220px] lg:w-[300px] lg:h-[300px] mb-4 rounded-2xl overflow-hidden shadow-xl bg-white dark:bg-gray-800">
                      <img
                        src={showcaseProducts[currentImageIndex].image}
                        alt={showcaseProducts[currentImageIndex].name}
                        className="w-full h-full object-contain p-4"
                      />
                    </div>
                    <h3 className="text-lg lg:text-2xl font-bold text-center text-gray-900 dark:text-white">
                      {showcaseProducts[currentImageIndex].name}
                    </h3>
                    <p className="text-xs lg:text-sm text-blue-600 dark:text-blue-200 text-center mt-2">
                      Premium Quality
                    </p>
                  </div>

                  {/* Floating product indicators */}
                  <div className="absolute bottom-4 lg:bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {showcaseProducts.map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          index === currentImageIndex
                            ? "w-8 bg-blue-600 dark:bg-white"
                            : "w-2 bg-blue-300 dark:bg-white/30"
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PageWrapper>
      </section>

      {/* Our Wide Range of Products - Quick Highlights */}
      <section className="bg-white dark:bg-gray-950 border-y border-gray-200 dark:border-gray-800">
        <PageWrapper>
          <div className="py-12 md:py-16">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                Our Wide Range of Products
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
                From precision bearings to complete automation systems - we've
                got everything your industry needs
              </p>
            </div>

            {/* Carousel Container */}
            <div className="relative">
              {/* Left Arrow */}
              <button
                onClick={prevProductPage}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-8 z-10 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-800 dark:text-white p-3 md:p-4 rounded-full shadow-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:scale-110 group"
                aria-label="Previous products"
              >
                <svg
                  className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Right Arrow */}
              <button
                onClick={nextProductPage}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-8 z-10 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-800 dark:text-white p-3 md:p-4 rounded-full shadow-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:scale-110 group"
                aria-label="Next products"
              >
                <svg
                  className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              {/* Products Grid with Animation */}
              <div className="overflow-hidden">
                <div
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 transition-all duration-500 ease-in-out"
                  style={{
                    opacity: 1,
                    transform: "translateX(0)",
                  }}
                >
                  {productRanges[currentProductPage].map((product, index) => (
                    <div
                      key={index}
                      className="group bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 animate-fadeIn"
                      style={{
                        animationDelay: `${index * 100}ms`,
                      }}
                    >
                      <div className="w-full aspect-square mx-auto mb-2 bg-white dark:bg-gray-700 rounded-lg p-3 shadow-md">
                        <img
                          src={product.icon}
                          alt={product.name}
                          className="w-full h-full object-contain transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300"
                        />
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                        {product.count} SKUs
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagination Dots */}
              <div className="flex justify-center gap-2 mt-8">
                {productRanges.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentProductPage(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      index === currentProductPage
                        ? "w-10 bg-blue-600 dark:bg-blue-400"
                        : "w-2.5 bg-gray-300 dark:bg-gray-600 hover:bg-blue-400 dark:hover:bg-blue-500"
                    }`}
                    aria-label={`Go to product page ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="text-center mt-10">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                View All Products
                <span className="text-lg">→</span>
              </Link>
            </div>
          </div>
        </PageWrapper>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <PageWrapper>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Products
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              Discover our top-selling products, trusted by industries across
              India
            </p>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {productRanges[0]
              .concat(productRanges[1])
              .slice(0, 8)
              .map((product, index) => (
                <div
                  key={index}
                  className="group bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-5 text-center border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="w-full aspect-square mx-auto mb-3 bg-white dark:bg-gray-700 rounded-lg p-4 shadow-md">
                    <img
                      src={product.icon}
                      alt={product.name}
                      className="w-full h-full object-contain transform group-hover:scale-110 transition-all duration-300"
                    />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-base md:text-lg mb-1.5">
                    {product.name}
                  </h3>
                  <p className="text-xs md:text-sm text-blue-600 dark:text-blue-400 font-semibold">
                    {product.count} SKUs
                  </p>
                </div>
              ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              View All Featured Products
              <span className="text-lg">→</span>
            </Link>
          </div>
        </PageWrapper>
      </section>

      {/* Official Partner Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 border-y border-gray-200 dark:border-gray-700">
        <PageWrapper>
          <div className="text-center mb-8">
            <div className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-semibold mb-3">
              🤝 Trusted Partnerships
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Official Partner
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400 mb-2">
              Mitsuki Is Official Partner With
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-6">
              <span className="text-blue-600 dark:text-blue-400">YIHEDA</span>
              <span className="text-gray-400">•</span>
              <span className="text-purple-600 dark:text-purple-400">
                HB FULLER
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-green-600 dark:text-green-400">SICK</span>
            </div>
          </div>

          {/* Partnership Cards - Compact Version */}
          <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-8">
            {[
              {
                name: "YIHEDA",
                description: "Leading manufacturer of linear motion systems",
                color: "from-blue-500 to-blue-600",
                icon: "🏭",
              },
              {
                name: "HB FULLER",
                description: "Global leader in adhesives & sealants",
                color: "from-purple-500 to-purple-600",
                icon: "🔬",
              },
              {
                name: "SICK",
                description: "Provider of sensors for industrial automation",
                color: "from-green-500 to-green-600",
                icon: "📡",
              },
            ].map((partner, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`w-10 h-10 bg-gradient-to-r ${partner.color} rounded-lg flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {partner.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {partner.name}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed mb-2">
                  {partner.description}
                </p>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                  ✓ Authorized Partner
                </span>
              </div>
            ))}
          </div>

          {/* Certificate Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-xl border-2 border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Left: Certificate Image */}
              <div className="flex-1 w-full">
                <div
                  className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-xl overflow-hidden shadow-lg border-2 border-gray-300 dark:border-gray-600 group relative cursor-pointer"
                  onClick={() => setShowCertificateModal(true)}
                >
                  <img
                    src={certificateImage}
                    alt="Official Partnership Certificate"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Zoom overlay on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        🔍 Click to view full size
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Text Content */}
              <div className="flex-1">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Where Innovation Meets Performance
                </h3>
                <div className="space-y-4 text-gray-600 dark:text-gray-400">
                  <p className="flex items-start gap-3">
                    <span className="text-green-500 text-xl mt-1">✓</span>
                    <span>
                      Authorized distributor of premium international brands
                    </span>
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="text-green-500 text-xl mt-1">✓</span>
                    <span>
                      100% genuine products with manufacturer warranty
                    </span>
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="text-green-500 text-xl mt-1">✓</span>
                    <span>Technical support backed by brand expertise</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="text-green-500 text-xl mt-1">✓</span>
                    <span>
                      Exclusive access to latest products and technologies
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </PageWrapper>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <PageWrapper>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: FAQ Content */}
            <div>
              <div className="mb-10">
                <div className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  ❓ Got Questions?
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Top Questions Answered
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Find answers to commonly asked questions about our industrial
                  components and services
                </p>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setOpenFaqIndex(openFaqIndex === index ? null : index)
                      }
                      className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                    >
                      <span className="font-semibold text-gray-900 dark:text-white text-sm md:text-base pr-4">
                        {faq.question}
                      </span>
                      <svg
                        className={`w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 transition-transform duration-300 ${
                          openFaqIndex === index ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    <div
                      className={`transition-all duration-300 ease-in-out ${
                        openFaqIndex === index
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      } overflow-hidden`}
                    >
                      <div className="px-5 pb-4 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact CTA */}
              <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-700">
                <p className="text-gray-700 dark:text-gray-300 font-semibold mb-4">
                  Still have questions? Our experts are here to help!
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/contact"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg text-sm"
                  >
                    Contact Us
                  </Link>
                  <a
                    href="tel:+911234567890"
                    className="px-5 py-2.5 bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-400 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-gray-800 transition-all duration-300 text-sm"
                  >
                    📞 Call Now
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Illustration/Image */}
            <div className="hidden lg:block sticky top-24">
              <div className="relative">
                {/* Main illustration container */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 shadow-2xl border-2 border-blue-200 dark:border-blue-700">
                  {/* Customer Support Illustration */}
                  <div className="text-center mb-6">
                    <div className="inline-block bg-white dark:bg-gray-900 rounded-full p-6 shadow-xl mb-4">
                      <div className="text-6xl">🎧</div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      24/7 Expert Support
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Our team is always ready to assist you
                    </p>
                  </div>

                  {/* Support Features */}
                  <div className="space-y-4">
                    {[
                      { icon: "💬", text: "Live Chat Support", color: "blue" },
                      {
                        icon: "📞",
                        text: "Phone Consultation",
                        color: "green",
                      },
                      { icon: "📧", text: "Email Support", color: "purple" },
                      {
                        icon: "📱",
                        text: "WhatsApp Assistance",
                        color: "teal",
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-4 bg-white dark:bg-gray-900 rounded-xl p-4 shadow-md transform hover:scale-105 transition-all duration-300"
                      >
                        <div className="text-3xl">{item.icon}</div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {item.text}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Available now
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-4 text-center shadow-md">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        99.5%
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Satisfaction Rate
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-4 text-center shadow-md">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        &lt;2min
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Response Time
                      </div>
                    </div>
                  </div>

                  {/* Trust Badge */}
                  <div className="mt-6 text-center">
                    <div className="inline-flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 px-4 py-2 rounded-full">
                      <span className="text-lg">⭐</span>
                      <span className="font-semibold text-sm">
                        5,000+ Happy Clients
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 bg-blue-500 text-white rounded-full p-4 shadow-xl animate-bounce">
                  <span className="text-2xl">💡</span>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-green-500 text-white rounded-full p-4 shadow-xl animate-pulse">
                  <span className="text-2xl">✓</span>
                </div>
              </div>
            </div>
          </div>
        </PageWrapper>
      </section>

      {/* Stats Bar - Moved Here */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 text-white border-y border-gray-700">
        <PageWrapper>
          <div className="py-12 md:py-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center transform hover:scale-110 transition-transform duration-300"
              >
                <div className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-gray-300 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </PageWrapper>
      </section>

      {/* Features Bar - Moved Here */}
      <section className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <PageWrapper>
          <div className="py-8 md:py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 md:gap-4 p-5 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  feature.highlight
                    ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 shadow-lg"
                    : "bg-white dark:bg-gray-800 shadow-md hover:shadow-2xl"
                }`}
              >
                <div className="text-4xl md:text-5xl">{feature.icon}</div>
                <div>
                  <div
                    className={`font-bold text-base md:text-lg ${feature.highlight ? "text-gray-900" : "text-gray-900 dark:text-white"}`}
                  >
                    {feature.title}
                  </div>
                  <div
                    className={`text-sm md:text-base ${feature.highlight ? "text-gray-800" : "text-gray-600 dark:text-gray-400"}`}
                  >
                    {feature.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </PageWrapper>
      </section>

      {/* Why Choose Us - Moved Here */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <PageWrapper>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Mitsuki India?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              Experience the difference with our commitment to quality, service,
              and innovation
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎯",
                title: "Precision Engineering",
                desc: "Every component meets the highest quality standards for optimal performance.",
              },
              {
                icon: "🏭",
                title: "Complete Solutions",
                desc: "From bearings to automation - we provide end-to-end industrial solutions.",
              },
              {
                icon: "🚀",
                title: "Fast Delivery",
                desc: "On-time delivery guaranteed - because your production can't wait.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105"
              >
                <div className="text-6xl mb-4 animate-bounce-slow">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </PageWrapper>
      </section>

      {/* Bulk Orders Banner - Compact Left-Right Layout */}
      <section className="py-10 bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-800 dark:to-orange-800 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <PageWrapper>
          <div className="relative flex flex-col lg:flex-row gap-6 items-center">
            {/* Left - Text Content (70%) */}
            <div className="flex-1 lg:w-[70%] text-white space-y-4">
              {/* Badge */}
              <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-semibold animate-pulse">
                🏢 For Bulk Orders
              </div>

              {/* Main heading */}
              <h2 className="text-2xl md:text-4xl font-bold animate-fade-blink leading-tight">
                50,000+ Companies Trust Mitsuki India
              </h2>

              <p className="text-base md:text-lg text-red-50 leading-relaxed">
                To supply their bearing needs. Join us and make your operations
                run smoother with our bearings.
              </p>
            </div>

            {/* Right - Compact Contact Box (30%) */}
            <div className="w-full lg:w-[30%] bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                What you will get:
              </h3>

              {/* Benefits List */}
              <div className="space-y-2.5 mb-4">
                {[
                  { icon: "✓", text: "Exceptional quality" },
                  { icon: "⚡", text: "Fast & reliable support" },
                  { icon: "📋", text: "Complete bearing catalog" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <span className="text-green-500 text-lg font-bold">
                      {item.icon}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Contact Button */}
              <Link
                to="/contact"
                className="block w-full px-4 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white text-center rounded-lg font-bold transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </PageWrapper>
      </section>

      {/* Footer - Same as About page */}
      <footer className="bg-gray-900 dark:bg-black text-gray-300">
        <PageWrapper>
          <div className="py-12">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {/* Useful Links */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4">
                  Useful Links
                </h3>
                <ul className="space-y-2">
                  {[
                    { name: "Home", path: "/" },
                    { name: "About Us", path: "/about" },
                    { name: "Products", path: "/shop" },
                    { name: "Privacy Policy", path: "/policies" },
                    { name: "Contact Us", path: "/contact" },
                  ].map((link) => (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        className="text-gray-400 hover:text-blue-400 transition-colors text-sm flex items-center gap-2 group"
                      >
                        <span className="text-blue-400 group-hover:translate-x-1 transition-transform">
                          →
                        </span>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* About Us */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4">About Us</h3>
                <div className="space-y-3 text-gray-400 text-sm leading-relaxed">
                  <p>
                    We are a team of passionate people whose goal is to improve
                    everyone's life through disruptive products. We build great
                    products to solve your business problems.
                  </p>
                  <p>
                    Our products are designed for small to medium size companies
                    willing to optimize their performance.
                  </p>
                </div>
              </div>

              {/* Connect With Us */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4">
                  Connect With Us
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Contact Us</p>
                    <a
                      href="mailto:sales@mitsuki.in"
                      className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2 text-sm"
                    >
                      <span>📧</span>
                      sales@mitsuki.in
                    </a>
                  </div>
                  <div>
                    <a
                      href="tel:+917988050803"
                      className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2 text-sm"
                    >
                      <span>📞</span>
                      +91 7988050803
                    </a>
                  </div>

                  {/* Social Media Icons */}
                  <div className="flex gap-3 pt-3">
                    <a
                      href="#"
                      className="w-9 h-9 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors text-sm"
                      aria-label="Facebook"
                    >
                      <span>f</span>
                    </a>
                    <a
                      href="#"
                      className="w-9 h-9 bg-gray-800 hover:bg-blue-400 rounded-full flex items-center justify-center transition-colors text-sm"
                      aria-label="Twitter"
                    >
                      <span>𝕏</span>
                    </a>
                    <a
                      href="#"
                      className="w-9 h-9 bg-gray-800 hover:bg-pink-600 rounded-full flex items-center justify-center transition-colors text-sm"
                      aria-label="Instagram"
                    >
                      <span>📷</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-6 border-t border-gray-800">
              <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-500">
                <div className="flex flex-wrap items-center gap-3">
                  <p>© {new Date().getFullYear()} Mitsuki India</p>
                  <Link
                    to="/policies"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Cookie Policy
                  </Link>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-gray-600">
                    Powered by <span className="text-blue-400">Odoo</span> - The
                    #1 Open Source eCommerce
                  </p>
                </div>
              </div>
            </div>
          </div>
        </PageWrapper>
      </footer>

      {/* Certificate Modal */}
      {showCertificateModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setShowCertificateModal(false)}
        >
          <div className="relative max-w-6xl w-full max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-4 right-4 z-10 bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 shadow-lg"
              aria-label="Close modal"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Certificate Image */}
            <div className="overflow-auto max-h-[90vh]">
              <img
                src={certificateImage}
                alt="Official Partnership Certificate - Full Size"
                className="w-full h-auto"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Download Button */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <a
                href={certificateImage}
                download="Mitsuki-Partnership-Certificate.png"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-lg transition-all duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download Certificate
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
