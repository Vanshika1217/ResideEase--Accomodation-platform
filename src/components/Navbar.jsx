import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PropTypes from "prop-types";

const Navbar = ({ admin }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white shadow w-full">
      <div className="flex justify-between items-center h-20 px-6 md:px-12">
        {/* Logo on the far left */}
        <div className="flex-shrink-0">
          <Link
            to={admin ? "/admin" : "/"}
            className="text-3xl font-bold tracking-tight hover:text-gray-300 transition"
          >
            {admin ? "ResideEaseAdmin" : "ResideEase"}
          </Link>
        </div>

        {/* Right side nav items */}
        <div className="flex items-center space-x-8 text-lg">
          {!admin && (
            <>
              <Link to="/" className="hover:text-gray-400 transition">Home</Link>
              <Link to="/profile" className="hover:text-gray-400 transition">Profile</Link>
              <Link to="/listings" className="hover:text-gray-400 transition">Listings</Link>
              <Link to="/contact" className="hover:text-gray-400 transition">Contact</Link>
              <Link to="/chat" className="hover:text-gray-400 transition">Chat</Link> {/* ✅ Chat Link */}
            </>
          )}

          {(user?.username || admin) ? (
            <div className="flex items-center space-x-4">
              {user?.username && (
                <span className="text-sm text-gray-300 flex items-center gap-1">
                  <span className="text-purple-400">👤</span> {user.username}
                </span>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 text-sm px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-gray-600 text-sm px-4 py-2 rounded-lg hover:bg-gray-700 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

Navbar.defaultProps = {
  admin: false,
};

Navbar.propTypes = {
  admin: PropTypes.bool,
};

export default Navbar;
