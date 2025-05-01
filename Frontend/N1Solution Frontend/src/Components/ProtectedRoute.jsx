import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== role) {
        return <Navigate to="/" replace />; // Redirect to home if not authorized
    }

    return children;
};

export default ProtectedRoute;