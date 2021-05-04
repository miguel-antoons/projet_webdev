import React, {useState, useEffect} from 'react';
import Row from './Row'
import './etiquetage.css';
import './impression.css';
import './commandesEtiquettes.css';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import * as BS from "react-bootstrap";
import { red } from '@material-ui/core/colors';

const Etiquetage = (props) => {
    const [etiquettes, setEtiquettes] = useState([]);
    const [colorDivClass, setColorDivClass] = useState("changementCouleur redCommand")
    const [selectedTextColor, setSelectedTextColor] = useState("red");
    const [newLineColumns, setNewLineColumns] = useState(18);
    const [projectID, setProjectID] = useState(Number(props.match.params.id));
    const [clientID, setClientID] = useState();
    const [clients, setClients] = useState([]);
    const [constructionSite, setConstructionSite] = useState("");
    const [clientName, setClientName] = useState("");
    const [saved, setSaved] = useState(<span></span>);
    const [events, setEvents] = useState("");
    const traductions = {
        colors: {
            green: 'verte', 
            red: 'rouge',
            black: 'noire',
            blue: 'bleue'
        }
    };
    let longPressTimer = 0;
    let clientInfo;

    useEffect(() => {
        let initiateTable;
        if (projectID) {
            initiateTable = async () => {
                const response = await fetch('/api/etiquettes/' + projectID);
                const responseData = await response.json();

                if (clientName === "" && clientID) {
                    setEvents("Projet enregistré pour la première fois avec ID " + projectID);
                }
                else {
                    setEvents("Projet N° " + projectID + " ouvert");
                }

                setProjectID(responseData.projectID);
                setClientName(responseData.clientInfo);
                setClientID(responseData.clientID);
                setConstructionSite(responseData.constructionSite);
                setEtiquettes(JSON.parse(responseData.projectData));
                setSaved(<span className="saved">Enregistré</span>);
            };
        }
        else {
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
                setEtiquettes(tableContent);
                setSaved(<span className="unsaved">Non-enregisté</span>);
                setEvents("Nouveau projet créé");

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
    }, [projectID]);

    
    const fuseMergePreview = (rowIndex, columnIndex) => {
        let stateCopy = etiquettes.slice();
        
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


    const clearPreview = (rowIndex) => {
        let stateCopy = etiquettes.slice();

        for (let e of stateCopy[rowIndex]) {
            e.tempBackground = "";
        }
        
        setEtiquettes(stateCopy);
    };


    const writeTicket = (htmlElement, rowIndex, columnIndex) => {
        let stateCopy = etiquettes.slice();

        stateCopy[rowIndex][columnIndex].value = htmlElement.target.value;
        setEtiquettes(stateCopy);
        setSaved(<span className="unsaved">Non-enregisté</span>);
        setEvents("Écriture dans la rangée n° " + (rowIndex + 1) + ", colonne n° " + (columnIndex+ 1));
    };


    const fuseMergeCells = (event, rowIndex, columnIndex) => {
        event.preventDefault();
        let stateCopy = etiquettes.slice();
        let newColumnColspan;
        
        if (event.button === 2 && stateCopy[rowIndex][columnIndex].colspan > 1) {
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
            stateCopy[rowIndex][columnIndex].colspan -= newColumnColspan;
            setEvents("Division à la rangée n° " + (rowIndex + 1) + " de la colonne n° " + (columnIndex+ 1));
        }
        else if (event.button === 0 && stateCopy[rowIndex].length > 1) {
            stateCopy[rowIndex][columnIndex].colspan += stateCopy[rowIndex][columnIndex + 1].colspan;
            stateCopy[rowIndex].splice(columnIndex + 1, 1);
            setEvents("Fusion à la rangée n° " + (rowIndex + 1) + " de la colonne n° " + (columnIndex+ 1) + " et de la colonne n° " + (columnIndex + 2));
        }

        
        setEtiquettes(stateCopy);
        setSaved(<span className="unsaved">Non-enregisté</span>);
        clearPreview(rowIndex);
        fuseMergePreview(rowIndex, columnIndex);
    };


    const writeCNumber = (htmlElement, rowIndex, columnIndex) => {
        let stateCopy = etiquettes.slice();

        stateCopy[rowIndex][columnIndex].circuitNumber.value = htmlElement.target.value;
        setEtiquettes(stateCopy);
        setSaved(<span className="unsaved">Non-enregisté</span>);
        setEvents("Écriture dans la rangée n° " + (rowIndex + 1) + ", colonne n° " + (columnIndex+ 1));
    }


    const setBoldText = (rowIndex, columnIndex) => {
        longPressTimer = window.setTimeout(function () {
            let stateCopy = etiquettes.slice();

            stateCopy[rowIndex][columnIndex].bold = !stateCopy[rowIndex][columnIndex].bold;
            setEtiquettes(stateCopy);
            setSaved(<span className="unsaved">Non-enregisté</span>);
            setEvents("Style du texte changée en gras à la rangée n° " + (rowIndex + 1) + " à la colonne n° " + (columnIndex + 1));
        }, 500)
    };


    const setCNumberBold = (rowIndex, columnIndex) => {
        longPressTimer = window.setTimeout(function () {
            let stateCopy = etiquettes.slice();

            stateCopy[rowIndex][columnIndex].circuitNumber.bold = !stateCopy[rowIndex][columnIndex].circuitNumber.bold;
            setEtiquettes(stateCopy);
            setSaved(<span className="unsaved">Non-enregisté</span>);
            setEvents("Style du texte changée en gras à la rangée n° " + (rowIndex + 1) + " à la colonne n° " + (columnIndex + 1));
        }, 500);
    };


    const resetLongPressTimer = () => {
        clearTimeout(longPressTimer);
    };


    const setTextColor = (newColor) => {
        setSelectedTextColor(newColor);
        setColorDivClass("changementCouleur " + newColor + "Command");
    };


    const changeTextColor = (rowIndex, columnIndex) => {
        let stateCopy = etiquettes.slice();
        
        stateCopy[rowIndex][columnIndex].color = selectedTextColor;

        setEtiquettes(stateCopy);
        setSaved(<span className="unsaved">Non-enregisté</span>);
        setEvents("Changement de couleur à la rangée n° " + (rowIndex + 1) + ", colonne n° " + (columnIndex + 1) + " vers la couleur " + traductions.colors[selectedTextColor]);
    };


    const changeCNumberColor = (rowIndex, columnIndex) => {
        let stateCopy = etiquettes.slice();
        
        stateCopy[rowIndex][columnIndex].circuitNumber.color = selectedTextColor;

        setEtiquettes(stateCopy);
        setSaved(<span className="unsaved">Non-enregisté</span>);
        setEvents("Changement de couleur à la rangée n° " + (rowIndex + 1) + ", colonne n° " + (columnIndex + 1) + " vers la couleur " + traductions.colors[selectedTextColor]);
    }


    const addRow = () => {
        let stateCopy = etiquettes.slice();

        if (newLineColumns && newLineColumns <= 18) {
            stateCopy.push([]);

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
            setEvents("Ajout d'une " + etiquettes.length + "e ligne");
        }
        else {
            setEvents(<span style={{color: "red"}}>Nombre de colonnes non valide</span>);
        }
    }


    const deleteRow = () => {
        if (etiquettes.length > 1) {
            let stateCopy = etiquettes.slice();
            stateCopy.pop();
            setEtiquettes(stateCopy);
            setSaved(<span className="unsaved">Non-enregisté</span>);
            setEvents("Supression de la ligne n° " + (etiquettes.length + 1));
        }
        else {
            setEvents(<span style={{color: "red"}}>Impossible de suprimmer la première ligne du tableau</span>)
        }
    }


    const saveProject = async () => {
        if (clientID && constructionSite){
            if(projectID) {
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
            else {
                try {
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


    if (clientID && projectID) {
        clientInfo = <h3 className="clientInfo">{clientName}</h3>;
    }
    else {
        clientInfo = 
        <Autocomplete
            options={clients}
            getOptionLabel={(option) => option.id + ": " + option.attribute1}
            onChange={(option) => setClientID(Number(option.target.innerHTML.split(':')[0]))}
            renderInput={(params) => <TextField {...params} label="Client" variant="outlined" />}
        />;
    }

    return (
        <BS.Row className="no_margin">
            <BS.Col className="no_print" lg="3">
                {clientInfo}
                <BS.Button variant="light" size="lg" id="addRow" className="cleanButton" onClick={() => addRow()}>ADD</BS.Button>
                <BS.Button variant="light" size="lg" id="deleteRow" className="cleanButton" onClick={() => deleteRow()}>DEL</BS.Button>
                <h4 className="titreNouvelleColonnes">Colonnes à ajouter</h4>
                <input value={ newLineColumns } onChange={ (e) => setNewLineColumns(e.target.value) } className="form-control form-control-lg newLineColumns" type="number" min="5" max="18" />
                <br />
                <div className={colorDivClass}>
                    <h4 className="titreCouleurs">Couleur</h4>
                    <div className="radioContainer">
                        <label htmlFor="black">
                            <input type="radio" id="black" name="color" value="black" onClick={(event) => setTextColor(event.target.value)} /> Noir
                        </label><br />
                        <label htmlFor="red">
                            <input type="radio" id="red" name="color" value="red" onClick={(event) => setTextColor(event.target.value)} defaultChecked /> Rouge
                        </label><br />
                        <label htmlFor="blue">
                            <input type="radio" id="blue" name="color" value="blue" onClick={(event) => setTextColor(event.target.value)} /> Bleue
                        </label><br />
                        <label htmlFor="green">
                            <input type="radio" id="green" name="color" value="green" onClick={(event) => setTextColor(event.target.value)} /> Vert
                        </label>
                    </div>
                </div>
                <BS.Button variant="light" size="lg" id="impression" className="cleanButton" onClick={() => window.print()}>PRINT</BS.Button>
                <BS.Button variant="light" size="lg" id="save" className="cleanButton" onClick={() => saveProject()}>SAVE</BS.Button>
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