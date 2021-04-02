import React from 'react';
import * as BS from "react-bootstrap";
import './ProjetListe.css';
import * as icon from 'react-icons/io5'
import BoutonRapide from './BoutonRapide.js';

const TableauProjets = () => {
    return (
        <BS.Table>
            <thead>
                <th>#</th>
                <th>Client</th>
                <th>Chantier</th>
                <th>Date</th>
                <th>Actions</th>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td>Matexi NV</td>
                    <td>Lot 456</td>
                    <td>13 Janvier 2021</td>
                    <td><BoutonRapide icon={icon.IoPencil} /><BoutonRapide /><BoutonRapide /></td>
                </tr>
            </tbody>
        </BS.Table>
    );
};

export default TableauProjets;
