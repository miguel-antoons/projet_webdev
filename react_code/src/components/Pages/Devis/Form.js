import React, { Component } from 'react';
import * as BS from "react-bootstrap"
import Preview from './preview'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import './Form.css'


class Form extends Component {
    constructor(props) {
        super(props)
        this.state = {
            clients: [],
            clients_options: [],
            materials: [],
            material_options: [],
            room: ''
        }
        this.addMaterial = this.addMaterial.bind(this)
        this.api_client()
        setTimeout(() => {this.api_material(); }, 100)
    }

    // Récupérer tous les clients de la base de données
    async api_client() {
        return await fetch('/api/clients').then((response) => {
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

    // Requête liste matériels
    api_material() {
        let tableau_materiels= [];
        //Création du dictionnaire
        let tableau_materiel = {};
        tableau_materiel["id"] = "1";
        tableau_materiel["name"] = "marteau";
        tableau_materiel["price"] = "10 €";
        tableau_materiels.push(tableau_materiel)
        this.setState({materials : tableau_materiels})
        this.options_material(tableau_materiels)
    }

    //Créer option des matériels
    options_material(materials){
        let materials_table = [];
        for (let material of materials) {
            materials_table.push({"material": material.id + '. ' + material.name + ' (' + material.price + ')'})
        }
        this.setState({material_options: materials_table})
    }

    addMaterial() {
        let level = document.getElementById("level").value
        let room = document.getElementById("room").value
        let material = document.getElementById("material").value
        material = material.split('. ')[0]
        for (let element of this.state.materials) {
            if (element.id === material){
                material = element
            }
        }

        let level_verify = document.getElementById(level)
        let room_verify = document.getElementsByName(room) 

        // vérifier si la pièce a déjà été utilisée à ce niveau
        if (room_verify.length > 0)
            for (let element of room_verify) {
                console.log(element.parentNode)
                console.log(level_verify)
                if(element.parentNode === level_verify) {
                    room_verify = element        
                }
                else {
                    room_verify = 0
                }
            }
        else {
            room_verify = 0
        }
        
        //vérification du niveau
        if (level_verify !== null) {   
            // vérification de la pièce du niveau
            if(room_verify !== 0) {
                
                room_verify.innerHTML += '<tr name="' + material.id + '"><td class="padding-right">' +  material.name + '</td><td>' + material.price +' </td></tr>'
            }
            else {
                
                level_verify.innerHTML += '<table name="' + room + '"><thead><tr><th><b> ' + room  + '</b> </th></tr></thead> <tr name="' + material.id + '"><td class="padding-right">' +  material.name + '</td><td>' + material.price +' </td></tr></table>'
            }
        }
        else {
            
            document.getElementById("materials").innerHTML += '<br /><div id="' + level + '"> <b><u>Niveau : ' +  level + '</u></b><table name="' + room + '"><thead><tr><th><b> ' + room  + '</b> </th></tr></thead> <tr name="' + material.id + '"><td class="padding-right">' +  material.name + '</td><td>' + material.price +' </td></tr></table>'
        }
        
        return false;
    }
    

    render() {
        return (

            <BS.Form>
                <BS.Form.Group>
                    <BS.Form.Label>N° de devis</BS.Form.Label>
                    <BS.Form.Control size="sm" type="text" placeholder="Entrer numéro de devis" value={this.props.devisNumber} onChange={this.props.onChangeValue} id="devisNumber" name="devisNumber" />
                </BS.Form.Group>
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
                    <BS.Form.Label>Date devis</BS.Form.Label >
                    <BS.Form.Control size="sm" type="date" value={this.props.devisDate} onChange={this.props.onChangeValue} id="devisDate" name="devisDate" />
                </BS.Form.Group>
                <BS.Form.Group>
                    <BS.Form.Label>Commentaire</BS.Form.Label>
                    <BS.Form.Control size="sm" as="textarea" placeholder="Commentaire" rows={3} value={this.props.comment} onChange={this.props.onChangeValue} id="comment" name="comment" />
                </BS.Form.Group>
                <hr />
                <BS.Form.Group>
                    <BS.Form.Label>Niveau</BS.Form.Label>
                    <BS.Form.Control  type="number" placeholder="Entrez le niveau de l'étage" value={this.props.level} onChange={this.props.onChangeValue} id="level" name="level"  required />
                </BS.Form.Group>
                <BS.Form.Group>
                    <BS.Form.Label>Pièce</BS.Form.Label>
                    <BS.Form.Control  type="text" placeholder="Entrez le nom de la pièce" value={this.props.room} onChange={this.props.onChangeValue} id="room" name="room" required />    
                </BS.Form.Group>
                <BS.Form.Group>
                    <BS.Form.Label>Matériel</BS.Form.Label>
                    <BS.Form.Row>
                        <BS.Col sm={9}>
                            <Autocomplete
                            id="material" 
                            name="material"
                            size="small"
                            options={this.state.material_options} 
                            onChange={this.props.onChangeValue}
                            getOptionLabel={(option) => option.material}
                            renderInput={(params) => <TextField {...params} variant="outlined" />}
                            />
                        </BS.Col>
                        <BS.Col sm={2}>
                            <BS.Button variant="outline-secondary" onClick={this.addMaterial} >Ajouter</BS.Button>
                        </BS.Col>
                    </BS.Form.Row>
                </BS.Form.Group>
                <Preview state={this.props.returnState} />
                <BS.Button className="no-print mb-2 ml-2" variant="info" onClick={window.print}>Imprimer</BS.Button> {' '}

            </BS.Form>
        )
    }
}


export default Form;