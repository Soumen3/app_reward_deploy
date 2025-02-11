import React, { useState } from "react";
import { uploadTask } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const CompleteTask = ({ task, setActiveWindow }) => {
    const [screenshot, setScreenshot] = useState(null);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setScreenshot(e.target.files[0]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setScreenshot(e.dataTransfer.files[0]);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("access_token");
        const formData = new FormData();
        formData.append('screenshot', screenshot);

        try {
            const response = await uploadTask(token, task.id, formData);
            console.log("Task created:", response.data);
            setActiveWindow("profile");
        } catch (error) {
            console.error("Error creating task:", error);
            // Handle error (e.g., show an error message)
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Complete Task</h2>
            <div className="bg-gray-800 p-4 rounded shadow-md">
                <p><strong>Task Name:</strong> {task.name}</p>
                <p><strong>Points:</strong> {task.points}</p>
                <p><strong>Category:</strong> {task.category}</p>
                <p><strong>Sub-category:</strong> {task.sub_category}</p>
                <p><strong>Link:</strong> <a href={task.app_link} target="_blank" rel="noopener noreferrer" className="text-blue-500">{task.app_link}</a></p>
                <form onSubmit={handleSubmit} className="mt-4" encType="multipart/form-data">
                    <div
                        className="flex items-center justify-center w-full"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                    >
                        <label
                            htmlFor="dropzone-file"
                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600"
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg
                                    className="w-8 h-8 mb-4 text-gray-500"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 16"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                    />
                                </svg>
                                <p className="mb-2 text-sm text-gray-500">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">
                                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                                </p>
                            </div>
                            <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
                        </label>
                    </div>
                    {screenshot && (
                        <p className="mt-2 text-sm text-gray-500">
                            Selected file: {screenshot.name}
                        </p>
                    )}
                    <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-4">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CompleteTask;
