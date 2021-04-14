import React, {useState, useEffect} from 'react';
import * as icon from 'react-icons/io5';
import * as BS from "react-bootstrap";
import Filter from '../../ProjetListe/Filter.js';
import TableauProjets from '../../ProjetListe/TableauProjets';
import './ProjetsDevis.css';
import { LinkContainer } from 'react-router-bootstrap';


function ProjetsDevis () {
    const three_months_ago = new Date();
    three_months_ago.setMonth(three_months_ago.getMonth() - 3);
    const [filter, setFilter] = useState(three_months_ago);
    const [projects, setProjects] = useState([]);

    
    useEffect(() => {
        const fetchProjects = async () => {
            const response = await fetch('/api/devis?filter='+ filter);
            const data = await response.json();
            setProjects(data);
        }

        fetchProjects();
    }, [filter]);


    /**
     * Function fires when the sort option changes.
     * The function will sort the projects according to the value chosen by the user
     * 
     * @param {*} event the event that launched the function
     */
    function sortProjects(event){
        let values = JSON.parse(event.target.value);        // get values from html element
        let sortedProjects = projects.slice();              // Create new array from the state array

        // Function which converts string dates (i.e. 18th April 2020) to ISO date format
        const stringToDate = (stringDate) => {
            let newDate = stringDate.split(" ");
            return new Date(newDate[1] + " " + parseInt(newDate[0]) + ", " + newDate[2]);
        }

        sortedProjects.sort((a, b) => a.id - b.id);         // sort according to the project ID

        // Condition which verifies what sign to use according to the input from the user
        if (values["sign"]) {
            sortedProjects.sort((a, b) => {
                let prime_a;
                let prime_b;

                // checks if the value is a date
                if (values["key"] === "date") {
                    // if it is a date, convert the string date to an actual date
                    prime_a = stringToDate(a[values["key"]]);
                    prime_b = stringToDate(b[values["key"]]);
                }
                else {
                    prime_a = a[values["key"]].toLowerCase();
                    prime_b = b[values["key"]].toLowerCase();
                }

                // compares the 2 values and returns the result
                if (lower_a > lower_b) {
                    return -1;
                }
                else if (lower_b > lower_a) {
                    return 1;
                }
                else{
                    return 0;
                }
            });
        }
        else{
            sortedProjects.sort((a, b) => {
                let prime_a;
                let prime_b;

                // checks if the value is a date
                if (values["key"] === "date") {
                    // if it is a date, convert the string date to an actual date
                    prime_a = stringToDate(a[values["key"]]);
                    prime_b = stringToDate(b[values["key"]]);
                }
                else {
                    prime_a = a[values["key"]].toLowerCase();
                    prime_b = b[values["key"]].toLowerCase();
                }

                // compares the 2 values and returns the result
                if (prime_a > prime_b) {
                    return 1;
                }
                else if (prime_b > prime_a) {
                    return -1;
                }
                else{
                    return 0;
                }
            });
        }
        
        setProjects(sortedProjects);        // change the projects order in the actual state
    };


    return (
        <BS.Container fluid style={{ margin: 0, padding: 0 }}>
            <BS.Jumbotron>
                <h1 className='d-inline-block'>Bienvenue dans Devis</h1>
                <LinkContainer to='/devis/0'>
                    <BS.Button className='float-right d-inline-block add_project' size='lg' variant='light'>
                            <icon.IoAddCircle style={{margin: 'auto'}} size={30}/>
                            <span style={{margin: 'auto'}}>   Nouveau</span>
                    </BS.Button>
                </LinkContainer>
                <div className="d-flex justify-content-center">
                    <BS.Col lg="2" xs></BS.Col>
                    <BS.Col md="auto">
                        <input type="text" className="form-control form-control-lg recherche" placeholder="Rechercher . . ." />
                        <select onChange={sortProjects} className="form-control form-control-lg shadow-none bg-transparent filtre">
                            <option value='{"key": "date", "sign": 0}' key="newOld">Récent à Ancien</option>
                            <option value='{"key": "date", "sign": 1}' key="oldNew">Ancien à Récent</option>
                            <option value='{"key": "name", "sign": 0}' key="AZClient">A-Z Client</option>
                            <option value='{"key": "chantier", "sign": 0}' key="AZChantier">A-Z Chantier</option>
                            <option value='{"key": "name", "sign": 1}' key="ZAClient">Z-A Client</option>
                            <option value='{"key": "chantier", "sign": 1}' key="ZAChantier">Z-A Chantier</option>
                        </select>
                        <Filter onChange={(selected_item) => setFilter(selected_item)} recent_date={ three_months_ago} />
                    </BS.Col>
                    <BS.Col lg="2" xs></BS.Col>
                </div>
            </BS.Jumbotron> 
            <BS.Table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Client</th>
                        <th>Chantier</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <TableauProjets projects={ projects } />
                </tbody>
            </BS.Table> 
        </BS.Container>
    )
};




export default ProjetsDevis;