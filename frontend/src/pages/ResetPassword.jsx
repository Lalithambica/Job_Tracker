import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function ResetPassword() {

  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setDialogMessage("Passwords do not match");
      setDialogOpen(true);
      return;
    }

    try {

      await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { password }
      );

      setDialogMessage("Password reset successful");
      setDialogOpen(true);

    } catch (error) {

      setDialogMessage(
        error.response?.data?.message || "Reset failed"
      );

      setDialogOpen(true);
    }
  };

  return (
    <>

      <div className="min-h-screen flex items-center justify-center">

        <div className="bg-white p-8 shadow rounded w-96">

          <h2 className="text-xl font-semibold mb-6">
            Reset Password
          </h2>

          <form onSubmit={handleSubmit}>

            <input
              type="password"
              placeholder="New password"
              className="w-full border px-3 py-2 mb-4"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm password"
              className="w-full border px-3 py-2 mb-4"
              value={confirmPassword}
              onChange={(e)=>setConfirmPassword(e.target.value)}
            />

            <button className="w-full bg-blue-500 text-white py-2 rounded">
              Reset Password
            </button>

          </form>

        </div>

      </div>

      {dialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">

          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">

            <h3 className="text-lg font-semibold mb-4">
              Reset Password
            </h3>

            <p className="text-gray-600 mb-6">
              {dialogMessage}
            </p>

            <button
              onClick={() => {
                setDialogOpen(false);
                navigate("/");
              }}
            >
              Go to Login
            </button>

          </div>

        </div>
      )}

    </>
  );
}

export default ResetPassword;