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
            house : {}
        }

        let url = window.location.href.split("/")
        let param = url.length - 1 
        if(url[param] !== 0) this.set_state_devis(url[param])

        this.addMaterial = this.addMaterial.bind(this)
        this.save = this.save.bind(this)
        this.deleteMaterial = this.deleteMaterial.bind(this)
        this.api_client()
        setTimeout(() => {this.api_material(); }, 100)
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

    // Requête liste matériels
    api_material() {
        let tableau_materiels= [];
        //Création du dictionnaire
        let tableau_materiel = {};
        tableau_materiel["id"] = "1";
        tableau_materiel["name"] = "marteau";
        tableau_materiel["price"] = "10";
        tableau_materiels.push(tableau_materiel)
        tableau_materiel = {};
        tableau_materiel["id"] = "2";
        tableau_materiel["name"] = "scie";
        tableau_materiel["price"] = "110.25";
        tableau_materiels.push(tableau_materiel)
        this.setState({materials : tableau_materiels})
        this.options_material(tableau_materiels)
    }

    //Créer option des matériels
    options_material(materials){
        let materials_table = [];
        for (let material of materials) {
            materials_table.push({"material": material.id + '. ' + material.name + ' (' + material.price + ' €)'})
        }
        this.setState({material_options: materials_table})
    }

    // set house
    async set_state_devis(id) {
        return await fetch('/api/devis/get_devis_id/' + id).then((response) => {
            return response.json().then((result) => {
                this.setState({ 
                    house: JSON.parse(result[0][4])
                })
                this.fill_text_materials()
            }).catch((err) => {
                console.log(err);
            })
        })
    }

    addMaterial() {
        let level = document.getElementById("level").value
        let room = document.getElementById("room").value
        let material = document.getElementById("material").value
        if (level === "" || room === "" || material === "") {
            document.getElementById("msg").innerText = "*Veuillez remplir le niveau, la pièce et le matériel à rajouter"
            return
        }
        document.getElementById("materials").innerHTML = ""
        material = material.split('. ')[0]
        for (let element of this.state.materials) {
            if (element.id === material){
                material = element
            }
        }

        // Initilisation du tableau
        if (this.state.house[level] === undefined) this.state.house[level] = {}
        if (this.state.house[level][room] === undefined) this.state.house[level][room] = {}
        if (this.state.house[level][room][material["id"]] === undefined) this.state.house[level][room][material["id"]] = {}
        
        if (this.state.house[level][room][material["id"]]["name"] !== undefined) {
            this.state.house[level][room][material["id"]]["counter"] += 1
        }
        else {
            this.state.house[level][room][material["id"]]["name"] = material["name"]
            this.state.house[level][room][material["id"]]["price"] = material["price"]
            this.state.house[level][room][material["id"]]["counter"] = 1
        }
        
        this.fill_text_materials()
    }

    /**
     * Permet de supprimer matériel de la liste
     * @returns 
     */
    deleteMaterial() {
        let level = document.getElementById("level").value
        let room = document.getElementById("room").value
        let material = document.getElementById("material").value
        material = material.split('. ')[0]
        if (level === "" || room === "" || material === "") {
            document.getElementById("msg").innerText = "*Veuillez remplir le niveau, la pièce et le matériel à suppimer"
            return
        }

        if(this.state.house[level] !== undefined ) {
            if(this.state.house[level][room] !== undefined ) {
                if(this.state.house[level][room][material] !== undefined ) {
                    if (this.state.house[level][room][material]["counter"] > 1) {
                        this.state.house[level][room][material]["counter"] = this.state.house[level][room][material]["counter"] - 1 
                    }
                    else {
                        delete this.state.house[level][room][material]
                        //suprimer pièce et niveau si vide 
                        if (Object.keys(this.state.house[level][room]).length === 0) delete this.state.house[level][room]
                        if (Object.keys(this.state.house[level]).length === 0) delete this.state.house[level]
                    }
                }
            }
        }

        document.getElementById("materials").innerHTML = ""
        this.fill_text_materials()
    }


    fill_text_materials() {
        let house_levels = Object.keys(this.state.house)
        for(let house_level of house_levels) {
            let level_rooms = Object.keys(this.state.house[house_level])
            // Titre niveau de la maison
           
            document.getElementById("materials").innerHTML += "<br /><span class='h7'>Niveau : " + house_level + "</span><br />"
            for (let house_room of level_rooms) {
                let room_materials = Object.keys(this.state.house[house_level][house_room])
                // Titre de la pièce du niveau
                document.getElementById("materials").innerHTML += "<u><b>" + house_room + "</b></u><br />"
                for (let house_material of room_materials) {
                    
                    // Matériel de la pièce
                    let price = this.state.house[house_level][house_room][house_material]["counter"] * this.state.house[house_level][house_room][house_material]["price"] + (this.state.house[house_level][house_room][house_material]["counter"] * this.state.house[house_level][house_room][house_material]["price"]) / 100 * this.props.returnState.percent
                    document.getElementById("materials").innerHTML += this.state.house[house_level][house_room][house_material]["counter"] + " x " + this.state.house[house_level][house_room][house_material]["name"] + "(s/x)<div class='float-right margin-right-20'>" + price +" €</div><br />"
                }    
            }
        }
    }

    async save() {   
        let url = window.location.href.split("/")
        let param = url.length - 1 

        let devisId = url[param]
        let id_client = this.props.returnState.clientId
        let id_texte_devis = "1"
        let date_devis = this.props.returnState.devisDate
        let chantier = JSON.stringify(this.state.house)
        let choix_prix = this.props.returnState.price
        let modification_prix_pourcentage = this.props.returnState.percent
        let modification_prix_fixe = this.props.returnState.price
        let chantier_nom = this.props.returnState.site
        let commentaire = this.props.returnState.comment
        
        // ajout de devis
        if(Number(devisId) === 0) {
            try{
                let result = await fetch('/api/devis', {
                method: 'post',
                //mode: 'no-cors', // --> pas besoin de cette ligne
                headers: {
                    //'Accept': 'application/json', // --> pas besoin de cette ligne non-plus
                    'Content-type': 'application/json',
                
                },
                
                body: JSON.stringify({chantier_nom, id_client, date_devis, commentaire, chantier, choix_prix, modification_prix_pourcentage, modification_prix_fixe, id_texte_devis}) // l'objet à l'intérieur de la fonction contient l'état des 5 input
                });
        
                const data = await result.json();
                document.getElementById("msg").innerText = "*" + data["msg"]
        
            }
            catch(e){
                console.log(e);
            }
        }
        //modification de devis
        else {
            try{
                let result = await fetch('/api/devis', {
                method: 'put',
                //mode: 'no-cors', // --> pas besoin de cette ligne
                headers: {
                    //'Accept': 'application/json', // --> pas besoin de cette ligne non-plus
                    'Content-type': 'application/json',
                
                },
                
                body: JSON.stringify({chantier_nom, devisId, id_client, date_devis, commentaire, chantier, choix_prix, modification_prix_pourcentage, modification_prix_fixe, id_texte_devis}) // l'objet à l'intérieur de la fonction contient l'état des 5 input
                });
        
                const data = await result.json();
                document.getElementById("msg").innerText = "*" + data["msg"]
            }
            catch(e){
                console.log(e);
            }
        }
        
         
    }
    

    render() {
        return (

            <BS.Form>
                {/*
                <BS.Form.Group>
                    <BS.Form.Label>N° de devis</BS.Form.Label>
                    <BS.Form.Control size="sm" type="text" placeholder="Entrer numéro de devis" value={this.props.devisNumber} onChange={this.props.onChangeValue} id="devisNumber" name="devisNumber" />
                </BS.Form.Group>
                */}

                <BS.Form.Group>
                    <BS.Form.Label>Chantier</BS.Form.Label>
                    <BS.Form.Control  type="text" placeholder="Entrez le nom du chantier" value={this.props.site} onChange={this.props.onChangeValue} id="site" name="site" required />    
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
                <BS.Form.Group>
                    <BS.Form.Label>Prix total</BS.Form.Label>
                    <BS.Form.Control size="sm" type="number"  placeholder="example: 150, 122.25" rows={3} value={this.props.price} onChange={this.props.onChangeValue} id="price" name="price" />
                </BS.Form.Group>
                <BS.Form.Group>
                    <BS.Form.Label>Pourcentage</BS.Form.Label>
                    <BS.Form.Control size="sm" type="number"  placeholder="example: 50%, 60%" rows={3} value={this.props.percent} onChange={this.props.onChangeValue} id="percent" name="percent" />
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
                        <BS.Col sm={6}>
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
                        <BS.Col sm={2.5}>
                            <BS.Button variant="outline-secondary" onClick={this.addMaterial} >Ajout</BS.Button>
                        </BS.Col>
                        <BS.Col sm={2}>
                            <BS.Button variant="danger" onClick={this.deleteMaterial}>Suppr</BS.Button>
                        </BS.Col>    
                    </BS.Form.Row>
                </BS.Form.Group>
                {/*<Preview state={this.props.returnState} />*/}
                <BS.Button id="save" className="no-print mb-2 ml-2" variant='dark' onClick={this.save}>Sauvegarder</BS.Button> {' '}
                <BS.Button className="no-print mb-2 ml-2" variant="info" onClick={window.print}>Imprimer</BS.Button> {' '}
                <div id="msg"></div>

            </BS.Form>
        )
    }
}


export default Form;