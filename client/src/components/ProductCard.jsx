import { Link } from "react-router-dom";

const placeholderImg =
  "https://www.techpacktemplates.com/_next/image?url=https%3A%2F%2Ftechpack-storage.s3.amazonaws.com%2Fimages%2F1718559702_GBNCT-USA-Regular-I.jpg&w=3840&q=75";

export default function ProductCard({ product }) {
  const imgSrc = product.image || placeholderImg;

  return (
    <Link
      to={`/product/${product.productSlug}`}
      className='block bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition border'
    >
      {/* IMAGE AREA */}
      <div className='w-full bg-white'>
        <img
          src={imgSrc}
          alt={product.productName}
          className='w-full h-56 object-contain bg-white'
        />
      </div>

      {/* DETAILS SECTION */}
      <div className='p-4 space-y-2'>
        {/* TITLE */}
        <h2
          className='text-lg font-semibold text-gray-900 hover:text-blue-600 line-clamp-2'
          title={product.productName}
        >
          {product.productName}
        </h2>

        {/* SHORT DESCRIPTION */}
        {product.productDesc && (
          <p
            className='text-sm text-gray-600 line-clamp-2'
            dangerouslySetInnerHTML={{ __html: product.productDesc }}
          />
        )}

        <div className='flex items-center text-yellow-400 text-sm justify-between'>
          <p className='text-green-600 text-lg font-semibold'>
            ${product.productPrice}
          </p>
          <div>
            <span className='mr-1'>★★★★☆</span>
            <span className='text-gray-500 ml-2'>(4.0)</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
