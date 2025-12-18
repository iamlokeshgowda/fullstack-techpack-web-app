import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../../layouts/AdminLayout";
import { useEffect } from "react";
import { getCategories } from "../../store/slices/admin/adminThunks";

export default function AdminDashboard() {
  const categories = useSelector((state) => state.admin.categories.data);
  const dispatch = useDispatch();
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(getCategories());
    }
  }, [categories.length, dispatch]);
  return (
    <AdminLayout>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white p-6 rounded shadow'>
          <h2 className='text-gray-500'>Total Categories</h2>
          <p className='text-3xl font-bold'>{categories.length}</p>
        </div>

        <div className='bg-white p-6 rounded shadow'>
          <h2 className='text-gray-500'>Total Products</h2>
          <p className='text-3xl font-bold'>48</p>
        </div>

        <div className='bg-white p-6 rounded shadow'>
          <h2 className='text-gray-500'>Active Users</h2>
          <p className='text-3xl font-bold'>120</p>
        </div>
      </div>
    </AdminLayout>
  );
}
