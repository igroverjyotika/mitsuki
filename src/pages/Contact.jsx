import React, { useMemo, useState } from "react";
import { Mail, Phone, Clock, MapPin, Send } from "lucide-react";
import PageWrapper from "../components/PageWrapper";
import Footer from "../components/Footer";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Request a quote");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const mailtoHref = useMemo(() => {
    const to = "sales@mitsukiindia.com";
    const safeSubject = subject?.trim() || "Contact request";
    const safeName = name?.trim() || "(not provided)";
    const safeEmail = email?.trim() || "(not provided)";
    const safeMessage = message?.trim() || "(no message)";

    const bodyLines = [
      `Name: ${safeName}`,
      `Email: ${safeEmail}`,
      "",
      safeMessage,
    ];

    return `mailto:${to}?subject=${encodeURIComponent(safeSubject)}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
  }, [name, email, subject, message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!message.trim()) {
      setError("Please add a short message.");
      return;
    }
    if (email.trim() && !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    window.location.href = mailtoHref;
  };

  return (
    <>
      <PageWrapper>
        <div className="py-10">
          {/* Hero */}
          <div className="rounded-2xl border bg-gradient-to-r from-gray-950 to-gray-900 text-white p-8 md:p-10 shadow-sm">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.25em] text-white/70">
                Contact
              </p>
              <h1 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">
                Let’s talk about your requirements
              </h1>
              <p className="mt-3 text-white/80">
                Share what you need and we’ll get back with pricing and
                availability. For urgent queries, call us directly.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="tel:+917988050803"
                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Call Mr. Sudhir Yadav
                </a>
                <a
                  href="mailto:sales@mitsukiindia.com"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold hover:bg-blue-600 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Email Sales
                </a>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mt-8 grid lg:grid-cols-2 gap-6 items-start">
            {/* Left: Info */}
            <div className="space-y-4">
              <div className="bg-white border rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">
                  Contact details
                </h2>
                <div className="mt-4 space-y-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <a
                        href="mailto:sales@mitsukiindia.com"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        sales@mitsukiindia.com
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900">Phone</p>
                      <a
                        href="tel:+917988050803"
                        className="text-sm text-blue-600 hover:underline block"
                      >
                        Mr. Sudhir Yadav: +91 7988050803
                      </a>
                      <a
                        href="tel:+919999810210"
                        className="text-sm text-blue-600 hover:underline block"
                      >
                        Mr. Vikas Dua: +91 9999810210
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Response time
                      </p>
                      <p className="text-sm text-gray-600">
                        Typically within 24 hours (Mon–Sat).
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Location
                      </p>
                      <p className="text-sm text-gray-600">
                        India (shipping PAN-India)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900">
                  Tips for faster quotes
                </h3>
                <ul className="mt-3 text-sm text-gray-600 space-y-2">
                  <li>Share part code(s) and required quantity.</li>
                  <li>Mention delivery location & timeline.</li>
                  <li>Include specs/measurements if applicable.</li>
                </ul>
              </div>
            </div>

            {/* Right: Form */}
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                Send a message
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                This opens your email app with a prefilled message.
              </p>

              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-700">
                      Name
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700">
                      Email
                    </label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700">
                    Subject
                  </label>
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                    placeholder="Request a quote"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                    placeholder="Tell us what you need (part code, quantity, delivery location, etc.)"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                  <a
                    href={mailtoHref}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Preview email
                  </a>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </PageWrapper>
      <Footer />
    </>
  );
}
