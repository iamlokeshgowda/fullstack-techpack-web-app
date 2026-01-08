import { useState } from "react";
import api from "../services/axios";
import { useNavigate } from "react-router-dom";
import { ROUTES, SERVER_ROUTES } from "../utils/constants";
import toast from "react-hot-toast";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(SERVER_ROUTES.AUTH_REGISTER, form);
      navigate(ROUTES.LOGIN);
      toast.success(`Registration Succesfull`);
    } catch (error) {
      console.error("Registration failed", error);
      toast.error("Registration failed please verify the details");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* LEFT BRAND SECTION */}
      <div className="hidden lg:flex flex-col justify-center px-16 bg-gradient-to-br from-emerald-600 to-emerald-800 text-white">
        <h1 className="text-4xl font-bold mb-4">TechPack Platform</h1>
        <p className="text-lg text-emerald-100 max-w-md">
          Design, manage, and download professional tech packs with ease.
        </p>
      </div>

      {/* RIGHT REGISTER FORM */}
      <div className="flex items-center justify-center px-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded w-96 shadow"
        >
          <h2 className="text-xl font-bold mb-4">Register</h2>

          <input
            type="text"
            placeholder="First Name"
            value={form.firstName}
            className="w-full mb-3 p-2 border rounded"
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={form.lastName}
            className="w-full mb-3 p-2 border rounded"
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            required
          />
          <input
            type="phone"
            placeholder="Phone Number"
            value={form.phone}
            className="w-full mb-3 p-2 border rounded"
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            className="w-full mb-3 p-2 border rounded"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            className="w-full mb-4 p-2 border rounded"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded mb-3"
          >
            Register
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full border border-emerald-600 text-emerald-600 p-2 rounded hover:bg-emerald-50"
          >
            Already registered? Login
          </button>
        </form>
      </div>
    </div>
  );
}
