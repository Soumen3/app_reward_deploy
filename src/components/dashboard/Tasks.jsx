import React, { useEffect, useState } from "react";
import { getUserData, refreshToken, fetchUndoneTasks } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const Tasks = ({ onEarnClick }) => {
    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);
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
                    fetchTasks(token, response.data);
                })
                .catch(async (error) => {
                    if (error.response && error.response.status === 401) {
                        try {
                            const response = await refreshToken(refresh);
                            localStorage.setItem("access_token", response.data.access);
                            getUserData(response.data.access)
                                .then(response => {
                                    setUser(response.data);                                    
                                    fetchTasks(response.data.access, response.data);
                                })
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

    const fetchTasks = async (token, user) => {
        try {            
            const response = await fetchUndoneTasks(token, user);
            setTasks(response.data);
            console.log(response.data);
            
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Available Tasks</h2>
            <div className="bg-gray-800 p-4 rounded shadow-md">
                <ul className="space-y-4">
                    {tasks.map((task, index) => (
                        <li key={index} className="border p-4 rounded shadow flex justify-between items-center bg-gray-700">
                            <div className="flex items-center">
                                {task.logo && <img src={`https://appreward.pythonanywhere.com${task.logo}`} alt="App Logo" className="w-12 h-12 object-cover mr-4" />}
                                <div>
                                    <p className="font-bold">{task.name}</p>
                                    <p>{task.points} Points</p>
                                </div>
                            </div>
                            <button
                                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                                onClick={() => onEarnClick(task)}
                            >
                                Earn
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Tasks;
