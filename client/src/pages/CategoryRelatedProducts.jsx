import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ProductGrid from "../components/ProductGrid";

export default function CategoryRelatedProducts() {
  const { slug } = useParams();
  const { products } = useSelector((state) => state.public);

  const filteredProducts =
    products?.data.filter((p) => p.category.catSlug === slug) || [];

  return (
    <div className='p-6 max-w-7xl mx-auto'>
      <h1 className='text-2xl font-bold mb-6'>Latest Products</h1>

      {products.status === "loading" && <p>Loading...</p>}
      {products.status === "failed" && <p>Failed to load products.</p>}

      {products.status === "succeeded" &&
        (filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          <p>No products found in this category.</p>
        ))}
    </div>
  );
}
