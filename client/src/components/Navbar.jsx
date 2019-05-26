import React, { Component } from 'react';
import '../App.css';

class Navbar extends Component {
    state = {}
    render() {
        const tempLink = "https://www.madewell.com/womens/sale"
        return (
            <nav className="navbar navbar-expand-lg navbar-light fixed-top">
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                    <a className="navbar-brand" href={tempLink}>Garment</a>
                    <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                        <li className="nav-item active">
                            <button className="btn btn-brand-nav">
                                <img className="brand-logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Nordstrom_Logo.svg/1280px-Nordstrom_Logo.svg.png" alt="brandLogo" />
                            </button>
                        </li>
                        <li className="nav-item active">
                            <button className="btn btn-brand-nav">
                                <img className="brand-logo" src="https://brickworks-media-production.s3.amazonaws.com/logo/6/madewell-logo.png" alt="brandLogo" />
                            </button>
                        </li>
                    </ul>
                    <form className="form-inline my-2 my-lg-0">
                        <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                        <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                    </form>
                </div>
            </nav>
        );
    }
}

export default Navbar;