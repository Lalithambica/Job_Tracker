import { Link } from "react-router-dom";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-20 transform transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Close Button */}
      <div className="flex justify-end p-4">
        <button
          onClick={() => setSidebarOpen(false)}
          className="text-xl p-2 rounded-lg 
           hover:bg-red-400 
           hover:text-black 
           transition-all duration-200 
           hover:scale-105"
        >
          ✕
        </button>
      </div>

      <nav className="px-6 mt-6 space-y-8 text-lg">
        <Link
          to="/dashboard"
          onClick={() => setSidebarOpen(false)}
          className="block hover:text-blue-600 transition"
        >
          Dashboard
        </Link>

        <Link
          to="/applications"
          onClick={() => setSidebarOpen(false)}
          className="block hover:text-blue-600 transition"
        >
          Applications
        </Link>

        <Link
          to="/interviews"
          onClick={() => setSidebarOpen(false)}
          className="block hover:text-blue-600 transition"
        >
          Interviews
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;