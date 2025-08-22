import { useState, useEffect } from "react";
import "./adduser.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { API_LINK } from "../../utility/config";

export default function AddUser() {
  const [user, setUser] = useState({ name: "", email: "", address: "" });
  const navigate = useNavigate();

  // ✅ Check token on page load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first!", { position: "top-right" });
      navigate("/login");
    }
  }, [navigate]);

  // ✅ Input change handler
  function inputHandler(e) {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  }

  // ✅ Form submit function
  const submitFunction = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Unauthorized! Please login.", { position: "top-right" });
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(`${API_LINK}/users`, user, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Send token
        },
      });

      toast.success(response.data.message, { position: "top-right" });
      navigate("/dashboard");
    } catch (error) {
      const errMsg = error.response?.data?.message || "Something went wrong!";
      toast.error(errMsg, { position: "top-right" });
    }
  };

  return (
    <div className="center-box">
      <div className="addUser">
        <Link
          to="/dashboard"
          style={{ width: "150px", textAlign: "center", fontSize: "1rem" }}
          className="btn"
        >
          <i className="fa-solid fa-backward"></i> Back
        </Link>
        <h3>
          Add New User <i className="fa-solid fa-user"></i>
        </h3>
        <form className="addUserForm" onSubmit={submitFunction}>
          {/* NAME FIELD */}
          <div className="inputGroup">
            <label htmlFor="name">Name:</label>
            <Input
              type="text"
              id="name"
              name="name"
              autoComplete="off"
              placeholder="Enter Your Name"
              onChange={inputHandler}
            />
          </div>

          {/* EMAIL FIELD */}
          <div className="inputGroup">
            <label htmlFor="email">Email:</label>
            <Input
              type="email"
              id="email"
              name="email"
              autoComplete="off"
              placeholder="Enter Your Email"
              onChange={inputHandler}
            />
          </div>

          {/* ADDRESS FIELD */}
          <div className="inputGroup">
            <label htmlFor="address">Address:</label>
            <Input
              type="text"
              id="address"
              name="address"
              autoComplete="off"
              placeholder="Enter Your Address"
              onChange={inputHandler}
            />
          </div>

          {/* BUTTON SUBMIT */}
          <div className="inputGroup">
            <Button style={{ width: "200px" }} type="submit" className="btn">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ✅ Reusable Input
function Input({
  type = "text",
  id,
  name,
  autoComplete = "off",
  placeholder,
  onChange,
}) {
  return (
    <input
      type={type}
      id={id}
      name={name}
      autoComplete={autoComplete}
      placeholder={placeholder}
      onChange={onChange}
      required
    />
  );
}

// ✅ Reusable Button
function Button({ children, className, style, type = "button" }) {
  return (
    <button style={style} type={type} className={className}>
      {children}
    </button>
  );
}
