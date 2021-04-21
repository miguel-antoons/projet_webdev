import React from 'react';
import  { useState } from 'react';
import * as BS from "react-bootstrap"

import 'bootstrap/dist/css/bootstrap.min.css';




// ici le component s'appelle home puisque je travaillais dessus, ça n'a pas d'importance et chez toi il s'apellera probablemnt autrement
const Ajout_Client = () => {
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
      
      // évite que la page se recharge onSubmit du formulaire
      event.preventDefault();
      

      try{
        let result = await fetch('/api/client', {
          method: 'post',
          //mode: 'no-cors', // --> pas besoin de cette ligne
          headers: {
            //'Accept': 'application/json', // --> pas besoin de cette ligne non-plus
            'Content-type': 'application/json',
        
          },
          
          body: JSON.stringify({name, firstname, societe, titre, langue,adress,tva,number,email}) // l'objet à l'intérieur de la fonction contient l'état des 5 input
        });
  
        const data = await result.json();
  
        console.log(data);
      }
      catch(e){
        console.log(e);
      }
     
    };
  
    return (

     

        <BS.Container>

      <BS.Form onSubmit={ (event) => { sendPost(event); }}  >


        <BS.Form.Group  >
          <BS.Form.Label column="lg" lg={2}  class="col-auto col-form-label" >Nom</BS.Form.Label>
          <BS.Form.Control size="sm" type="text" placeholder="Entrer le nom du client"  id="name" name="name" 
          value={ name } onChange={ (e) => setName(e.target.value)   } required />

          <BS.Form.Label column="lg" lg={2} >Prénom</BS.Form.Label>
          <BS.Form.Control size="sm" type="text" placeholder="Entrer le Prénom du client"  id="firstName " name="firstName " 
          value={ firstname } onChange={ (e) => setFirstname(e.target.value)   } required />
        </BS.Form.Group>

        <BS.Form.Group>
          <BS.Form.Label column="lg" lg={2} >Société</BS.Form.Label>
          <BS.Form.Control size="sm" type="text" placeholder="Entrer la Société du client"  id="societe " name="societe" 
          value={ societe } onChange={ (e) => setSociete(e.target.value)  } required />

          <BS.Form.Label column="lg" lg={2} >Adresse</BS.Form.Label>
          <BS.Form.Control size="sm" type="text" placeholder="Entrer l'adresse du client"  id="adress" name="adress " 
          value={ adress } onChange={ (e) => setAdress(e.target.value)   }  />

        <BS.Form.Label column="lg" lg={2} >N°TVA</BS.Form.Label>
          <BS.Form.Control size="sm" type="text" placeholder="Entrer le N° TVA"  id="tva" name="tva" maxLength='20' 
          value={ tva } onChange={ (e) => setTva(e.target.value)   }  />

        <BS.Form.Label column="lg" lg={2} >Numéro</BS.Form.Label>
          <BS.Form.Control size="sm" type="text" placeholder="Entrer le numéro du client" maxLength='10'  id="number" name="number" 
          value={ number } onChange={ (e) => setNumber(e.target.value)   }  />

          <BS.Form.Label column="lg" lg={2} >Email</BS.Form.Label>
          <BS.Form.Control size="sm" type="text" placeholder="Entrer l'émail du client"  id="email" name="email" 
          value={ email } onChange={ (e) => setEmail(e.target.value)   }  />

        </BS.Form.Group>

        <BS.Form.Group>
          <BS.Form.Label column="lg" lg={2} >Titre</BS.Form.Label>
          <BS.Form.Control size="sm" as="select" id="titre" name="titre" value={titre}  onChange={ (e) => setTitre(e.target.value)  }   required>
          <option value="Mr">Mr</option>
          <option value="Mme">Mme</option>

          </BS.Form.Control>
        </BS.Form.Group>

        <BS.Form.Group>
          <BS.Form.Label column="lg" lg={2} >Langue</BS.Form.Label>
          <BS.Form.Control size="sm" as="select" name="langue" id="langue" value={langue}  onChange={ (e) => setLangue(e.target.value)  }required>
          <option value="FR">FR</option>
          <option value="NDL">NDL</option>
          </BS.Form.Control>

         
        </BS.Form.Group>



          <BS.Button className="submite" variant="info" type="submit" >Enregistrer Client</BS.Button> 

      </BS.Form>

      </BS.Container>

      

    );
  };

  export default Ajout_Client ;