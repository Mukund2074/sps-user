import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApiCall from "../ApiCall";

function Login({ setIsAuthenticated }) {
    const [loginData, setLoginData] = React.useState({
        email: "",
        password: "",
        role: '1'
    });

    const navigate = useNavigate();


    const handleChange = (e) => {
        const { name, value } = e.target;

        setLoginData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await ApiCall("POST", "user/userlogin", loginData);

            if (response.data.success) {
                localStorage.setItem('AUTH_TOKEN', response.data.token);
                localStorage.setItem('email', response.data.userData.email);
                document.cookie = "hasCard=" + response.data.userData.hasCard;
                document.cookie = "userData=" + response.data.userData._id;
                setIsAuthenticated(true);
                toast.success("Login Successful", {
                    autoClose: 1500,
                    onClose: () => navigate("/"),
                });
            }
        } catch (error) {
            toast.error("Login Err: ", error);
            
            if (error.response && error.response.status === 401) {
                toast.error(error.response.data.message, {
                    autoClose: 1500,
                });
            } else {
                toast.error("An error occurred. Please try again.", {
                    autoClose: 1500,
                });
            }
        }
    }

    return (
        <div className="login-page">
            <div className="container">
                <div className="row justify-content-center align-items-center vh-100">
                    <div className="col-lg-6 col-md-8">
                        <div className="form-container">
                            <div className="form-icon">
                                <i className="fa fa-user-circle" />
                                <span className="signup">
                                    <Link to={"/signup"}>Don't have account? Signup</Link>
                                </span>
                            </div>
                            <form onSubmit={handleSubmit} className="form-horizontal">
                                <h3 className="title">Member Login</h3>
                                <div className="form-group">
                                    <span className="input-icon">
                                        <i className="fa fa-envelope" />
                                    </span>
                                    <input
                                        className="form-control"
                                        name="email"
                                        onChange={handleChange}
                                        value={loginData.email}
                                        type="email"
                                        placeholder="Email Address"
                                    />
                                </div>
                                <div className="form-group">
                                    <span className="input-icon">
                                        <i className="fa fa-lock" />
                                    </span>
                                    <input
                                        className="form-control"
                                        name="password"
                                        onChange={handleChange}
                                        value={loginData.password}
                                        type="password"
                                        placeholder="Password"
                                    />
                                </div>
                                <button type="submit" className="btn signin">Login</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
