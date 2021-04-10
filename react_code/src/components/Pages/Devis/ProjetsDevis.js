import React from 'react';
import * as icon from 'react-icons/io5';
import * as BS from "react-bootstrap";
import Filter from '../../ProjetListe/Filter.js';
import TableauProjets from '../../ProjetListe/TableauProjets';
import './ProjetsDevis.css';
import { LinkContainer } from 'react-router-bootstrap';


function ProjetsDevis () {
    return (
        <BS.Container fluid style={{ margin: 0, padding: 0 }}>
            <BS.Jumbotron>
                <h1 className='d-inline-block'>Bienvenue dans Devis</h1>
                <LinkContainer to='/devis'>
                    <BS.Button className='float-right d-inline-block add_project' size='lg' variant='light'>
                            <icon.IoAddCircle style={{margin: 'auto'}} size={30}/>
                            <span style={{margin: 'auto'}}>   Nouveau</span>
                    </BS.Button>
                </LinkContainer>
                <div className="d-flex justify-content-center">
                    <BS.Col lg="2" xs></BS.Col>
                    <BS.Col md="auto">
                        <input type="text" className="form-control form-control-lg recherche" placeholder="Rechercher . . ." />
                        <select className="form-control form-control-lg shadow-none bg-transparent filtre">
                            <option key="AZClient">A-Z Client</option>
                            <option key="AZChantier">A-Z Chantier</option>
                            <option key="ZAClient">Z-A Client</option>
                            <option key="ZAChantier">Z-A Chantier</option>
                            <option key="newold">Récent à Ancien</option>
                            <option key="oldnew">Ancien à Récent</option>
                        </select>
                        <Filter />
                    </BS.Col>
                    <BS.Col lg="2" xs></BS.Col>
                </div>
            </BS.Jumbotron> 
            <BS.Table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Client</th>
                        <th>Chantier</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <TableauProjets />
                </tbody>
            </BS.Table> 
        </BS.Container>
    )
};




export default ProjetsDevis;