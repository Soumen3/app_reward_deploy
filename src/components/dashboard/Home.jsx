import React from "react";

const Home = () => {
    return (
        <div className="p-4 bg-gray-900 text-white">
            <h2 className="text-2xl font-bold mb-4">Home</h2>
            <p>Welcome to the Social Rewards Dashboard!</p>
            <p className="mt-4">
                Here you can manage your tasks, view your points, and update your profile. Use the navigation menu on the left to access different sections of the dashboard.
            </p>
            <p className="mt-4">
                Complete tasks to earn points and redeem them for rewards. Keep track of your progress and stay motivated!
            </p>
        </div>
    );
};

export default Home;
