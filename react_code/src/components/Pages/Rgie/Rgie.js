import React from 'react';
import  { useState, useEffect } from 'react';
import * as BS from "react-bootstrap";
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import './regie.css';
import * as icon from 'react-icons/io5';
import { MDBBtn, MDBIcon } from 'mdb-react-ui-kit';


const Regie = () => {
    return (
        <BS.Row>
            <BS.Col lg="6">
                <BS.Button size="lg" variant="light" className="add_article"><icon.IoDuplicate size="19pt"/> Nouveau</BS.Button>
                <MDBTable className="whiteTable" hover>
                    <MDBTableHead>
                        <tr>
                            <th scope='col'>Libellé</th>
                            <th scope='col'>Prix</th>
                            <th scope='col'>Ajouter</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        <tr>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                        </tr>
                        <tr>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                        </tr>
                    </MDBTableBody>
                </MDBTable>
            </BS.Col>
            <BS.Col lg="6">
                <BS.Button size="lg" variant="light" className="addCustom"><icon.IoAddCircle size="19pt"/> Ajouter</BS.Button>
                <BS.Table className="roundTable" striped hover variant="dark">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Libellé</th>
                            <th>Quantité</th>
                            <th>Prix</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <BS.Button className="deleteRowRgie" variant="light">
                                    <icon.IoClose size="25px" />
                                </BS.Button>
                            </td>
                            <td className="middleCell">
                                <input 
                                    type="text"
                                    placeholder="Article"
                                    className="newRowRgie"
                                />
                            </td>
                            <td className="middleCell">
                                <input 
                                    type="number"
                                    placeholder="Qté"
                                    className="quantiteRgie"
                                />
                            </td>
                            <td className="middleCell">
                                <input 
                                    type="number"
                                    placeholder="Qté"
                                    className="quantiteRgie"
                                />
                            </td>
                        </tr>
                    </tbody>
                </BS.Table>
            </BS.Col>
        </BS.Row>
    );
};


export default Regie;
