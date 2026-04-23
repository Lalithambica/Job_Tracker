import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { SearchContext } from "../context/SearchContext";
import { useNavigate } from "react-router-dom";

function Navbar({ setSidebarOpen }) {
  const { user, logout } = useContext(AuthContext);

  const searchContext = useContext(SearchContext);
  const searchQuery = searchContext?.searchQuery || "";
  const setSearchQuery = searchContext?.setSearchQuery || (() => {});

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="h-16 bg-white shadow flex items-center justify-between px-6">

      {/* LEFT - Hamburger + Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-2xl p-2 rounded-lg 
           hover:bg-blue-100 
           hover:text-blue-600 
           transition-all duration-200 
           hover:scale-105"
        >
          ☰
        </button>

        <h3 
        onClick={() => navigate("/dashboard")}
        className="text-lg font-semibold cursor-pointer hover:text-blue-600 transition">
          JobTracker
        </h3>
      </div>

      {/* CENTER - Search */}
      <div className="flex-1 px-10">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* RIGHT - User + Logout */}
      <div className="flex items-center gap-4">
        <span className="text-gray-600">{user?.name}</span>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

    </div>
  );
}

export default Navbar;