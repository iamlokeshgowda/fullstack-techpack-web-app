import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import api from "../../../services/axios";
import { SERVER_ROUTES } from "../../../utils/constants";
import toast from "react-hot-toast";

export default function AddProductForm({
  onClose,
  onProductAdded,
  product = null,
}) {
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    productSlug: "",
    productName: "",
    metaDesc: "",
    metaKeyword: "",
    metaJson: "",
    shortDescription: "",
    longDescription: "",
    addiInfo: "",
    productPrice: "",
    catId: "",
    images: [],
    isActive: true,
  });
  const [downloadFile, setDownloadFile] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [existingDownloadUrl, setExistingDownloadUrl] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 5) {
      toast.error("You can upload up to 5 images");
      return;
    }
    setFormData((prev) => ({ ...prev, images: files }));
  };

  const handleDownloadChange = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      file.type !== "application/zip" &&
      !file.name.endsWith(".zip")
    ) {
      toast.error("Please upload a ZIP file for download link");
      return;
    }
    setDownloadFile(file || null);
  };

  // load categories from server
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get(SERVER_ROUTES.CATEGORIES);
        setCategoriesList(res.data?.data || []);
      } catch (err) {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  // Prefill when editing
  useEffect(() => {
    if (!product) return;
    setFormData((prev) => ({
      ...prev,
      id: product.id || "",
      productName: product.productName || "",
      productSlug: product.productSlug || "",
      metaDesc: product.metaDesc || product.metaDesc || "",
      metaKeyword: product.metaKeyword || "",
      metaJson: product.metaJson || "",
      shortDescription: product.shortDescription || "",
      longDescription: product.longDescription || "",
      addiInfo: product.addiInfo || "",
      productPrice: product.productPrice || "",
      catId: product.catId || "",
      images: [],
      isActive: product.isActive ?? true,
    }));
    setExistingImages(product.images || []);
    setExistingDownloadUrl(product.downloadLink || null);
  }, [product]);

  // Flatten categories (simple)
  const flatten = (cats, level = 0, out = []) => {
    cats.forEach((c) => {
      out.push({
        id: c.id,
        name: c.catName || c.catName,
        indent: "—".repeat(level),
      });
      if (c.children && c.children.length) flatten(c.children, level + 1, out);
    });
    return out;
  };

  const flatCategories = flatten(categoriesList);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.productName.trim())
        throw new Error("Product name required");
      if (!formData.productSlug.trim())
        throw new Error("Product slug required");
      if (!formData.productPrice || Number(formData.productPrice) <= 0)
        throw new Error("Valid product price required");
      if (!formData.catId) throw new Error("Please select a category");

      // Prepare files metadata for presign
      const filesMeta = [];
      // images
      formData.images.forEach((file) => {
        filesMeta.push({
          name: file.name,
          type: file.type || "image/*",
          purpose: "image",
        });
      });
      // download zip
      if (downloadFile) {
        filesMeta.push({
          name: downloadFile.name,
          type: downloadFile.type || "application/zip",
          purpose: "download",
        });
      }

      let presigned = [];
      if (filesMeta.length > 0) {
        const presignRes = await api.post("/admin/s3/presign", {
          files: filesMeta,
        });
        presigned = presignRes.data?.data || [];
      }

      // upload files to S3 using putUrl
      const uploadPromises = [];
      let imageGetUrls = [];
      let downloadGetUrl = null;

      // map presigned entries to files
      for (let i = 0; i < presigned.length; i++) {
        const p = presigned[i];
        // match by name
        const matchingImage = formData.images.find((f) => f.name === p.name);
        if (matchingImage) {
          uploadPromises.push(
            fetch(p.putUrl, {
              method: "PUT",
              headers: { "Content-Type": matchingImage.type },
              body: matchingImage,
            }).then((r) => {
              if (!r.ok) throw new Error("Failed to upload image to S3");
              imageGetUrls.push(p.getUrl);
            })
          );
          continue;
        }

        if (downloadFile && downloadFile.name === p.name) {
          uploadPromises.push(
            fetch(p.putUrl, {
              method: "PUT",
              headers: { "Content-Type": downloadFile.type },
              body: downloadFile,
            }).then((r) => {
              if (!r.ok)
                throw new Error("Failed to upload download file to S3");
              downloadGetUrl = p.getUrl;
            })
          );
          continue;
        }
      }

      await Promise.all(uploadPromises);

      // merge existing urls when editing and no new uploads provided
      const finalImages =
        imageGetUrls.length > 0 ? imageGetUrls : existingImages || [];
      const finalDownload = downloadGetUrl || existingDownloadUrl || null;

      const submitData = {
        productName: formData.productName,
        productSlug: formData.productSlug,
        metaDesc: formData.metaDesc || null,
        metaKeyword: formData.metaKeyword || null,
        metaJson: formData.metaJson || null,
        shortDescription: formData.shortDescription || null,
        longDescription: formData.longDescription || null,
        addiInfo: formData.addiInfo || null,
        productPrice: Number(formData.productPrice),
        catId: formData.catId,
        images: finalImages,
        downloadLink: finalDownload,
        isActive: !!formData.isActive,
      };

      if (product && product.id) {
        // try update, fallback to create if endpoint missing
        try {
          const updateRes = await api.put(
            `/admin/product/${product.id}`,
            submitData
          );
          if (updateRes.data?.success === false) {
            throw new Error(
              updateRes.data?.message || "Failed to update product"
            );
          }
          toast.success("Product updated successfully");
        } catch (err) {
          // fallback to create
          const createRes = await api.post("/admin/product", submitData);
          if (createRes.data?.success === false) {
            throw new Error(
              createRes.data?.message || "Failed to create product"
            );
          }
          toast.success("Product saved successfully");
        }
      } else {
        const createRes = await api.post("/admin/product", submitData);
        if (createRes.data?.success === false) {
          throw new Error(
            createRes.data?.message || "Failed to create product"
          );
        }
        toast.success("Product created successfully");
      }

      onProductAdded();
      onClose();
    } catch (err) {
      toast.error(
        err.message ||
          (err.response && err.response.data && err.response.data.message) ||
          "Failed to create product"
      );
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-semibold">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Slug *
            </label>
            <input
              type="text"
              name="productSlug"
              value={formData.productSlug}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Price (USD) *
            </label>
            <input
              type="number"
              name="productPrice"
              value={formData.productPrice}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="catId"
              value={formData.catId}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
              required
            >
              <option value="">Select a category</option>
              {flatCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.indent} {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Description
            </label>
            <input
              type="text"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Long Description
            </label>
            <textarea
              name="longDescription"
              value={formData.longDescription}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Info (JSON or text)
            </label>
            <textarea
              name="addiInfo"
              value={formData.addiInfo}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Description
            </label>
            <input
              type="text"
              name="metaDesc"
              value={formData.metaDesc}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Keywords (comma separated)
            </label>
            <input
              type="text"
              name="metaKeyword"
              value={formData.metaKeyword}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta JSON
            </label>
            <textarea
              name="metaJson"
              value={formData.metaJson}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images (up to 5)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.images.length} file(s) selected
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Download ZIP (single)
            </label>
            <input
              type="file"
              accept=".zip,application/zip"
              onChange={handleDownloadChange}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              {downloadFile ? downloadFile.name : "No file selected"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <input
              id="isActive"
              name="isActive"
              type="checkbox"
              checked={!!formData.isActive}
              onChange={(e) =>
                setFormData((p) => ({ ...p, isActive: e.target.checked }))
              }
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">
              Active
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded"
            >
              {loading
                ? product
                  ? "Saving..."
                  : "Creating..."
                : product
                ? "Save Changes"
                : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
