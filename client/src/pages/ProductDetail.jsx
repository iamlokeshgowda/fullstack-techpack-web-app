import { useEffect, useMemo, useState, lazy, Suspense } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import api from "../services/axios";
import { ROUTES, SERVER_ROUTES } from "../utils/constants";
import { addToCart } from "../store/slices/cartSlice";
import toast from "react-hot-toast";

const LoginModal = lazy(() => import("../components/LoginModal"));
import ProductGrid from "../components/ProductGrid";

const placeholderImg =
  "https://www.techpacktemplates.com/_next/image?url=https%3A%2F%2Ftechpack-storage.s3.amazonaws.com%2Fimages%2F1718559702_GBNCT-USA-Regular-I.jpg&w=3840&q=75";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { products } = useSelector((state) => state.public);

  const [product, setProduct] = useState(null);

  const relatedProducts = useMemo(() => {
    if (!product || !Array.isArray(products?.data)) return [];

    const slug = product.category?.catSlug;
    if (!slug) return [];

    return products.data.filter(
      (p) => p.id !== product.id && p.category?.catSlug === slug
    );
  }, [products?.data, product]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showLogin, setShowLogin] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(null);

  const displayImages = useMemo(() => {
    const valid = Array.isArray(product?.images)
      ? product.images.filter(
          (img) =>
            typeof img === "string" &&
            img.trim() &&
            !img.includes("undefined") &&
            !img.includes("null")
        )
      : product?.image
      ? [product.image]
      : [];

    return valid.length ? valid : [placeholderImg];
  }, [product]);

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(
          `${SERVER_ROUTES.PUBLIC_PRODUCT_BY_SLUG}/${slug}`
        );

        if (!data?.data) throw new Error("Product not found");
        setProduct(data.data);
      } catch (e) {
        console.error(e);
        setError(e.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) return <Loader />;

  if (error || !product) return <ErrorState error={error} />;

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
    // persist to server when user is authenticated
    if (isAuthenticated) {
      (async () => {
        try {
          await api.post(SERVER_ROUTES.USER_CART, {
            productId: product.id,
            quantity,
          });
        } catch (err) {
          console.error("Failed to persist cart to server", err);
        }
      })();
    }
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      setShowLogin(true);
      return;
    }

    handleAddToCart();
    navigate(ROUTES.CHECKOUT);
  };

  const handleLoginSuccess = async () => {
    handleAddToCart();
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

            {/* Short Description */}
            {product.shortDescription && (
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-1">
                  Overview
                </h3>
                <p className="text-gray-700">{product.shortDescription}</p>
              </div>
            )}

            <div className="space-y-4 pt-4 border-t">
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

            {/* Meta Info */}
            {product.metaDesc && (
              <div className="border rounded-lg">
                <button
                  onClick={() =>
                    setOpenAccordion(
                      openAccordion === "metaDesc" ? null : "metaDesc"
                    )
                  }
                  className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition"
                >
                  <h3 className="text-sm font-semibold text-gray-600">
                    Meta Description
                  </h3>
                  <span className="text-gray-600">
                    {openAccordion === "metaDesc" ? "−" : "+"}
                  </span>
                </button>
                {openAccordion === "metaDesc" && (
                  <div className="border-t px-4 py-3 bg-gray-50">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {product.metaDesc}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <Suspense fallback={null}>
          <LoginModal
            open={showLogin}
            onClose={() => setShowLogin(false)}
            onSuccess={handleLoginSuccess}
          />
        </Suspense>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {products.status === "loading" && <Loader />}
        {products.status === "failed" && <p>Failed to load products.</p>}

        {products.status === "succeeded" && relatedProducts.length > 0 && (
          <section className="p-6 max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <ProductGrid products={relatedProducts.slice(0, 6)} />
          </section>
        )}
      </div>
    </div>
  );
}

const Loader = () => (
  <div className="flex items-center justify-center min-h-screen text-gray-600">
    Loading...
  </div>
);

const ErrorState = ({ error }) => (
  <div className="flex flex-col items-center justify-center min-h-screen gap-4">
    <p className="text-red-600">{error}</p>
    <Link to={ROUTES.HOME} className="text-blue-600 underline">
      Back to Home
    </Link>
  </div>
);
