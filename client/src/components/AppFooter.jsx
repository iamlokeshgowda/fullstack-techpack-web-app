// components/AppFooter.jsx
import { Link } from "react-router-dom";

export default function AppFooter() {
  return (
    <footer className='bg-gray-900 text-gray-300'>
      <div className='max-w-7xl mx-auto px-6 py-10'>
        <div className='grid gap-8 sm:grid-cols-2 md:grid-cols-3'>
          {/* About */}
          <div>
            <h3 className='text-lg font-semibold text-white'>AppName</h3>
            <p className='text-sm mt-2'>
              Your trusted platform to manage everything efficiently.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className='text-md font-semibold text-white'>Navigate</h4>
            <ul className='mt-2 space-y-1 text-sm'>
              <li>
                <Link to='/' className='hover:text-white'>
                  Home
                </Link>
              </li>
              <li>
                <Link to='/dashboard' className='hover:text-white'>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to='/profile' className='hover:text-white'>
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className='text-md font-semibold text-white'>Connect</h4>
            <div className='flex space-x-4 mt-2 text-xl'>
              <a href='#'>🐦</a>
              <a href='#'>📘</a>
              <a href='#'>📸</a>
              <a href='#'>💼</a>
            </div>
          </div>
        </div>

        <hr className='my-6 border-gray-700' />
        <p className='text-center text-sm'>
          © {new Date().getFullYear()} AppName — All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
