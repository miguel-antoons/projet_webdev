import React from 'react';
import Button from '../../Home/Button.js';
import * as icon from 'react-icons/io5';
import * as BS from "react-bootstrap";
import './Home.css';


const Home = () => {

    return (
        <BS.Container fluid className="div pt-3">
            <div className="d-flex justify-content-center div">
                <BS.Col lg="2"></BS.Col>
                <BS.Col md="auto" className="div">
                    <Button icon={ <icon.IoDocumentText /> } text='Factures' bd_color='#940000' icon_color='#f2003c' destination='/projets_factures' />
                    <Button icon={ <icon.IoDocuments /> } text='Devis' bd_color='#947e00' icon_color='#ffcc33' destination='/projets_devis' />
                </BS.Col>
                <BS.Col lg="2"></BS.Col>
            </div>
            <div className="d-flex justify-content-center">
                <BS.Col lg="2"></BS.Col>
                <BS.Col md="auto" className="div">
                    <Button icon={ <icon.IoPeople /> } text='Clients' bd_color='#004d00' icon_color='#2e8b57' destination='/rassemblement_clients' />
                    <Button icon={ <icon.IoCube /> } text='Articles' bd_color='#002147' icon_color='#006db0' destination='/rassemblement_articles' />
                </BS.Col>
                <BS.Col lg="2"></BS.Col>
            </div>
            <div className="d-flex justify-content-center">
                <BS.Col lg="2"></BS.Col>
                <BS.Col md="auto" className="div">
                    <Button icon={ <icon.IoGrid /> } text='Étiquettes' bd_color='#b37400' icon_color='#ff8c00' destination='/projets_etiquettes' />
                    <Button icon={ <icon.IoCreate /> } text='Rgie' bd_color='#66023c' icon_color='purple' destination='/projets_rgie' />
                </BS.Col>
                <BS.Col lg="2"></BS.Col>
            </div>
            <div className="d-flex justify-content-center">
                <BS.Col lg="2"></BS.Col>
                <BS.Col md="auto" className="div">
                    <Button icon={ <icon.IoCompass /> } text='Suivi de Matériel' bd_color='#005b5b' icon_color='#009698' destination='/suivi' />
                    <Button icon={ <icon.IoSettings /> } text='Paramètres' bd_color='#000014' icon_color='#23297a' destination='/parametrage' />
                </BS.Col>
                <BS.Col lg="2"></BS.Col>
            </div>
        </BS.Container>
    );
};


export default Home;