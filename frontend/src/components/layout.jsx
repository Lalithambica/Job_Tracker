import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useState } from "react";

function Layout({ children }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-gray-100 relative">

      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Blur Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 backdrop-blur-sm bg-black/20 z-10"
        />
      )}

      {/* Main Content */}
      <div className="flex flex-col h-full">
        <Navbar setSidebarOpen={setSidebarOpen} />
        <main className="p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;