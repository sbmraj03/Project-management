import { useEffect, useState, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { io } from "socket.io-client";

export default function ProjectDetail() {
    const { id } = useParams();
    const { token } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const socketRef = useRef(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        if (id) {
            // Create socket connection only once
            if (!socketRef.current) {
                socketRef.current = io("http://localhost:5000");
            }

            const socket = socketRef.current;
            
            socket.emit("joinProject", id);

            socket.on("taskUpdated", (task) => {
                console.log("🔄 Task updated:", task);
                fetchTasks();
            });

            socket.on("taskCreated", () => fetchTasks());
            socket.on("taskDeleted", () => fetchTasks());
            socket.on("commentAdded", () => fetchTasks());

            return () => {
                socket.emit("leaveProject", id);
                socket.off("taskUpdated");
                socket.off("taskCreated");
                socket.off("taskDeleted");
                socket.off("commentAdded");
            };
        }
    }, [id]);

    // Cleanup socket on component unmount
    useEffect(() => {
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const createTask = async (e) => {
        e.preventDefault();
        try {
            await fetch('http://localhost:5000/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ projectId: id, title })
            });
            setTitle("");
            fetchTasks();
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    const updateTask = async (taskId, updates) => {
        try {
            await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(updates)
            });
            fetchTasks();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const deleteTask = async (taskId) => {
        try {
            await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const addComment = async (taskId, text) => {
        try {
            await fetch(`http://localhost:5000/api/tasks/${taskId}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ text })
            });
            fetchTasks();
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Project Tasks</h1>

            {/* Add Task Form */}
            <form onSubmit={createTask} className="flex gap-2 mb-6">
                <input
                    type="text"
                    placeholder="Task title"
                    className="border rounded p-2 flex-1"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded">
                    Add
                </button>
            </form>

            {/* Task List */}
            <div className="space-y-3">

                {tasks.map((task) => (
                    <div key={task._id} className="border rounded p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h2 className="font-semibold text-lg">{task.title}</h2>
                                <p className="text-sm text-gray-500">Status: {task.status}</p>
                                {task.description && (
                                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <select
                                    value={task.status}
                                    onChange={(e) => updateTask(task._id, { status: e.target.value })}
                                    className="border rounded px-2 py-1 text-sm"
                                >
                                    <option value="ToDo">ToDo</option>
                                    <option value="InProgress">InProgress</option>
                                    <option value="Done">Done</option>
                                </select>
                                <button
                                    onClick={() => deleteTask(task._id)}
                                    className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="border-t pt-3">
                            <h4 className="text-sm font-medium mb-2">Comments:</h4>
                            {task.comments?.map((c) => (
                                <p key={c._id} className="text-sm text-gray-600 mb-1">
                                    💬 {c.text}
                                </p>
                            ))}

                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const text = e.target.comment.value;
                                    if (text) addComment(task._id, text);
                                    e.target.reset();
                                }}
                                className="flex gap-2 mt-2"
                            >
                                <input
                                    name="comment"
                                    placeholder="Add comment"
                                    className="border rounded p-1 flex-1 text-sm"
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                                >
                                    Post
                                </button>
                            </form>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}


