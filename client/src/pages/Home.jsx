import { useSelector } from "react-redux";
import ProductGrid from "../components/ProductGrid";

export default function Home() {
  const { products } = useSelector((state) => state.public);

  return (
    <div className='p-6 max-w-7xl mx-auto'>
      <h1 className='text-2xl font-bold mb-6'>Latest Products</h1>

      {products.status === "loading" && <p>Loading...</p>}
      {products.status === "failed" && <p>Failed to load products.</p>}
      {products.status === "succeeded" && (
        <ProductGrid products={products.data} />
      )}
    </div>
  );
}
