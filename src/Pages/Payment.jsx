import React, { useState, useEffect, useCallback } from 'react';
import CardReactFormContainer from "card-react";
import Header from '../Components/Header';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Footer from '../Components/Footer';
import { toast } from 'react-toastify';
import "react-datetime/css/react-datetime.css";
import ApiCall from '../ApiCall';
import * as EmailJS from 'emailjs-com';

export default function Payment() {
    const [hoverIndex, setHoverIndex] = useState(null);
    const [fromTime, setFromTime] = useState('');
    const [toTime, setToTime] = useState('');
    const [charge, setCharge] = useState(0);
    const [isTimeFixed, setIsTimeFixed] = useState(false);
    const [cardDetails, setCardDetails] = useState({
        number: '',
        name: '',
        expiry: '',
        cvc: ''
    });
    const location = useLocation();
    const { cardData } = location.state;
    const Navigate = useNavigate();

    const calculateCharge = useCallback(() => {
        if (!fromTime || !toTime) return;

        const start = new Date(fromTime);
        const end = new Date(toTime);
        const diff = (end - start) / (1000 * 60 * 60); // Difference in hours

        let ratePerHour = 10;
        if (diff < 1) {
            setCharge(10); // Minimum charge
        } else if (diff > 0) {
            setCharge(diff * ratePerHour);
        } else {
            setCharge(0);
        }
    }, [fromTime, toTime]);



    useEffect(() => {
        if (isTimeFixed && fromTime && toTime) {
            calculateCharge();
        }
    }, [fromTime, toTime, isTimeFixed, calculateCharge]);

    const handleFromTimeChange = (event) => {
        const value = event.target.value;
        setFromTime(value);
        if (toTime && new Date(toTime) <= new Date(value)) {
            setToTime('');
        }
    };

    const handleToTimeChange = (event) => {
        const value = event.target.value;
        setToTime(value);
    };


    const handleFixTime = () => {
        const now = new Date();
        const fromDate = new Date(fromTime);
        const toDate = new Date(toTime);
        const maxDate = new Date();
        maxDate.setHours(now.getHours() + 48);

        if (fromDate <= now) {
            alert("Please select a time of future in slot booking time.");
            return;
        }
        if (toDate <= fromDate) {
            alert("Please select a time which is after the time of booking.");
            return;
        }
        if (toDate > maxDate) {
            alert("We do not accept more than 48 hours booking time.");
            return;
        }

        setIsTimeFixed(true);
        calculateCharge();
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCardDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const sendEmail = async () => {
        try {
            await EmailJS.send(
                'sps', // Replace with your EmailJS service ID
                'template_1olquug', // Replace with your EmailJS template ID
                {
                    to_email: localStorage.getItem('email'), // Dynamically specify recipient email address
                    to_name: localStorage.getItem('email'),
                    message: 'Your payment was successful.',
                    area: cardData.Name,
                    Zipcode: cardData.Zipcode,
                    Locality: cardData.Locality,
                    fromTime: fromTime,
                    toTime: toTime,
                    charge: charge
                },
                'OdgX-RtTLKIJGeJLI' // Replace with your EmailJS user ID
            );

        } catch (error) {
            toast.error('Email error:', error);
        }
    };

    const handlePayment = async (e) => {
        e.preventDefault();

        const payload = {
            UserId: document.cookie.split('; ').find((cookie) => cookie.startsWith("userData="))?.split('=')[1],
            Area: cardData,
            PaymentCard: cardDetails,
            fromTime,
            toTime,
            charge
        };
        try {
            const response = await ApiCall('POST', 'user/payment', {
                ...payload
            });

            if (response.data.success) {
                alert('Payment Successful!');
                Navigate('/bookings', { state: { data: response.data.data } });
                sendEmail();
            } else {
                alert('Payment Failed. Please try again.');
            }
        } catch (error) {
            toast.error('Payment Error:', error);
        }
    };

    return (
        <div>
            <Header />
            <section className="w3l-about-breadcrumb position-relative text-center">
                <div className="breadcrumb-bg breadcrumb-bg-about py-sm-5 py-4">
                    <div className="container py-lg-5 py-3">
                        <h2 className="title">Payment </h2>
                        <ul className="breadcrumbs-custom-path mt-2">
                            <li>
                                <Link to="/">Home</Link>
                            </li>
                            <li className="active">
                                <span
                                    className="fa fa-angle-double-right mx-2"
                                    aria-hidden="true"
                                />
                                Payment
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
            <div className="container">
                <div className="row">
                    <div className="col-12 col-md-6 mb-4">
                        <div className="causes-grid-info"
                            style={{
                                border: hoverIndex === 0 ? "1px solid red" : "1px solid white",
                                margin: '10px',
                                borderRadius: '40px',
                                transition: 'all 0.3s ease-in-out',
                                transform: hoverIndex === 0 ? "scale(1.05)" : "scale(1)",
                                boxShadow: hoverIndex === 0 ? "0 0 20px red" : "none",
                                zIndex: hoverIndex === 0 ? 2 : 1,
                                position: 'relative'
                            }}
                            onMouseEnter={() => setHoverIndex(0)}
                            onMouseLeave={() => setHoverIndex(null)}
                        >
                            <div className="card-body">
                                <span className="cause-title-wrap">
                                    <h4 className="cause-title">{cardData.Name} - {cardData.Locality}</h4>
                                    <h4 className="cause-title">{cardData.Zipcode}</h4>
                                </span>
                                <p className="card-text mb-0">
                                    Available Slots: {cardData.availableOnlineSlot}
                                </p>
                                <div>
                                    <div>
                                        <label htmlFor="fromTime">From Time:</label>
                                        <input
                                            id="fromTime"
                                            type="datetime-local"
                                            value={fromTime}
                                            onChange={handleFromTimeChange}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="toTime">To Time:</label>
                                        <input
                                            id="toTime"
                                            type="datetime-local"
                                            value={toTime}
                                            onChange={handleToTimeChange}
                                        />
                                    </div>
                                    <button onClick={handleFixTime} className='btn btn-secondary mt-3'>Fix This Time</button>
                                </div>
                                <span className="cause-title-wrap">
                                    <h4 className="cause-title">Charge Should be = {charge.toFixed(2)} INR</h4>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 mb-4">
                        <CardReactFormContainer container="card-wrapper">
                            <div className="container">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="form-group">
                                            <label htmlFor="number">Card number</label>
                                            <input
                                                className="form-control"
                                                id="number"
                                                placeholder="Card number"
                                                type="text"
                                                name="number"
                                                value={cardDetails.number}
                                                onChange={handleInputChange}
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
                                                value={cardDetails.name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <label htmlFor="expiry">Expiry</label>
                                        <input
                                            className="form-control"
                                            id="expiry"
                                            placeholder="MM/YYYY"
                                            type="text" // Use text for MM/YYYY format
                                            name="expiry"
                                            value={cardDetails.expiry}
                                            onChange={handleInputChange}
                                            required
                                        />

                                        <div className="form-group">
                                            <label htmlFor="cvc">CVC</label>
                                            <input
                                                className="form-control"
                                                id="cvc"
                                                placeholder="CVC"
                                                type="number"
                                                name="cvc"
                                                value={cardDetails.cvc}
                                                onChange={handleInputChange}
                                                maxLength={3}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className='col-12'>
                                        <div id="card-wrapper"></div>
                                        <center><button onClick={handlePayment} className='btn btn-primary m-5'>Pay Now</button></center>
                                    </div>
                                </div>
                            </div>
                        </CardReactFormContainer>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );


}
