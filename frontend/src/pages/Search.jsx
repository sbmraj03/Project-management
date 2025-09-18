import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Search() {
  const { token } = useContext(AuthContext);
  const [filters, setFilters] = useState({
    q: "",
    status: "",
    priority: "",
  });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    if (!token) {
      setError("Please log in to search tasks");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      // Only add non-empty parameters
      if (filters.q) params.append('q', filters.q);
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      
      const url = `http://localhost:5000/api/tasks/search?${params}`;
      console.log('Search URL:', url);
      console.log('Search params:', params.toString());
      
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Search results:', data);
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to fetch tasks. Please try again.');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      // Don't auto-fetch on mount, let user search manually
      console.log('Token available:', !!token);
    }
  }, [token]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchTasks();
  };

  if (!token) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Search Tasks</h1>
        <p className="text-gray-600">Please log in to search tasks.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Search Tasks</h1>

      {/* Test Connection */}
      <div className="mb-4">
        <button 
          onClick={async () => {
            try {
              const response = await fetch('http://localhost:5000/api/projects', {
                headers: { Authorization: `Bearer ${token}` }
              });
              console.log('Test API response:', response.status);
              if (response.ok) {
                const data = await response.json();
                console.log('Projects found:', data.length);
                alert(`API working! Found ${data.length} projects.`);
              } else {
                alert(`API error: ${response.status}`);
              }
            } catch (error) {
              console.error('Test API error:', error);
              alert('API connection failed: ' + error.message);
            }
          }}
          className="bg-green-600 text-white px-4 py-2 rounded mr-2"
        >
          Test Projects API
        </button>
        
        <button 
          onClick={async () => {
            try {
              console.log('Testing search API...');
              const response = await fetch('http://localhost:5000/api/tasks/search?q=book', {
                headers: { Authorization: `Bearer ${token}` }
              });
              console.log('Search API response:', response.status);
              if (response.ok) {
                const data = await response.json();
                console.log('Search results:', data);
                alert(`Search API working! Found ${data.length} tasks.`);
              } else {
                const errorText = await response.text();
                console.error('Search API error:', response.status, errorText);
                alert(`Search API error: ${response.status} - ${errorText}`);
              }
            } catch (error) {
              console.error('Search API error:', error);
              alert('Search API failed: ' + error.message);
            }
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
        >
          Test Search API
        </button>
      </div>

      {/* Filters */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          name="q"
          placeholder="Search keyword..."
          value={filters.q}
          onChange={handleChange}
          className="border rounded p-2 flex-1"
        />
        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="border rounded p-2"
        >
          <option value="">All Status</option>
          <option value="ToDo">ToDo</option>
          <option value="InProgress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        <select
          name="priority"
          value={filters.priority}
          onChange={handleChange}
          className="border rounded p-2"
        >
          <option value="">All Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button 
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 rounded disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-4">
          <p className="text-gray-600">Searching tasks...</p>
        </div>
      )}

      {/* Results */}
      {!loading && !error && (
        <div>
          <h2 className="text-lg font-semibold mb-2">
            Results ({tasks.length} tasks found)
          </h2>
          {tasks.length === 0 ? (
            <p className="text-gray-600">No tasks found matching your criteria.</p>
          ) : (
            <ul className="space-y-2">
              {tasks.map((t) => (
                <li key={t._id} className="border p-3 rounded hover:bg-gray-50">
                  <h3 className="font-semibold text-lg">{t.title}</h3>
                  {t.description && (
                    <p className="text-sm text-gray-600 mt-1">{t.description}</p>
                  )}
                  <div className="flex gap-4 mt-2 text-sm">
                    <span className="text-gray-600">
                      Project: <span className="font-medium">{t.project?.title || "Unknown"}</span>
                    </span>
                    <span className="text-gray-600">
                      Assignee: <span className="font-medium">{t.assignee?.name || "Unassigned"}</span>
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      t.status === "ToDo" ? "bg-red-100 text-red-800" :
                      t.status === "InProgress" ? "bg-blue-100 text-blue-800" :
                      "bg-green-100 text-green-800"
                    }`}>
                      {t.status}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      t.priority === "High" ? "bg-red-100 text-red-800" :
                      t.priority === "Medium" ? "bg-yellow-100 text-yellow-800" :
                      "bg-green-100 text-green-800"
                    }`}>
                      {t.priority || "No Priority"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
