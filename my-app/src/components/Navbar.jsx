
import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LangContext } from '../App';


export const NavBar = () => {
    // Hacemos uso del contexto para mostrar correctamente traducidos los enlaces a los juegos
    const { dictionary } = useContext(LangContext)

    return (
    <nav className='nav nav-tabs' role="tablist">
    <NavLink className={({ isActive }) =>
        "nav-link" + (isActive ? " selected" : "")}
        to="/">{dictionary.links.home}</NavLink>
    <NavLink className={({ isActive }) =>
        "nav-link" + (isActive ? " selected" : "")}
        to="/tictactoe">{dictionary.links.tictactoe}</NavLink>
    <NavLink className={({ isActive }) =>
        "nav-link" + (isActive ? " selected" : "")}
        to="/quiz">{dictionary.links.quiz}</NavLink>
    </nav>
    )
}

