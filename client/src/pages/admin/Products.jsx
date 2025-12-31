import { useEffect, useState } from "react";
import api from "../../services/axios";
import { useDispatch } from "react-redux";
import { showConfirmDialog } from "../../store/slices/ui/confirmDialogSlice";
import { SERVER_ROUTES } from "../../utils/constants";
import AddProductForm from "./components/AddProductForm";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    const handler = () => loadProducts();
    window.addEventListener("admin:productDeleted", handler);
    return () => window.removeEventListener("admin:productDeleted", handler);
  }, []);

  const loadProducts = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const res = await api.get(SERVER_ROUTES.PRODUCTS, {
        // params: { page, search },
      });
      setProducts(res.data?.data ?? []);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter((p) =>
    p.productName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>

        <div className="flex gap-3">
          <input
            className="border rounded px-3 py-2 w-64"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={loadProducts}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Refresh
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add Product
          </button>
        </div>
      </div>

      {loading && <div>Loading…</div>}
      {error && <div className="text-red-600">{error}</div>}

      {!loading && !error && (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-right">Price</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-left">Updated</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-t">
                  <td className="p-3">
                    <img
                      src={
                        product.images && product.images.length
                          ? product.images[0]
                          : "/no-image.png"
                      }
                      alt={product.productName}
                      className="w-12 h-12 rounded object-cover border"
                    />
                  </td>

                  <td className="p-3">
                    <div className="font-medium">{product.productName}</div>
                    <div className="text-sm text-gray-500">
                      {product.productSlug}
                    </div>
                  </td>

                  <td className="p-3 text-sm text-gray-600">
                    {product.categoryPath && product.categoryPath.length
                      ? product.categoryPath
                          .map((c) => c.catName || c.name)
                          .join(" \u203A ")
                      : "-"}
                  </td>
                  <td className="p-3 text-right font-medium">
                    ₹{Number(product.productPrice).toFixed(2)}
                  </td>

                  <td className="p-3 text-center">
                    {product.isActive ? (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
                        Active
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="p-3 text-sm">
                    {new Date(product.updatedAt).toLocaleString()}
                  </td>

                  <td className="p-3 text-right flex gap-2 justify-end">
                    {/* <button className="px-3 py-1 border rounded">View</button> */}
                    <button
                      onClick={async () => {
                        try {
                          const res = await api.get(
                            `/admin/product/${product.id}`
                          );
                          setSelectedProduct(res.data?.data || product);
                          setShowAdd(true);
                        } catch (err) {
                          console.error("Failed to fetch product", err);
                          setSelectedProduct(product);
                          setShowAdd(true);
                        }
                      }}
                      className="px-3 py-1 bg-yellow-500 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        dispatch(
                          showConfirmDialog({
                            title: "Delete Product",
                            message:
                              "Are you sure you want to delete this product? This action cannot be undone.",
                            confirmText: "Delete",
                            actionType: "DELETE_PRODUCT",
                            actionPayload: product.id,
                          })
                        )
                      }
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {!filtered.length && (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {showAdd && (
        <AddProductForm
          product={selectedProduct}
          onClose={() => {
            setShowAdd(false);
            setSelectedProduct(null);
          }}
          onProductAdded={() => {
            loadProducts();
            setShowAdd(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
}

// Add product modal
// Show form when `showAdd` is true (handled inside component via state)
