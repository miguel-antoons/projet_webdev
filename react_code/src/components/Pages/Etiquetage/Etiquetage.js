import React, {useState, useEffect} from 'react';
import Row from './Row'
import './etiquetage.css';
import './impression.css';
import './commandesEtiquettes.css';
import * as BS from "react-bootstrap";

const Etiquetage = (props) => {
    const [etiquettes, setEtiquettes] = useState([]);
    const [colorDivClass, setColorDivClass] = useState("changementCouleur redCommand")
    const [selectedTextColor, setSelectedTextColor] = useState("red");
    let longPressTimer = 0;

    useEffect(() => {
        let initiateTable;
        if (Number(props.match.params.id)) {
            initiateTable = () => {
                console.log(props.match.params.id);
            };
        }
        else {
            initiateTable = () => {
                let tableContent = [[]];
                for (let i = 0 ; i < 18 ; i++) {
                    tableContent[0].push({
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
                setEtiquettes(tableContent);
            };
        }

        initiateTable();
    }, [props.match.params.id]);

    
    const fuseMergePreview = (htmlElement, rowIndex, columnIndex) => {
        let stateCopy = etiquettes.slice();
        
        if (stateCopy[rowIndex][columnIndex])
        if (columnIndex === stateCopy[rowIndex].length -1) {
            stateCopy[rowIndex][columnIndex].tempBackground = "green";
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
        console.log(event.button);
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


    return (
        <BS.Row>
            <BS.Col lg="3">
                <BS.Button variant="light" size="lg" id="addRow" className="cleanButton" onClick={() => console.log("showTickets()")}>ADD</BS.Button>
                <BS.Button variant="light" size="lg" id="deleteRow" className="cleanButton" onClick={() => console.log("deleteRow()")}>DEL</BS.Button>
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
                <BS.Button variant="light" size="lg" id="save" className="cleanButton" onClick={() => console.log("saveProject()")}>SAVE</BS.Button>
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