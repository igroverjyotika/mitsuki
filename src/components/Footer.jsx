import React from "react";
import { Link } from "react-router-dom";
import PageWrapper from "./PageWrapper";

export default function Footer() {
  const scrollToTop = () => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  return (
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
                  { name: "Home", path: "/", onClick: scrollToTop },
                  { name: "About Us", path: "/about", onClick: scrollToTop },
                  { name: "Products", path: "/shop", onClick: scrollToTop },
                  {
                    name: "Privacy Policy",
                    path: "/policies/privacy-policy",
                    onClick: scrollToTop,
                  },
                  {
                    name: "Contact Us",
                    path: "/contact",
                    onClick: scrollToTop,
                  },
                ].map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      onClick={link.onClick}
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
                    href="mailto:sales@mitsukiindia.com"
                    className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2 text-sm"
                  >
                    <span>📧</span>
                    sales@mitsukiindia.com
                  </a>
                </div>
                <div>
                  <a
                    href="tel:+917988050803"
                    className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2 text-sm"
                  >
                    <span>📞</span>
                    <span className="inline-flex items-center rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-bold tracking-wide text-white whitespace-nowrap">
                      Mr. Sudhir Yadav
                    </span>
                    +91 7988050803
                  </a>

                  <a
                    href="tel:+919999810210"
                    className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2 text-sm"
                  >
                    <span>📞</span>
                    <span className="inline-flex items-center rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-bold tracking-wide text-white whitespace-nowrap">
                      Mr. Vikas Dua
                    </span>
                    +91 9999810210
                  </a>
                </div>

                {/* Social Media Icons */}
                <div className="flex gap-3 pt-3">
                  <a
                    // href=""
                    className="w-9 h-9 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors text-sm"
                    aria-label="Facebook"
                  >
                    <span>f</span>
                  </a>
                  <a
                    // href="#"
                    className="w-9 h-9 bg-gray-800 hover:bg-blue-400 rounded-full flex items-center justify-center transition-colors text-sm"
                    aria-label="Twitter"
                  >
                    <span>𝕏</span>
                  </a>
                  <a
                    // href="#"
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
            </div>
          </div>
        </div>
      </PageWrapper>
    </footer>
  );
}
