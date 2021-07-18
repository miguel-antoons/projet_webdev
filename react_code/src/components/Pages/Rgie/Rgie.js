import React from 'react';
import  { useState, useEffect } from 'react';
import * as BS from "react-bootstrap";
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import './regie.css';
import * as icon from 'react-icons/io5';


const Regie = () => {
    const hideNewArticleForm = {
        display: "None"
    };

    const showNewArticleForm = {
        display: "table-row"
    };

    const [rgieList, setRgieList] = useState([]);
    const [tempLibelle, setTempLibelle] = useState('');
    const [tempQuantite, setTempQuantite] = useState(0);
    const [tempPrix, setTempPrix] = useState(0);
    const [firstArticleTableRow, setFirstArticleTableRow] = useState(hideNewArticleForm);
    const [tempArticleName, setTempArticleName] = useState('');
    const [tempArticlePrice, setTempArticlePrice] = useState(0);
    const [tempArticleID, setTempArticleID] = useState(0);


    const postArticle = async () => {
        let id = 0;
        const article_name = tempArticleName;
        const article_price = tempArticlePrice;

        try {
            let result = await fetch(
                '/api/articles_rgie',
                {
                    method: 'post',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(
                        {
                            article_name,
                            article_price
                        }
                    )
                }
            );

            const data = await result.json();

            id = data['projectID'];
        }
        catch (e) {
            console.log(e);
            console.log('There was an error when calling the api during a post request');
        }

        try {
            id = Number(id);
        }
        catch (e) {
            console.log(e);
            console.log('error during id conversion from string to number --> id is not a number');
        }
    };


    const putArticle = async (articleID) => {
        console.log('temporar no update article list', articleID);
    }


    const updateArticleList = () => {
        if (tempArticleID) {
            putArticle(tempArticleID);
        }
        else {
            postArticle();
        }

        setFirstArticleTableRow('');
        setTempArticleID(0);
        setTempArticleName('');
        setTempArticlePrice(0);
    };


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
                <BS.Button onClick={ () => setFirstArticleTableRow(showNewArticleForm) } size="lg" variant="light" className="add_article">
                    <icon.IoDuplicate size="19pt"/> Nouveau
                </BS.Button>
                <MDBTable className="whiteTable" hover>
                    <MDBTableHead>
                        <tr>
                            <th scope='col' className="w-50">Libellé</th>
                            <th scope='col' className="w-25">Prix</th>
                            <th scope='col' className="w-25">Ajouter</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        <tr style={firstArticleTableRow}>
                            <td className="middleCell">
                                <input 
                                    type="text"
                                    placeholder="Libellé"
                                    className="newArticleRgie w-100"
                                    value={tempArticleName}
                                    onChange={(e) => setTempArticleName(e.target.value) }
                                    required
                                />
                            </td>
                            <td className="middleCell">
                            <input 
                                type="number"
                                placeholder="€"
                                className="newPrixRgie w-100"
                                value={tempArticlePrice}
                                onChange={ (e) => {setTempArticlePrice(e.target.value); console.log(tempArticlePrice);} }
                                required
                            />
                            </td>
                            <td>
                                <BS.Button onClick={ () => console.log("temporar") } className="deleteRowArticles" variant="light" >
                                    <icon.IoClose size="25px" />
                                </BS.Button>
                                <BS.Button onClick={ () => updateArticleList() } className="addRowRgie" variant="light">
                                    <icon.IoArrowDown size="25px" />
                                </BS.Button>
                            </td>
                        </tr>
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
                            <th className="w-50">Libellé</th>
                            <th className="w-25">Quantité</th>
                            <th className="w-25">Prix</th>
                            <th className="w-25">Tot.</th>
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
                                <td>
                                    {row.quantity * row.price}
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
                                    className="newRowRgie w-100"
                                    value={tempLibelle}
                                    onChange={(e) => setTempLibelle(e.target.value) }
                                    required
                                />
                            </td>
                            <td className="middleCell">
                                <input 
                                    type="number"
                                    placeholder="Qté"
                                    className="quantiteRgie w-100"
                                    value={tempQuantite}
                                    onChange={ (e) => setTempQuantite(e.target.value) }
                                    required
                                />
                            </td>
                            <td className="middleCell">
                                <input 
                                    type="number"
                                    placeholder="€"
                                    className="quantiteRgie w-100"
                                    value={tempPrix}
                                    onChange={ (e) => setTempPrix(e.target.value) }
                                    required
                                />
                            </td>
                            <td>
                                {tempPrix * tempQuantite}
                            </td>
                        </tr>
                    </tbody>
                </BS.Table>
            </BS.Col>
        </BS.Row>
    );
};


export default Regie;
