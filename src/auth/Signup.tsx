import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const navigate = useNavigate();
        const [form, setForm] = useState({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        });
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState("");
        const [success, setSuccess] = useState("");

        const onChange = (e) =>
            setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

        const validate = () => {
            setError("");
            if (!form.name.trim()) return "Name is required";
            if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Invalid email";
            if (form.password.length < 6) return "Password must be at least 6 characters";
            if (form.password !== form.confirmPassword) return "Passwords do not match";
            return null;
        };

        const onSubmit = async (e) => {
            e.preventDefault();
            const v = validate();
            if (v) {
                setError(v);
                return;
            }

            setLoading(true);
            setError("");
            setSuccess("");
            try {
                setSuccess("Account created successfully");
                setForm({ name: "", email: "", password: "", confirmPassword: "" });
                navigate("/login");
            } catch (err) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        return (
            <div className="max-w-md mx-auto my-8 p-5 border border-gray-300 rounded-lg">
                <h2 className="text-2xl font-bold mt-0 mb-4">Sign Up</h2>

                {error && <div className="text-white bg-red-500 p-2 rounded mb-3">{error}</div>}
                {success && <div className="text-white bg-green-500 p-2 rounded mb-3">{success}</div>}

                <form onSubmit={onSubmit}>
                    <div className="mb-3">
                        <label className="block mb-1.5 font-medium">Name</label>
                        <input name="name" value={form.name} onChange={onChange} required className="w-full p-2 border border-gray-300 rounded" />
                    </div>

                    <div className="mb-3">
                        <label className="block mb-1.5 font-medium">Email</label>
                        <input name="email" type="email" value={form.email} onChange={onChange} required className="w-full p-2 border border-gray-300 rounded" />
                    </div>

                    <div className="mb-3">
                        <label className="block mb-1.5 font-medium">Password</label>
                        <input name="password" type="password" value={form.password} onChange={onChange} required className="w-full p-2 border border-gray-300 rounded" />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1.5 font-medium">Confirm Password</label>
                        <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={onChange} required className="w-full p-2 border border-gray-300 rounded" />
                    </div>

                    <button type="submit" disabled={loading} className="px-4 py-2.5 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50">
                        {loading ? "Signing up..." : "Sign Up"}
                    </button>
                    <button type="button" onClick={() => navigate("/login")} disabled={loading} className="ml-2 px-4 py-2.5 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50">
                        Login
                    </button>
                </form>
            </div>
        );
    }
