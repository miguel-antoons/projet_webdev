import React, {useState, useEffect} from 'react';
import Row from './Row'
import './etiquetage.css';
import './impression.css';
import './commandesEtiquettes.css';
import * as BS from "react-bootstrap";

const Etiquetage = (props) => {
    const  [etiquettes, setEtiquettes] = useState([]);

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
                        color: 'black',
                        bold: false,
                        value: ''
                    });
                }
                setEtiquettes(tableContent);
            };
        }

        initiateTable();
    }, [props.match.params.id]);

    return (
        <BS.Row>
            <BS.Col lg="3">
                <BS.Button variant="light" size="lg" id="addRow" className="cleanButton" onClick={() => console.log("showTickets()")}>ADD</BS.Button>
                <BS.Button variant="light" size="lg" id="deleteRow" className="cleanButton" onClick={() => console.log("deleteRow()")}>DEL</BS.Button>
                <br />
                <div className="changementCouleur">
                    <h4 className="titreCouleurs">Couleur</h4>
                    <div>
                        <label htmlFor="black">
                            <input type="radio" id="black" name="color" value="black" onClick={() => console.log("changeColor(this.value)")} />  Black
                        </label><br />
                        <label htmlFor="red">
                            <input type="radio" id="red" name="color" value="red" onClick={() => console.log("changeColor(this.value)")} defaultChecked />  Red
                        </label><br />
                        <label htmlFor="blue">
                            <input type="radio" id="blue" name="color" value="blue" onClick={() => console.log("changeColor(this.value)")} />  Blue
                        </label><br />
                        <label htmlFor="green">
                            <input type="radio" id="green" name="color" value="green" onClick={() => console.log("changeColor(this.value)")} />  Green
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
            <BS.Col lg="9">
                <table className="tableauxEtiquettes">
                        <tbody className="etiquettes">
                            {etiquettes.map((row, index) => (
                                <Row key={index} rowContent={row} />
                            ))}
                        </tbody>
                </table>
            </BS.Col>
        </BS.Row>
    );
}


export default Etiquetage;