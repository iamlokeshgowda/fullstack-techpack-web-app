import { useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";

export default function Dashboard() {
  const dispatch = useDispatch();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <button
        onClick={() => dispatch(logout())}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
