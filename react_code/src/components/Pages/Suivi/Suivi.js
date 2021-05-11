import React from 'react';
import {Component} from 'react';
import * as BS from "react-bootstrap";



class Suivi extends Component {
    constructor(props) {
        super(props)

        this.state = {
            materiel: [],
            tableau_html: '',
            result: ''
        }

        this.api_materiel()
    }

    async api_materiel() {
        return await fetch('/api/suivi').then((response) => {
            //console.log(response);
            return response.json().then((result) => {

                let tableau_materiel = [];
                console.log(result[0].id);
                //console.log(result[0].materiel);

                for (let materiel in result) {
                    let objet_materiel = {};
                    objet_materiel["id"] = result[materiel].id;
                    objet_materiel["materiel"] = result[materiel].materiel;
                    objet_materiel["name"] = result[materiel].name;
                    objet_materiel["telephone"] = result[materiel].telephone;
                    objet_materiel["email"] = result[materiel].email;
                    objet_materiel["date_emprunt"] = result[materiel].date_emprunt;
                    objet_materiel["date_retour"] = result[materiel].date_retour;
                    //console.log(objet_materiel);
                    tableau_materiel.push(objet_materiel);
                }
                this.setState({result: result})
                this.setState({ materiel: tableau_materiel })
                this.setState({ name: tableau_materiel[1].name })
                //console.log(this.state.name);
                
                let texteHtml = '';
                for (let i in this.state.materiel) {
                    let monTableau = Object.values(this.state.materiel[i]);
                    for (let e in monTableau){
                        texteHtml += '<td>' + monTableau[e] + '</td>' 
                    }
                    //texteHtml += '<td>' + this.state.bouton_retour + '</td>';
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
    
    //function todo({}) {
    //   return <div data-testid='suivi-1'>
    //}
    

    render() {
        function supprimer(id) {
            //alert(id)
            let url = "http://localhost:5000/api/suivi/" + id
            fetch(url,{
                method:'DELETE'
            }).then((result)=>{
                result.json().then((resp)=>{
                    //console.warn(resp)
                })
            })
        }
        return (
            <BS.Container>
                <BS.Jumbotron className="suivi">
                <h1>Suivi du Matériel</h1>
                </BS.Jumbotron> 
                <BS.Table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Matériel</th>
                        <th>Nom</th>
                        <th>Téléphone</th>
                        <th>Email</th>
                        <th>Date Emprunt</th>
                        <th>Rendu</th>
                    </tr>
                </thead>
                <tbody id=''>
                    {this.state.materiel.map((item,i)=>
                    <tr key={i}>
                        <td>{item.id}</td>
                        <td>{item.materiel}</td>
                        <td>{item.name}</td>
                        <td>{item.telephone}</td>
                        <td>{item.email}</td>
                        <td>{item.date_emprunt}</td>
                        <td><BS.Button onClick={()=>supprimer(item.id)}>Supprimer</BS.Button></td>
                    </tr>
                    )
                    }
                </tbody>
            </BS.Table> 
            </BS.Container>
        )
    }

}


export default Suivi;