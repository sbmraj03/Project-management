import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { registerUser } from "../utils/api";

export default function Register() {
  const { setToken, setUser } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await registerUser(form.name, form.email, form.password);
    if (data.token) {
      setToken(data.token);
      setUser(data.user);
    } else {
      alert(data.message || "Error registering");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <input
          className="border p-2 w-full mb-2"
          placeholder="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          className="border p-2 w-full mb-2"
          placeholder="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          className="border p-2 w-full mb-4"
          type="password"
          placeholder="Password"
          name="password"
          value={form.password}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          Register
        </button>
      </form>
    </div>
  );
}
