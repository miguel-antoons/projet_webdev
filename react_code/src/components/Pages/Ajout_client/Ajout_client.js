import React from 'react';
import  { useState } from 'react';
import * as BS from "react-bootstrap"
// import { MDBInput } from "mdbreact";
import MDBInput from '@material-ui/core/TextField';
import Select from "react-select";


// ici le component s'appelle home puisque je travaillais dessus, ça n'a pas d'importance et chez toi il s'apellera probablemnt autrement
const Ajout_Client = (props) => {
    // Met le state des inputs
    const [name, setName] = useState('');
    const [firstname, setFirstname] = useState('');
    const [titre,setTitre] = useState('Mr');
    const [societe,setSociete] = useState('');
    const [langue,setLangue] = useState('FR');
    const [adress,setAdress] = useState('');
    const [tva,setTva] = useState('');
    const [number,setNumber] = useState('');
    const [email,setEmail] = useState('');

    // envoi les données des inputs onSubmit
    const sendPost = async (event) => {

        let id = Number(props.match.params.id)
      
        // évite que la page se recharge onSubmit du formulaire
        event.preventDefault();

        //if props.match.paramsid = 0:

        if (Number(props.match.params.id) === 0) {
            try {
                let result = await fetch('/api/client', {
                method: 'post',
                //mode: 'no-cors', // 
                headers: {
                    //'Accept': 'application/json'
                    'Content-type': 'application/json',
                },
                // l'objet à l'intérieur de la fonction contient l'état des 5 input
                body: JSON.stringify({name, firstname, societe, titre, langue,adress,tva,number,email})
                });
        
                const data = await result.json();
                console.log(data);
            }
            catch(e) {
                console.log(e);
            }    
        }
        else {
            try {
                let result = await fetch('/api/client', 
                    {
                        method: 'put',
                        //mode: 'no-cors', // 
                        headers: {
                            //'Accept': 'application/json'
                            'Content-type': 'application/json',
                        
                        },
                        // l'objet à l'intérieur de la fonction contient l'état des 5 input
                        body: JSON.stringify({id,name, firstname, societe, titre, langue,adress,tva,number,email})
                    }
                );
        
                const data = await result.json();
        
                console.log(data);
            }
            catch(e) {
                console.log(e);
            }
        }
    }   
  
    return (
        <BS.Container>
            <BS.Form onSubmit={ (event) => { sendPost(event); }}  >
                <BS.Form.Label column="lg" lg={2} >Titre</BS.Form.Label>
                <MDBInput
                    label="test"
                    type="radio"
                    id="exampleRadios2"
                    name="exampleRadios"
                /><br />



                <MDBInput label="Nom" background size="lg" value={ name } onChange={ (e) => setName(e.target.value) } />
                <MDBInput label="Prenom" value={ firstname } onChange={ (e) => setFirstname(e.target.value) } required />

                <MDBInput label="Société" value={ societe } onChange={ (e) => setSociete(e.target.value)  } required />

                <MDBInput size="lg" label="Adresse 1" value={ adress } onChange={ (e) => setAdress(e.target.value) }  />
                <MDBInput size="lg" label="Adresse 2" value={ adress } onChange={ (e) => setAdress(e.target.value) }  />

                <MDBInput size="lg" label="N° de TVA" value={ tva } onChange={ (e) => setTva(e.target.value)   }  />

                <MDBInput size="lg" label="Téléphone" value={ number } onChange={ (e) => setNumber(e.target.value)   }  />

                <MDBInput size="lg" label="E-mail" value={ email } onChange={ (e) => setEmail(e.target.value)   }  />

                <BS.Form.Control size="sm" as="select" id="titre" name="titre" value={titre}  onChange={ (e) => setTitre(e.target.value)  }   required>
                <option value="Mr">Mr</option>
                <option value="Mme">Mme</option>

                </BS.Form.Control><br />

                <Select
                    defaultValue="Mr"
                    label="Titre"
                    options={["Mr", "Mme"]}
                 />


                <BS.Form.Label column="lg" lg={2} >Langue</BS.Form.Label>
                <BS.Form.Control size="sm" as="select" name="langue" id="langue" value={langue} onChange={ (e) => setLangue(e.target.value)  } required>
                <option value="FR">fr</option>
                <option value="NL">nl</option>
                </BS.Form.Control>

                <BS.Button className="" variant="info" type="submit">Enregistrer</BS.Button> 
            </BS.Form>
        </BS.Container>

      

    );
  };

export default Ajout_Client ;