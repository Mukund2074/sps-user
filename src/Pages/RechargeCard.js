import React, { useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CardReactFormContainer from "card-react";
import ApiCall from "../ApiCall";

function RechargeCard() {
    const navigate = useNavigate();
    const [RechargeCardDetail, setRechargeCardDetail] = useState({
        balance: "",
    });
    const [paymentCardDetail, setPaymentCardDetail] = useState({
        number: "",
        expiry: "",
        name: "",
        cvc: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
            setPaymentCardDetail({
                ...paymentCardDetail,
                [name]: value,
            });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const cardWrapper = document.getElementById("card-wrapper");
        const nestedDiv = cardWrapper.querySelector(".jp-card-identified");
        if (nestedDiv) {
            try {
                const hasCard = document.cookie
                    .split('; ')
                    .find((cookie) => cookie.startsWith('hasCard='))
                    ?.split('=')[1];

                if (!hasCard) {
                    toast.error('User data not found in cookies');
                    return;
                }

                const payload = {
                    userId: document.cookie.split('; ').find((cookie) => cookie.startsWith("userData="))?.split('=')[1],
                    balance: RechargeCardDetail.balance,
                    cardDetails: paymentCardDetail
                }
                const response = await ApiCall("POST", `user/rechargeCard`, {
                    ...payload,
                });

                const { success } = response.data;
                if (success) {
                    toast.success(response.data.message, {
                        autoClose: 1500,
                        onClose: () => navigate("/viewCard"),
                    });
                
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    toast.error(error.response.data.message, {
                        autoClose: 1500,
                        onClose: () => navigate("/"),
                    });
                } else {
                    toast.error(error.response.data.message, {
                        autoClose: 1500,
                    });
                }
            }
        } else {
            toast.error("Please provide valid card details.", { autoClose: 1500 });
        }
    };

    return (
        <>
            <Header />
            <section className="w3l-about-breadcrumb position-relative text-center">
                <div className="breadcrumb-bg breadcrumb-bg-about py-sm-5 py-4">
                    <div className="container py-lg-5 py-3">
                        <h2 className="title">Recharge Card</h2>
                        <ul className="breadcrumbs-custom-path mt-2">
                            <li>
                                <Link to="/">Home</Link>
                            </li>
                            <li className="active">
                                <span
                                    className="fa fa-angle-double-right mx-2"
                                    aria-hidden="true"
                                />
                                Recharge Card
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
            {/* //about breadcrumb */}
            <section className="w3l-contact-11 py-5">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 form-inner-cont">
                            <div className="title-content text-left">
                                <h3 className="hny-title mb-lg-5 mb-4">Recharge Card</h3>
                            </div>
                            <div className="row">
                                <div className="col-lg-12">
                                    <form className="row align-form-map" onSubmit={handleSubmit}>
                                        <div className="signin-form">
                                            <CardReactFormContainer container="card-wrapper">
                                                <div className="row form-inner-cont">
                                                    <div className="col-lg-12" >
                                                        <div className="form-input">
                                                            <label htmlFor="vehicleNo">Add Amount</label>
                                                            <input
                                                                type="number"
                                                                name="balance"
                                                                placeholder="Minimum allowed amount is 100 ₹"
                                                                value={RechargeCardDetail.balance}
                                                                onChange={(e) => setRechargeCardDetail({ ...RechargeCardDetail, balance: e.target.value })}
                                                                min={100}
                                                                required
                                                            />
                                                        </div>
                                                    </div>


                                                    <div className="col-lg-6 mt-4" >
                                                        <div className="form-group">
                                                            <label htmlFor="number">Card number</label>
                                                            <input
                                                                className="form-control"
                                                                placeholder="Card number"
                                                                type="text"
                                                                value={paymentCardDetail.number} // Controlled input
                                                                onChange={handleInputChange} // Using the modified handler
                                                                name="number"
                                                                required
                                                            />

                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="name">Full name</label>
                                                            <input
                                                                className="form-control"
                                                                id="name"
                                                                placeholder="Full name"
                                                                type="text"
                                                                name="name"
                                                                value={RechargeCardDetail.name}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6 mt-4">
                                                        <div className="form-group">
                                                            <label htmlFor="expiry">MM/YYYY</label>
                                                            <input
                                                                className="form-control"
                                                                id="expiry"
                                                                placeholder="MM/YYYY"
                                                                type="text"
                                                                value={RechargeCardDetail.expiry}
                                                                onChange={handleInputChange}
                                                                name="expiry"
                                                                required
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="cvc">CVC</label>
                                                            <input
                                                                className="form-control"
                                                                id="cvc"
                                                                placeholder="CVC"
                                                                type="text"
                                                                name="cvc"
                                                                value={RechargeCardDetail.cvc}
                                                                onChange={handleInputChange}
                                                                maxLength={3}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardReactFormContainer>
                                            <div className="submit-button text-lg-right">
                                                <button type="submit" className="btn btn-style">
                                                    Submit
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="col-lg-6 "></div>
                            </div>
                        </div>

                        <div className="col-lg-6 mt-5">
                            <div id="card-wrapper"></div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}

export default RechargeCard;
