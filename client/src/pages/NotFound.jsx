import { Link } from "react-router-dom";
import { ROUTES } from "../utils/constants";

export default function NotFound() {
  return (
    <div className='flex h-screen items-center justify-center bg-gray-50 px-4'>
      <div className='text-center'>
        {/* Icon */}
        <div className='mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-blue-100'>
          <svg
            className='h-10 w-10 text-blue-600 animate-bounce'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={1.8}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.49-1.67 1.72-3L13.72 4.999c-.77-1.33-2.67-1.33-3.44 0L3.34 17c-.77 1.33.18 3 1.72 3z'
            />
          </svg>
        </div>

        {/* Content */}
        <h1 className='text-5xl font-extrabold text-gray-800'>404</h1>
        <p className='mt-1 text-xl text-gray-600'>Page Not Found</p>
        <p className='mt-2 text-gray-500'>
          The page you are looking for might have been removed or doesn't exist.
        </p>

        {/* Button */}
        <div className='mt-6'>
          <Link
            to={ROUTES.HOME}
            className='inline-block rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold
            hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg'
          >
            Back to Home
          </Link>
        </div>

        {/* Help text */}
        <p className='mt-4 text-sm text-gray-500'>
          Need help?{" "}
          <span className='text-blue-600 font-medium'>Contact support</span>.
        </p>
      </div>
    </div>
  );
}
