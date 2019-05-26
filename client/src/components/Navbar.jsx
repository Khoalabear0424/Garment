import React, { Component } from 'react';
import '../App.css';

class Navbar extends Component {
    state = {}
    render() {
        const tempLink = "https://www.madewell.com/womens/sale"
        return (
            <nav className="navbar navbar-expand-lg navbar-light fixed-top">
                <div className="row nav-row">
                    <div className="col-2">
                        <a className="navbar-brand app-name" href={tempLink}>Garment</a>
                    </div>
                    <div className="col-10">
                        <ul className="navbar-nav">
                            <li className="btn-brand-nav">
                                <button className="btn">
                                    <a href="https://shop.nordstrom.com/c/all-womens-sale">
                                        <img className="brand-logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Nordstrom_Logo.svg/1280px-Nordstrom_Logo.svg.png" alt="brandLogo" />
                                    </a>
                                </button>
                            </li>
                            <li className="btn-brand-nav">
                                <button className="btn">
                                    <a href="https://www.madewell.com/womens/sale">
                                        <img className="brand-logo" src="https://brickworks-media-production.s3.amazonaws.com/logo/6/madewell-logo.png" alt="brandLogo" />
                                    </a>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

export default Navbar;