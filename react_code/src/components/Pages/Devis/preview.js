import React from 'react';
import * as BS from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from "react";



function Preview(props) {
    const [lgShow, setLgShow] = useState(false);
    
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
                                Sint Agatha Rode, {props.state.devisDate}<br /><br />
                                {props.state.clientName} {props.state.clientFirstname},<br />
                                {props.state.clientAdress}

                            </BS.Col>
                        </BS.Row>

                        <BS.Row className="mt-4">
                            <BS.Col className="mr-5" xs lg="6">
                                Référence devis : {props.state.devisNumber} <br /><br />
                                <div id="sexe"></div>
                                {props.state.comment}<br /><br />

                            </BS.Col>
                        </BS.Row>

                        <div id="materials">{/*section liste des matériels*/}</div>

                        <div>
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
                        L'installation décrite ci-dessus peut-être résalisée pour la somme hors TVA de <span>{props.state.price}</span> Euro <br /><br /><br />

                        <span><b><u>Paimement</u></b></span><br />
                        {props.state.percent} % dès la fin de la pose des tabues pour l'installation électrique. <br />
                        {props.state.percent} % à la réception de l'installation électrique pour un organisme agréé. <br />
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