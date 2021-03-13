import React from 'react';
import * as BS from "react-bootstrap"
import logoNavbar from "./navbar_logo.png"

function Navbar() {
    return (
        <BS.Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <BS.Navbar.Brand href="#home">
                <img
                    alt=""
                    src={logoNavbar}
                    width="30"
                    height="30"
                    className="d-inline-block align-top"
                />{' '}
                Factevis
            </BS.Navbar.Brand>
            <BS.Navbar.Toggle aria-controls="responsive-BS.Navbar-BS.Nav"/>
            <BS.Navbar.Collapse id="responsive-BS.Navbar-BS.Nav">
                <BS.Nav className="mr-auto">
                    <BS.Nav.Link href="#features">Factures</BS.Nav.Link>
                    <BS.Nav.Link href="#pricing">Devis</BS.Nav.Link>
                    <BS.Nav.Link href="#pricing">Étiquetage</BS.Nav.Link>
                    <BS.Nav.Link href="#pricing">Suivi de matériel</BS.Nav.Link>
                    <BS.NavDropdown title="Modifier/Ajouter" id="collasible-BS.Nav-dropdown">
                        <BS.NavDropdown.Item href="#action/3.1">Client</BS.NavDropdown.Item>
                        <BS.NavDropdown.Item href="#action/3.2">Articles</BS.NavDropdown.Item>
                        <BS.NavDropdown.Item href="#action/3.3">Articles bis</BS.NavDropdown.Item>
                        <BS.NavDropdown.Divider/>
                    </BS.NavDropdown>
                </BS.Nav>
                {/*
                    <BS.Nav>
                        <BS.Nav.Link href="#deets"></BS.Nav.Link>
                        <BS.Nav.Link eventKey={2} href="#memes">
                            Dank memes
                        </BS.Nav.Link>
                    </BS.Nav>
                */}
            </BS.Navbar.Collapse>
        </BS.Navbar>
    )
}


export default Navbar;