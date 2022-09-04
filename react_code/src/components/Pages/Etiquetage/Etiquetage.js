import React, {useState, useEffect} from 'react';
import Row from './Row'
import './etiquetage.css';
import './impression.css';
import './commandesEtiquettes.css';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import * as BS from "react-bootstrap";
import * as icon from 'react-icons/io5';
import { useLocation } from 'react-router';


const Etiquetage = (props) => {
    const [etiquettes, setEtiquettes] = useState([]);                                   // contains the different characteristics of each row and cell in th table
    const [colorDivClass, setColorDivClass] = useState("changementCouleur redCommand")  // contains the class value of the color div
    const [selectedTextColor, setSelectedTextColor] = useState("red");                  // sets the color to change to on double click on a cell
    const [newLineColumns, setNewLineColumns] = useState(18);                           // contains the value of cells to add when a new row is requested
    const [projectID, setProjectID] = useState(Number(props.match.params.id));          // contains the project ID
    const [clientID, setClientID] = useState();                                         // contains the clientID
    const [clients, setClients] = useState([]);                                         // contains the client to chose from when creating a new project
    const [constructionSite, setConstructionSite] = useState("");                       // contains the construction site of the project, this is shown on top of the page
    const [clientName, setClientName] = useState("");                                   // contains the client name and surname shown on top of the page
    const [saved, setSaved] = useState(<span></span>);                                  // inidiquates of the project has been modified or if it is still saved
    const [events, setEvents] = useState("");                                           // contains the most recent event that happened on the project
    let {query} = useLocation();                                                        // check if we have to print or not
    const [print, setPrint] = useState(query);                                          // put the print variable in the state so that is not alwau-ys requested again
    const traductions = {                                                               // contains color translations to French
        colors: {
            green: 'verte', 
            red: 'rouge',
            black: 'noire',
            blue: 'bleue'
        }
    };
    let longPressTimer = 0;                                                             // contains the timer value to perform a long press on a cell
    let clientInfo;                                                                     // contains the information about the client

    /**
     * Function fires on page load and when new projectID is set
     */
    useEffect(() => {
        let initiateTable;      // wil contain the function to call eventually

        // if there is a projectID greater than 0 (which means the project already existed)
        if (projectID) {
            /**
             * function will call an api to get the requested project
             */
            initiateTable = async () => {
                const response = await fetch('/api/etiquettes/' + projectID);
                const responseData = await response.json();

                // set the recent events part on the page
                if (clientName === "" && clientID) {
                    setEvents("Projet enregistré pour la première fois avec ID " + projectID);
                }
                else {
                    setEvents("Projet N° " + projectID + " ouvert");
                }

                // prepare the different states
                setProjectID(responseData.projectID);
                setClientName(responseData.clientInfo);
                setClientID(responseData.clientID);
                setConstructionSite(responseData.constructionSite);
                setEtiquettes(JSON.parse(responseData.projectData));
                setSaved(<span className="saved">Enregistré</span>);

                // s'il faut imprimer, imprimer la page et mettre query à false pour ne pas réimprimer
                if (print) {
                    printWindow();
                    setPrint(false);
                }
            };
        }
        // if it is a newly created project
        else {
            /**
             * function adds a first row to the table.
             * this row can NEVER be deleted.
             * (one row contains 18 cells)
             */
            initiateTable = async () => {
                let tableContent = [[]];
                for (let i = 0 ; i < 18 ; i++) {
                    tableContent[0].push({
                        tempBackground: '',
                        color: 'black',
                        bold: false,
                        colspan: 1,
                        value: '',
                        circuitNumber: {
                            color: 'black',
                            bold: false,
                            value: ''
                        }
                    });
                }

                // set the different state values
                setEtiquettes(tableContent);
                setSaved(<span className="unsaved">Non-enregisté</span>);
                setEvents("Nouveau projet créé");

                // get the basic client information so that the user can choose a client to link this project
                try{
                    const response = await fetch('/api/client');
                    const responseData = await response.json();
                    setClients(responseData);
                }
                catch (e) {
                    console.log(e);
                }
            };
        }

        initiateTable();
    // eslint-disable-next-line
    }, [projectID]);

    /**
     * Funtion shows which columns will be merged (red columns) on right mouse click
     * and which columns will be fused (green columns) on left mouse click
     * @param {number} rowIndex 
     * @param {number} columnIndex 
     */
    const fuseMergePreview = (rowIndex, columnIndex) => {
        let stateCopy = etiquettes.slice();
        
        // set different colors depending on the column index and the number of columns
        if (columnIndex === stateCopy[rowIndex].length -1 && stateCopy[rowIndex][columnIndex].colspan <= 1) {
            stateCopy[rowIndex][columnIndex].tempBackground = "green";
        }
        else if (columnIndex === stateCopy[rowIndex].length -1) {
            stateCopy[rowIndex][columnIndex].tempBackground = "red";
        }
        else if (stateCopy[rowIndex][columnIndex].colspan === 1) {
            stateCopy[rowIndex][columnIndex].tempBackground = "green";
            stateCopy[rowIndex][columnIndex + 1].tempBackground = "green";
        }
        else {
            stateCopy[rowIndex][columnIndex].tempBackground = "red";
            stateCopy[rowIndex][columnIndex + 1].tempBackground = "green";
        }
        
        setEtiquettes(stateCopy);
    };

    /**
     * clears the colors set on preview   ^^^
     * @param {number} rowIndex 
     */
    const clearPreview = (rowIndex) => {
        let stateCopy = etiquettes.slice();

        for (let e of stateCopy[rowIndex]) {
            e.tempBackground = "";
        }
        
        setEtiquettes(stateCopy);
    };

    /**
     * function takes the value of the html element and stores it in the project state on the right row and in the right column.
     * when a sequance of characters are equal to delta and a space, these characters are deleted and instead 
     * the greek symbol delta is written
     * @param {htmlObject} htmlElement contains the vlaues of the written html element
     * @param {number} rowIndex 
     * @param {number} columnIndex 
     */
    const writeTicket = (htmlElement, rowIndex, columnIndex) => {
        let stateCopy = etiquettes.slice();
        
        stateCopy[rowIndex][columnIndex].value = htmlElement.target.value.replace('delta ', '\u0394 ');

        setEtiquettes(stateCopy);
        setSaved(<span className="unsaved">Non-enregisté</span>);
        setEvents("Écriture dans la rangée n° " + (rowIndex + 1) + ", colonne n° " + (columnIndex+ 1));
    };

    /**
     * function fuses or merges cells from the table
     * @param {htmlObject} event 
     * @param {number} rowIndex 
     * @param {number} columnIndex 
     */
    const fuseMergeCells = (event, rowIndex, columnIndex) => {
        event.preventDefault();
        let stateCopy = etiquettes.slice();
        let newColumnColspan;
        
        // if the click is a right click and the colspan is greater than 1
        if (event.button === 2 && stateCopy[rowIndex][columnIndex].colspan > 1) {

            // divide the column in 2 parts and generate a new column
            newColumnColspan = Math.floor(stateCopy[rowIndex][columnIndex].colspan / 2);
            stateCopy[rowIndex].splice(
                columnIndex + 1, 0, 
                {
                    tempBackground: 'white',
                    color: 'black',
                    bold: false,
                    colspan: newColumnColspan,
                    value: '',
                    circuitNumber: {
                        color: 'black',
                        bold: false,
                        value: ''
                    }
                }
            );

            // decrease the colspan of the existing column
            stateCopy[rowIndex][columnIndex].colspan -= newColumnColspan;
            setEvents("Division à la rangée n° " + (rowIndex + 1) + " de la colonne n° " + (columnIndex+ 1));
        }
        // if the click is a left click and there are more than 1 column left in the row
        else if (event.button === 0 && stateCopy[rowIndex].length > 1) {
            // increase the left column with the right column's colspan
            stateCopy[rowIndex][columnIndex].colspan += stateCopy[rowIndex][columnIndex + 1].colspan;
            // delete the right column
            stateCopy[rowIndex].splice(columnIndex + 1, 1);
            setEvents("Fusion à la rangée n° " + (rowIndex + 1) + " de la colonne n° " + (columnIndex+ 1) + " et de la colonne n° " + (columnIndex + 2));
        }

        
        setEtiquettes(stateCopy);
        setSaved(<span className="unsaved">Non-enregisté</span>);
        clearPreview(rowIndex);
        fuseMergePreview(rowIndex, columnIndex);
    };

    /**
     * function stores the value of the written textarea in the program state
     * @param {htmlObject} htmlElement 
     * @param {number} rowIndex 
     * @param {number} columnIndex 
     */
    const writeCNumber = (htmlElement, rowIndex, columnIndex) => {
        let stateCopy = etiquettes.slice();

        stateCopy[rowIndex][columnIndex].circuitNumber.value = htmlElement.target.value;
        setEtiquettes(stateCopy);
        setSaved(<span className="unsaved">Non-enregisté</span>);
        setEvents("Écriture dans la rangée n° " + (rowIndex + 1) + ", colonne n° " + (columnIndex+ 1));
    }

    /**
     * sets bold text on a long click (500ms) on a big textarea
     * @param {number} rowIndex 
     * @param {number} columnIndex 
     */
    const setBoldText = (rowIndex, columnIndex) => {
        // start the timer and tell what to do at the end of the timer
        longPressTimer = window.setTimeout(function () {
            let stateCopy = etiquettes.slice();

            stateCopy[rowIndex][columnIndex].bold = !stateCopy[rowIndex][columnIndex].bold;
            setEtiquettes(stateCopy);
            setSaved(<span className="unsaved">Non-enregisté</span>);
            setEvents("Style du texte changée en gras à la rangée n° " + (rowIndex + 1) + " à la colonne n° " + (columnIndex + 1));
        }, 500)
    };

     /**
     * sets bold text on a long click (500ms) on a little textarea
     * @param {number} rowIndex 
     * @param {number} columnIndex 
     */
    const setCNumberBold = (rowIndex, columnIndex) => {
        longPressTimer = window.setTimeout(function () {
            let stateCopy = etiquettes.slice();

            stateCopy[rowIndex][columnIndex].circuitNumber.bold = !stateCopy[rowIndex][columnIndex].circuitNumber.bold;
            setEtiquettes(stateCopy);
            setSaved(<span className="unsaved">Non-enregisté</span>);
            setEvents("Style du texte changée en gras à la rangée n° " + (rowIndex + 1) + " à la colonne n° " + (columnIndex + 1));
        }, 500);
    };

    /**
     * resets the timer for long presses (in case the user didn't hold long enough)
     */
    const resetLongPressTimer = () => {
        clearTimeout(longPressTimer);
    };

    /**
     * sets the new color to apply on double click and changes the color div background color
     * @param {string} newColor 
     */
    const setTextColor = (newColor) => {
        setSelectedTextColor(newColor);
        setColorDivClass("changementCouleur " + newColor + "Command");
    };

    /**
     * changes the color of a big textarea to the, at the time of double click, selected color
     * @param {number} rowIndex 
     * @param {number} columnIndex 
     */
    const changeTextColor = (rowIndex, columnIndex) => {
        let stateCopy = etiquettes.slice();
        
        stateCopy[rowIndex][columnIndex].color = selectedTextColor;

        setEtiquettes(stateCopy);
        setSaved(<span className="unsaved">Non-enregisté</span>);
        setEvents("Changement de couleur à la rangée n° " + (rowIndex + 1) + ", colonne n° " + (columnIndex + 1) + " vers la couleur " + traductions.colors[selectedTextColor]);
    };

    /**
     * changes the color of a little textarea to the, at the time of double click, selected color
     * @param {number} rowIndex 
     * @param {number} columnIndex 
     */
    const changeCNumberColor = (rowIndex, columnIndex) => {
        let stateCopy = etiquettes.slice();
        
        stateCopy[rowIndex][columnIndex].circuitNumber.color = selectedTextColor;

        setEtiquettes(stateCopy);
        setSaved(<span className="unsaved">Non-enregisté</span>);
        setEvents("Changement de couleur à la rangée n° " + (rowIndex + 1) + ", colonne n° " + (columnIndex + 1) + " vers la couleur " + traductions.colors[selectedTextColor]);
    }

    /**
     * adds a row to the table, the new row will contain the number of columns 
     * specified in the 'newLineColumns' state variable, this variable is changeable by the user.
     * The 'newLineColumns' value can't be greater than 18 and must at least be equal to 1
     */
    const addRow = () => {
        let stateCopy = etiquettes.slice();

        if (newLineColumns && newLineColumns <= 18) {
            // first push a new row to the state
            stateCopy.push([]);

            // then complete the row with the number of columns specified by the user (--> 'newLineColumns')
            for (let i = 0 ; i < newLineColumns ; i++){
                stateCopy[stateCopy.length -1].push({
                    tempBackground: 'white',
                    color: 'black',
                    bold: false,
                    colspan: 1,
                    value: '',
                    circuitNumber: {
                        color: 'black',
                        bold: false,
                        value: ''
                    }
                });
            }

            setEtiquettes(stateCopy);
            setSaved(<span className="unsaved">Non-enregisté</span>);
            setEvents("Ajout d'une " + (etiquettes.length + 1) + "e ligne");
        }
        else {
            setEvents(<span style={{color: "red"}}>Nombre de colonnes non valide</span>);
        }
    }

    /**
     * deletes a row and all of its columns from the project state.
     * this function can be executed only if there are more than 1 rows left
     */
    const deleteRow = () => {
        if (etiquettes.length > 1) {
            let stateCopy = etiquettes.slice();
            stateCopy.pop();
            setEtiquettes(stateCopy);
            setSaved(<span className="unsaved">Non-enregisté</span>);
            setEvents("Supression de la ligne n° " + (etiquettes.length));
        }
        else {
            setEvents(<span style={{color: "red"}}>Impossible de suprimmer la première ligne du tableau</span>)
        }
    }

    /**
     * function sends the project state to the backend server with the appropriate api.
     * The http method will either be POST if it is the first time the project is saved or
     * PUT if it isn't
     */
    const saveProject = async () => {
        // if all the input are correcctly specified (client and construction site)
        if (clientID && constructionSite){
            // if there is already a prohjectID in which case it means the project already existed before
            if(projectID) {
                // try to put and, by doing so, update the project in the database
                try {
                    await fetch(
                        '/api/etiquettes',
                        {
                            method: 'put',
                            headers: {
                                'Content-type': 'application/json'
                            },
                            body: JSON.stringify([constructionSite, etiquettes, projectID])
                        }
                    );
                }
                catch (e) {
                    console.log(e);
                }
            }
            // if the project id equals to 0, it means the project didn't exist before and it has still to be created
            else {
                try {
                    // send the data with the http POST method too create the new row in the database
                    let response = await fetch(
                        '/api/etiquettes',
                        {
                            method: 'post',
                            headers: {
                                'Content-type': 'application/json'
                            },
                            body: JSON.stringify([clientID, constructionSite, etiquettes])
                        }
                    );
                    
                    // when the project is saved, wait for the project id to be returned and set the projectID state
                    const responseData = await response.json();
                    setProjectID(responseData.projectID);
                    setEvents(<span style={{color: "green"}}>Document enregistré</span>);
                }
                catch (e) {
                    console.log(e);
                }
            }
            setSaved(<span className="saved">Enregistré</span>);
        }
        else {
            setEvents(<span style={{color: "red"}}>Assurez vou que les champs clients et chantier sont bien remplis adéquatement</span>);
        }
    };

    /**
     * Change css rules in order to adapt the css for printing,
     * and finally print the table
     */
    const printWindow = () => {
        let cssPagedMedia = (function () {
            let style = document.createElement('style');
            document.head.appendChild(style);
            return function (rule) {
                style.innerHTML = rule;
            };
        }());
        
        cssPagedMedia.size = function (size) {
            cssPagedMedia('@page {size: ' + size + '}');
        };
        
        cssPagedMedia.size('A3 landscape');
        window.print();
    };

    
    // if there is a clientID and a projectID
    if (clientID && projectID) {
        // just show the client name
        clientInfo = <h3 className="clientInfo">{clientName}</h3>;
    }
    else {
        // ask the user which client to choose
        clientInfo = 
        <Autocomplete
            style={{marginTop: "7%", marginLeft: "6%", width: "290px"}}
            options={clients}
            getOptionLabel={(option) => option.id + ": " + option.attribute1}
            onChange={(option) => setClientID(Number(option.target.innerHTML.split(':')[0]))}
            renderInput={(params) => <TextField {...params} label="Client" variant="outlined" />}
        />;
    }


    return (
        <BS.Row className="no_margin programContainer" >
            <BS.Col className="no_print" lg="3">
                {clientInfo}
                <BS.Button variant="light" size="lg" className="cleanButton" onClick={() => addRow()}><icon.IoAddCircle /> Add</BS.Button>
                <BS.Button variant="light" size="lg" className="cleanButton" onClick={() => deleteRow()}><icon.IoCut /> Del</BS.Button>
                <h4 className="titreNouvelleColonnes">Colonnes à ajouter</h4>
                <input 
                    value={ newLineColumns } 
                    onChange={ (e) => setNewLineColumns(e.target.value) } 
                    className="form-control form-control-lg newLineColumns" 
                    type="number" 
                    min="5" 
                    max="18" 
                />
                <br />
                <div className={colorDivClass}>
                    <h4 className="titreCouleurs">Couleur</h4>
                    <div className="radioContainer">
                        <label htmlFor="black">
                            <input type="radio" name="color" value="black" onClick={(event) => setTextColor(event.target.value)} /> Noir
                        </label><br />
                        <label htmlFor="red">
                            <input type="radio" name="color" value="red" onClick={(event) => setTextColor(event.target.value)} defaultChecked /> Rouge
                        </label><br />
                        <label htmlFor="blue">
                            <input type="radio" name="color" value="blue" onClick={(event) => setTextColor(event.target.value)} /> Bleue
                        </label><br />
                        <label htmlFor="green">
                            <input type="radio" name="color" value="green" onClick={(event) => setTextColor(event.target.value)} /> Vert
                        </label>
                    </div>
                </div>
                <BS.Button variant="light" size="lg"className="cleanButton" onClick={() => printWindow()}><icon.IoPrint /> Print</BS.Button>
                <BS.Button variant="light" size="lg"className="cleanButton" onClick={() => saveProject()}><icon.IoSave /> Save</BS.Button>
                <br />
                <div className="projectStatus">
                    <h5>Enregistrement</h5>
                    {saved}
                    <br /><br />
                    <h5>Nombre de Lignes</h5>
                    <span className="nOfLines">{etiquettes.length} lignes</span>
                    <br /><br />
                    <h5>Événements Récents</h5>
                    <p className="events">{events}</p>
                </div>
            </BS.Col>
            <BS.Col className="no_margin" lg="9">
                <input 
                    value={ constructionSite }
                    onChange={ (e) => {setConstructionSite(e.target.value); setSaved(<span className="unsaved">Non-enregisté</span>);}} 
                    className="form-control form-control-lg constructionSite" 
                    type="text" 
                    placeholder="Chantier" 
                />
                <div className="etiquettesContainer">
                    <table className="tableauxEtiquettes">
                            <tbody className="etiquettes">
                                {etiquettes.map((row, index) => (
                                    <Row 
                                        key={index} 
                                        writeCells={writeTicket}
                                        writeCNumber = {writeCNumber}
                                        rowIndex={index} 
                                        rowContent={row} 
                                        setBold={setBoldText}
                                        setCNumberBold={setCNumberBold}
                                        resetTimer={resetLongPressTimer} 
                                        fuseMergePreview={fuseMergePreview}
                                        changeColor={changeTextColor}
                                        changeCNumberColor={changeCNumberColor}
                                        clearPreview={clearPreview}
                                        fuseMergeCells={fuseMergeCells}
                                    />
                                ))}
                            </tbody>
                    </table>
                </div>
            </BS.Col>
        </BS.Row>
    );
}


export default Etiquetage;