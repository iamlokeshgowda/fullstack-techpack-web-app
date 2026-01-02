import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "../services/axios";
import { ROUTES, SERVER_ROUTES } from "../utils/constants";
import toast from "react-hot-toast";
import { authStart, authSuccess, authFailure } from "../store/slices/authSlice";

export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(SERVER_ROUTES.AUTH_PROFILE);
        setProfile(res.data?.data || null);
        setForm(res.data?.data || {});
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      dispatch(authStart());
      const res = await api.patch(SERVER_ROUTES.AUTH_PROFILE, form);
      setProfile(res.data?.data || null);
      // update auth store user info (name etc.)
      dispatch(
        authSuccess({
          user: res.data?.data,
          accessToken: localStorage.getItem("accessToken"),
        })
      );
      toast.success("Profile updated");
      setEditing(false);
    } catch (err) {
      console.error("Failed to update profile", err);
      dispatch(authFailure(err.response?.data?.message || "Failed to update"));
      toast.error("Failed to update profile");
    }
  };

  if (!profile) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold">Profile</h1>
        <div className="mt-4 text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-xl font-bold">Profile</h1>

      {!editing ? (
        <div className="bg-white shadow rounded p-6 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm text-gray-500">Name</h4>
              <div className="font-medium">
                {`${profile.firstName || ""} ${profile.lastName || ""}`}
              </div>
            </div>
            <div>
              <h4 className="text-sm text-gray-500">Email</h4>
              <div className="font-medium">{profile.email}</div>
            </div>

            <div>
              <h4 className="text-sm text-gray-500">Phone</h4>
              <div className="font-medium">{profile.phone || "-"}</div>
            </div>

            <div>
              <h4 className="text-sm text-gray-500">Country</h4>
              <div className="font-medium">{profile.country || "-"}</div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-sm text-gray-500">Address</h4>
            <div className="mt-2 text-gray-700 whitespace-pre-wrap">
              {`${profile.address || ""} ${profile.city || ""} ${
                profile.state || ""
              }  ${profile.zipCode || ""}` || "-"}
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSave}
          className="bg-white shadow rounded p-6 mt-4 space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">First Name</label>
              <input
                name="firstName"
                value={form.firstName || ""}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500">Last Name</label>
              <input
                name="lastName"
                value={form.lastName || ""}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Phone</label>
              <input
                name="phone"
                value={form.phone || ""}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500">Country</label>
              <input
                name="country"
                value={form.country || ""}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-500">Address</label>
            <textarea
              name="address"
              value={form.address || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <input
              name="city"
              value={form.city || ""}
              onChange={handleChange}
              placeholder="City"
              className="border rounded px-3 py-2"
            />
            <input
              name="state"
              value={form.state || ""}
              onChange={handleChange}
              placeholder="State"
              className="border rounded px-3 py-2"
            />
            <input
              name="zipCode"
              value={form.zipCode || ""}
              onChange={handleChange}
              placeholder="ZIP"
              className="border rounded px-3 py-2"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-emerald-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setForm(profile);
              }}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
