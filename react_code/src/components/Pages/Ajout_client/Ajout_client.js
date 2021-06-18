import React from 'react';
import  { useState } from 'react';
import * as BS from "react-bootstrap";
import MDBInput from '@material-ui/core/TextField';
import Select from "react-select";
import './ajoutClients.css';


// ici le component s'appelle home puisque je travaillais dessus, ça n'a pas d'importance et chez toi il s'apellera probablemnt autrement
const Ajout_Client = (props) => {
    // Met le state des inputs
    const [clientID, setClientID] = useState();
    const [name, setName] = useState('');
    const [firstname, setFirstname] = useState('');
    const [titre, setTitre] = useState({value: 0, label: 'Mr'});
    const [societe, setSociete] = useState('');
    const [langue, setLangue] = useState({value: 0, label: 'Nl'});
    const [adress, setAdress] = useState('');
    const [tva, setTva] = useState('');
    const [number, setNumber] = useState('');
    const [email, setEmail] = useState('');
    const [disabled, setDisabled] = useState(true);
    const [message, setMessage] = useState('');

    const errorMessage = (
        <BS.Alert variant="danger" onClose={() => setMessage('')} className="popup" dismissible>
            <BS.Alert.Heading>Une erreur est survenue</BS.Alert.Heading>
            <p>
            Veuillez contacter les développeurs.<br />
            Attention! Les données générés avant cette erreur sont susceptibles de ne pas avoir été enregistrés.
            </p>
        </BS.Alert>   
    );

    const savedMessage = (
        <BS.Alert variant="success" onClose={() => setMessage('')} className="popup" dismissible>
            <BS.Alert.Heading>Nouveau Client Enregistré</BS.Alert.Heading>
            <p>
                Le nouveau client a été créé et enregistré avec succès.<br />
                Son ID est {clientID}.
            </p>
        </BS.Alert>
    )
    
    const optionsTitle = [
        {value: 0, label: 'Mr'},
        {value: 1, label: 'Mme'}
    ];

    const optionsLanguage = [
        {value: 0, label: 'Nl'},
        {value: 1, label: 'Fr'}
    ];

    // envoi les données des inputs onSubmit
    const sendPost = async (event) => {

        let id = Number(props.match.params.id)
      
        // évite que la page se recharge onSubmit du formulaire
        event.preventDefault();

        //if props.match.paramsid = 0:

        if (Number(props.match.params.id) === 0) {
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
                            adress,
                            tva,
                            number,
                            email
                        }
                    )
                });
        
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
                        body: JSON.stringify({id,name, firstname, societe, titre, langue,adress,tva,number,email})
                    }
                );
        
                const data = await result.json();
        
                console.log(data);
            }
            catch(e) {
                console.log(e);
            }
        }
    }   
  
    return (
            <BS.Col className="mx-auto no-margin" lg='4' xs='12' align='center'>
                <BS.Form onSubmit={ (event) => { sendPost(event); }}>
                    <MDBInput className="defaultInput" label="Nom" value={ name } onChange={ (e) => {setName(e.target.value); setDisabled(false)} } />
                    <MDBInput className="defaultInput" label="Prenom" value={ firstname } onChange={ (e) => {setFirstname(e.target.value); setDisabled(false)} } required />
                    <MDBInput className="defaultInput" label="Société" value={ societe } onChange={ (e) => {setSociete(e.target.value); setDisabled(false)} } required />
                    <MDBInput className="defaultInput" label="Adresse 1" value={ adress } onChange={ (e) => {setAdress(e.target.value); setDisabled(false)} }  />
                    <MDBInput className="defaultInput" label="Adresse 2" value={ adress } onChange={ (e) => {setAdress(e.target.value); setDisabled(false)} }  />
                    <MDBInput className="defaultInput" label="N° de TVA" value={ tva } onChange={ (e) => {setTva(e.target.value); setDisabled(false)} }  />
                    <MDBInput className="defaultInput" label="Téléphone" value={ number } onChange={ (e) => {setNumber(e.target.value); setDisabled(false)} }  />
                    <MDBInput className="defaultInput" label="E-mail" value={ email } onChange={ (e) => {setEmail(e.target.value); setDisabled(false)} }  />
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
