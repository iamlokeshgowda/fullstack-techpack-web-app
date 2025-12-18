import Sidebar from "../components/Sidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className='flex min-h-screen bg-gray-100'>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className='flex-1 flex flex-col'>
        {/* Header */}
        <header className='h-16 bg-white shadow flex items-center px-6'>
          <h1 className='text-xl font-semibold text-gray-700'>
            Admin Dashboard
          </h1>
        </header>

        {/* Page Content */}
        <main className='flex-1 p-6'>{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
