import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApiCall from "../ApiCall";

function Apply() {
    const navigate = useNavigate();




    const [cardApplyDetail, setCardApplyDetail] = useState({

        name: "",
        email: "",
        phoneNo: "",
        address: "",
    });

    useEffect(() => {
        window.scrollTo(0, 0, { behavior: "smooth" });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCardApplyDetail((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userId = document.cookie.split('; ').find((cookie) => cookie.startsWith("userData="))?.split('=')[1];
            
    
            const response = await ApiCall("POST", "user/applyForCard", {
                ...cardApplyDetail,
                userId: userId, // Use the extracted ID
            });
    
            const { success } = response.data;
            if (success) {
                toast.success(response.data.message, {
                    autoClose: 1500, onClose: () => navigate("/"),
                });
            }
    
        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast.error(error.response.data.message, {
                    autoClose: 1500, onClose: () => navigate("/"),
                });
            } else {
                toast.error("An error occurred.", {
                    autoClose: 1500,
                });
            }
        }
    };
    


    return (
        <>
            <Header />
            <section className="w3l-about-breadcrumb position-relative text-center">
                <div className="breadcrumb-bg breadcrumb-bg-about py-sm-5 py-4">
                    <div className="container py-lg-5 py-3">
                        <h2 className="title">Apply For RFID Card</h2>
                        <ul className="breadcrumbs-custom-path mt-2">
                            <li>
                                <Link to="/">Home</Link>
                            </li>
                            <li className="active">
                                <span
                                    className="fa fa-angle-double-right mx-2"
                                    aria-hidden="true"
                                />
                                Apply for RFID Card
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
            {/* //about breadcrumb */}
            <section className="w3l-contact-11">
                <div className="form-41-mian py-5">
                    <div className="container py-lg-4">
                        <div className="row align-form-map">
                            <div className="col-lg-6 contact-left pr-lg-4">
                                <div className="partners">
                                    <div className="cont-details">
                                        <div className="title-content text-left">
                                            <h6 className="sub-title">Apply for RFID Card</h6>
                                            <h3 className="hny-title">Get your RFID Card</h3>
                                        </div>
                                        <p className="mt-3 mb-4 pr-lg-5">
                                            Welcome to our RFID card application page. Please fill out
                                            the form below to apply for your RFID card.
                                        </p>
                                        <h6 className="mb-4">
                                            For any inquiries or assistance, feel free to contact us
                                            using the details below.
                                        </h6>
                                    </div>
                                    <div className="hours">
                                        <h6 className="mt-4">Email:</h6>
                                        <p>
                                            <a href="mailto:hadiyamukund16@example.com">DriveSyncParkX.com</a>
                                        </p>
                                        <h6 className="mt-4">Address:</h6>
                                        <p>
                                            Ahmedabad,Gujarat,india
                                        </p>
                                        <h6 className="mt-4">Contact:</h6>
                                        <p className="margin-top">
                                            <a href="tel:+(91)DriveSyncParkX">+(91)DriveSyncParkX</a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 form-inner-cont">
                                <div className="title-content text-left">
                                    <h3 className="hny-title mb-lg-5 mb-4">Fill out the Form</h3>
                                </div>
                                <form
                                    onSubmit={handleSubmit}
                                    className="signin-form"
                                >
                                    <div className="form-input">
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Your Name"
                                            value={cardApplyDetail.name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="row con-two">
                                        <div className="col-lg-6 form-input">
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="Your Email"
                                                value={cardApplyDetail.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-lg-6 form-input">
                                            <input
                                                type="tel"
                                                maxLength={10}
                                                name="phoneNo"
                                                placeholder="Phone Number"
                                                value={cardApplyDetail.phoneNo}
                                                onChange={handleChange}
                                                className="contact-input"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-input">
                                        <div className="form-input">
                                            <textarea
                                                placeholder="Enter Your Address For Delivery"
                                                name="address"
                                                value={cardApplyDetail.address}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="submit-button text-lg-right">
                                        <button type="submit" className="btn btn-style">
                                            Submit
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}

export default Apply;
