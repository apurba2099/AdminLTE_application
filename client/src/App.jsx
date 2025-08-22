import React from "react";
import User from "./components/getUser/User";
import AddUser from "./components/addUser/AddUser";
import UpdateUser from "./components/updateUser/UpdateUser";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // If no token, redirect to login
    window.location.href = "/login";
    return null;
  }

  return children;
};

export default function App() {
  //Routing the client side
  const route = createBrowserRouter([
    {
      path: "/",
      element: <Login />, // Start with login page
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <User />
        </ProtectedRoute>
      ),
    },
    {
      path: "/add",
      element: (
        <ProtectedRoute>
          <AddUser />
        </ProtectedRoute>
      ),
    },
    {
      path: "/update/:id",
      element: (
        <ProtectedRoute>
          <UpdateUser />
        </ProtectedRoute>
      ),
    },
  ]);

  return (
    <>
      <RouterProvider router={route}></RouterProvider>
    </>
  );
}
