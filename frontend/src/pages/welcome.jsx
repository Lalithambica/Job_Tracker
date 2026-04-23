import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import loginImage from "../images/login.jpg";


function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      setDialogMessage(message);
      setDialogOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT SIDE */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-200 to-blue-300 text-white flex-col justify-between p-10">
        
        <h1 className="text-2xl font-bold text-blue-600">
          Job Tracker
        </h1>

        <div className="flex justify-center items-center flex-1">
          <img
            src={loginImage}
            alt="Login Illustration"
            className="w-3/4"
          />
        </div>

      </div>


      {/* RIGHT SIDE */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white">

        <div className="w-full max-w-md p-8">

          <h2 className="text-3xl font-semibold mb-6">
            Welcome!
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block mb-1 text-gray-600">
                Email
              </label>
              <input
                type="email"
                className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-1 text-gray-600">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full border rounded px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 text-gray-500"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right text-sm">
              <Link
                to="/forgot-password"
                className="text-blue-500 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
            >
              Login
            </button>

          </form>

          {/* Sign Up */}
          <p className="mt-6 text-sm text-center text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signUp"
              className="text-blue-500 hover:underline"
            >
              Sign Up
            </Link>
          </p>

        </div>
      </div>

      {dialogOpen &&(
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">

          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">

            <h3 className="text-lg font-semibold mb-4">Login Error</h3>

            <p className="text-gray-600 mb-6">
              {dialogMessage}
            </p>

            <button
              onClick={() => setDialogOpen(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default Login;