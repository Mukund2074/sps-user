import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import { toast } from 'react-toastify'
import ApiCall from "../ApiCall";

export default function Bookonline() {
    const [areas, setAreas] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [hoverIndex, setHoverIndex] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            ApiCall('GET', 'user/getAreas')
                .then((response) => {
                    if (Array.isArray(response.data.areas)) {
                        setAreas(response.data.areas);
                    } else {
                        toast.error("Error fetching areas:", response.data.message);
                    }
                })
                .catch(error => {
                    toast.error("Error fetching areas:", error);
                });
        } catch (error) {
            toast.error("Error in useEffect:", error);
        }
    }, []);

    const filteredAreas = areas.filter(item =>
        item.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.Locality.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.Zipcode.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleBook = (item) => {
        navigate("/payment", { state: { cardData: item } });
    };

    return (
        <div>
            <Header />
            <section className="w3l-about-breadcrumb position-relative text-center">
                <div className="breadcrumb-bg breadcrumb-bg-about py-sm-5 py-4">
                    <div className="container py-lg-5 py-3">
                        <h2 className="title">Book Your Parking Slot</h2>
                        <ul className="breadcrumbs-custom-path mt-2">
                            <li>
                                <Link to="/">Home</Link>
                            </li>
                            <li className="active">
                                <span
                                    className="fa fa-angle-double-right mx-2"
                                    aria-hidden="true"
                                />
                                Book Parking Slot
                            </li>
                        </ul>
                    </div>
                    <span className="d-flex justify-content-center align-items-center">
                        <p className=" text-light">
                            search areas here :
                        </p>
                        <input
                            type="text"
                            className="p-2 mx-3 rounded"
                            placeholder="Search areas..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ maxWidth: '300px' }}
                        />
                    </span>
                </div>
            </section>


            <div className="grid-container  m-5">
                {filteredAreas.map((item, index) => (
                    <div
                        key={index}
                        style={{
                            border: hoverIndex === index ? "1px solid red" : "1px solid white",
                            borderRadius: '40px',
                            transition: 'all 0.3s ease-in-out',
                            backgroundColor: "transparent ",
                            transform: hoverIndex === index ? "scale(1.05)" : "scale(1)",
                            boxShadow: hoverIndex === index ? "0 0 20px red" : "none"
                        }}
                        onMouseEnter={() => setHoverIndex(index)}
                        onMouseLeave={() => setHoverIndex(null)}
                    >
                        <div className="p-3 d-flex  flex-column">
                            <h4 className="cause-title">{item.Name}<br />{item.Locality}<br />{item.Zipcode}</h4>
                            Available Slots : {JSON.stringify(item.availableOnlineSlot)}
                            <button
                                className="btn btn-style btn-primary w-auto"
                                style={{ borderRadius: '80px' }}
                                onClick={() => handleBook(item)}
                            >
                                Book
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Footer />
        </div>
    );
}
