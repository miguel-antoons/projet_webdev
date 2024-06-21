import React from 'react';
import {Component} from 'react';
import * as BS from "react-bootstrap";



class Suivi extends Component {
    constructor(props) {
        super(props)

        this.state = {
            materiel: [],
            tableau_html: ''
        }

        this.api_materiel()
    }

    async api_materiel() {
        return await fetch('/api/suivi').then((response) => {
            //console.log(response);
            return response.json().then((result) => {

                let tableau_materiel = [];
                //console.log(result);
                //console.log(result[0].materiel);

                for (let materiel in result) {
                    let objet_materiel = {};
                    objet_materiel["id"] = materiel;
                    objet_materiel["materiel"] = result[materiel].materiel;
                    objet_materiel["name"] = result[materiel].name;
                    objet_materiel["telephone"] = result[materiel].telephone;
                    objet_materiel["email"] = result[materiel].email;
                    objet_materiel["date_emprunt"] = result[materiel].date_emprunt;
                    objet_materiel["date_retour"] = result[materiel].date_retour;
                    //console.log(objet_materiel);
                    tableau_materiel.push(objet_materiel);
                }
                this.setState({ materiel: tableau_materiel })
                this.setState({ name: tableau_materiel[1].name })
                //console.log(this.state.name);
                
                let texteHtml = '';
                for (let i in this.state.materiel) {
                    let monTableau = Object.values(this.state.materiel[i]);
                    for (let e in monTableau){
                        texteHtml += '<td>' + monTableau[e] + '</td>'
                        
                    }
                    texteHtml += '</tr>';
                    console.log(monTableau);
                    console.log(texteHtml);
                }
            this.setState({ html: texteHtml })
            document.getElementById("tbody").innerHTML = this.state.html
            }).catch((err) => {
                console.log(err);
            })
        })
    }
    
    

    render() {
        return (
            <BS.Container>
                <div className="suivi jumbotron">
                    <h1>Suivi du Matériel</h1>
                </div>
                <BS.Table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Matériel</th>
                            <th>Nom</th>
                            <th>Téléphone</th>
                            <th>Email</th>
                            <th>Date Emprunt</th>
                            <th>Date Retour</th>
                            <th>Stock</th>
                        </tr>
                    </thead>
                    <tbody id='tbody'>
                    </tbody>
                </BS.Table>
            </BS.Container>
        )
    }
}


export default Suivi;