import ProductCard from "./ProductCard";

export default function ProductGrid({ products = [] }) {
  if (!products.length)
    return (
      <p className='text-gray-500 text-center py-4'>No products available.</p>
    );

  return (
    <div className='grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3'>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
