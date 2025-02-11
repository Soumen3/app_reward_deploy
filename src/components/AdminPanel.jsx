import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllApps, getUserData, refreshToken, createApp } from "../utils/api";

const AdminPanel = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [apps, setApps] = useState([]);
    const [name, setName] = useState("");
    const [link, setLink] = useState("");
    const [category, setCategory] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [points, setPoints] = useState(0);
    const [logo, setLogo] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        const refresh = localStorage.getItem("refresh_token");

        if (!token || !refresh) {
            navigate("/login");
        } else {
            getUserData(token)
                .then(response => {
                    setUser(response.data);
                    if (!response.data.is_admin) {
                        navigate("/dashboard");
                    }
                })
                .catch(async (error) => {
                    if (error.response && error.response.status === 401) {
                        try {
                            const response = await refreshToken(refresh);
                            localStorage.setItem("access_token", response.data.access);
                            getUserData(response.data.access)
                                .then(response => setUser(response.data))
                                .catch(() => navigate("/login"));
                        } catch (refreshError) {
                            navigate("/login");
                        }
                    } else {
                        navigate("/login");
                    }
                });
        }

        fetchApps();
    }, [navigate]);

    const fetchApps = async () => {
        try {
            const response = await fetchAllApps();
            setApps(response.data.apps);
        } catch (error) {
            console.error("Error fetching apps:", error);
        }
    };

    const handleFileChange = (e) => {
        setLogo(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("access_token");
        const formData = new FormData();
        formData.append("name", name);
        formData.append("link", link);
        formData.append("category", category);
        formData.append("sub_category", subCategory);
        formData.append("points", points);
        formData.append("logo", logo);

        try {
            const response = await createApp(token, formData);
            console.log("App created:", response.data);
            fetchApps();
            e.target.reset();
        } catch (error) {
            console.error("Error creating app:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("access_token");
            await axios.delete(`https://appreward.pythonanywhere.com/api/admin/apps/delete/${id}/`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });
            fetchApps();
        } catch (error) {
            console.error("Error deleting app:", error);
        }
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/login");
    };

    return (
        <div className="bg-gray-700 mx-auto p-8 text-white min-h-screen">
            <div className="flex justify-between items-center mb-4">
                <div className="w-1/2">
                    <h1 className="text-3xl font-bold mb-4">Admin Panel - Manage Apps</h1>
                    <h2 className="text-xl font-semibold mb-4">Welcome, {user && user.username}</h2>
                </div>
                <button onClick={logout} className="w-fit mt-4 p-4 bg-red-500 text-white py-2 rounded hover:bg-red-600">Logout</button>
            </div>

            <form onSubmit={handleSubmit} className="mb-4 p-4 bg-gray-800 shadow rounded flex flex-wrap gap-2">
                <input type="text" name="name" placeholder="App Name" className="border rounded-lg p-2 flex-1 bg-gray-700 text-white" onChange={(e) => setName(e.target.value)} required />
                <input type="url" name="link" placeholder="App Link" className="border rounded-lg p-2 flex-1 bg-gray-700 text-white" onChange={(e) => setLink(e.target.value)} required />
                <input type="text" name="category" placeholder="Category" className="border rounded-lg p-2 flex-1 bg-gray-700 text-white" onChange={(e) => setCategory(e.target.value)} required />
                <input type="text" name="sub_category" placeholder="Sub-category" className="border rounded-lg p-2 flex-1 bg-gray-700 text-white" onChange={(e) => setSubCategory(e.target.value)} required />
                <input type="number" name="points" placeholder="Points" className="border rounded-lg p-2 w-24 bg-gray-700 text-white" onChange={(e) => setPoints(e.target.value)} required />
                <input type="file" name="logo" className="border rounded-lg p-2 w-full bg-gray-700 text-white" onChange={handleFileChange} />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add App</button>
            </form>

            <ul className="bg-gray-800 p-4 rounded">
                {apps.map((app) => (
                    <li key={app.id} className="flex justify-between items-center p-2 bg-gray-700 shadow mb-2 rounded">
                        <div className="flex items-center">
                            {app.logo && <img src={`https://appreward.pythonanywhere.com${app.logo}`} alt="App Logo" className="w-12 h-12 object-cover mr-4" />}
                            <span>{app.name} - {app.points} Points</span>
                        </div>
                        <button onClick={() => handleDelete(app.id)} className="bg-red-500 text-white p-1 rounded">Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminPanel;
