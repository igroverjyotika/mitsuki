import React, { useState, useEffect } from "react";
import PageWrapper from "../components/PageWrapper";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

// Import linear motion images
import product1 from "../assets/linear-motion/HGW.avif";
import product2 from "../assets/linear-motion/LMHUU.avif";
import product3 from "../assets/linear-motion/LMKLUU.webp";
import product4 from "../assets/linear-motion/LMUU.jpeg";

export default function About() {
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "About Mitsuki";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-950 overflow-hidden">
      {/* Hero Section - Simple Text Focus */}
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 py-24 md:py-32 overflow-hidden">
        {/* Clean, subtle background accents */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/40 dark:bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-200/40 dark:bg-blue-900/30 rounded-full blur-3xl" />
        </div>

        <PageWrapper>
          <div className="relative max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-5 py-2 rounded-full text-sm font-semibold">
              🏢 About Mitsuki
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white leading-tight min-h-[80px] md:min-h-[100px]">
              {displayedText}
              <span className="inline-block w-1 h-16 md:h-20 bg-blue-600 dark:bg-blue-400 ml-2 animate-pulse"></span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
              We don't just provide components; we engineer solutions for your
              industrial needs.
            </p>
          </div>
        </PageWrapper>
      </section>

      {/* Our Story - Compact & Creative */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <PageWrapper>
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-12">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-blue-600"></div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Our Story
              </h2>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-blue-600"></div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Left - Animated Text Content */}
              <div className="space-y-6">
                <div className="relative">
                  <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                  <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed pl-6">
                    At{" "}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      Mitsuki
                    </span>
                    , we specialize in providing a wide array of bearings for
                    various applications. Our products meet the highest industry
                    standards.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-l-4 border-blue-500 p-6 rounded-lg transform hover:scale-105 transition-transform duration-300">
                  <p className="text-lg font-semibold text-gray-900 dark:text-white italic">
                    "Start with the customer – find what they need and provide
                    it."
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
                  <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed pl-6">
                    We build great products to solve your business problems,
                    designed for small to medium companies willing to optimize
                    performance.
                  </p>
                </div>
              </div>

              {/* Right - Animated Product Showcase */}
              <div className="relative h-80 lg:h-96">
                {/* Floating products with different animations */}
                <div className="absolute top-10 left-10 w-24 h-24 animate-float">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-xl transform hover:rotate-12 transition-transform">
                    <img
                      src={product1}
                      alt=""
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                <div
                  className="absolute top-5 right-5 w-32 h-32 animate-float"
                  style={{ animationDelay: "0.5s" }}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl transform hover:-rotate-12 transition-transform">
                    <img
                      src={product2}
                      alt=""
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                <div
                  className="absolute bottom-10 left-1/4 w-28 h-28 animate-float"
                  style={{ animationDelay: "1s" }}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-xl transform hover:rotate-6 transition-transform">
                    <img
                      src={product3}
                      alt=""
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                <div
                  className="absolute bottom-5 right-10 w-20 h-20 animate-float"
                  style={{ animationDelay: "1.5s" }}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-xl transform hover:-rotate-6 transition-transform">
                    <img
                      src={product4}
                      alt=""
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Connecting lines - subtle decoration */}
                <svg
                  className="absolute inset-0 w-full h-full opacity-10 dark:opacity-20 pointer-events-none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Line 1: Top left to top right */}
                  <line
                    x1="15%"
                    y1="25%"
                    x2="80%"
                    y2="15%"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="0"
                      to="10"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </line>

                  {/* Line 2: Top right to bottom right */}
                  <line
                    x1="82%"
                    y1="18%"
                    x2="85%"
                    y2="75%"
                    stroke="#A855F7"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="10"
                      to="0"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </line>

                  {/* Line 3: Bottom right to bottom left */}
                  <line
                    x1="83%"
                    y1="78%"
                    x2="35%"
                    y2="85%"
                    stroke="#6366F1"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="0"
                      to="10"
                      dur="2.5s"
                      repeatCount="indefinite"
                    />
                  </line>

                  {/* Line 4: Bottom left back to top left (closing the loop) */}
                  <line
                    x1="33%"
                    y1="83%"
                    x2="17%"
                    y2="28%"
                    stroke="#EC4899"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="10"
                      to="0"
                      dur="2.8s"
                      repeatCount="indefinite"
                    />
                  </line>
                </svg>
              </div>
            </div>

            {/* Stats Row - Compact */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  15+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Years Experience
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                  5000+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Happy Clients
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                  10000+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Products
                </div>
              </div>
            </div>
          </div>
        </PageWrapper>
      </section>

      {/* Founder Section - Creative Split Layout */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>

        <PageWrapper>
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-600 dark:text-blue-400 px-5 py-2 rounded-full text-sm font-semibold mb-4">
                👨‍💼 Leadership
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
                Meet Our Founders
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left - Founder Visual Cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-6">
                {/* Founder 1 */}
                <div className="relative">
                  <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border-2 border-gray-100 dark:border-gray-700 transform hover:scale-105 transition-all duration-500">
                    {/* Profile Section */}
                    <div className="text-center mb-6">
                      <div className="relative inline-block">
                        <div className="w-36 h-36 md:w-40 md:h-40 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-7xl shadow-2xl animate-float">
                          👨‍💼
                        </div>
                        {/* Floating badges */}
                        <div className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 rounded-full px-3 py-1 text-xs font-bold shadow-lg animate-bounce">
                          15+ Years
                        </div>
                        <div className="absolute -bottom-2 -left-2 bg-green-400 text-gray-900 rounded-full px-3 py-1 text-xs font-bold shadow-lg">
                          ✓ Verified
                        </div>
                      </div>

                      <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-6 mb-2">
                        Sudhir Yadav
                      </h3>
                      <p className="text-blue-600 dark:text-blue-400 font-semibold text-xl mb-4">
                        Founder & CEO
                      </p>

                      {/* Quick Stats */}
                      <div className="flex justify-center gap-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            5000+
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            Clients
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            15+
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            Years
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            99.5%
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            On-Time
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expertise Tags */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      {[
                        "Sales Expert",
                        "Supply Chain",
                        "Factory Automation",
                        "Leadership",
                      ].map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold border border-blue-200 dark:border-blue-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Founder 2 */}
                <div className="relative">
                  <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border-2 border-gray-100 dark:border-gray-700 transform hover:scale-105 transition-all duration-500">
                    <div className="text-center mb-6">
                      <div className="relative inline-block">
                        <div className="w-36 h-36 md:w-40 md:h-40 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-7xl shadow-2xl animate-float">
                          👨‍💼
                        </div>
                        <div className="absolute -top-2 -right-2 bg-white text-gray-900 rounded-full px-3 py-1 text-xs font-bold shadow-lg border border-gray-200">
                          Co-Founder
                        </div>
                        <div className="absolute -bottom-2 -left-2 bg-green-400 text-gray-900 rounded-full px-3 py-1 text-xs font-bold shadow-lg">
                          ✓ Verified
                        </div>
                      </div>

                      <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-6 mb-2">
                        Vikas Dua
                      </h3>
                      <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-xl mb-4">
                        Co-Founder
                      </p>

                      <div className="flex justify-center gap-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                            Ops
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            Operations
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                            CS
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            Support
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            QC
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            Quality
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center">
                      {[
                        "Operations",
                        "Customer Success",
                        "Logistics",
                        "Execution",
                      ].map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-semibold border border-emerald-200 dark:border-emerald-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Story & Quote */}
              <div className="space-y-6">
                <div className="relative">
                  <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-blue-600 via-purple-600 to-pink-600 rounded-full"></div>
                  <div className="pl-6 space-y-4">
                    <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                      Founded by industry veteran{" "}
                      <span className="font-semibold text-gray-900 dark:text-white">
                        Mr. Sudhir Yadav
                      </span>
                      , and co-founded by{" "}
                      <span className="font-semibold text-gray-900 dark:text-white">
                        Mr. Vikas Dua
                      </span>
                      , with{" "}
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        15 years of extensive experience
                      </span>{" "}
                      in sales and Supply Chain, Mitsuki has become synonymous
                      with excellence in Factory Automation and Motion Control
                      Technology.
                    </p>

                    <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                      We recognize the pivotal role time plays in your
                      operations, and we strive to make every moment count. Our
                      promise is not just to meet deadlines but to exceed
                      expectations, ensuring that your operations run
                      seamlessly.
                    </p>
                  </div>
                </div>

                {/* Featured Quote */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <div className="relative bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 border-l-4 border-yellow-500 p-6 rounded-2xl">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl text-yellow-600 dark:text-yellow-400">
                        ❝
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-xl mb-2">
                          "On Time delivery" is more than a tagline for us -
                          it's a commitment.
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          - Sudhir Yadav, Founder
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mission Statement */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="text-2xl">🎯</span>
                    Our Mission
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    To provide innovative industrial solutions that empower
                    businesses to achieve operational excellence through
                    reliable components, exceptional service, and unwavering
                    commitment to quality.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </PageWrapper>
      </section>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
