import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@chakra-ui/react";
import "./nav.css";

function Nav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const storedToken = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(storedToken !== null);
  }, [storedToken]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <header className="header">
      <nav className="nav">
        {isLoggedIn ? (
          <>
            <NavLink to={`/transaction/${storedToken}`} className="login">
              TRANSACTIONS
            </NavLink>
            <Button
              style={{ margin: "5px" }}
              onClick={handleLogout}
              className="logout"
            >
              LOGOUT
            </Button>
          </>
        ) : (
          <NavLink to="/login" className="login">
            LOGIN
          </NavLink>
        )}
      </nav>
    </header>
  );
}

export default Nav;
