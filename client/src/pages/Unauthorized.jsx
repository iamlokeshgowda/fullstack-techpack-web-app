import { Link } from "react-router-dom";
import { ROUTES } from "../utils/constants";

export default function Unauthorized() {
  return (
    <div className='flex h-screen items-center justify-center bg-gray-50 px-4'>
      <div className='text-center'>
        {/* Icon */}
        <div className='mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-100'>
          <svg
            className='h-10 w-10 text-red-500 animate-pulse'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={1.8}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M12 9v3m0 4h.01M5.07 19h13.86c1.54 0 2.49-1.67 1.72-3L13.72 4.99c-.77-1.33-2.68-1.33-3.45 0L3.34 16c-.77 1.33.18 3 1.73 3z'
            />
          </svg>
        </div>

        {/* Text */}
        <h1 className='text-4xl font-bold text-gray-800'>Access Denied</h1>
        <p className='mt-2 text-lg text-gray-600'>
          You don’t have permission to view this page.
        </p>

        {/* Redirect button */}
        <div className='mt-6'>
          <Link
            to={ROUTES.HOME}
            className='inline-block rounded-lg bg-red-500 px-6 py-3 text-white font-semibold 
            hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg'
          >
            Go Back Home
          </Link>
        </div>

        {/* Help text */}
        <p className='mt-4 text-sm text-gray-500'>
          If you think this is a mistake, please contact support.
        </p>
      </div>
    </div>
  );
}
