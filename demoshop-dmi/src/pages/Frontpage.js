// src/pages/Frontpage.js
import React from 'react';
import { Link } from 'react-router-dom';


const Frontpage = () => {
    return (
        <div className='container'>
            <h1 className='p-5 text-center'>Demoshop Frontpage</h1>
            <nav>
                <ul className='d-flex justify-content-between'>
                    <p><Link to="/search">Search Results Page</Link></p>
                    <p><Link to="/products">Product Listing Page</Link></p>
                    <p><Link to="/product/1">Product Details Page</Link></p> {/* /product/:id route */}
                    <p><Link to="/cart">Cart Page</Link></p>
                    <p><Link to="/order-receipt">Order Receipt Page</Link></p>
                </ul>
            </nav>
            <div>
                <form class="d-flex p-2 mb-5 justify-content-center">
                    <input class="form-control text-center w-50" type="search" placeholder="Search for any product" aria-label="Search"></input>
                    <button class="btn btn-outline-success" type="submit">Search</button>
                </form>
            </div>
        </div>
    );
};

export default Frontpage;
