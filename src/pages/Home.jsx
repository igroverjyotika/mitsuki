// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FeaturedProducts from "../components/FeaturedProducts";
import FeaturedParts from "../components/FeaturedParts";
import PageWrapper from "../components/PageWrapper";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import certificateImage from "../assets/certificate.png";

import heroBg from "../assets/flow-bg.svg";
import mixLaptop from "../assets/grey-laptop.png";
import screen1 from "../assets/linear-motion/MTK.jpg";
import screen2 from "../assets/linear-motion/HGH.jpg";
import screen3 from "../assets/linear-motion/SK.jpg";

export default function Home() {
  const { currentUser } = useAuth();
  const [currentProductPage, setCurrentProductPage] = useState(0);
   const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const heroScreens = [screen1, screen2, screen3];

  const stats = [
    { number: "10,000+", label: "Products" },
    { number: "500+", label: "Brands" },
    { number: "5,000+", label: "Happy Clients" },
    { number: "24/7", label: "Support" },
  ];

  const productRanges = [
    [
      { name: "Bearings", count: "500+" },
      { name: "Bushings", count: "200+" },
      { name: "Caster Wheels", count: "150+" },
      { name: "Conveyors", count: "250+" },
      { name: "Pulleys", count: "180+" },
      { name: "Automation", count: "400+" },
    ],
    [
      { name: "Linear Motion", count: "300+" },
      { name: "Pneumatics", count: "220+" },
      { name: "Ball Screws", count: "160+" },
      { name: "Gearboxes", count: "190+" },
      { name: "Fasteners", count: "350+" },
      { name: "Tool Holders", count: "280+" },
    ],
    [
      { name: "Sensors", count: "240+" },
      { name: "Cables", count: "320+" },
      { name: "Controllers", count: "170+" },
      { name: "Switches", count: "290+" },
      { name: "Power Supply", count: "150+" },
      { name: "HMI Panels", count: "130+" },
    ],
  ];

  // Auto-scroll for product ranges
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProductPage((prev) => (prev + 1) % productRanges.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate images shown on the laptop "screen"
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentScreenIndex((prev) => (prev + 1) % heroScreens.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [heroScreens.length]);

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

  return (
    <div className="bg-white">
      {/* Hero Section (new dark-header theme) */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right top",
          backgroundSize: "cover",
        }}
      >
        <PageWrapper className="min-h-[calc(100vh-120px)] sm:min-h-[calc(100vh-140px)] pt-8 sm:pt-10 pb-10 flex items-start">
          <div className="relative z-10 w-full flex flex-col lg:flex-row justify-between gap-10">
            {/* Hero copy */}
            <div className="max-w-xl pt-4 lg:pt-10 animate-fadeIn text-center lg:text-left mx-auto lg:mx-0">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-gray-900">
                The Innovation Behind
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-amber-300 to-white">
                  Our Product
                </span>
              </h1>

              <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-3">
                At <span className="font-semibold">Mitsuki India</span>, we don&apos;t just
                provide components; we engineer complete solutions. Mitsuki India has
                become synonymous with excellence in factory automation and motion
                control technology.
              </p>

              <p className="text-gray-900 font-semibold text-base sm:text-lg mb-6">
                
"On Time Delivery" is more than a tagline for us – it&apos;s a commitment.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <Link
                  to="/shop"
                  className="inline-flex w-full sm:w-auto items-center justify-center px-7 py-2.5 rounded-full bg-yellow-400 text-black text-sm sm:text-base font-semibold shadow-md hover:bg-yellow-300 hover:shadow-lg transition-all"
                >
                  Shop Now
                </Link>
                <Link
                  to="/cart"
                  className="inline-flex w-full sm:w-auto items-center justify-center px-7 py-2.5 rounded-full border border-gray-900 text-gray-900 text-sm sm:text-base font-semibold bg-white/90 hover:bg-gray-900 hover:text-white transition-all"
                >
                  Get Quote
                </Link>
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative w-full lg:w-[680px] flex items-center justify-center animate-heroZoomIn mt-4 lg:mt-0">
              <div className="absolute -inset-y-10 -right-10 lg:-right-20 w-[420px] lg:w-[520px] bg-gradient-to-tr from-yellow-300/25 via-blue-400/15 to-purple-500/20 blur-3xl rounded-full pointer-events-none" />
              {/* Laptop base image, no outer shadow so it blends with white */}
              <img
                src={mixLaptop}
                alt="Industrial components on Mitsuki platform"
                className="relative w-full max-w-[720px] h-auto object-contain"
              />

              {/* Rotating "screen" content overlay - clean white background, no visible border */}
              <div className="absolute top-[14%] sm:top-[16%] left-1/2 -translate-x-1/2 w-[78%] sm:w-[66%] lg:w-[63%] aspect-[16/10] rounded-2xl overflow-hidden bg-white">
                <img
                  src={heroScreens[currentScreenIndex]}
                  alt="Highlighted Mitsuki product"
                  className="w-full h-full object-contain bg-white transition-opacity duration-700"
                />
              </div>
            </div>
          </div>
        </PageWrapper>
      </section>

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Featured part names */}
      <FeaturedParts
        title="Featured Products"
        subtitle="Main product groups"
        maxItems={24}
      />

      {/* Stats Section */}
      <section className="py-12 sm:py-16">
        <PageWrapper>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">
                  {stat.number}
                </div>
                <div className="text-sm sm:text-base text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </PageWrapper>
      </section>

      {/* Partnerships + Certificate */}
      <section className="py-12 sm:py-14 bg-gray-50 border-y border-gray-100">
        <PageWrapper>
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Trusted Partnerships
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Authorized brands, genuine products, and expert support.
            </p>
          </div>

          {/* Partnership Cards */}
          <div className="mt-8 sm:mt-10 grid md:grid-cols-3 gap-4 md:gap-6">
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
                className="group rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-gray-300"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 bg-gradient-to-r ${partner.color} rounded-xl flex items-center justify-center text-xl flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-300`}
                  >
                    {partner.icon}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900">
                      {partner.name}
                    </h3>
                    <div className="mt-0.5 text-xs font-semibold text-blue-600">
                      ✓ Authorized Partner
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {partner.description}
                </p>
              </div>
            ))}
          </div>

          {/* Certificate */}
          <div className="mt-8 rounded-3xl bg-white shadow-sm border border-gray-200 overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              <button
                type="button"
                className="group relative aspect-[4/3] md:aspect-auto md:min-h-[320px] bg-gradient-to-br from-gray-100 to-gray-200 cursor-zoom-in"
                onClick={() => setShowCertificateModal(true)}
                aria-label="View partnership certificate"
              >
                <img
                  src={certificateImage}
                  alt="Official Partnership Certificate"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/85 backdrop-blur px-3 py-1 text-xs font-semibold text-gray-900 shadow-sm border border-white/60">
                  Official Certificate
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px]">
                  <div className="bg-white px-4 py-2 rounded-full shadow-md text-sm font-semibold text-gray-900">
                    Click to view full size
                  </div>
                </div>
              </button>

              <div className="p-6 sm:p-8 md:p-10">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                  Where Innovation Meets Performance
                </h3>
                <p className="mt-3 text-sm sm:text-base text-gray-600">
                  We work closely with global leaders to ensure reliability,
                  authenticity, and strong technical support.
                </p>

                <div className="mt-5 sm:mt-6 space-y-3 text-gray-700">
                  {[
                    "Authorized distributor of premium international brands",
                    "100% genuine products with manufacturer warranty",
                    "Technical support backed by brand expertise",
                    "Exclusive access to latest products and technologies",
                  ].map((text) => (
                    <p key={text} className="flex items-start gap-3">
                      <span className="text-green-600 text-lg leading-none mt-0.5">
                        ✓
                      </span>
                      <span className="text-sm sm:text-base">{text}</span>
                    </p>
                  ))}
                </div>

                <div className="mt-6 sm:mt-8">
                  <button
                    type="button"
                    onClick={() => setShowCertificateModal(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                  >
                    View Certificate <span aria-hidden>→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </PageWrapper>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-12 sm:py-16">
        <PageWrapper>
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm">
                <button
                  onClick={() =>
                    setOpenFaqIndex(openFaqIndex === index ? null : index)
                  }
                  className="w-full text-left p-4 sm:p-6 focus:outline-none"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                      {faq.question}
                    </h3>
                    <span className="text-gray-400">
                      {openFaqIndex === index ? "−" : "+"}
                    </span>
                  </div>
                </button>
                {openFaqIndex === index && (
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                    <p className="text-sm sm:text-base text-gray-600">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </PageWrapper>
      </section>

      {/* Bulk Orders Banner - Compact Left-Right Layout */}
      <section className="py-10 sm:py-12 bg-gradient-to-r from-rose-700 via-red-800 to-amber-700 dark:from-rose-900 dark:via-red-950 dark:to-amber-900 relative overflow-hidden">
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
            <div className="flex-1 lg:w-[70%] text-white space-y-4 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-block bg-white/20 backdrop-blur-sm px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm md:text-base font-semibold animate-pulse">
                🏢 For Bulk Orders
              </div>

              {/* Main heading */}
              <h2 className="text-xl sm:text-2xl md:text-4xl font-bold animate-fade-blink leading-tight">
                50,000+ Companies Trust Mitsuki India
              </h2>

              <p className="text-sm sm:text-base md:text-lg text-red-50 leading-relaxed">
                To supply their bearing needs. Join us and make your operations
                run smoother with our bearings.
              </p>
            </div>

            {/* Right - Compact Contact Box (30%) */}
            <div className="w-full lg:w-[30%] bg-white dark:bg-gray-900 rounded-2xl p-5 sm:p-6 shadow-2xl">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4">
                What you will get:
              </h3>

              {/* Benefits List */}
              <div className="space-y-2.5 mb-4">
                {[
                  { icon: "✓", text: "Exceptional quality" },
                  { icon: "⚡", text: "Fast & reliable support" },
                  { icon: "📋", text: "Complete bearing catalog" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm">
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
                onClick={() =>
                  window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
                }
                className="block w-full px-4 py-3 bg-gradient-to-r from-rose-700 via-red-800 to-amber-700 hover:from-rose-800 hover:via-red-900 hover:to-amber-800 text-white text-center rounded-lg font-bold transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </PageWrapper>
      </section>

      {/* Footer - Same as About page */}
      <Footer />

      {/* Footer-like section
      <section className="bg-gray-900 text-white py-12">
        <PageWrapper>
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-gray-300 mb-8">
              Contact us today for all your industrial component needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Contact Us
              </Link>
              <a
                href="tel:+911234567890"
                className="border border-gray-600 text-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Call +91 123 456 7890
              </a>
            </div>
          </div>
        </PageWrapper>
      </section> */}

      {showCertificateModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Certificate preview"
          onClick={() => setShowCertificateModal(false)}
        >
          <div className="absolute inset-0 bg-black/60" />

          <div
            className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="text-sm font-semibold text-gray-900">
                Official Partnership Certificate
              </div>
              <button
                type="button"
                className="rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                onClick={() => setShowCertificateModal(false)}
              >
                Close
              </button>
            </div>

            <div className="max-h-[75vh] overflow-auto bg-gray-50">
              <img
                src={certificateImage}
                alt="Official Partnership Certificate"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
