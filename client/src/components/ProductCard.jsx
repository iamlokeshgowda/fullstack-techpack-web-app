import { Link } from "react-router-dom";
import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const placeholderImg =
  "https://www.techpacktemplates.com/_next/image?url=https%3A%2F%2Ftechpack-storage.s3.amazonaws.com%2Fimages%2F1718559702_GBNCT-USA-Regular-I.jpg&w=3840&q=75";

export default function ProductCard({ product }) {
  // Filter valid images (non-empty strings, ignore broken URLs)
  const validImages = Array.isArray(product.images)
    ? product.images.filter(
        (img) =>
          img &&
          typeof img === "string" &&
          img.trim() &&
          !img.includes("undefined") &&
          !img.includes("null")
      )
    : product.image && typeof product.image === "string" && product.image.trim()
    ? [product.image]
    : [];

  const displayImages = validImages.length > 0 ? validImages : [placeholderImg];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const currentImage = displayImages[currentImageIndex];

  const handlePrev = (e) => {
    e.preventDefault();
    setCurrentImageIndex(
      (prev) => (prev - 1 + displayImages.length) % displayImages.length
    );
  };

  const handleNext = (e) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
  };

  return (
    <Link
      to={`/product/${product.productSlug}`}
      className="block bg-white overflow-hidden shadow hover:shadow-lg transition border"
    >
      {/* IMAGE AREA WITH CAROUSEL - FIXED ASPECT RATIO */}
      <div className="w-full bg-white relative group overflow-hidden flex items-center justify-center">
        <img
          src={currentImage}
          alt={product.productName}
          className="w-full h-full object-contain bg-white"
        />

        {/* CAROUSEL CONTROLS */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>

            {/* CAROUSEL INDICATORS */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {displayImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentImageIndex(idx);
                  }}
                  className={`w-2 h-2 rounded-full transition ${
                    idx === currentImageIndex
                      ? "bg-white"
                      : "bg-white/50 hover:bg-white/75"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* DETAILS SECTION */}
      <div className="p-4 space-y-2">
        {/* TITLE */}
        <h2
          className="text-lg font-semibold text-gray-900 hover:text-blue-600 line-clamp-2"
          title={product.productName}
        >
          {product.productName}
        </h2>

        {/* SHORT DESCRIPTION */}
        {product.productDesc && (
          <p
            className="text-sm text-gray-600 line-clamp-2"
            dangerouslySetInnerHTML={{ __html: product.productDesc }}
          />
        )}

        <div className="flex items-center text-yellow-400 text-sm justify-between">
          <p className="text-green-600 text-lg font-semibold">
            ${product.productPrice}
          </p>
          <div>
            <span className="mr-1">★★★★☆</span>
            <span className="text-gray-500 ml-2">(4.0)</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
