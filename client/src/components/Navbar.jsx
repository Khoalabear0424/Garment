import React, { Component } from 'react';
import '../App.css';

class Navbar extends Component {
    state = {}
    render() {
        return (
            <div>
                <nav className="navbar">
                    <a className="navbar-brand" href="#">Page Title</a>
                    <div id="navbarNav">
                        <div className="nav-item active">
                            <a className="nav-link" href="/">Home</a>
                        </div>
                        <div className="nav-item active">
                            <a className="nav-link" href="/shopping">Shopping</a>
                        </div>
                        <div className="nav-item active">
                            <a className="nav-link" href="/saved">Saved</a>
                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}

export default Navbar;