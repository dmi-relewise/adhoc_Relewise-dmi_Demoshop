// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="header bg-dark text-white text-center py-4">
            <div className='container'>
                <div>
                    <form className="d-flex p-2 mb-3  mt-4 justify-content-center">
                        <input className="form-control text-center w-50" type="search" placeholder="Search for any product" aria-label="Search"></input>
                        <button className="btn btn-outline-success" type="submit">Search</button>
                    </form>
                </div>

                <nav>
                    <ul className='d-flex justify-content-between'>
                        <p><Link to="/products" className='text-decoration-none text-white'>Product Listing Page</Link></p>
                        <p><Link to="/cart" className='text-decoration-none text-white'><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-cart-fill" viewBox="0 0 16 16">
                            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" /> </svg>
                           </Link>
                        </p>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;