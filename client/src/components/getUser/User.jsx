import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import "./user.css";
import { API_LINK } from "../../utility/config";

import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";

export default function User() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // Get current user info from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  // Fetch user-specific data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(`${API_LINK}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsers(response.data);
      } catch (error) {
        // console.log("Error while fetching data", error);
        toast.error("Failed to fetch users!", { position: "top-right" });

        // If token is invalid, redirect to login
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
      }
    };
    fetchData();
  }, [navigate]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully!", { position: "top-right" });
    navigate("/login");
  };

  // Delete User data with authentication
  const deleteUser = async (userID) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:8000/api/users/${userID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove user from the list
      setUsers((prevUser) => prevUser.filter((user) => user._id !== userID));
      toast.success("User deleted successfully!✅", { position: "top-right" });
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        toast.error("Error deleting user!", { position: "top-right" });
      }
    }
  };

  return (
    <>
      {/* Navbar */}
      <Navbar currentUser={currentUser} onClick={handleLogout} />
      <div className="container">
        <div className="user-dashboard">
          {/* Main Content */}
          <div className="userTable">
            <div className="dashboard-header">
              <h2>📊 Your Personal Data Dashboard</h2>
              <Link to="/add" className="btn">
                Add User <i className="fa-solid fa-user-plus"></i>
              </Link>
            </div>

            {/* Conditional Rendering */}
            {users.length === 0 ? (
              <div className="table">
                <h3>No Data to display!</h3>
                <p className="para">Please add New User👤</p>
              </div>
            ) : (
              <>
                {/* Table heading */}
                <table className="table">
                  <thead>
                    <tr>
                      <th className="heading" scope="col">
                        S.No.
                      </th>
                      <th className="heading" scope="col">
                        Name
                      </th>
                      <th className="heading" scope="col">
                        Email
                      </th>
                      <th className="heading" scope="col">
                        Address
                      </th>
                      <th className="heading" scope="col">
                        Action
                      </th>
                    </tr>
                  </thead>

                  {/* Table body data */}
                  <tbody>
                    {users.map((user, index) => {
                      return (
                        <tr className="table-row" key={user.email}>
                          <td className="data">{index + 1}</td>
                          <td className="data">{user.name}</td>
                          <td className="data">{user.email}</td>
                          <td className="data">{user.address}</td>
                          <td className="data">
                            <div className="action-box">
                              {/* ROUTE THE UPDATE USER_ID  */}
                              <Link
                                to={`/update/` + user._id}
                                className="action-btn"
                                style={{
                                  background: "lightGreen",
                                  textDecoration: "none",
                                  color: "#000",
                                }}
                                type="button"
                              >
                                <i className="fa-solid fa-pen-to-square"></i>
                              </Link>
                              |
                              <Button
                                className="action-btn"
                                style={{ background: "red" }}
                                type="button"
                                onClick={() => deleteUser(user._id)}
                              >
                                <i className="fa-solid fa-trash"></i>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
        <Footer
          style={{
            marginTop: "2rem",
            padding: "1rem",
            borderTop: "1px solid #ccc",
            fontWeight: 700,
          }}
        >
          <p>
            <a
              style={{ color: "blue" }}
              href="mailto:apurbadutta2099@gmail.com"
            >
              apurbadutta
            </a>
            ©{new Date().getFullYear()}. All rights reserved.
          </p>
        </Footer>
      </div>
    </>
  );
}

export function Button({
  children,
  className,
  style,
  type = "button",
  onClick,
}) {
  return (
    <button style={style} className={className} type={type} onClick={onClick}>
      {children}
    </button>
  );
}
