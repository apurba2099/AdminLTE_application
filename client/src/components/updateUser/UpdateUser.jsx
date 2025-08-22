import { useEffect, useState } from "react";
import "./updateuser.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { API_LINK } from "../../utility/config";

export default function UpdateUser() {
  const users = {
    name: "",
    email: "",
    address: "",
  };

  //Use useState hook for manage the user form data
  const [user, setUser] = useState(users);
  const [loading, setLoading] = useState(false);

  //useNavigate (Router function) use for navigate after sending/post data
  const navigate = useNavigate();

  //The hook useParams is used to read dynamic parameters from the URL.
  const { id } = useParams();

  //Input function  changes for input fileds
  function inputHandler(e) {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  }

  //Set up the dynamic user id in the URL with authentication
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(`${API_LINK}/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (error) {
        console.log(error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        } else if (error.response?.status === 404) {
          toast.error("Data not found or access denied!", {
            position: "top-right",
          });
          navigate("/dashboard");
        } else {
          toast.error("Error fetching data!", { position: "top-right" });
        }
      }
    };

    fetchUserData();
  }, [id, navigate]);

  // Form submit function to backend with authentication
  const submitFunction = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.put(`${API_LINK}/users/${id}`, user, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Success message
      toast.success(response.data.message, { position: "top-right" });
      navigate("/dashboard");
    } catch (error) {
      console.log(error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else if (error.response?.status === 404) {
        toast.error("Data not found or access denied!", {
          position: "top-right",
        });
      } else {
        toast.error("Error updating data!", { position: "top-right" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-box">
      <div className="addUser">
        {/* Navigation Header */}
        <div className="update-header">
          <Link
            to="/dashboard"
            style={{ width: "150px", textAlign: "center", fontSize: "1rem" }}
            className="btn"
          >
            <i className="fa-solid fa-backward"></i> Back
          </Link>
        </div>

        <h3>
          Update User <i className="fa-solid fa-user"></i>
        </h3>

        <form className="addUserForm" onSubmit={submitFunction}>
          {/* NAME FIELD  */}
          <div className="inputGroup">
            <label htmlFor="name">Name:</label>
            <Input
              type="text"
              id="name"
              name="name"
              value={user.name}
              autoComplete="off"
              placeholder="Enter Your Name"
              onChange={inputHandler}
              required
            />
          </div>

          {/* EMAIL FIELD  */}
          <div className="inputGroup">
            <label htmlFor="email">Email:</label>
            <Input
              type="email"
              id="email"
              name="email"
              value={user.email}
              autoComplete="off"
              placeholder="Enter Your Email"
              onChange={inputHandler}
              required
            />
          </div>

          {/* ADDRESS FIELD  */}
          <div className="inputGroup">
            <label htmlFor="address">Address:</label>
            <Input
              type="text"
              id="address"
              name="address"
              value={user.address}
              autoComplete="off"
              placeholder="Enter Your Address"
              onChange={inputHandler}
              required
            />
          </div>

          {/* BUTTON SUBMIT */}
          <div className="inputGroup">
            <Button
              style={{ width: "200px" }}
              type="submit"
              className="btn"
              disabled={loading}
            >
              {loading ? "Updating..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Input({
  type = "text",
  id,
  name,
  value,
  autoComplete = "off",
  placeholder,
  onChange,
  required = false,
}) {
  return (
    <input
      type={type}
      id={id}
      name={name}
      autoComplete={autoComplete}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      required={required}
    />
  );
}

function Button({
  children,
  className,
  style,
  type = "button",
  disabled = false,
}) {
  return (
    <button style={style} type={type} className={className} disabled={disabled}>
      {children}
    </button>
  );
}
