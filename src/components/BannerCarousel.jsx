import React, { useEffect, useState } from "react";

const banners = [
  {
    id: 1,
    title: "The Innovation Behind Our Product — Mitsuki.",
    subtitle: "We Don't Just Provide Components; We Engineer Solutions.",
    img: "/src/assets/banner1.jpg",
  },
  // {
  //   id: 2,
  //   title: "On Time Delivery is More Than a Tagline — It’s Our Commitment.",
  //   subtitle: "Fast & Reliable",
  //   img: "/src/assets/banner2.png",
  // },
  {
    id: 2,
    title: "On Time Delivery is More Than a Tagline — It’s Our Commitment.",
    subtitle: "Fast & Reliable",
    img: "/src/assets/banner3.png",
  },
];

export default function BannerCarousel() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % banners.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="grid md:grid-cols-10 gap-6 items-center border border-red-300">
      {/* LEFT BOX — fixed text */}
      <div className="md:col-span-4 p-6 bg-gray-100 rounded-lg shadow-sm border border-red-300">
        <h2 className="text-3xl font-bold leading-tight text-gray-900">
          The Innovation Behind Our Product
        </h2>

        <p className="mt-3 text-lg text-gray-700">
          <span className="font-semibold text-gray-900">Mitsuki</span>, We Don't
          Just Provide Components; We Engineer Solutions. Mitsuki has become
          synonymous with excellence in factory automation and motion control
          technology.
        </p>

        <p className="mt-4 text-lg font-medium text-gray-800">
          “On Time Delivery” is more than a tagline for us — it’s our
          <span className="font-semibold"> commitment.</span>
        </p>

        <button className="mt-6 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition">
          Shop Now
        </button>
      </div>

      {/* RIGHT BOX — changing banner */}
      <div className="md:col-span-6 relative border border-blue-300">
        <div className="h-52 md:h-80 rounded-2xl overflow-hidden bg-gray-200 shadow-md">
          <img
            src={banners[idx].img}
            alt="Banner"
            className="object-cover w-full h-full transition-all duration-700 ease-in-out"
          />
        </div>

        {/* Navigation dots */}
        <div className="flex gap-2 justify-center mt-4">
          {banners.map((b, i) => (
            <button
              key={b.id}
              onClick={() => setIdx(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i === idx ? "bg-gray-800" : "bg-gray-400 hover:bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
