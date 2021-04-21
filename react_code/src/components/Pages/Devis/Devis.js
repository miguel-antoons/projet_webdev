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
            clientNumber: '',
            clientName: '',
            clientFirstname: '',
            clientCompany: '',
            clientAdress: '',
            title: 'M.',
            
            level: '',
            room: '',
            material : '',
            devisDate: '',
            workDate: '',
            deadline: '',
            tva: '6',
            comment: '',
            price: '0',
            clients: []
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

    handleChange(event) {
        const name = event.target.name
        const value = event.target.value

        this.setState({
            [name]: value
        })

        // changement client
        let event_id = document.getElementById(event.target.id).innerHTML
        event_id = event_id.split('. ')[0]
        console.log(event_id)
        for (let client of this.state.clients) {
            if (client.id === event_id && event.target.name == "clientNumber") {
                this.setState({
                    clientNumber: client.number,
                    clientName: client.name,
                    clientFirstname: client.firstname,
                    clientCompany: client.company,
                    clientAdress: client.adress,
                    title: client.title
                })

                // changement de sexe
                console.log(this.state.title)
                if (this.state.title === "M.") {
                    document.getElementById("sexe").innerText = "Monsieur, "
                }
                else {
                    document.getElementById("sexe").innerText = "Madame, "
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
                                Sint Agatha Rode, {this.state.devisDate}
                            </BS.Col>
                        </BS.Row>

                        <BS.Row className="mt-4">
                            <BS.Col className="mr-5" xs lg="6">
                                Référence devis : {this.state.devisNumber} <br /><br />
                                <div id="sexe"></div>
                                {this.state.comment}<br /><br />

                            </BS.Col>
                        </BS.Row>

                        <div id="materials"></div>

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


export default Devis;