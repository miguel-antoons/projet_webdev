import React from 'react';
import * as BS from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap'
import logoNavbar from "./navbar_logo.png";

function Navbar() {
    return (
        <BS.Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <LinkContainer to='/'>
                <BS.Navbar.Brand>
                    <img
                        alt=""
                        src={logoNavbar}
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                    />{' '}
                    Factevis
                </BS.Navbar.Brand>
            </LinkContainer>
            <BS.Navbar.Toggle aria-controls="responsive-BS.Navbar-BS.Nav"/>
            <BS.Navbar.Collapse id="responsive-BS.Navbar-BS.Nav">
                <BS.Nav className="mr-auto">
                    
                    <LinkContainer to='/projets_factures'>
                        <BS.Nav.Link>Factures</BS.Nav.Link>
                    </LinkContainer>
                    <LinkContainer to='/projets_devis'>
                        <BS.Nav.Link>Devis</BS.Nav.Link>
                    </LinkContainer>
                    <LinkContainer to='/projets_etiquettes'>
                        <BS.Nav.Link>Étiquetage</BS.Nav.Link>
                    </LinkContainer>
                    <LinkContainer to='/suivi'>
                        <BS.Nav.Link>Suivi de matériel</BS.Nav.Link>
                    </LinkContainer>
                    
                    <LinkContainer to='/rassemblement_clients'>
                        <BS.Nav.Link>Client</BS.Nav.Link>
                    </LinkContainer>
                    <LinkContainer to='/projets_rgie'>
                        <BS.Nav.Link>Rgie</BS.Nav.Link>
                    </LinkContainer>
                    <LinkContainer to='/rassemblement_articles'>
                        <BS.Nav.Link>Articles</BS.Nav.Link>
                    </LinkContainer>
                    <BS.NavDropdown.Divider/>
                    
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