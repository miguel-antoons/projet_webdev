import React from 'react';
import  { useState, useEffect } from 'react';
import * as BS from "react-bootstrap";
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import './regie.css';
import * as icon from 'react-icons/io5';


const Regie = () => {
    const [rgieList, setRgieList] = useState([]);
    const [tempLibelle, setTempLibelle] = useState('');
    const [tempQuantite, setTempQuantite] = useState(0);
    const [tempPrix, setTempPrix] = useState(0);
    const [firstArticleTableRow, setFirstArticleTableRow] = useState('');


    const addArticleForm = (
        <tr>
            <td className="middleCell">
                <input 
                    type="text"
                    placeholder="Libellé"
                    className="newArticleRgie"
                    value={tempLibelle}
                    onChange={(e) => setTempLibelle(e.target.value) }
                    required
                />
            </td>
            <td className="middleCell">
            <input 
                type="number"
                placeholder="€"
                className="newPrixRgie"
                value={tempPrix}
                onChange={ (e) => setTempPrix(e.target.value) }
                required
            />
            </td>
            <td>
                <BS.Button onClick={ () => console.log("temporar") } className="deleteRowArticles" variant="light" >
                    <icon.IoClose size="25px" />
                </BS.Button>
                <BS.Button className="addRowRgie" variant="light">
                    <icon.IoArrowDown size="25px" />
                </BS.Button>
            </td>
        </tr>
    );


    const addCustomRow = () => {
        let rgieListCopy = rgieList.slice();

        rgieListCopy.push({
            libelle: tempLibelle,
            quantity: tempQuantite,
            price: tempPrix
        });

        setRgieList(rgieListCopy);

        setTempLibelle('');
        setTempPrix(0);
        setTempQuantite(0);
    };


    const deleteRowRgie = (indexToDelete) => {
        let rgieListCopy = rgieList.splice();

        rgieListCopy.splice(indexToDelete);
        setRgieList(rgieListCopy);
    };

    return (
        <BS.Row className="no_margin">
            <BS.Col lg="6">
                <BS.Button onClick={ () => setFirstArticleTableRow(addArticleForm) } size="lg" variant="light" className="add_article">
                    <icon.IoDuplicate size="19pt"/> Nouveau
                </BS.Button>
                <MDBTable className="whiteTable" hover>
                    <MDBTableHead>
                        <tr>
                            <th scope='col'>Libellé</th>
                            <th scope='col'>Prix</th>
                            <th scope='col'>Ajouter</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {firstArticleTableRow}
                        <tr>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>
                                <BS.Button className="modifyRowRgie" variant="light">
                                    <icon.IoBuild size="25px" />
                                </BS.Button>
                                <BS.Button className="addRowRgie" variant="light">
                                    <icon.IoArrowForward size="25px" />
                                </BS.Button>
                            </td>
                        </tr>
                    </MDBTableBody>
                </MDBTable>
            </BS.Col>
            <BS.Col lg="6">
                <BS.Button size="lg" variant="light" className="addCustom" onClick={ () => addCustomRow() }>
                    <icon.IoAddCircle size="19pt"/> Ajouter
                </BS.Button>
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
                        {rgieList.map( (row, index) => (
                            <tr key={index}>
                                <td>
                                    <BS.Button onClick={ () => deleteRowRgie(index) } className="deleteRowRgie" variant="light" >
                                        <icon.IoClose size="25px" />
                                    </BS.Button>
                                </td>
                                <td>
                                    {row.libelle}
                                </td>
                                <td className="alignRight">
                                    {row.quantity}
                                </td>
                                <td className="alignRight">
                                    {row.price}
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td>
                                <BS.Button className="deleteRowRgie" variant="light" disabled>
                                    <icon.IoClose size="25px" />
                                </BS.Button>
                            </td>
                            <td className="middleCell">
                                <input 
                                    type="text"
                                    placeholder="Article"
                                    className="newRowRgie"
                                    value={tempLibelle}
                                    onChange={(e) => setTempLibelle(e.target.value) }
                                    required
                                />
                            </td>
                            <td className="middleCell">
                                <input 
                                    type="number"
                                    placeholder="Qté"
                                    className="quantiteRgie"
                                    value={tempQuantite}
                                    onChange={ (e) => setTempQuantite(e.target.value) }
                                    required
                                />
                            </td>
                            <td className="middleCell">
                                <input 
                                    type="number"
                                    placeholder="€"
                                    className="quantiteRgie"
                                    value={tempPrix}
                                    onChange={ (e) => setTempPrix(e.target.value) }
                                    required
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
