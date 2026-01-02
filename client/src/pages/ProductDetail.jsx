import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import api from "../services/axios";
import { ROUTES } from "../utils/constants";
import { addToCart } from "../store/slices/cartSlice";
import toast from "react-hot-toast";
import LoginModal from "../components/LoginModal";

const placeholderImg =
  "https://www.techpacktemplates.com/_next/image?url=https%3A%2F%2Ftechpack-storage.s3.amazonaws.com%2Fimages%2F1718559702_GBNCT-USA-Regular-I.jpg&w=3840&q=75";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showLogin, setShowLogin] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(null); // "description" or "additionalInfo"

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Fetch product by slug from public endpoint
        const res = await api.get(`/public/product/${slug}`);
        setProduct(res.data?.data || null);
        if (!res.data?.data) {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Failed to load product", err);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  // Fetch similar products by category
  useEffect(() => {
    if (product) {
      const fetchSimilarProducts = async () => {
        try {
          setSimilarLoading(true);
          const res = await api.get(`/public/products`);
          const allProducts = res.data?.data || [];

          // Filter products with same category (try categoryId first, then categoryPath)
          const similar = allProducts
            .filter((p) => {
              // Exclude current product
              if (p.id === product.id) return false;

              // Match by categoryId if available
              if (product.categoryId && p.categoryId === product.categoryId) {
                return true;
              }

              // Fallback: match by category path name
              if (
                product.categoryPath &&
                product.categoryPath.length > 0 &&
                p.categoryPath &&
                p.categoryPath.length > 0
              ) {
                const productCatId =
                  product.categoryPath[product.categoryPath.length - 1]?.id;
                const compareCatId =
                  p.categoryPath[p.categoryPath.length - 1]?.id;
                if (
                  productCatId &&
                  compareCatId &&
                  productCatId === compareCatId
                ) {
                  return true;
                }
              }

              return false;
            })
            .slice(0, 6); // Limit to 6 similar products

          setSimilarProducts(similar);
        } catch (err) {
          console.error("Failed to load similar products", err);
        } finally {
          setSimilarLoading(false);
        }
      };
      fetchSimilarProducts();
    }
  }, [product]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-lg text-red-600">
          {error || "Product not found"}
        </div>
        <Link
          to={ROUTES.HOME}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  // Filter valid images
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
  const currentImage = displayImages[currentImageIndex];

  const handlePrev = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + displayImages.length) % displayImages.length
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
  };

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.id,
        productName: product.productName,
        productSlug: product.productSlug,
        productPrice: product.productPrice,
        images: product.images,
        quantity,
      })
    );
    toast.success(`${product.productName} added to cart!`);
    setQuantity(1);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      setShowLogin(true);
      return;
    }

    dispatch(
      addToCart({
        id: product.id,
        productName: product.productName,
        productSlug: product.productSlug,
        productPrice: product.productPrice,
        images: product.images,
        quantity,
      })
    );
    navigate(ROUTES.CHECKOUT);
  };

  const handleLoginSuccess = () => {
    // after successful login from modal, add to cart and go to checkout
    dispatch(
      addToCart({
        id: product.id,
        productName: product.productName,
        productSlug: product.productSlug,
        productPrice: product.productPrice,
        images: product.images,
        quantity,
      })
    );
    setShowLogin(false);
    navigate(ROUTES.CHECKOUT);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white border-b p-4">
        <Link
          to={ROUTES.HOME}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          ← Back to Products
        </Link>
      </div>

      {/* Product Details */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* IMAGE GALLERY */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-lg overflow-hidden flex items-center justify-center group">
              <img
                src={currentImage}
                alt={product.productName}
                className="w-full h-full object-contain"
              />

              {/* Navigation Buttons */}
              {displayImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <ChevronLeftIcon className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <ChevronRightIcon className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {displayImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {displayImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden transition ${
                      idx === currentImageIndex
                        ? "border-blue-600"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`thumbnail-${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Dot Indicators */}
            {displayImages.length > 1 && (
              <div className="flex gap-1 justify-center">
                {displayImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-2 h-2 rounded-full transition ${
                      idx === currentImageIndex
                        ? "bg-blue-600"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* PRODUCT INFO */}
          <div className="space-y-6">
            {/* Title & Price */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.productName}
              </h1>
              <p className="text-sm text-gray-500 mb-4">
                {product.productSlug}
              </p>
              <p className="text-4xl font-bold text-green-600">
                ${Number(product.productPrice || 0).toFixed(2)}
              </p>
            </div>

            {/* Status */}
            <div>
              {product.isActive ? (
                <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  In Stock
                </span>
              ) : (
                <span className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Category */}
            {product.categoryPath && product.categoryPath.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-1">
                  Category
                </h3>
                <p className="text-gray-800">
                  {product.categoryPath
                    .map((c) => c.catName || c.name)
                    .join(" › ")}
                </p>
              </div>
            )}

            {/* Short Description */}
            {product.shortDescription && (
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-1">
                  Overview
                </h3>
                <p className="text-gray-700">{product.shortDescription}</p>
              </div>
            )}

            {/* Quantity & Cart/Checkout */}
            <div className="space-y-4 pt-4 border-t">
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-2 block">
                  Quantity
                </label>
                <div className="flex items-center gap-3 border rounded w-fit px-3 py-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="font-bold text-gray-600 hover:text-gray-900"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="font-bold text-gray-600 hover:text-gray-900"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.isActive}
                  className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🛒 Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={!product.isActive}
                  className="bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  💳 Buy Now
                </button>
              </div>

              <Link
                to={ROUTES.CART}
                className="block text-center text-blue-600 hover:text-blue-800 font-semibold"
              >
                View Cart
              </Link>
            </div>

            {/* Long Description - Accordion */}
            {product.longDescription && (
              <div className="border rounded-lg">
                <button
                  onClick={() =>
                    setOpenAccordion(
                      openAccordion === "description" ? null : "description"
                    )
                  }
                  className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition"
                >
                  <h3 className="text-sm font-semibold text-gray-600">
                    Description
                  </h3>
                  <span className="text-gray-600">
                    {openAccordion === "description" ? "−" : "+"}
                  </span>
                </button>
                {openAccordion === "description" && (
                  <div className="border-t px-4 py-3 bg-gray-50">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {product.longDescription}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Additional Info - Accordion */}
            {product.addiInfo && (
              <div className="border rounded-lg">
                <button
                  onClick={() =>
                    setOpenAccordion(
                      openAccordion === "additionalInfo"
                        ? null
                        : "additionalInfo"
                    )
                  }
                  className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition"
                >
                  <h3 className="text-sm font-semibold text-gray-600">
                    Additional Information
                  </h3>
                  <span className="text-gray-600">
                    {openAccordion === "additionalInfo" ? "−" : "+"}
                  </span>
                </button>
                {openAccordion === "additionalInfo" && (
                  <div className="border-t px-4 py-3 bg-gray-50">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {product.addiInfo}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Download files are available after purchase */}

            {/* Meta Info */}
            {product.metaDesc && (
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="text-xs font-semibold text-gray-600 uppercase mb-1">
                  Meta Description
                </h4>
                <p className="text-sm text-gray-700">{product.metaDesc}</p>
              </div>
            )}
          </div>
        </div>

        {/* Meta Keywords */}
        {product.metaKeyword && (
          <div className="mt-8 pt-8 border-t">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">
              Keywords
            </h3>
            <div className="flex flex-wrap gap-2">
              {product.metaKeyword.split(",").map((keyword, idx) => (
                <span
                  key={idx}
                  className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
                >
                  {keyword.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <div className="mt-16 pt-8 border-t">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Similar Products
            </h3>
            {similarLoading ? (
              <div className="text-center text-gray-600">
                Loading similar products...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {similarProducts.map((prod) => (
                  <Link
                    key={prod.id}
                    to={`/product/${prod.productSlug}`}
                    className="bg-white rounded-lg border hover:shadow-lg transition overflow-hidden"
                  >
                    <div className="w-full h-48 bg-gray-100 overflow-hidden flex items-center justify-center">
                      {Array.isArray(prod.images) && prod.images.length ? (
                        <img
                          src={prod.images[0]}
                          alt={prod.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={placeholderImg}
                          alt={prod.productName}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                        {prod.productName}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {prod.shortDescription}
                      </p>
                      <p className="text-lg font-bold text-green-600">
                        ${Number(prod.productPrice || 0).toFixed(2)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Login Modal for Buy Now when unauthenticated */}
        <LoginModal
          open={showLogin}
          onClose={() => setShowLogin(false)}
          onSuccess={handleLoginSuccess}
        />

        {/* SEO JSON-LD - use admin-provided metaJson */}
        {product.metaJson && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html:
                typeof product.metaJson === "string"
                  ? product.metaJson
                  : JSON.stringify(product.metaJson),
            }}
          />
        )}
      </div>
    </div>
  );
}
