// src/pages/PolicyDetail.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import PageWrapper from "../components/PageWrapper";
import Footer from "../components/Footer";

const POLICY_CONTENT = {
  "return-and-cancellation-policy": {
    title: "Return & Cancellation Policy",
    body: "Our returns and cancellations policy: Items can be returned within 7 days of delivery if unused and in original packaging. Contact sales@mitsukiindia.com or sales@mitsuki.in for support.",
  },
  "privacy-policy": {
    title: "Privacy Policy",
    body: "Privacy Policy summary: We collect minimal customer data to process orders. We do not sell personal information.",
  },
  "terms-and-conditions": {
    title: "Terms & Conditions",
    body: "Terms & Conditions summary: By using this site you agree to our terms. For full details, contact us.",
  },
  "shipping-policy": {
    title: "Shipping Policy",
    body: "Shipping Policy summary: Standard shipping 2-3 business days. Expedited options available for large orders.",
  },
};

export default function PolicyDetail() {
  const { slug } = useParams();
  const doc = POLICY_CONTENT[slug];

  if (!doc) {
    return (
      <>
        <PageWrapper>
          <div className="py-10">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900">
                Policy not found
              </h2>
              <p className="mt-1 text-gray-600">
                Try one of the policies from the list.
              </p>
              <Link
                to="/policies"
                className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to policies
              </Link>
            </div>
          </div>
        </PageWrapper>
        <Footer />
      </>
    );
  }

  return (
    <>
      <PageWrapper>
        <div className="py-10">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <Link
              to="/policies"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Policies
            </Link>
          </div>

          <div className="mt-5 rounded-2xl border bg-gradient-to-r from-gray-950 to-gray-900 text-white p-8 md:p-10 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-white/70">
                  Policy
                </p>
                <h1 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">
                  {doc.title}
                </h1>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border bg-white p-6 md:p-8 shadow-sm">
            <p className="text-gray-700 leading-relaxed">{doc.body}</p>
          </div>

          <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900">Questions?</h3>
            <p className="mt-1 text-sm text-gray-600">
              Reach out via our{" "}
              <Link to="/contact" className="text-blue-600 hover:underline">
                Contact Us
              </Link>{" "}
              page.
            </p>
          </div>
        </div>
      </PageWrapper>
      <Footer />
    </>
  );
}
