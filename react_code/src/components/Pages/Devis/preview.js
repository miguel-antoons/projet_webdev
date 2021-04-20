import React from 'react';
import * as BS from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from "react";



function Preview(props) {
    const [lgShow, setLgShow] = useState(false);

    function tva (price_str, tva_str) {
        let price = Number(price_str)
        let tva = Number(tva_str)
        let total_tva = (price / 100) * tva
        return Math.round(total_tva*100)/100
    }

    function total_tva (price_str, tva_str){
        let price = Number(price_str)
        let tva = Number(tva_str)
        let total_tva =  price + (price / 100) * tva
        return Math.round(total_tva*100)/100
    }

    function currentDate() {
        let date=new Date()
        return date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()
    }


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
                            N° de TVA client: &nbsp;&nbsp;&nbsp;         {props.state.clientNumber}          <br />
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

                        <BS.Row className="border height-100">
                            <BS.Col className="mr-5 mt-2">
                                P0 : 4500082808 <br />
                                <br />
                                <span id='description'>{props.state.comment} </span> <br /><br /><br /><br />

                            Livraison et placement de matériel d'éclairage &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                            <b>TOTAL :</b>   &nbsp;&nbsp; <span id='prix'>&nbsp;&nbsp;&nbsp; {props.state.price} € </span>
                            </BS.Col>

                        </BS.Row>

                        <BS.Row className="border no-border-top">
                            <BS.Col>
                                Vervaldatum :  &nbsp;&nbsp; {props.state.deadline} <br />
                                Echéance : 
                            </BS.Col>
                            <BS.Col>
                                Gefaktureerde werken beeindigd op :  &nbsp;&nbsp; {props.state.workDate} <br />
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
                                                {props.state.price} EUR
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Btw :     {props.state.tva}% <br />
                                                Tva :
                                            </td>
                                            <td>
                                                {tva(props.state.price, props.state.tva)} EUR
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                TE BETALEN : <br />
                                                A PAYER :
                                            </td>
                                            <td>
                                                {total_tva(props.state.price, props.state.tva)} EUR
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
                                {currentDate()}
                            </BS.Col>
                            <BS.Col>
                                KBC - CBC <br />
                            BE35 7340 1927 6737
                        </BS.Col>
                        </BS.Row>


                    </BS.Col>

                </BS.Modal.Body>
            </BS.Modal>
        </>
    );
}

export default Preview;