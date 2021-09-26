import React from 'react';
import  { useState, useEffect } from 'react';
import * as BS from "react-bootstrap";
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import './regie.css';
import * as icon from 'react-icons/io5';
import Select from "react-select";


const Regie = (props) => {
    // 2 folowing variables contain css info in order to hide
    // or not the form for a new rgie article
    const hideNewArticleForm = {
        display: "None"
    };

    const showNewArticleForm = {
        display: "table-row"
    };

    const [rgieList, setRgieList] = useState([]);                                           // all the articles the rgie list contains (the right table)
    const [rgieID, setRgieID] = useState(Number(props.match.params.id));                    // the id of the rgie project (if 0 --> no id is assigned yet)
    const [articleList, setArticleList] = useState([]);                                     // all the articles available for rgie
    const [tempLibelle, setTempLibelle] = useState('');                                     // temp label of a custom article, this becomes permanent once the custom article is added to the list
    const [tempQuantite, setTempQuantite] = useState(0);                                    // temp quantity of a custom article, this becomes permanent once the custom article is added to the list
    const [tempPrix, setTempPrix] = useState(0);                                            // temp price of a custom article, this becomes permanent once the custom article is added to the list
    const [firstArticleTableRow, setFirstArticleTableRow] = useState(hideNewArticleForm);   // contains which css rules to apply on the first row of the article table (the left one)
    const [tempArticleName, setTempArticleName] = useState('');                             // contains temporar new article name, before its creation
    const [tempArticlePrice, setTempArticlePrice] = useState(0);                            // contains temporar new article price1, before its creation
    const [tempArticlePrice2, setTempArticlePrice2] = useState(0);                          // contains temporar new article price 2, before its creation
    const [tempArticleID, setTempArticleID] = useState(0);                                  // ID of the article that is being modified in the article array (left table) if id === 0 --> new article is about to be created
    const [tempArticleIndex, setTempArticleIndex] = useState(0);                            // index of the article that is being modified in the article table
    const [constructionSite, setConstructionSite] = useState('');                           // contains the construction site of the project
    const [clients, setClients] = useState([]);                                             // contains the list of all the clients from the database
    const [selectedClient, setSelectedClient] = useState(0);                                // contains the clientID from whom this project belongs
    const [deletedArticles, setDeletedArticles] = useState([]);                             // contains the list of deleted articles

    /**
     * This function will say, from the variable it receives as argument
     * if a problem happened to an API or not. It will, if a problem happened
     * log an according message in the console.
     * If the argument does not pass the test, false is returned. Else, true
     * is returned
     * 
     * @param {*} numberToVerify variable from which we caan say if there is a problem or not
     * @returns false if error, true if not
     */
    const verifyError = (numberToVerify) => {
        // first we verify if it is a number
        try {
            let newNumber = Number(numberToVerify);

            // then we verify if the number is not 0
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

        // we check the length of the element to verify
        if (numberToVerify.length) {
            console.log("Length of value was greater then 0");
            return false;
        }

        return false;
    };

    /**
     * API - GET
     * Function will call back-end and ask to send all the clients
     * Then it will store the clients in a state variable
     */
    const getClients = async () => {
        try {
            let tempClients = [];

            // here we send a request to the back-end
            let result = await fetch(
                '/api/client',
                {
                    method: 'get'
                }
            );

            // we wait for the data (the clients) and convert them to a javascript array
            const data = await result.json();

            // we decompose the received data and reorganize them in a javascript object
            for (let i in data) {
                tempClients.push(
                    {value: data[i].id, label: `${data[i].id}  ${data[i].attribute1}`}
                );
            }

            // we set the state variable
            setClients(tempClients);
        }
        catch (e) {
            console.log(e);
        }
    };

    /**
     * API - GET
     * function fetches all the rgie articles and puts them
     * in a state variable
     */
    const getAllArticles = async () => {
        try {
            // first, fetch from back-end
            let result = await fetch(
                '/api/articles_rgie/',
                {
                    method: 'get'
                }
            );

            // wait for the data and convert to a javascript array
            const data = await result.json();

            // store it in a state variable
            setArticleList(data);
        }
        catch (e) {
            console.log(
                "Something went wrong during the fetch of the rgie articles.", 
                " Please refer to the following error for more information"
            );
            console.log(e);
        }
    };

    /**
     * This will execute the appropriate functions
     * when the rgie program is being launched/opened
     */
    useEffect(() => {
        getAllArticles();

        // if ther is and ID --> meaning the user is opening an existing project
        if (rgieID) {
            getRgieProject();
        }

        getClients();
    // eslint-disable-next-line
    }, []);

    /**
     * API - POST
     * Sends a new article to the back-end to store it permanently
     */
    const postArticle = async () => {
        let id = 0;                                 // variable where the ID of the newly created article will be stored
        let error = false;                          // variable tells if ther is an error (true) or not (false)
        const article_name = tempArticleName;       // variable contains the article name of the new article
        const article_price = tempArticlePrice;     // variable contains the first price of the new article
        const article_price2 = tempArticlePrice2;   // variable contains the second price of the new article

        try {
            // send the article to back-end with all of its data
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

            // wait for the new id and store it in a local variable
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
            // store the article with its id in the article state array
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

    /**
     * API - PUT
     * Function updates an article by sending its new values
     * to the back-end
     * @param {int} articleID the article ID to update
     * @param {int} indexToUpdate the article index in the rgieList array
     */
    const putArticle = async (articleID, indexToUpdate) => {
        let id = 0;                                 // will receive the result of the back-end
        let error = false;                          // indicates if ther is an error, if so the value will be true
        const article_name = tempArticleName;       // contains the article name of the article to update
        const article_price = tempArticlePrice;     // contains the first price of the article to update
        const article_price2 = tempArticlePrice2;   // contains the second price of the article to update

        try {
            // send the new data for the article to back-end
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

            // wait for the return id and store it
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
            // if no error happened, update the values in the article array
            let articleListCopy = articleList.slice();

            articleListCopy[indexToUpdate]['article_name'] = article_name;
            articleListCopy[indexToUpdate]['article_price'] = article_price;
            articleListCopy[indexToUpdate]['article_price2'] = article_price2;

            setArticleList(articleListCopy);
        }
    };

    /**
     * API - DELETE
     * Function sends a request to delete an article
     */
    const deletArticle = async () => {
        let error = false;  // indicates if there is an error, if so value will be true
        let id = 0;         // receives the result sent by back-end

        try {
            // send the request with the article ID
            let result = await fetch(
                `/api/articles_rgie/${articleList[tempArticleIndex].articleID}`,
                {
                    method: 'delete'
                }
            );

            // wait for the back-end result and verify if there was an error
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
            // if no error occured
            // update the article list by deleting the deleted article
            let articleListCopy = articleList.slice();
            let articleIDToDelete = tempArticleIndex;

            articleListCopy.splice(articleIDToDelete);
            setArticleList(articleListCopy);
            resetNewArticleForm();
        }
    };

    /**
     * Function resets all the state varaibles linked to the new article form.
     * This will also hide the new article form
     */
    const resetNewArticleForm = () => {
        setFirstArticleTableRow(hideNewArticleForm);
        setTempArticleID(0);
        setTempArticleName('');
        setTempArticlePrice(0);
        setTempArticlePrice2(0);
        setTempArticleIndex(0);
    };

    /**
     * Function is called on submit button of new article form.
     * This function decides, according to the fact if the article already exists or not,
     * to update or to create a new article.
     */
    const updateArticleList = () => {
        if (tempArticleID) {
            // if the article ID != 0 --> the article exists
            putArticle(tempArticleID, tempArticleIndex);
        }
        else {
            postArticle();
        }

        resetNewArticleForm();
    };

    /**
     * When the user wants to modify an article, this
     * function is called and will fill in the inputs of the new
     * article form with the values of the article to modify
     * @param {int} index the index of the article to modify in the article list
     */
    const modifyArticle = (index) => {
        setTempArticleIndex(index);
        setTempArticleID(articleList[index].articleID);
        setTempArticleName(articleList[index].article_name);
        setTempArticlePrice(articleList[index].article_price);
        setTempArticlePrice2(articleList[index].article_price2);
        setFirstArticleTableRow(showNewArticleForm);
    };

    // TODO verify user experience !!!
    /**
     * Function decides what to do when the user clicks on the red cross
     * Either it closes the new article form or it deletes the article being modified
     */
    const closeArticleForm = () => {
        if (tempArticleID) {
            deletArticle();
        }
        else {
            resetNewArticleForm();
        }
    };

    /**
     * Adds an article to Rgie list, or increases its quantity if 
     * the article is already present in rgieList
     * @param {int} articleIndex index of the article in the article array
     * @param {bool} price1 checks which price to take : true --> price1 , false --> price2
     * @returns if the article already is in rgieList
     */
    const addArticleToRgie = (articleIndex, price1) => {
        let rgieListCopy = rgieList.slice();
        let price = 0;
        let existingArticleInRgieList = 0;

        // checks which price to add to rgieList
        if (price1) {
            price = articleList[articleIndex].article_price;
        }
        else {
            price = articleList[articleIndex].article_price2;
        }

        existingArticleInRgieList = checkIfInRgieList(articleIndex, price); // can be replaced by a find / filter

        // adds 1 to quantity and returns if the article is already present in rgieList
        if (existingArticleInRgieList) {
            addQuantity((existingArticleInRgieList - 1));
            return 0;
        }

        // pushes the article to rgieList if the article si not yet present
        rgieListCopy.push(
            {
                articleID: articleList[articleIndex].articleID,
                libelle: articleList[articleIndex].article_name,
                quantity: 1,
                price: price,
                price1 : price1,
                custom: 0,
                position: rgieList.length,
                new: 1,
                modified: 0
            }
        );

        setRgieList(rgieListCopy);
    };


    const getRgieProject = async () => {
        let data;

        try {
            let result = await fetch(
                `/api/rgie/${rgieID}`,
                {
                    method: 'get'
                }
            );

            data = await result.json();
        }
        catch (e) {
            console.log(e);
        }

        if (data['rgieID'] === rgieID) {
            setSelectedClient(data['clientID']);
            setConstructionSite(data['constructSite']);
            setRgieList(data['articles']);
        }
        else {
            console.log(
                "Data received has not the correct id.", 
                "\nTherefore it is possible that the data received may not be the same as the data requested."
            );
        }
    };


    const postRgie = async () => {
        try {
            let result = await fetch(
                '/api/rgie',
                {
                    method: 'post',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(
                        {
                            selectedClient,
                            constructionSite,
                            rgieList
                        }
                    )
                }
            );

            const data = await result.json();
            setRgieID(data);
        }
        catch (e) {
            console.log(e);
        }
    };

    // pas en ordre
    const putRgie = async () => {
        try {
            let tempModifiedArray = rgieList.filter(element => (element.modified && !element.new));
            let tempNewArray = rgieList.filter(element => element.new);

            tempModifiedArray.forEach(
                (element) => {
                    delete element.libelle;
                    delete element.price;
                    delete element.modified;
                    delete element.new;
                    element.rgieID = rgieID;
                }
            );
            tempNewArray.forEach(element => element.rgieID = rgieID);

            let result = await fetch(
                `/api/rgie/${rgieID}`,
                {
                    method: 'put',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify(
                        {
                            client: selectedClient,
                            constructSite: constructionSite,
                            deletedElements: deletedArticles.map( article => ({ ...article, rgieID: rgieID}) ),
                            modifiedElements: tempModifiedArray,
                            newElements: tempNewArray
                        }
                    )
                }
            );

            const data = await result.json();
            console.log(data);
        }
        catch (e) {
            console.log(e);
        }
    };


    const saveRgie = () => {
        if (rgieID) {
            putRgie();
        }
        else {
            postRgie();
        }
    };


    // TODO : this function is replacable with a filter method
    const checkIfInRgieList = (articleIndex, price) => {
        for (let i in rgieList) {
            if (rgieList[i].articleID === articleList[articleIndex].articleID && rgieList[i].price === price) {
                return (Number(i) + 1);
            }
        }

        return false;
    };


    const addQuantity = (rgieListIndex) => {
        let rgieListCopy = rgieList.slice();
        
        rgieListCopy[rgieListIndex].quantity++;
        rgieListCopy[rgieListIndex].modified = 1;
        setRgieList(rgieListCopy);
    };


    const addCustomRow = () => {
        let rgieListCopy = rgieList.slice();

        rgieListCopy.push({
            articleID: 0,
            libelle: tempLibelle,
            quantity: tempQuantite,
            price: tempPrix,
            price1: 0,
            custom: 1,
            position: rgieList.length,
            new: 1,
            modified: 0
        });

        setRgieList(rgieListCopy);

        setTempLibelle('');
        setTempPrix(0);
        setTempQuantite(0);
    };


    const deleteRowRgie = (indexToDelete) => {
        let rgieListCopy = rgieList.slice();
        let deletedArticlesCopy = deletedArticles.slice();

        deletedArticlesCopy.push(
            {
                articleID: rgieListCopy[indexToDelete].articleID,
                custom: rgieListCopy[indexToDelete].custom,
                price1: rgieListCopy[indexToDelete].price1
            }
        );
        
        rgieListCopy.splice(indexToDelete, 1);
        rgieListCopy.forEach(
            (element, index) => {
                if (index >= indexToDelete) {
                    element.position--;
                    element.modified = 1;
                }
            }
        );
        
        setRgieList(rgieListCopy);
        setDeletedArticles(deletedArticlesCopy);
    };


    const setNewQuantity = (indexToModify, newValue) => {
        let rgieListCopy = rgieList.slice();

        rgieListCopy[indexToModify].quantity = newValue;
        rgieListCopy[indexToModify].modified = 1;
        setRgieList(rgieListCopy);
    };


    return (
        <BS.Row className="no_margin rgiePage">
            <BS.Col lg="6">
                <BS.Button onClick={ () => saveRgie() } size="lg" variant="light" className="saveRgieProject">
                    <icon.IoSave size="19pt"/> Enregistrer
                </BS.Button>
                <input
                    type="text"
                    className="form-control form-control-lg w-50 rechercheArticle"
                    placeholder="Rechercher"
                />
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
                                        <icon.IoPlay size="25px" />
                                    </BS.Button>
                                    <BS.Button onClick={ () => addArticleToRgie(index, 0) } className="addRowRgie" variant="light">
                                        <icon.IoPlayForward size="25px" />
                                    </BS.Button>
                                </td>
                            </tr>
                        ))}
                    </MDBTableBody>
                </MDBTable>
            </BS.Col>

            <BS.Col lg="6">
                <Select 
                    className="clientSelect"
                    label="Clients"
                    placeholder="Choisissez un client"
                    value={
                        clients.filter(client => client.value === selectedClient)
                    }
                    options={clients}
                    onChange={ (e) => setSelectedClient(e.value) }
                />
                <input 
                    type="text"
                    value={constructionSite}
                    onChange={ (e) => setConstructionSite(e.target.value) }
                    className="form-control form-control-lg rgieConstructionSite"
                    placeholder="Chantier"
                />
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
