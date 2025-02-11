import { useEffect, useState } from "react";
import { getUserData, refreshToken } from "../utils/api";
import { useNavigate } from "react-router-dom";
import React from "react";
import Home from "./dashboard/Home";
import Points from "./dashboard/Points";
import Tasks from "./dashboard/Tasks";
import Profile from "./dashboard/Profile";
import CompleteTask from "./dashboard/CompleteTask";
import { CurrencyDollarIcon, HomeIcon, ClipboardDocumentListIcon, UserIcon } from '@heroicons/react/24/solid'

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [activeWindow, setActiveWindow] = useState("home");
    const [selectedTask, setSelectedTask] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        const refresh = localStorage.getItem("refresh_token");

        if (!token || !refresh) {
            navigate("/login");
        } else {
            getUserData(token)
                .then(response => {
                    setUser(response.data);
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
    }, [navigate]);

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/login");
    };

    const handleEarnClick = (task) => {
        setSelectedTask(task);
        setActiveWindow("completeTask");
    };

    const renderContent = () => {
        switch (activeWindow) {
            case "home":
                return <Home />;
            case "points":
                return <Points />;
            case "tasks":
                return <Tasks onEarnClick={handleEarnClick} />;
            case "profile":
                return <Profile />;
            case "completeTask":
                return <CompleteTask task={selectedTask} setActiveWindow={setActiveWindow} />;
            default:
                return <Home />;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-900 text-white">
            <div className="w-1/7 bg-gray-800 p-4 flex flex-col items-center">
                <div className="flex flex-col items-center fixed">
                    <button className="w-20 mb-2 p-2 bg-blue-500 text-white rounded flex items-center justify-center" onClick={() => setActiveWindow("home")}>
                        <HomeIcon className="w-5 h-5 mr-2" />
                        Home
                    </button>
                    <button className="w-20 mb-2 p-2 bg-blue-500 text-white rounded flex items-center justify-center" onClick={() => setActiveWindow("points")}>
                        <CurrencyDollarIcon className="w-5 h-5 mr-2" />
                        Points
                    </button>
                    <button className="w-20 mb-2 p-2 bg-blue-500 text-white rounded flex items-center justify-center" onClick={() => setActiveWindow("tasks")}>
                        <ClipboardDocumentListIcon className="w-5 h-5 mr-2" />
                        Tasks
                    </button>
                    <button className="w-20 mb-2 p-2 bg-blue-500 text-white rounded flex items-center justify-center" onClick={() => setActiveWindow("profile")}>
                        <UserIcon className="w-5 h-5 mr-2" />
                        Profile
                    </button>
                    <button className="w-20 mb-2 p-2 bg-red-500 text-white rounded flex items-center justify-center" onClick={logout}>
                        Logout
                    </button>
                </div>
            </div>
            <div className="w-6/7 p-4">
                {renderContent()}
            </div>
        </div>
    );
};

export default Dashboard;
