import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ProjectDetail from "./pages/ProjectDetail";
import Search from "./pages/Search";


function App() {
  const { token, setToken, setUser } = useContext(AuthContext);

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <Router>
      {/* Navigation */}
      <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div className="flex gap-4">
          <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
          <Link to="/projects" className="hover:text-gray-300">Projects</Link>
          <Link to="/search">Search</Link>
        </div>
        <div className="flex gap-4">
          {token ? (
            <button 
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300">Login</Link>
              <Link to="/register" className="hover:text-gray-300">Register</Link>
            </>
          )}
        </div>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/" 
          element={<Navigate to="/dashboard" replace />} 
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/projects/:id" 
          element={
            <ProtectedRoute>
              <ProjectDetail />
            </ProtectedRoute>
          } 
        />
        <Route path="/search" element={<Search />} />
      </Routes>
    </Router>
  );
}

export default App;