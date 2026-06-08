import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav,Navbar } from 'react-bootstrap';
import {BrowserRouter as Router,Route,Routes,Link } from 'react-router-dom';
import './App.css';
import Chatbot from "./Components/Chatbot";

function App()
{
    return(
        <Router>
            <div>
                <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 shadow-sm px-3">
                    <Navbar.Brand as={Link} to="/">Cold Outreach Email </Navbar.Brand>
                </Navbar>
                 <Chatbot/>
            </div>
        </Router>
    )
}

export default App;