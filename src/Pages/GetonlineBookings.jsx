import React, { useEffect, useState } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { Link } from 'react-router-dom';
import ApiCall from "../ApiCall";
import { toast } from 'react-toastify';
import DataTable from 'react-data-table-component';

export default function GetOnlineBooking() {
  const [booking, setBooking] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ApiCall("GET", `user/getOnlineBookingApi/${document.cookie.split('; ').find((cookie) => cookie.startsWith("userData="))?.split('=')[1]}`);
        // Check if response.data.bookings is an object
        if (response.data.bookings && typeof response.data.bookings === 'object' && !Array.isArray(response.data.bookings)) {
          setBooking([response.data.bookings]); // Wrap it in an array
        } else {
          setBooking(response.data.bookings); // If it's already an array, set it directly
        }
        setIsLoading(false);
      } catch (error) {
        toast.error('Error fetching data:');
      }
    };
    fetchData();
  }, []);

  const columns = [
    {
      name: 'SR NO.',
      selector: (row, index) => index + 1,
      sortable: true,
      width: '100px',
      cell: (row, index) => (
        <div title={`SR NO.: ${index + 1}`} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
          {index + 1}
        </div>
      ),
    },
    {
      name: 'From Time',
      selector: row => new Date(row.fromTime).toLocaleString(),
      sortable: true,
    },
    {
      name: 'To Time',
      selector: row => new Date(row.toTime).toLocaleString(),
      sortable: true,
    },
    {
      name: 'Charges',
      selector: row => row.charge, // Fixed: This should refer to the charge directly
      sortable: true,
    },
    {
      name: 'User Name',
      selector: row => row.userName, // Fixed: This should refer to userName directly
      sortable: true,
    },
    {
      name: 'Parking Slot Name',
      selector: row => `${row.areaName} / ${row.locality} / ${row.zipcode}`, // Fixed: Changed Locality to locality for case sensitivity
      sortable: true,
    },
  ];


  return (
    <>
      <Header />
      <section className="w3l-about-breadcrumb position-relative text-center">
        <div className="breadcrumb-bg breadcrumb-bg-about py-sm-5 py-4">
          <div className="container py-lg-5 py-3">
            <h2 className="title"> Slot Bookings</h2>
            <ul className="breadcrumbs-custom-path mt-2">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li className="active">
                <span className="fa fa-angle-double-right mx-2" aria-hidden="true" />
                Slot Bookings
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section className="w3l-content-6">
        <div className="w3-services py-5">
          <div className="container py-lg-4">
            <div className="row w3-services-grids">
              {isLoading ? (
                <p>Loading...</p>
              ) : (
                <div className="col-lg-12 d-flex flex-column d-md-block">
                  <DataTable
                    data={booking}
                    columns={columns}
                    pagination
                    highlightOnHover
                    responsive
                    striped
                    theme="dark"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
