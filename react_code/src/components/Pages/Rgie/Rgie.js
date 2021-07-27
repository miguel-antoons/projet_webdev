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
    const [articleList, setArticleList] = useState([]);
    const [tempLibelle, setTempLibelle] = useState('');
    const [tempQuantite, setTempQuantite] = useState(0);
    const [tempPrix, setTempPrix] = useState(0);
    const [firstArticleTableRow, setFirstArticleTableRow] = useState(hideNewArticleForm);
    const [tempArticleName, setTempArticleName] = useState('');
    const [tempArticlePrice, setTempArticlePrice] = useState(0);
    const [tempArticlePrice2, setTempArticlePrice2] = useState(0);
    const [tempArticleID, setTempArticleID] = useState(0);
    const [tempArticleIndex, setTempArticleIndex] = useState(0);


    const verifyError = (numberToVerify) => {
        try {
            let newNumber = Number(numberToVerify);

            if (!newNumber) {
                console.log('The number returned has a null value --> something went wrong at back-end');
                return true;
            }
        }
        catch (e) {
            console.log(e);
            console.log('error during value conversion from string to number --> value is not a number');
            return true;
        }

        if (numberToVerify.length) {
            console.log("Length of value was greater then 0");
            return false;
        }

        return false;
    };


    const getAllArticles = async () => {
        try {
            let result = await fetch(
                '/api/articles_rgie/',
                {
                    method: 'get'
                }
            );

            const data = await result.json();

            setArticleList(data);
        }
        catch (e) {
            console.log(
                "Somethine went wrong during the fetch of the rgie articles.", 
                " Please refer to the following error for more information"
            );
            console.log(e);
        }
    };

    useEffect(() => {
        getAllArticles();
    }, []);


    const postArticle = async () => {
        let id = 0;
        let error = false;
        const article_name = tempArticleName;
        const article_price = tempArticlePrice;
        const article_price2 = tempArticlePrice2;

        try {
            let result = await fetch(
                '/api/articles_rgie/',
                {
                    method: 'post',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(
                        {
                            article_name,
                            article_price,
                            article_price2
                        }
                    )
                }
            );

            const data = await result.json();
            id = data['projectID'];
            error = verifyError(id);
        }
        catch (e) {
            error = true;
            console.log(e);
            console.log('There was an error when calling the api during a post request');
        }

        if (error) {
            console.log("due to a previous api error, the article list wasn't updated with the new article");
        }
        else {
            let articleListCopy = articleList.slice();

            articleListCopy.push(
                {
                    articleID: id,
                    article_name: article_name,
                    article_price: article_price,
                    article_price2: article_price2
                }
            );

            setArticleList(articleListCopy);
        }
    };


    const putArticle = async (articleID, indexToUpdate) => {
        let id = 0;
        let error = false;
        const article_name = tempArticleName;
        const article_price = tempArticlePrice;
        const article_price2 = tempArticlePrice2;

        try {
            let result = await fetch(
                `/api/articles_rgie/${articleID}`,
                {
                    method: 'put',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(
                        {
                            article_name,
                            article_price,
                            article_price2
                        }
                    )
                }
            );

            const data = await result.json();
            id = data['projectID'];
            error = verifyError(id);
        }
        catch (e) {
            error = true;
            console.log(e);
            console.log('There was an error when calling the api during a post request');
        }

        if (error) {
            console.log("due to a previous api error, the article list wasn't updated with the new article");
        }
        else {
            let articleListCopy = articleList.slice();

            articleListCopy[indexToUpdate]['article_name'] = article_name;
            articleListCopy[indexToUpdate]['article_price'] = article_price;
            articleListCopy[indexToUpdate]['article_price2'] = article_price2;

            setArticleList(articleListCopy);
        }
    };


    const deletArticle = async () => {
        let error = false;
        let id = 0;

        try {
            let result = await fetch(
                `/api/articles_rgie/${articleList[tempArticleIndex].articleID}`,
                {
                    method: 'delete'
                }
            );

            id = await result.json();
            error = verifyError(id);
        }
        catch (e) {
            error = false;
            console.log(
                "There was an error during the api for deleting an rgie article.",
                " Please refer to the following error for more information."
            );
            console.log(e);
        }

        if (!error) {
            console.log(
                "Since there was an error, the article table was not updated.",
                " This is normal and will solve itself after the error is solved"
            );
        }
        else {
            let articleListCopy = articleList.slice();
            let articleIDToDelete = tempArticleIndex;

            articleListCopy.splice(articleIDToDelete);
            setArticleList(articleListCopy);
            resetNewArticleForm();
        }
    };


    const resetNewArticleForm = () => {
        setFirstArticleTableRow(hideNewArticleForm);
        setTempArticleID(0);
        setTempArticleName('');
        setTempArticlePrice(0);
        setTempArticlePrice2(0);
        setTempArticleIndex(0);
    };


    const updateArticleList = () => {
        if (tempArticleID) {
            putArticle(tempArticleID, tempArticleIndex);
        }
        else {
            postArticle();
        }

        resetNewArticleForm();
    };


    const modifyArticle = (index) => {
        setTempArticleIndex(index);
        setTempArticleID(articleList[index].articleID);
        setTempArticleName(articleList[index].article_name);
        setTempArticlePrice(articleList[index].article_price);
        setTempArticlePrice2(articleList[index].article_price2);
        setFirstArticleTableRow(showNewArticleForm);
    };


    const closeArticleForm = () => {
        if (tempArticleID) {
            deletArticle();
        }
        else {
            resetNewArticleForm();
        }
    };


    const addArticleToRgie = (articleIndex, price1) => {
        let rgieListCopy = rgieList.slice();
        let price = 0;
        let existingArticleInRgieList = 0;

        if (price1) {
            price = articleList[articleIndex].article_price;
        }
        else {
            price = articleList[articleIndex].article_price2;
        }

        existingArticleInRgieList = checkIfInRgieList(articleIndex, price);

        if (existingArticleInRgieList) {
            addQuantity((existingArticleInRgieList - 1));
            return 0;
        }

        rgieListCopy.push(
            {
                articleID: articleList[articleIndex].articleID,
                libelle: articleList[articleIndex].article_name,
                quantity: 1,
                price: price
            }
        );

        setRgieList(rgieListCopy);
    };


    const checkIfInRgieList = (articleIndex, price1) => {
        for (let i in rgieList) {
            if (rgieList[i].articleID === articleList[articleIndex].articleID && rgieList[i].price === price1) {
                return (i + 1);
            }
        }

        return false;
    };


    const addQuantity = (rgieListIndex) => {
        let rgieListCopy = rgieList.slice();

        rgieListCopy[rgieListIndex].quantity++;
        setRgieList(rgieListCopy);
    };


    const addCustomRow = () => {
        let rgieListCopy = rgieList.slice();

        rgieListCopy.push({
            articleID: 0,
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
        let rgieListCopy = rgieList.slice();

        rgieListCopy.splice(indexToDelete);
        setRgieList(rgieListCopy);
    };


    const setNewQuantity = (indexToModify, newValue) => {
        let rgieListCopy = rgieList.slice();

        rgieListCopy[indexToModify].quantity = newValue;
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
                            <th scope='col' className="w-25">Prix 1</th>
                            <th scope='col' className="w-25">Prix 2</th>
                            <th scope='col' className="w-25">Modifier/Ajouter</th>
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
                                onChange={ (e) => {setTempArticlePrice(e.target.value);} }
                                required
                            />
                            </td>
                            <td className="middleCell">
                                <input 
                                    type="number"
                                    placeholder="€"
                                    className="newPrixRgie w-100"
                                    value={tempArticlePrice2}
                                    onChange={ (e) => {setTempArticlePrice2(e.target.value);} }
                                    required
                                />
                            </td>
                            <td>
                                <BS.Button onClick={ () => closeArticleForm() } className="deleteRowArticles" variant="light" >
                                    <icon.IoClose size="25px" />
                                </BS.Button>
                                <BS.Button onClick={ () => updateArticleList() } className="addRowRgie" variant="light">
                                    <icon.IoArrowDown size="25px" />
                                </BS.Button>
                            </td>
                        </tr>
                        {articleList.map((article, index) => (
                            <tr key={index}>
                                <td>
                                    {article.article_name}
                                </td>
                                <td>
                                    {article.article_price}
                                </td>
                                <td>
                                    {article.article_price2}
                                </td>
                                <td>
                                    <BS.Button onClick={ () => modifyArticle(index) } className="modifyRowRgie" variant="light">
                                        <icon.IoBuild size="25px" />
                                    </BS.Button>
                                    <BS.Button onClick={ () => addArticleToRgie(index, 1) } className="addRowRgie" variant="light">
                                        <icon.IoArrowForward size="25px" />
                                    </BS.Button>
                                </td>
                            </tr>
                        ))}
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
                                <td className="alignRight middleCell">
                                    <input 
                                        type="number"
                                        placeholder="Qté"
                                        className="quantiteRgie w-100"
                                        value={row.quantity}
                                        onChange={ (e) => setNewQuantity(index, e.target.value) }
                                        required
                                    />
                                </td>
                                <td className="alignRight">
                                    {row.price}
                                </td>
                                <td>
                                    {row.quantity * row.price}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </BS.Table>
            </BS.Col>
        </BS.Row>
    );
};


export default Regie;
