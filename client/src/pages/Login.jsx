import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authStart, authSuccess, authFailure } from "../store/slices/authSlice";
import api from "../services/axios";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { SERVER_ROUTES } from "../utils/constants";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorCode, setErrorCode] = useState(null);

  const { loading, error } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validate = () => {
    if (!email || !password) {
      toast.error("Email and password required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setErrorCode(null);
    dispatch(authStart());

    try {
      const res = await api.post(SERVER_ROUTES.AUTH_LOGIN, { email, password });
      dispatch(authSuccess(res.data));
      toast.success("Login successful");
      //TODO: Redirect based on role
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      const code = err.response?.data?.code;
      setErrorCode(code);
      dispatch(authFailure(err.response?.data?.message));
    }
  };

  const handleGoogleLogin = async (credential) => {
    dispatch(authStart());

    try {
      const res = await api.post(SERVER_ROUTES.AUTH_GOOGLE, {
        idToken: credential,
      });
      dispatch(authSuccess(res.data));
      toast.success("Logged in with Google");
      //TODO: Redirect based on role
      navigate(ROUTES.DASHBOARD);
    } catch {
      dispatch(authFailure("Google login failed"));
      toast.error("Google login failed");
    }
  };

  return (
    <div className='min-h-screen grid grid-cols-1 lg:grid-cols-2'>
      <div className='hidden lg:flex flex-col justify-center px-16 bg-gradient-to-br from-emerald-600 to-emerald-800 text-white'>
        <h1 className='text-4xl font-bold mb-4'>TechPack Platform</h1>
        <p className='text-lg text-emerald-100'>
          Design, manage, and download professional tech packs.
        </p>
      </div>

      <div className='flex items-center justify-center px-6'>
        <form
          onSubmit={handleSubmit}
          className='w-full max-w-md bg-white rounded-2xl shadow-xl p-8'
        >
          <h2 className='text-2xl font-semibold mb-6'>Sign in</h2>

          <input
            type='email'
            placeholder='Email'
            className='w-full mb-4 px-4 py-2 border rounded-lg'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type='password'
            placeholder='Password'
            className='w-full mb-3 px-4 py-2 border rounded-lg'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className='text-red-500 text-sm mb-3'>{error}</p>}

          <button
            disabled={loading}
            className='w-full bg-emerald-600 text-white py-2.5 rounded-lg disabled:opacity-60'
          >
            {loading ? "Signing in..." : "Login"}
          </button>

          <div className='my-4 text-center text-sm text-gray-400'>OR</div>

          <GoogleLogin
            onSuccess={(res) => handleGoogleLogin(res.credential)}
            onError={() => toast.error("Google sign-in failed")}
          />
        </form>
      </div>
    </div>
  );
}
