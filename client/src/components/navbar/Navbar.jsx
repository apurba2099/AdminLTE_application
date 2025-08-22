import "./navbar.css";
import { Button } from "../getUser/User";
export default function Navbar({ currentUser, onClick }) {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <h2>&lt;The CRUD Data-Base System/&gt;</h2>
      </div>
      <div className="nav-right">
        <span className="welcome-message">
          👋 Welcome, <strong>{currentUser?.name || "User"}</strong>
        </span>
        <Button onClick={onClick} className="logout-btn">
          🚪 Logout
        </Button>
      </div>
    </nav>
  );
}
