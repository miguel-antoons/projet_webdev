import React, {useState, useEffect} from 'react';
import Row from './Row'
import './etiquetage.css';
import './impression.css';
import './commandesEtiquettes.css';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import * as BS from "react-bootstrap";

const Etiquetage = (props) => {
    const [etiquettes, setEtiquettes] = useState([]);
    const [colorDivClass, setColorDivClass] = useState("changementCouleur redCommand")
    const [selectedTextColor, setSelectedTextColor] = useState("red");
    const [newLineColumns, setNewLineColumns] = useState(18);
    const [projectID, setProjectID] = useState(props.match.params.id);
    const [clientID, setClientID] = useState();
    const [clients, setClients] = useState([]);
    const [constructionSite, setConstructionSite] = useState("");
    const [clientName, setClientName] = useState("");
    let longPressTimer = 0;
    let clientInfo;

    useEffect(() => {
        let initiateTable;
        if (Number(projectID)) {
            initiateTable = async () => {
                const response = await fetch('/api/facture?id=' + projectID);
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
    }, [props.match.params.id]);

    
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
        }
        else if (event.button === 0 && stateCopy[rowIndex].length > 1) {
            stateCopy[rowIndex][columnIndex].colspan += stateCopy[rowIndex][columnIndex + 1].colspan;
            stateCopy[rowIndex].splice(columnIndex + 1, 1);
        }

        
        setEtiquettes(stateCopy);
        clearPreview(rowIndex);
        fuseMergePreview(rowIndex, columnIndex);
    };


    const writeCNumber = (htmlElement, rowIndex, columnIndex) => {
        let stateCopy = etiquettes.slice();

        stateCopy[rowIndex][columnIndex].circuitNumber.value = htmlElement.target.value;
        setEtiquettes(stateCopy);
    }


    const setBoldText = (rowIndex, columnIndex) => {
        longPressTimer = window.setTimeout(function () {
            let stateCopy = etiquettes.slice();

            stateCopy[rowIndex][columnIndex].bold = !stateCopy[rowIndex][columnIndex].bold;
            setEtiquettes(stateCopy);
        }, 500)
    };


    const setCNumberBold = (rowIndex, columnIndex) => {
        longPressTimer = window.setTimeout(function () {
            let stateCopy = etiquettes.slice();

            stateCopy[rowIndex][columnIndex].circuitNumber.bold = !stateCopy[rowIndex][columnIndex].circuitNumber.bold;
            setEtiquettes(stateCopy);
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
    };


    const changeCNumberColor = (rowIndex, columnIndex) => {
        let stateCopy = etiquettes.slice();
        
        stateCopy[rowIndex][columnIndex].circuitNumber.color = selectedTextColor;

        setEtiquettes(stateCopy);
    }


    const addRow = () => {
        let stateCopy = etiquettes.slice();
        console.log(stateCopy);

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
        }
        setEtiquettes(stateCopy);
    }


    const deleteRow = () => {
        if (etiquettes.length > 1) {
            let stateCopy = etiquettes.slice();
            stateCopy.pop();
            setEtiquettes(stateCopy);
        }
    }


    const saveProject = async () => {
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
            console.log(responseData);
        }
        catch (e) {
            console.log(e);
        }
    };


    if (clientID) {
        clientInfo = <h3>{clientName}</h3>;
    }
    else {
        clientInfo = 
        <Autocomplete
            options={clients}
            getOptionLabel={(option) => option.id + ": " + option.attribute1}
            onChange={(option) => setClientID(option.id)}
            renderInput={(params) => <TextField {...params} label="Client" variant="outlined" />}
        />;
    }

    return (
        <BS.Row>
            <BS.Col lg="3">
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
                <BS.Button variant="light" size="lg" id="impression" className="cleanButton" onClick={() => console.log("printWindow()")}>PRINT</BS.Button>
                <BS.Button variant="light" size="lg" id="save" className="cleanButton" onClick={() => saveProject()}>SAVE</BS.Button>
                <br />
                <div className="projectStatus">
                    <h4>Project Status</h4>
                    <h5>Save status</h5>
                    <span id="saveStatus"></span>
                    <br /><br />
                    <h5>Number of lines</h5>
                    <span id="nOfLines"></span>
                    <br /><br />
                    <h5>Recent events</h5>
                    <p id="events"></p>
                </div>
            </BS.Col>
            <BS.Col className="no_margin" lg="9">
                <input value={ constructionSite } onChange={ (e) => setConstructionSite(e.target.value) } className="form-control form-control-lg" type="text" />
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