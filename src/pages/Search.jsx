import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function SearchRedirect() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    if (q.trim()) {
      navigate(`/shop?query=${encodeURIComponent(q.trim())}`, { replace: true });
    } else {
      navigate("/shop", { replace: true });
    }
  }, [location.search, navigate]);

  return null;
}
