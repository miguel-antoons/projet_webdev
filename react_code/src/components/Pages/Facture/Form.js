import React, { Component } from 'react';
import * as BS from "react-bootstrap"
import Preview from './preview'


class Form extends Component {
    render() {
        return (
            
            <BS.Form>
                        <BS.Form.Group>
                            <BS.Form.Label>N° de facture</BS.Form.Label>
                            <BS.Form.Control size="sm" type="text" placeholder="Entrer numéro de facture" value={this.props.factureNumber} onChange={this.props.onChangeValue} id="factureNumber" name="factureNumber" />
                        </BS.Form.Group>
                        <BS.Form.Group>
                            <BS.Form.Label>N° client</BS.Form.Label>
                            <BS.Form.Control size="sm" type="text" placeholder="Entrer numéro de client" value={this.props.clientNumber} onChange={this.props.onChangeValue} id="clientNumber" name="clientNumber"/>
                        </BS.Form.Group>
                        <BS.Form.Group>
                            <BS.Form.Label>Titre</BS.Form.Label>
                            <BS.Form.Control size="sm" as="select" onChange={this.props.onChangeValue} value={this.props.title} id="title" name="title">
                                <option value="M.">M.</option>
                                <option value="Mme.">Mme.</option>
                            </BS.Form.Control>
                        </BS.Form.Group>
                        <BS.Form.Group>
                            <BS.Form.Label>Date facture</BS.Form.Label >
                            <BS.Form.Control size="sm" type="date" value={this.props.factureDate} onChange={this.props.onChangeValue} id="factureDate" name="factureDate"/>
                        </BS.Form.Group>
                        <BS.Form.Group>
                            <BS.Form.Label>Travaux terminé le</BS.Form.Label>
                            <BS.Form.Control size="sm" type="date" value={this.props.workDate} onChange={this.props.onChangeValue} id="workDate" name="workDate"/>
                        </BS.Form.Group>
                        <BS.Form.Group>
                            <BS.Form.Label>Echéance</BS.Form.Label>
                            <BS.Form.Control size="sm" type="text" placeholder="Entrer échéance" value={this.props.deadline} onChange={this.props.onChangeValue} id="deadline" name="deadline"/>
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
                            <BS.Form.Control size="sm" as="textarea" placeholder="Commentaire" rows={3} value={this.props.comment} onChange={this.props.onChangeValue} id="comment" name="comment"/>
                        </BS.Form.Group>
                        <BS.Form.Group>
                            <BS.Form.Label>Montant à facturer htva</BS.Form.Label>
                            <BS.Form.Control size="sm" type="number" rows={3} value={this.props.price} onChange={this.props.onChangeValue} id="price" name="price"/>
                        </BS.Form.Group>
                        <Preview state={this.props.returnState} />
                    <BS.Button className="no-print mb-2 ml-2" variant="info" onClick={window.print}>Imprimer</BS.Button> {' '} 
                    </BS.Form> 
        )
    }
}


export default Form;