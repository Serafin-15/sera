import React from "react";
import { Link } from 'react-router-dom';
export default function welcome(){
    return(
    <header>
        <h1 className='title'>Serafin</h1>
        <p>Welcome to your families favorite planning app!</p>
        <Link to={`/login`} className= "login-btn">Login</Link>
    </header>
    )
};