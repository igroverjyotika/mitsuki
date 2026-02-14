// src/components/SearchBar.jsx
import React, { useState } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";

export default function SearchBar() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    const trimmed = q.trim();
    navigate({
      pathname: "/shop",
      search: createSearchParams({ query: trimmed }).toString(),
    });
  };

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="flex items-center border rounded overflow-hidden">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by product name or id..."
          className="flex-1 px-3 py-2 text-sm outline-none"
        />
        <button
          type="submit"
          className="px-3 py-2 bg-gray-100 border-l text-sm"
        >
          Search
        </button>
      </div>
    </form>
  );
}
