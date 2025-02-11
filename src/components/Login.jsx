import { useState, useEffect } from "react";
import { loginUser } from "../utils/api";
import { useNavigate } from "react-router-dom";
import React from "react";

const Login = () => {
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const navigate = useNavigate();
    const [isMounted, setIsMounted] = useState(false);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser(credentials);
            localStorage.setItem("access_token", response.data.token.access);
            localStorage.setItem("refresh_token", response.data.token.refresh);
            if (response.data.is_admin) {
                navigate("/admin");
            } else {
                navigate("/dashboard");
            }
        } catch (error) {
            alert("Login failed. Please try again.");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
            <div className="bg-gray-800 p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="username" placeholder="Username" className="w-full p-2 border rounded bg-gray-700 text-white" onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Password" className="w-full p-2 border rounded bg-gray-700 text-white" onChange={handleChange} required />
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Login</button>
                </form>
                <p className="text-center mt-4 text-gray-400">
                    Don't have an account? <a href="/" className="text-blue-500">Sign Up</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
