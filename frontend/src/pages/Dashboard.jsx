import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { fetchProjects, createProject } from "../utils/api";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
    const { user, token } = useContext(AuthContext);
    const [projects, setProjects] = useState([]);
    const [dashboardData, setDashboardData] = useState(null);
    const [newProject, setNewProject] = useState({
        title: "",
        description: "",
        deadline: "",
    });

    useEffect(() => {
        async function loadDashboardData() {
            try {
                // Load projects
                const projectsData = await fetchProjects(token);
                setProjects(projectsData);

                // Load dashboard data (projects, tasks, status counts)
                const response = await fetch('http://localhost:5000/api/projects/dashboard', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('Dashboard data loaded:', data);
                setDashboardData(data);
            } catch (error) {
                console.error('Error loading dashboard data:', error);
                // Set empty data structure to prevent blank screen
                setDashboardData({
                    projects: [],
                    tasks: [],
                    statusCounts: { ToDo: 0, InProgress: 0, Done: 0 }
                });
            }
        }
        
        if (token) {
            loadDashboardData();
        }
    }, [token]);

    const handleCreate = async (e) => {
        e.preventDefault();
        const data = await createProject(token, newProject);
        if (data._id) {
            setProjects([...projects, data]);
            setNewProject({ title: "", description: "", deadline: "" });
            // Reload dashboard data to include new project
            window.location.reload();
        } else {
            alert(data.message || "Error creating project");
        }
    };

    if (!token) {
        return <div className="p-6">Please log in to view the dashboard.</div>;
    }

    if (!dashboardData) {
        return <div className="p-6">Loading dashboard...</div>;
    }

    // Chart data
    const chartData = {
        labels: ["ToDo", "InProgress", "Done"],
        datasets: [
            {
                data: [
                    dashboardData.statusCounts.ToDo,
                    dashboardData.statusCounts.InProgress,
                    dashboardData.statusCounts.Done,
                ],
                backgroundColor: ["#f87171", "#60a5fa", "#34d399"], // red, blue, green
                borderWidth: 2,
                borderColor: "#fff",
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
        },
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <p className="mb-6">Welcome, <span className="font-semibold">{user?.name}</span></p>

            {/* Create Project Form */}
            <form
                onSubmit={handleCreate}
                className="bg-white shadow p-4 rounded-lg mb-6 w-full max-w-md"
            >
                <h2 className="text-lg font-semibold mb-2">Create New Project</h2>
                <input
                    className="border p-2 w-full mb-2"
                    placeholder="Title"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                />
                <textarea
                    className="border p-2 w-full mb-2"
                    placeholder="Description"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
                <input
                    type="date"
                    className="border p-2 w-full mb-2"
                    value={newProject.deadline}
                    onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                />
                <button className="bg-blue-500 text-white px-4 py-2 rounded w-full">
                    Create Project
                </button>
            </form>

            {/* Dashboard Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Projects Section */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">My Projects</h2>
                    <div className="space-y-2">
                        {dashboardData.projects.map((project) => (
                            <div key={project._id} className="border rounded p-3 hover:bg-gray-50">
                                <Link 
                                    to={`/projects/${project._id}`}
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    {project.title}
                                </Link>
                                <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                                <p className="text-xs text-gray-500">
                                    Owner: {project.owner?.name || "Unknown"}
                                </p>
                            </div>
                        ))}
                        {dashboardData.projects.length === 0 && (
                            <p className="text-gray-500">No projects yet. Create one above!</p>
                        )}
                    </div>
                </div>

                {/* Pending Tasks Section */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Pending Tasks</h2>
                    <div className="space-y-2">
                        {dashboardData.tasks
                            .filter((task) => task.status !== "Done")
                            .slice(0, 5)
                            .map((task) => (
                                <div key={task._id} className="border rounded p-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-medium">{task.title}</p>
                                            <p className="text-sm text-gray-600">
                                                Project: {task.project?.title || "Unknown"}
                                            </p>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs ${
                                            task.status === "ToDo" ? "bg-red-100 text-red-800" :
                                            task.status === "InProgress" ? "bg-blue-100 text-blue-800" :
                                            "bg-green-100 text-green-800"
                                        }`}>
                                            {task.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        {dashboardData.tasks.filter((task) => task.status !== "Done").length === 0 && (
                            <p className="text-gray-500">No pending tasks!</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Chart Section */}
            <div className="mt-6 bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Task Status Overview</h2>
                <div className="flex justify-center">
                    <div className="w-64 h-64">
                        <Pie data={chartData} options={chartOptions} />
                    </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                    <div className="bg-red-50 p-3 rounded">
                        <div className="text-2xl font-bold text-red-600">{dashboardData.statusCounts.ToDo}</div>
                        <div className="text-sm text-red-800">ToDo</div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded">
                        <div className="text-2xl font-bold text-blue-600">{dashboardData.statusCounts.InProgress}</div>
                        <div className="text-sm text-blue-800">In Progress</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                        <div className="text-2xl font-bold text-green-600">{dashboardData.statusCounts.Done}</div>
                        <div className="text-sm text-green-800">Done</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
