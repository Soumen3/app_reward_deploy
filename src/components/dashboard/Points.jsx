import React, { useEffect, useState } from "react";
import { getUserData, refreshToken } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const Points = () => {
    const [user, setUser] = useState(null);
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

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div className="p-4 bg-gray-900 text-white">
            <h2 className="text-2xl font-bold mb-4">Points</h2>
            <p>Track your points and see how much you've earned!</p>
            <p className="mt-4">
                Points are awarded for completing tasks. The more tasks you complete, the more points you earn. Use your points to redeem rewards and enjoy the benefits of your hard work.
            </p>
            <p className="mt-4">
                Keep an eye on this section to monitor your progress and stay motivated. Your total points and recent activities will be displayed here.
            </p>
            <div className="mt-8">
                <h3 className="text-4xl font-bold">Total Points: {user.total_points}</h3>
            </div>
            <div className="mt-8">
                <h3 className="text-2xl font-bold mb-4">Tasks Completed</h3>
                <ul className="list-disc list-inside">
                    {user.tasks_completed.map((task, index) => (
                        <li key={index} className="mb-4 flex justify-between items-center">
                            <div className="flex items-center">
                                {task.app.logo && <img src={`https://appreward.pythonanywhere.com${task.app.logo}`} alt="App Logo" className="w-12 h-12 object-cover mr-4" />}
                                <div>
                                    <p><strong>App Name:</strong> {task.app.name}</p>
                                    <p><strong>Points:</strong> {task.app.points}</p>
                                </div>
                            </div>
                            <img src={`https://appreward.pythonanywhere.com${task.screenshot}`} alt="Screenshot" className="w-32 h-32 object-cover" />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Points;
