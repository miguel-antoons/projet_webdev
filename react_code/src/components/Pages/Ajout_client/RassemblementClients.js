import React, {useState, useEffect} from 'react';
import * as icon from 'react-icons/io5';
import * as BS from "react-bootstrap";
import TableauProjets from '../../ProjetListe/TableauProjets';
import '../../ProjetListe/RassemblementProjets.css';
import { LinkContainer } from 'react-router-bootstrap';


function RassemblementClients () {
    const [sort, setSort] = useState('{"key": "attribute1", "sign": 0}');
    const [search, setSearch] = useState('');
    const [shownContent, setShownContent] = useState([]);
    const three_months_ago = new Date();
    three_months_ago.setMonth(three_months_ago.getMonth() - 3);
    const [content, setContent] = useState([]);
    const pathname = "/client/";

    const sortOptions = [
        { value: '{"key": "attribute1", "sign": 0}', label: "A-Z Client", key: 3},
        { value: '{"key": "attribute1", "sign": 1}', label: "Z-A Client", key: 4},
        { value: '{"key": "id", "sign": 0}', label: "A-Z id", key: 1},
        { value: '{"key": "id", "sign": 1}', label: "Z-A id", key: 2},
        { value: '{"key": "attribute2", "sign": 0}', label: "A-Z Adresse", key: 5},
        { value: '{"key": "attribute2", "sign": 1}', label: "Z-A Adresse", key: 6} 
    ];

    // GET information about all content, fires on page load and on filter change
    useEffect(() => {
        /**
         * Function call the API which responds wuth the basic information about
         * all the content that the filter lets trough.
         * In case an error occured, the error is printed in console.
         */
        const fetchContent = async () => {
            try {
                const response = await fetch('/api/client');
                const data = await response.json();
                setContent(data);
                setShownContent(data);
            }
            catch (e) {
                console.log(e);
            }
        }

        fetchContent();
    }, [pathname]);

    const deleteElement = async (id) => {
        await fetch(`/api/client?id=${id}`, { 
            method: 'DELETE'
        });

        let filteredContent = content.slice();
        filteredContent = filteredContent.filter(element => element.id !== id);
        setContent(filteredContent);
        sortContent(filteredContent);
    };
    

    /**
     * Function sorts the array with all the element according to the users 
     * choice and afterwards calls a function to filter the sorted result according
     * to the user's choice (again).
     * @param {Array} arrayToSort array to sort and filter
     */
    const sortContent = (arrayToSort) => {
        let values = JSON.parse(sort);        // get values from html element
        let sortedContent = arrayToSort.slice();      // Create new array from the state array

        sortedContent.sort((a, b) => a.id - b.id);         // sort according to the project ID

        // Condition which verifies what sign to use according to the input from the user
        if (values["sign"]) {
            sortedContent.sort((a, b) => {
                let prime_a = String(a[values["key"]]).toLowerCase();
                let prime_b = String(b[values["key"]]).toLowerCase();

                // compares the 2 values and returns the result
                if (prime_a > prime_b) {
                    return -1;
                }
                else if (prime_b > prime_a) {
                    return 1;
                }
                else{
                    return 0;
                }
            });
        }
        else{
            sortedContent.sort((a, b) => {
                let prime_a = String(a[values["key"]]).toLowerCase();
                let prime_b = String(b[values["key"]]).toLowerCase();

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
        
        setShownContent(filterContent(sortedContent));        // change the (filtered) content order in the actual state
    };


    /**
     * Function fires when the sort option changes or when the user is searching an element.
     * The function will sort the content according to the value chosen by the user
     * and will afterwards filter the content according to the value entered in the search bar 
     * (value is stored in 'search' variable)
     */
    useEffect( () => {
        try {
            sortContent(content);
        }
        catch (e) {
            console.log(e);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sort, search]);


    /**
     * function filters an array depending on what is written in the
     * search bar. The content written in the search bar is memorized
     * in the 'search' state variable.
     * 
     * @param {Array} unfilteredArray 
     * @returns filtered array
     */
    const filterContent = (unfilteredArray) => {
        return unfilteredArray.filter(element => {
            return (
                (String(element["id"]).toLowerCase().indexOf(search) > -1) || 
                (element["attribute1"].toLowerCase().indexOf(search) > -1) || 
                (element["attribute2"].toLowerCase().indexOf(search) > -1) || 
                (element["date"].toLowerCase().indexOf(search) > -1)
            );
        })
    };  

    return (
        <BS.Container fluid style={{ margin: 0, padding: 0 }}>
            <BS.Jumbotron className="client">
                <h1 className='d-inline-block'>Bienvenue dans Clients</h1>
                <LinkContainer to='/client/0'>
                    <BS.Button className='float-right d-inline-block add_project newClient' size='lg' variant='light'>
                            <icon.IoAddCircle style={{margin: 'auto'}} size={30}/>
                            <span style={{margin: 'auto'}}>   Nouveau</span>
                    </BS.Button>
                </LinkContainer>
                <div className="d-flex justify-content-center">
                    <BS.Col lg="1" xs></BS.Col>
                    <BS.Col md="5">
                        <input onChange={ (e) => setSearch(e.target.value.toLowerCase()) } value={ search } type="text" className="form-control form-control-lg recherche" placeholder="Rechercher . . ." />
                        <select onChange={(event) => setSort(event.target.value)} className="form-control form-control-lg shadow-none bg-transparent filtre">
                            {sortOptions.map((option) => (
                                    <option value={option.value} key={option.key}>{option.label}</option>
                                ))}
                        </select>
                    </BS.Col>
                    <BS.Col lg="1" xs></BS.Col>
                </div>
            </BS.Jumbotron> 
            <BS.Table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Client</th>
                        <th>Adresse</th>
                        <th>Téléphone</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <TableauProjets content={ shownContent } onDelete={deleteElement} pathname={ pathname } />
                </tbody>
            </BS.Table> 
        </BS.Container>
    )
};




export default RassemblementClients;