import React, { Component } from 'react';
import * as BS from "react-bootstrap"
import Preview from './preview'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import './Form.css'

// ATTENTION CHANGER TABLE FACTURE BDD

class Form extends Component {
    constructor(props) {
        super(props)
        this.state = {
            clients: [],
            clients_options: []
        }
        this.api_client()
        this.save = this.save.bind(this)
        
    }

    // Récupérer tous les clients de la base de données
    async api_client() {
        return await fetch('/api/facture/get_clients').then((response) => {
            return response.json().then((result) => {
                let tableau_clients = [];

                //Création du dictionnaire
                for (let client in result) {
                    let tableau_client = {};
                    tableau_client["id"] = client;
                    tableau_client["name"] = result[client]["0"]["0"];
                    tableau_client["firstname"] = result[client]["0"]["1"];
                    tableau_client["title"] = result[client]["0"]["2"];
                    tableau_client["company"] = result[client]["0"]["3"];
                    tableau_client["adress"] = result[client]["0"]["4"];
                    tableau_client["tva"] = result[client]["0"]["5"];
                    tableau_client["language"] = result[client]["0"]["6"];
                    tableau_client["artichitecteName"] = result[client]["0"]["7"];
                    tableau_client["number"] = result[client]["0"]["8"];
                    tableau_client["mail"] = result[client]["0"]["9"];
                    tableau_clients.push(tableau_client);
                }
                this.setState({clients : tableau_clients})
                this.options_client(tableau_clients)

            }).catch((err) => {
                console.log(err);
            })
        })
    }

    // Créer option des clients
    options_client(clients) {
        const clients_table = []
        for (let client of clients) {
            clients_table.push({"client" :  client.id + '. ' + client.firstname + ' ' + client.name})
        }
        this.setState({ clients_options: clients_table })
    }

    async save() {
        let url = window.location.href.split("/")
        let param = url.length - 1 
        let factureId = url[param]
        let id_client = document.getElementById("clientNumber").value.split(". ")[0]
        let date_facture = document.getElementById("factureDate").value
        let date_echeance = document.getElementById("deadline").value
        let date_fin_travaux = document.getElementById("workDate").value
        let taux_tva = document.getElementById("tva").value
        let commentaire = document.getElementById("comment").value
        let montant = document.getElementById("price").value
        let id_texte_facture = "1"

        // ajout de facture
        if(Number(factureId) === 0) {
            try{
                let result = await fetch('/api/facture', {
                method: 'post',
                //mode: 'no-cors', // --> pas besoin de cette ligne
                headers: {
                    //'Accept': 'application/json', // --> pas besoin de cette ligne non-plus
                    'Content-type': 'application/json',
                
                },
                
                body: JSON.stringify({id_client, date_facture, date_echeance, date_fin_travaux, taux_tva, commentaire, montant, id_texte_facture}) // l'objet à l'intérieur de la fonction contient l'état des 5 input
                });
        
                const data = await result.json();
                document.getElementById("msg").innerText = "*" + data["msg"]
        
            }
            catch(e){
                console.log(e);
            }
        }
        //modification de facture
        else {
            try{
                let result = await fetch('/api/facture', {
                method: 'put',
                //mode: 'no-cors', // --> pas besoin de cette ligne
                headers: {
                    //'Accept': 'application/json', // --> pas besoin de cette ligne non-plus
                    'Content-type': 'application/json',
                
                },
                
                body: JSON.stringify({factureId, id_client, date_facture, date_echeance, date_fin_travaux, taux_tva, commentaire, montant, id_texte_facture}) // l'objet à l'intérieur de la fonction contient l'état des 5 input
                });
        
                const data = await result.json();
                document.getElementById("msg").innerText = "*" + data["msg"]
            }
            catch(e){
                console.log(e);
            }
        }
         
    }
<<<<<<< HEAD
=======

    print() {
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
        
        cssPagedMedia.size('length');

        window.print();
    }
>>>>>>> c443f989462b988d6b91ba7cb30768a7be1f39c8
    

    render() {
        return (

            <BS.Form onSubmit={this.save}>
                {/*
                <BS.Form.Group>
                    <BS.Form.Label>N° de facture</BS.Form.Label>
                    <BS.Form.Control size="sm" type="text" placeholder="Entrer numéro de facture" value={this.props.factureNumber} onChange={this.props.onChangeValue} id="factureNumber" name="factureNumber" />
                </BS.Form.Group>
                */}
                <BS.Form.Group>
                    <BS.Form.Label>Client</BS.Form.Label>
                    <Autocomplete
                    id="clientNumber" 
                    name="clientNumber"
                    size="small"
                    options={this.state.clients_options} 
                    onChange={this.props.onChangeValue}
                    getOptionLabel={(option) => option.client}
                    renderInput={(params) => <TextField {...params} variant="outlined" />}
                    />
                </BS.Form.Group>
                <BS.Form.Group>
                    <BS.Form.Label>Date facture</BS.Form.Label >
                    <BS.Form.Control size="sm" type="date" value={this.props.factureDate} format="dd/mm/yyyy" onChange={this.props.onChangeValue} id="factureDate" name="factureDate" />
                </BS.Form.Group>
                <BS.Form.Group>
                    <BS.Form.Label>Travaux terminé le</BS.Form.Label>
                    <BS.Form.Control size="sm" type="date" value={this.props.workDate} onChange={this.props.onChangeValue} id="workDate" name="workDate" />
                </BS.Form.Group>
                <BS.Form.Group>
                    <BS.Form.Label>Echéance</BS.Form.Label>
                    <BS.Form.Control size="sm" type="date" value={this.props.deadline} onChange={this.props.onChangeValue} id="deadline" name="deadline" />
                </BS.Form.Group>
                <BS.Form.Group>
                    <BS.Form.Label>TVA</BS.Form.Label>
                    <BS.Form.Control size="sm" as="select" value={this.props.tva} onChange={this.props.onChangeValue} id="tva" name="tva">
                        <option value="6">6%</option>
                        <option value="13">13%</option>
                        <option value="15">15%</option>
                    </BS.Form.Control>
                </BS.Form.Group>
                <BS.Form.Group>
                    <BS.Form.Label>Commentaire</BS.Form.Label>
                    <BS.Form.Control size="sm" as="textarea" placeholder="Commentaire" rows={3} value={this.props.comment} onChange={this.props.onChangeValue} id="comment" name="comment" />
                </BS.Form.Group>
                <BS.Form.Group>
                    <BS.Form.Label>Montant à facturer htva</BS.Form.Label>
                    <BS.Form.Control size="sm" type="number" rows={3} value={this.props.price} defaultValue={0} onChange={this.props.onChangeValue} id="price" name="price" />
                </BS.Form.Group>
                <Preview state={this.props.returnState} />
                <BS.Button id="save" className="no-print mb-2 ml-2" variant="info" onClick={this.save}>Sauvegarder</BS.Button> {' '}
                <BS.Button className="no-print mb-2 ml-2" variant="info" onClick={this.print}>Imprimer</BS.Button> {' '}
                <div id="msg"></div>

            </BS.Form>
        )
    }
}


export default Form;