import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");


  const passwordMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordMismatch) return;

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        dob,
        password,
      });

      navigate("/");
    } catch (error) {
      const message = error.response?.data?.message || "SignUp failed";

      setDialogMessage(message);
      setDialogOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-blue-200 relative flex items-center justify-center">

      {/* Top Left Logo */}
      <h1 className="absolute top-6 left-8 text-2xl font-bold text-blue-700">
        Job Tracker
      </h1>

      {/* Signup Card */}
      <div className="bg-white w-full max-w-md p-8 rounded shadow-lg">

        <h2 className="text-2xl font-semibold mb-6 text-center">
          Sign Up
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <div>
            <label className="text-sm text-gray-600">Name</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 mt-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2 mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* DOB */}
          <div>
            <label className="text-sm text-gray-600">DOB</label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2 mt-1"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-600">Password</label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full border rounded px-3 py-2 mt-1 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                👁️
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm text-gray-600">
              Confirm Password
            </label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2 mt-1"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              required
            />

            {passwordMismatch && (
              <p className="text-red-500 text-sm mt-1">
                Passwords do not match
              </p>
            )}
          </div>

          {/* Create Account */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
            disabled={passwordMismatch}
          >
            Create Account
          </button>

        </form>

        {/* Login Link */}
        <p className="text-sm text-center mt-6">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-blue-500 hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
      {dialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">

          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">

            <h3 className="text-lg font-semibold mb-4">
              Signup Error
            </h3>

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

export default Signup;