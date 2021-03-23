import React, { Component } from 'react';
import * as BS from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Facture.css';
import './print.css';
import Form from './Form'

class Facture extends Component {
    constructor(props) {
        super(props)

        this.state = {
            factureNumber : '',
            clientNumber: '',
            title: 'M.',
            factureDate: '',
            workDate: '',
            tva : '6',
            comment: '',
            price: ''
        }
       this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event) {
        const name = event.target.name
        const value = event.target.value
        /*
        const type = event.target.type
        const id = event.target.id
        const as = event.target.as
        */
        

        this.setState({
            [name] : value
            
        })
        
    }

    render() {
    return (
        <BS.Container>
            <BS.Row>
                {/* Left */}
                <BS.Col xs lg="4" className="border mt-5 mr-3 no-print h-50 rounded">
                    <Form   onChange={this.handleChange} onChangeValue={this.handleChange} returnState={this.state}
                    />
                </BS.Col>


                {/* Right */}
                <BS.Col className="mt-5  overflow-auto text-pdf" id='print'>
                    <BS.Row className="mt-2">
                        <BS.Col className="mr-5">
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
                        <BS.Col className="mr-5">
                            Datum factuur: &nbsp;&nbsp;&nbsp; {this.state.factureDate} <br />
                            Date facture:                           <br />
                            <br />
                            BTW nr klant:      <br />
                            N° de TVA client:                       <br />
                            <br />
                            Nummer factuur:&nbsp;&nbsp;&nbsp; {this.state.factureNumber} <br />
                            Numéro facture: 
                </BS.Col>
                        <BS.Col className="margin-left">
                            Matexi Projects N.V. <br />
                            <br />
                            Franklin Rooseveltlaan. 180
                            8790 Waregem
                </BS.Col>
                    </BS.Row>

                    <BS.Row className="border mt-4">
                        <BS.Col className="mr-5">
                            Omschrijving <br />
                            Description <br />
                        </BS.Col>
                        <BS.Col className="margin-left">
                            Prijs Zonder BTW <br />
                            Prix Sans TVA
                </BS.Col>
                    </BS.Row>

                    <BS.Row className="border height-100 mb-5">
                        <BS.Col className="mr-5 mt-2">
                            P0 : 4500082808 <br />
                            <br />
                            <span id='description'>{this.state.comment} </span> <br /><br /><br /><br />

                            Livraison et placement de matériel d'éclairage &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
                            
                            <b>TOTAL :</b>   &nbsp;&nbsp; <span id='prix'>&nbsp;&nbsp;&nbsp; {this.state.price} € </span>
                        </BS.Col>

                    </BS.Row>
                  
                </BS.Col>
            </BS.Row>
        </BS.Container>
    )
}
}


export default Facture;