import React from 'react';
import  { useState, useEffect } from 'react';
import * as BS from "react-bootstrap";
import MDBInput from '@material-ui/core/TextField';
import Select from "react-select";
import './ajoutClients.css';


// ici le component s'appelle home puisque je travaillais dessus, ça n'a pas d'importance et chez toi il s'apellera probablemnt autrement
const Ajout_Client = (props) => {
    // Met le state des inputs
    const [clientID, setClientID] = useState(Number(props.match.params.id));
    const [name, setName] = useState('');
    const [firstname, setFirstname] = useState('');
    const [titre, setTitre] = useState({value: 0, label: 'Mr'});
    const [societe, setSociete] = useState('');
    const [langue, setLangue] = useState({value: 0, label: 'Nl'});
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [architect, setArchitect] = useState('');
    const [tva, setTva] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [disabled, setDisabled] = useState(true);
    const [message, setMessage] = useState('');

    const errorMessage = (
        <BS.Alert variant="danger" onClose={() => setMessage('')} className="popup" dismissible>
            <BS.Alert.Heading>Une erreur est survenue</BS.Alert.Heading>
            <p>
            Attention! Les données générés avant cette erreur sont susceptibles de ne pas avoir été enregistrés.
            </p>
        </BS.Alert>   
    );

    const createdMessage = (
        <BS.Alert variant="success" onClose={() => setMessage('')} className="popup" dismissible>
            <BS.Alert.Heading>Nouveau Client Enregistré</BS.Alert.Heading>
            <p>
                Le nouveau client a été créé et enregistré avec succès.<br />
                Son ID est {clientID}.
            </p>
        </BS.Alert>
    );

    const savedMessage = (
        <BS.Alert variant="success" onClose={() => setMessage('')} className="popup" dismissible>
            <BS.Alert.Heading>Client Enregistré</BS.Alert.Heading>
            <p>
                Le client a été enregistré avec succès.<br />
                Son ID est {clientID}.
            </p>
        </BS.Alert>
    );
    
    const optionsTitle = [
        {value: 0, label: 'Mr'},
        {value: 1, label: 'Mme'}
    ];

    const optionsLanguage = [
        {value: 0, label: 'Nl'},
        {value: 1, label: 'Fr'}
    ];

    useEffect( () => {
        if (clientID) {
            const fetchContent = async () => {
                try {
                    const response = await fetch('/api/client/' + clientID);
                    const data = await response.json();

                    setName(data[0][1]);
                    setFirstname(data[0][2]);
                    setSociete(data[0][4]);
                    setAddress1(data[0][6]);
                    setTva(data[0][7]);
                    setPhoneNumber(data[0][8]);
                    setEmail(data[0][9]);
                    setTitre(optionsTitle[Number(data[0][3])]);
                    setLangue(optionsLanguage[Number(data[0][5])]);
                    setAddress2(data[0][10]);
                    setArchitect(data[0][11]);
                }
                catch (e) {
                    console.log(e);
                }
            }
    
            fetchContent();
        }
    // eslint-disable-next-line
    }, [clientID]);

    // envoi les données des inputs onSubmit
    const sendPost = async (event) => {
        // évite que la page se recharge onSubmit du formulaire
        event.preventDefault();

        //if props.match.paramsid = 0:

        if (!Number(props.match.params.id)) {
            try {
                let result = await fetch('/api/client', {
                    method: 'post',
                    //mode: 'no-cors', // 
                    headers: {
                        //'Accept': 'application/json'
                        'Content-type': 'application/json',
                    },
                    // l'objet à l'intérieur de la fonction contient l'état des 5 input
                    body: JSON.stringify(
                        {
                            name,
                            firstname,
                            societe,
                            titre,
                            langue,
                            address1,
                            tva,
                            phoneNumber,
                            email,
                            address2,
                            architect
                        }
                    )
                });
        
                const data = await result.json();

                try {
                    setClientID(Number(data.projectID));
                    setMessage(createdMessage);
                }
                catch (e) {
                    console.log(e);
                    setMessage(errorMessage);
                }
            }
            catch(e) {
                console.log(e);
                setMessage(errorMessage);
            }
        }
        else {
            try {
                let result = await fetch('/api/client', 
                    {
                        method: 'put',
                        //mode: 'no-cors', // 
                        headers: {
                            //'Accept': 'application/json'
                            'Content-type': 'application/json',
                        
                        },
                        // l'objet à l'intérieur de la fonction contient l'état des 5 input
                        body: JSON.stringify(
                            {
                                clientID,
                                name,
                                firstname,
                                societe,
                                titre,
                                langue,
                                address1,
                                tva,
                                phoneNumber,
                                email,
                                address2,
                                architect
                            }
                        )
                    }
                );
        
                const data = await result.json();
        
                try {
                    setClientID(Number(data.projectID));
                    setMessage(savedMessage);
                }
                catch (e) {
                    console.log(e);
                    setMessage(errorMessage);
                }
            }
            catch(e) {
                console.log(e);
                setMessage(errorMessage);
            }
        }
    }   
  
    return (
        <BS.Col className="mx-auto no-margin clientAnimation" lg='4' xs='12' align='center'>
            <BS.Form onSubmit={ (event) => { sendPost(event); }}>
                <MDBInput className="defaultInput" label="Nom" value={ name } onChange={ (e) => {setName(e.target.value); setDisabled(false)} } />
                <MDBInput className="defaultInput" label="Prenom" value={ firstname } onChange={ (e) => {setFirstname(e.target.value); setDisabled(false)} } required />
                <MDBInput className="defaultInput" label="Société" value={ societe } onChange={ (e) => {setSociete(e.target.value); setDisabled(false)} } required />
                <MDBInput className="defaultInput" label="Adresse 1" value={ address1 } onChange={ (e) => {setAddress1(e.target.value); setDisabled(false)} }  />
                <MDBInput className="defaultInput" label="Adresse 2" value={ address2 } onChange={ (e) => {setAddress2(e.target.value); setDisabled(false)} }  />
                <MDBInput className="defaultInput" label="N° de TVA" value={ tva } onChange={ (e) => {setTva(e.target.value); setDisabled(false)} }  />
                <MDBInput className="defaultInput" label="Téléphone" value={ phoneNumber } onChange={ (e) => {setPhoneNumber(e.target.value); setDisabled(false)} }  />
                <MDBInput className="defaultInput" label="E-mail" value={ email } onChange={ (e) => {setEmail(e.target.value); setDisabled(false)} }  />
                <MDBInput className="defaultInput" label="Architecte" value={ architect } onChange={ (e) => {setArchitect(e.target.value); setDisabled(false)} }  />
                <Select
                    className="defaultSelect border-0"
                    defaultValue={titre}
                    onChange={(event) => {setTitre(event); setDisabled(false)} }
                    label="Titre"
                    options={optionsTitle}
                />
                <Select
                    className="defaultSelect"
                    defaultValue={langue}
                    onChange={ (event) => {setLangue(event); setDisabled(false)} }
                    label="Titre"
                    options={optionsLanguage}
                />
                <BS.Button className="submitClient" variant="outline-info" type="submit" disabled={disabled}>Enregistrer</BS.Button> 
            </BS.Form>
            {message}
            
        </BS.Col>
    );
};

export default Ajout_Client ;
