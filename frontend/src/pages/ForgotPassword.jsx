import { useState } from "react";
import axios from "axios";

function ForgotPassword() {

  const [email, setEmail] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [mailSent, setMailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );

      setMailSent(true);

    } catch (error) {

      setDialogMessage(
        error.response?.data?.message || "Error occurred"
      );

      setDialogOpen(true);
    }
  };

  if (mailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2>Please check your inbox</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="bg-white p-8 rounded shadow w-96">

        <h2 className="text-xl font-semibold mb-6">
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border px-3 py-2 mb-4"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          <button
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Send Reset Link
          </button>

        </form>

      </div>

      {dialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">

          <div className="bg-white p-6 rounded text-center">

            <p className="mb-4">{dialogMessage}</p>

            <button
              onClick={()=>setDialogOpen(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default ForgotPassword;