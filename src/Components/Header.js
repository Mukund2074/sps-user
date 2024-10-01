import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Header() {
    const location = useLocation();
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isCardAssigned, setIsCardAssigned] = useState(false);
    const [activeItem, setActiveItem] = useState("Home");
    const theme = localStorage.getItem("theme") || "dark";

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    useEffect(() => {
        const checkLoginStatus = () => {
            const loggedIn = localStorage.getItem("AUTH_TOKEN") !== null;
        
            if (loggedIn) {
                setIsCardAssigned(document.cookie.split('; ').find((cookie) => cookie.startsWith("hasCard="))?.split('=')[1] !== 'false');
            }
            setIsLoggedIn(loggedIn);
            setIsLoading(false);
        };

        checkLoginStatus();
    }, []);

    useEffect(() => {
        const routeMap = {
            "/": "Home",
            "/bookonline": "Book Online",
            "/about": "About",
            "/services": "Services",
            "/applyForCard": "Apply Card",
            "/viewCard": "View Card",
            "/bookings": "Booking",
            "/giveFeedback": "Feedback",
            "/addComplaint": "Complaint"
        };
        setActiveItem(routeMap[location.pathname] || "Home");
    }, [location.pathname]);

    const handleLogout = async (e) => {
        e.preventDefault();
        setIsLoading(true);

               

        try {
            localStorage.removeItem("AUTH_TOKEN" && "email" && "hasCard");
            document.cookie = `userData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            toast.success("Logout Successful", {
                autoClose: 1000,
                onClose: () => navigate("/login"),
                position: "top-left",
            });
        } catch (error) {
            toast.error(error.response?.data?.message || "Logout failed", {
                autoClose: 1500,
                onClose: () => navigate("/login"),
                position: "top-left",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const routes = [
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
        { name: "Services", path: "/services" }
    ];

    if (isLoading) {
        return null;
    }

    return (
        <header id="site-header" className="fixed-top">
            <div className="container">
                <nav className="navbar navbar-expand-lg navbar-light ">
                    <h1>
                        <Link className="navbar-brand" to="/">
                            <span>D</span>rive<span>S</span>ync<span>P</span>ark<span>X</span>
                        </Link>
                    </h1>
                    <button
                        className="navbar-toggler collapsed"
                        type="button"
                        data-toggle="collapse"
                        data-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="fa icon-expand fa-bars" />
                        <span className="fa icon-close fa-times" />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ml-auto mt-lg-0 mt-2">
                            {routes.map(({ name, path }) => (
                                <li key={name} className={`nav-item ${activeItem === name ? "active" : ""}`}>
                                    <Link className="nav-link" to={path} style={{ fontSize: "15px" }}>
                                        {name}
                                    </Link>
                                </li>
                            ))}
                            {isLoggedIn && (
                                <li className={`nav-item ${activeItem === "Book Online" ? "active" : ""}`}>
                                    <Link className="nav-link" to="/bookonline" style={{ fontSize: "15px" }}>
                                        Book Online
                                    </Link>
                                </li>
                            )}
                            <li className="nav-item dropdown">
                                <Link
                                    className="nav-link dropdown-toggle"
                                    to="#"
                                    id="navbarDropdown"
                                    role="button"
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                    style={{ fontSize: "15px" }}
                                >
                                    More<i className="fa fa-angle-down" />
                                </Link>
                                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    {isLoggedIn && (
                                        <>
                                            {isCardAssigned ? (
                                                <Link className="dropdown-item" to="/viewCard" >View Card</Link>
                                            ) : (
                                                <Link className="dropdown-item" to="/applyForCard">Apply for Card</Link>
                                            )}
                                            <Link className="dropdown-item" to="/bookings">Booking</Link>
                                            <Link className="dropdown-item" to="/addComplaint">Add Complaint</Link>
                                        </>
                                    )}
                                    <Link className="dropdown-item" to="/giveFeedback">Feedback</Link>
                                </div>
                            </li>
                      
                          
                            {isLoggedIn ? (
                                <li className="nav-item mt-2">
                                    <Link onClick={handleLogout} className="btn btn-primary d-lg-block btn-style mr-2">Logout</Link>
                                </li>
                            ) : (
                                <li className="nav-item">
                                    <Link to="/login" className="btn btn-primary d-lg-block btn-style mr-2">Login</Link>
                                </li>
                            )}
                        </ul>
                    </div>
                  
                </nav>
            </div>
        </header>
    );
}

export default Header;
