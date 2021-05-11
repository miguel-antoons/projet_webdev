import React, { Component } from 'react';
import * as BS from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Devis.css';
import './print.css';
import Form from './Form'

class Devis extends Component {
    constructor(props) {
        super(props)

        this.state = {
            devisNumber: '',
            //client 
            clientId : '',
            clientNumber: '',
            clientName: '',
            clientFirstname: '',
            clientCompany: '',
            clientAdress: '',
            title: 'Mr.',

            site: '',
            devisDate: '',
            comment: '',
            price: '0',
            percent: '0',
            house : '',
            price_choice : 'price1',
            clients: []
        }

        let url = window.location.href.split("/")
        let param = url.length - 1 
        if(url[param] !== 0) {
            this.set_state_devis(url[param])
        }

        this.api_client()
        this.handleChange = this.handleChange.bind(this)
    }

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
                    tableau_client["title"] = result[client]["0"]["8"];
                    tableau_client["company"] = result[client]["0"]["2"];
                    tableau_client["adress"] = result[client]["0"]["3"];
                    tableau_client["tva"] = result[client]["0"]["5"];
                    tableau_client["language"] = result[client]["0"]["6"];
                    tableau_client["artichitecteName"] = result[client]["0"]["7"];
                    tableau_client["number"] = result[client]["0"]["9"];
                    tableau_client["mail"] = result[client]["0"]["10"];
                    tableau_clients.push(tableau_client);
                }
                this.setState({ clients: tableau_clients })


            }).catch((err) => {
                console.log(err);
            })
        })
    }

    handleChange(event) {
        const name = event.target.name
        const value = event.target.value

        this.setState({
            [name]: value
        })
        
        // changement client
        let event_id = document.getElementById(event.target.id).innerHTML
        event_id = event_id.split('. ')[0]
        let event_name = event.target.id.split("-")[0]
        for (let client of this.state.clients) {
            if (client.id === event_id && event_name === "clientNumber") {
                this.setState({
                    clientId: client.id,
                    clientNumber: client.number,
                    clientName: client.name,
                    clientFirstname: client.firstname,
                    clientCompany: client.company,
                    clientAdress: client.adress,
                    title: client.title
                })

                // changement de sexe
                if (this.state.title === "Mr.") {
                    document.getElementById("sexe").innerText = "Monsieur, "
                }
                else {
                    document.getElementById("sexe").innerText = "Madame, "
                }
            }
        }
        if (name === "percent") {
            document.getElementById("materials").innerHTML = ""
            this.fill_text_materials(value)
        }
    }

    // permet de remplir zone matériels du devis
    fill_text_materials(percent) {
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
                    let price = this.state.house[house_level][house_room][house_material]["counter"] * this.state.house[house_level][house_room][house_material]["price"] + (this.state.house[house_level][house_room][house_material]["counter"] * this.state.house[house_level][house_room][house_material]["price"]) / 100 * percent
                    document.getElementById("materials").innerHTML += this.state.house[house_level][house_room][house_material]["counter"] + " x " + this.state.house[house_level][house_room][house_material]["name"] + "(s/x)<div class='float-right margin-right-20'>" + price +" €</div><br />"
                } 
            }
        }
    }
    
    // set l'état du formulaire avec l'id du devis rentré en param
    async set_state_devis(id) {
        return await fetch('/api/devis/get_devis_id/' + id).then((response) => {
            return response.json().then((result) => {
                this.setState({ 
                    devisNumber: id,
                    devisDate: this.change_date_format(result[0][3]),
                    comment: result[0][12],
                    price: result[0][5],
                    percent: result[0][6],
                    house: JSON.parse(result[0][4])
                })

                // remplir le formulaire
                document.getElementById("comment").value = result[0][12]
                document.getElementById("site").value = result[0][11]
                document.getElementById("devisDate").value = this.change_date_format(result[0][3])
                document.getElementById("price").value =  result[0][5]
                document.getElementById("percent").value =  result[0][6]
                
                console.log(result)
                this.set_state_client(result[0][1])
                //changer bouton sauvegarder par modifier
                document.getElementById("save").innerText = "Modifier"
            }).catch((err) => {
                console.log(err);
            })
        })
    }

    change_date_format(date) {
        let facture_date = Date.parse(date)
        facture_date = new Date(facture_date)
        return ("0" + facture_date.getFullYear()).slice(-4) + "-" + ("0" + (facture_date.getMonth() + 1)).slice(-2) + "-" + ("0" + facture_date.getDate()).slice(-2)
    }

    // set l'état du formulaire avec l'id de la devis rentré en param
    async set_state_client(id) {
        return await fetch('/api/client/' + id).then((response) => {
            return response.json().then((result) => {
                this.setState({ 
                    clientId: result[0][0],
                    clientName: result[0][1],
                    clientFirstname: result[0][2],
                    clientTva: result[0][6],
                    clientCompany: result[0][3],
                    clientAdress: result[0][4],
                    title: result[0][9],
                    clientNumber: result[0][10]
                })

                // changement de sexe
                if (result[0][9] === "Mr.") {
                    document.getElementById("sexe").innerText = "Monsieur, "
                }
                else {
                    document.getElementById("sexe").innerText = "Madame, "
                }
                
                // remplir le formulaire, ne fonctionne pas
                /*
                let option = {client : this.state.clientNumber + '. ' + this.state.clientFirstname + ' ' + this.state.clientName}
                console.log(option)
                document.getElementById("clientNumber").Value = option
                document.getElementById('clientNumber').getElementsByTagName('option')[2].selected = 'selected'
                */
            }).catch((err) => {
                console.log(err);
            })
        })
    }

    

    tva(price_str, tva_str) {
        let price = Number(price_str)
        let tva = Number(tva_str)
        let total_tva = (price / 100) * tva
        return Math.round(total_tva * 100) / 100
    }

    total_tva(price_str, tva_str) {
        let price = Number(price_str)
        let tva = Number(tva_str)
        let total_tva = price + (price / 100) * tva
        return Math.round(total_tva * 100) / 100
    }

    currentDate() {
        let date = new Date()
        return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
    }

    render() {
        return (
            <BS.Container>
                <BS.Row>
                    {/* Left */}
                    <BS.Col xs lg="4" className="border mt-5 mr-3 no-print h-50 rounded">
                        <Form onChange={this.handleChange} onChangeValue={this.handleChange} returnState={this.state}
                        />
                    </BS.Col>

                    {/* Right */}
                    <BS.Col className="mt-5  overflow-auto text-pdf" id='print'>
                        <BS.Row className="mt-2">
                            <BS.Col className="mr-5" xs lg="6">
                                Leuvensebaan 201 A <br />
                            3040 ST-Agatha-Rode (Huldenberg)<br />
                            Tel. 016/47 16 85 - Gsm 0475-23 38 56<br />
                            Fax. 016/47 38 64 Email: luc@antoons.be<br />

                            </BS.Col>
                            <BS.Col className="margin-left">
                                <br />
                                <b>Bv Antoons Luc Srl</b><br />
                            Elektrische installaties - Domotica<br />
                            Intallations électriques - Domotique<br /><br /><br />
                            </BS.Col>
                        </BS.Row>
                        <hr />

                        <BS.Row className="mt-2">
                            <BS.Col className="mr-5" xs lg="6">

                            </BS.Col>
                            <BS.Col className="margin-left">
                                <br />
                                Sint Agatha Rode, {this.state.devisDate}<br /><br />
                                {this.state.clientName} {this.state.clientFirstname},<br />
                                {this.state.clientAdress}

                            </BS.Col>
                        </BS.Row>

                        <BS.Row className="mt-4">
                            <BS.Col className="mr-5" xs lg="6">
                                Référence devis : {this.state.devisNumber} <br /><br />
                                <div id="sexe"></div>
                                {this.state.comment}<br /><br />

                            </BS.Col>
                        </BS.Row>

                        <div id="materials" className="margin-bot-100">{/*section liste des matériels*/}</div>

                        <div className="pagebreak">
                        <span><b><u>Conditions générales</u></b></span><br />
                        L'installation commence juste après le coffret compteur,  pour autant que celui-ci se trouve dans le corps principal du bâtiment.  <br />
                        Les prises et interrupteurs sont de marque NIKO type ORIGINAL WHITE pour le matériel encastré et de type HYDRO 55 pour le matériel apparent.  <br />
                        Aucun appareil d'éclairage est prévu dans cette offre, sauf ceux des représailles ci-dessus. <br />
                        Les prix unitaires sont valables pour autant que le bâtiment n'est pas constitué de plusieurs petits bâtiments ou annexes;  dans ce cas une offre précise peut être demandée. 
                        La protection des circuits sera réalisée par disjoncteurs multipolaires adaptés à la section des fils. 
                        Coffret divisionnaire et disjoncteurs ABB VYNCKIER. 
                        Le contrôle de l'installation électrique par un organisme agréé est compris dans cette offre.  <br />
                        La boucle de terre est considérée comme existante et de résistance inférieure à 30 Ohms.  <br />
                        Bouton de sonnerie NIKO, sonnerie (ding dong) FRIEDLAND.  
                        Les travaux de terrassement et de tubage-câblage extérieur ne sont jamais compris dans l'offre. <br />
                        Le nettoyage du bâtiment avant le début des travaux, n'est pas compris dans cette offre.  <br />
                        Le bâtiment devra être propre et libre de tous les déchets et matériaux laissés par de precedents corps de métier.  
                        Tous les déchets provenant de nos travaux seront repris. 
                        De l'eau et 1 prise de courant de minimum 20A seront disponibles sur le chantier dès le début
                        de nos travaux;  si l'utilisation d'un groupe électrogène est nécessaire, cela vous sera facturé en 
                        supplément à ce devis.  <br />
                        Une toilette doit être disponible sur le chantier.  
                        Dans cette offre est prévue une visite de chantier préliminaire au début des travaux.  <br />
                        Toutes les factures concernant ce chantier doivent être payées dans les quinze jours suivant la
                        date de facturation. 
                        En cas de non paiement à l'échéance, le solde de la facture sera majoré d'une indemnit
                        forfaitaire de 10% et d'un intérêt de retard de 1% par mois.  <br />
                        En cas de contestation, les tribunaux de Louvain sont seuls compétents.  <br />
                        Toute réclamation doit nous parvenir par écrit dans les 8 jours par lettre recommandée suivant 
                        la date de facturation pour être pris en considération.  <br />
                        Les prix mentionnés ci-dessus restent valables pendant 3 mois.<br /><br />
                        </div>

                        <span><b><u>Prix</u></b></span><br />
                        L'installation décrite ci-dessus peut-être résalisée pour la somme hors TVA de <span>{ (Number(this.state.price) + (this.state.price / 100 * this.state.percent)).toFixed(2)}</span> Euro <br /><br /><br />

                        <span><b><u>Paimement</u></b></span><br />
                        50 % dès la fin de la pose des tabues pour l'installation électrique. <br />
                        50 % à la réception de l'installation électrique pour un organisme agréé. <br />
                        <br /><br /><br /><br />
                        En attendant une réponse de votre part, je me tiens à votre entière disposition pour toutes <br />
                        informations supplémentaires éventuelles.<br />
                        <br />
                        Avec mes salutations distinguées<br />
                        <br />
                        Pour accord (le maître d'ouvrage) <span className="margin-left">LUC ANTOONS</span>



                        {/*footer*/}
                        <BS.Row className="small center border-top divFooter margin-top">
                            <BS.Col>
                                Ond Nr - Nr Ent <br />
                            BE0885.315.931
                        </BS.Col>
                            <BS.Col>
                                REG. - ENREG. <br />
                                {this.currentDate()}
                            </BS.Col>
                            <BS.Col>
                                KBC - CBC <br />
                            BE35 7340 1927 6737
                        </BS.Col>
                        </BS.Row>

                    </BS.Col>
                </BS.Row>
            </BS.Container>
        )
    }
}


export default Devis;