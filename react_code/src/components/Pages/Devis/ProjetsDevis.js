import React from 'react';
import * as icon from 'react-icons/io5';
import * as BS from "react-bootstrap";
import { Filter } from '../../ProjetListe/Filter.js'
import { recherche, filtre } from './ProjetsDevis.css';


function ProjetsDevis () {
    return (
        <BS.Container fluid style={{ margin: 0, padding: 0 }}>
            <BS.Jumbotron>
                <h1>Bienvenue dans Devis</h1>
                <div className="d-flex justify-content-center">
                    <BS.Col lg="2" xs></BS.Col>
                    <BS.Col md="auto">
                        <input type="text" className="form-control form-control-lg recherche" placeholder="Rechercher . . ." />
                        <select className="form-control form-control-lg shadow-none bg-transparent filtre">
                            <option>A-Z Client</option>
                            <option>A-Z Chantier</option>
                            <option>Z-A Client</option>
                            <option>Z-A Chantier</option>
                            <option>Récent à Ancien</option>
                            <option>Ancien à Récent</option>
                        </select>
                        <Filter />
                    </BS.Col>
                    <BS.Col lg="2" xs></BS.Col>
                </div>
            </BS.Jumbotron>     
        </BS.Container>
    )
};




export default ProjetsDevis;