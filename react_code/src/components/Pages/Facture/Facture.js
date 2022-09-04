import React, { Component } from 'react';
import * as BS from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Facture.css';
import './print.css';
import Form from './Form'

class Facture extends Component {
    constructor(props) {
        super(props)
        let url = window.location.href.split("/")
        let param = url.length - 1 

       
        this.state = {
            factureNumber: '',
            clientNumber: '',
            clientName: '',
            clientFirstname: '',
            clientTva: '',
            clientCompany: '',
            clientAdress: '',
            title: 'M.',
            factureDate: '',
            workDate: '',
            deadline: '',
            tva: '6',
            comment: '',
            price: '0',
            clients: []
        }
        if(url[param] !== 0) {
            this.set_state_facture(url[param])
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
                this.setState({ clients: tableau_clients })


            }).catch((err) => {
                console.log(err);
            })
        })
    }

    // set l'état du formulaire avec l'id de la facture rentré en param
    async set_state_facture(id) {
        return await fetch('/api/facture/get_facture_id/' + id).then((response) => {
            return response.json().then((result) => {
                this.setState({ 
                    factureNumber: id,
                    factureDate: this.change_date_format(result[0][3]),
                    workDate: this.change_date_format(result[0][5]),
                    deadline: this.change_date_format(result[0][4]),
                    tva: result[0][6],
                    comment: result[0][7],
                    price: result[0][8]
                })
                // remplir le formulaire
                document.getElementById("factureDate").value = this.change_date_format(result[0][3])
                document.getElementById("workDate").value =  this.change_date_format(result[0][5])
                document.getElementById("deadline").value =  this.change_date_format(result[0][4])
                document.getElementById("tva").value =  result[0][6]
                document.getElementById("comment").value =  result[0][7]
                document.getElementById("price").value =  result[0][8]
                

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

    // set l'état du formulaire avec l'id de la facture rentré en param
    async set_state_client(id) {
        return await fetch('/api/client/' + id).then((response) => {
            return response.json().then((result) => {
                this.setState({ 
                    clientNumber: result[0][0],
                    clientName: result[0][1],
                    clientFirstname: result[0][2],
                    clientTva: result[0][6],
                    clientCompany: result[0][3],
                    clientAdress: result[0][4],
                    title: result[0][9]
                })
                
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

    handleChange(event) {
        const name = event.target.name
        const value = event.target.value

        this.setState({
            [name]: value
        })

        if (document.getElementById(event.target.id) !== null) {
            let event_id = document.getElementById(event.target.id).innerHTML
            event_id = event_id.split('. ')[0]
        
            for (let client of this.state.clients) {
                if (client.id === event_id) {
                    this.setState({
                        clientNumber: client.number,
                        clientTva: client.tva,
                        clientName: client.name,
                        clientFirstname: client.firstname,
                        clientCompany: client.company,
                        clientAdress: client.adress
                    })

                }
            }
        }
        
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
                    <BS.Col className="mt-5 overflow-auto-facture overflow-auto text-pdf" id='print'>
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


                        <BS.Row className="border mt-2">
                            <BS.Col className="mr-5" xs lg="6">
                                Datum factuur: &nbsp;&nbsp;&nbsp; {this.state.factureDate} <br />
                            Date facture:                           <br />
                                <br />
                            BTW nr klant:      <br />
                            N° de TVA client: &nbsp;&nbsp;&nbsp;          {this.state.clientTva}            <br />
                                <br />
                            Nummer factuur:&nbsp;&nbsp;&nbsp; {this.state.factureNumber} <br />
                            Numéro facture:
                        </BS.Col>
                            <BS.Col className="margin-left">
                                {this.state.clientCompany}  <br />
                                <br />
                                {this.state.clientName}   {this.state.clientFirstname} <br />
                                {this.state.clientAdress}
                            </BS.Col>
                        </BS.Row>

                        <BS.Row className="border mt-4">
                            <BS.Col className="mr-5" xs lg="6">
                                Omschrijving <br />
                            Description <br />
                            </BS.Col>
                            <BS.Col className="margin-left">
                                Prijs Zonder BTW <br />
                            Prix Sans TVA
                </BS.Col>
                        </BS.Row>

                        <BS.Row className="border height-100 no-border-bot">
                            <BS.Col className="mr-5 mt-2">
                                P0 : 4500082808 <br />
                                <br />
                                <span id='description'>{this.state.comment} </span> <br /><br /><br /><br />

                            Livraison et placement de matériel d'éclairage &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                            <b>TOTAL :</b>   &nbsp;&nbsp; <span id='prix'>&nbsp;&nbsp;&nbsp; {this.state.price} € </span>
                            </BS.Col>
                        </BS.Row>

                        <BS.Row className="border no-border-top">
                            <BS.Col>
                                Vervaldatum :  &nbsp;&nbsp; {this.state.deadline} <br />
                            Echéance :
                        </BS.Col>
                            <BS.Col>
                                Gefaktureerde werken beeindigd op :  &nbsp;&nbsp; {this.state.workDate} <br />
                            Travaux facturé terminé le :
                        </BS.Col>
                        </BS.Row>

                        <BS.Row>
                            <BS.Col xs lg="8  small">
                                {/* NL*/}
                                <h6>Aglemene verkoopsvoorwaarden : </h6>
                                <ul>
                                    <li>Betaalbar binnen de 15 kalenderdagen na opsteldatum.</li>
                                    <li>In geval van niet-betaling op de vergaldag zal het nog te betalen saldo worden verhoogd met een forfaitaire vergoeding van 10 % en een nalatigheidsinstrest van 1% per maand.</li>
                                    <li>In geval van betwisting is alleen de rechtbank van Leuven bevoegd.</li>
                                    <li>Alle klachten moeten schriftelijk per aangetekende zending binnen de 8 dagen na factuurdatum gemaakt worden om in aanmerking te komen</li>
                                </ul>
                                {/* Français*/}
                                <h6>Conditions Générales de ventes : </h6>
                                <ul>
                                    <li>Payble endéans les 15 jours calendriers suivant la date de rédaction</li>
                                    <li>En cas de non payement à l'échéance, le solde de facture sera majoré d'un indeminté de 10% et d'un intérêt de retard de 1% par mois.</li>
                                    <li>En cas de contestation, les tribunaux de Louvain sont seuls compétents.</li>
                                    <li>Toute réclamation doit nous parvenir par écrit dans les 8 jours par lettre recommandée suivant la date de facturation pour être prise en considération</li>
                                </ul>
                            </BS.Col>
                            <BS.Col className="pr-0">
                                <BS.Table className="border">
                                    <tbody>
                                        <tr className="border-top">
                                            <td>
                                                Totaal :<br />
                                        Total:

                                    </td>
                                            <td className="no-border">
                                                {this.state.price} EUR
                                    </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Btw :     {this.state.tva}% <br />
                                        Tva :
                                    </td>
                                            <td>
                                                {this.tva(this.state.price, this.state.tva)} EUR
                                    </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                TE BETALEN : <br />
                                        A PAYER :
                                    </td>
                                            <td>
                                                {this.total_tva(this.state.price, this.state.tva)} EUR
                                    </td>
                                        </tr>
                                    </tbody>
                                </BS.Table>
                            </BS.Col>
                        </BS.Row>
                        <BS.Row className="small center border-top">
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


export default Facture;