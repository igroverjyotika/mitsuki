// src/components/PageWrapper.jsx
import React from "react";

export default function PageWrapper({ children, className = "" }) {
  return (
    <div
      className={`
        max-w-7xl mx-auto
        px-2
        ${className}
      `}
    >
      {children}
    </div>
  );
}
