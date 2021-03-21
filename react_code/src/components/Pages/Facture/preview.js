import React from 'react';
import * as BS from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from "react";



function Preview(props) {
    const [lgShow, setLgShow] = useState(false);
    return (
        <>  
            <BS.Button variant='dark' onClick={() => setLgShow(true)} className="mb-2">Prévisualiser</BS.Button>
            <BS.Modal
                size="xl"
                show={lgShow}
                onHide={() => setLgShow(false)}
                aria-labelledby="example-BS.Modal-sizes-title-lg"
            >
                <BS.Modal.Header closeButton>
                    <BS.Modal.Title id="example-BS.Modal-sizes-title-lg">
            </BS.Modal.Title>
                </BS.Modal.Header>
                <BS.Modal.Body>
                    {/* Right */}
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
                            Datum factuur: &nbsp;&nbsp;&nbsp; {props.state.factureDate} <br />
                            Date facture:                           <br />
                            <br />
                            BTW nr klant:      <br />
                            N° de TVA client:                       <br />
                            <br />
                            Nummer factuur:&nbsp;&nbsp;&nbsp; {props.state.factureNumber} <br />
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
                            <span id='description'>{props.state.comment} </span> <br /><br /><br /><br />

                            Livraison et placement de matériel d'éclairage &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
                            
                            <b>TOTAL :</b>   &nbsp;&nbsp; <span id='prix'>&nbsp;&nbsp;&nbsp; {props.state.price} € </span>
                        </BS.Col>

                    </BS.Row>
                  
                </BS.Col>

                </BS.Modal.Body>
            </BS.Modal>
        </>
    );
}

export default Preview;