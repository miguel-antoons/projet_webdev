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
                    <td>Leuvensebaan 201 a, 3040</td>
                    <td>13 Janvier 2021</td>
                    <td className='last_column'>
                        <BS.Row>
                            <BS.Col className='button_container' >
                                <BoutonRapide icon={<icon.IoTrash />} text="  Suprimmer" css_variant={true} />
                            </BS.Col>
                            <BS.Col className='button_container'>
                                <BoutonRapide icon={<icon.IoPrint />} text="  Imprimer" />
                            </BS.Col>
                            <BS.Col className='button_container'>
                                <BoutonRapide icon={<icon.IoOpen />} text="  Ouvrir" />
                            </BS.Col>
                        </BS.Row>
                    </td>
                </tr>
            </tbody>
        </BS.Table>
    );
};

export default TableauProjets;
