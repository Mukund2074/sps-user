import React, { useEffect } from "react";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import { Link } from "react-router-dom";
import ApiCall from "../ApiCall";
import { useState } from "react";
import { toast } from "react-toastify";

function ViewCard() {

    const [cardDetails, setCardDetails] = useState({});

    useEffect(() => {
        const getDetails = async () => {
            try {
                const hasCard = document.cookie
                    .split('; ')
                    .find((cookie) => cookie.startsWith('hasCard='))
                    ?.split('=')[1];

                if (!hasCard) {
                    toast.error('User data not found in cookies');
                    return;
                }

                const response = await ApiCall("GET", `user/getcardDetailsUser/${hasCard}`);
                setCardDetails(response.data.cardDetails);
            } catch (error) {
                toast.error('Error fetching card details:', error);
            }
        };

        getDetails();
    }, []);


    useEffect(() => {
        window.scrollTo(0, 0, { behavior: "smooth" });
    })
    return (
        <>
            <Header />
            <section className="w3l-pricing">
                <div className="py-5" id="pricing">
                    <div className="container py-lg-5">
                        <div className="title-content text-center mb-5">
                            <h6 className="sub-title">User Card Details</h6>
                        </div>
                        <div className="row t-in d-flex align-items-center justify-content-center" >

                            <div className="col-lg-4 col-md-6 price-main-info mt-md-0 mt-4">
                                <div className="price-inner card box-shadow active">
                                    <div className="card-body" >
                                        <label className="price-label">Active Status OK</label>
                                        <h4 className="text-uppercase text-center mb-3">
                                            CARD NUMBER<br /> {cardDetails?.id}
                                        </h4>
                                        <h5 className="card-title pricing-card-title">
                                            <span className="align-top">₹</span>{cardDetails?.balance}
                                        </h5>
                                        <ul className="list-unstyled mt-3 mb-4">
                                            {cardDetails && Object.keys(cardDetails).map((key) => {
                                                if (key === "id" || key === "balance" || key === "timestamp" || key === "password") {
                                                    return null
                                                }
                                                if(key === "assignedAt"){
                                                    return (
                                                        <li>
                                                            <span className="fa fa-check" /> {key} : {new Date(cardDetails[key]).toLocaleString()}
                                                        </li>
                                                    )
                                                }
                                                return (
                                                    <li>
                                                        <span className="fa fa-check" /> {key} : {cardDetails[key]}
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                        <div className="read-more mt-5 pt-lg-2">
                                            <p className="mb-0 fw-bold"><u>insufficient balance ???</u></p>
                                            <Link to="/rechargeCard" className="btn btn-style btn-primary">
                                                Recharge Card Here
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}

export default ViewCard;
