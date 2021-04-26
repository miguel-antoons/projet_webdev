import React from 'react';
import  { useState } from 'react';
import * as BS from "react-bootstrap"

import 'bootstrap/dist/css/bootstrap.min.css';




// ici le component s'appelle home puisque je travaillais dessus, ça n'a pas d'importance et chez toi il s'apellera probablemnt autrement
const Ajout_Articles = () => {
    // Met le state des inputs
    const [LibelleFR, setLibelleFR] = useState('');
    const [LibelleNDL, setLibelleNDL] = useState('');
    const [Categorie,setCategorie] = useState('');
    const [Prix1,setPrix1] = useState('');
    const [Prix2,setPrix2] = useState('');
    const [Prix3,setPrix3] = useState('');
    
    

    
    

    // envoi les données des inputs onSubmit
    const sendPost = async (event) => {
      
      // évite que la page se recharge onSubmit du formulaire
      event.preventDefault();
      

      try{
        let result = await fetch('/api/articles', {
          method: 'post',
          //mode: 'no-cors', // 
          headers: {
            //'Accept': 'application/json'
            'Content-type': 'application/json',
        
          },
          
          body: JSON.stringify({LibelleFR,LibelleNDL,Categorie,Prix1,Prix2,Prix3}) // l'objet à l'intérieur de la fonction contient l'état des 5 input
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
          <BS.Form.Label column="lg" lg={2}  class="col-auto col-form-label" >LibelleFR</BS.Form.Label>
          <BS.Form.Control size="sm" type="text" placeholder="Entrer le libéllé de l'article en FR"  id="LibelleFR" name="LibelleFR" 
          value={ LibelleFR } onChange={ (e) => setLibelleFR(e.target.value)   } required />

          <BS.Form.Label column="lg" lg={2} >LibelleNDL</BS.Form.Label>
          <BS.Form.Control size="sm" type="text" placeholder="Entrer le libéllé de l'article en NDL"  id="LibelleNDL " name="LibelleNDL " 
          value={ LibelleNDL } onChange={ (e) => setLibelleNDL(e.target.value)   } required />
        </BS.Form.Group>
        <BS.Form.Group>
          <BS.Form.Label column="lg" lg={2} >Catégorie</BS.Form.Label>
          <BS.Form.Control size="sm" as="select" name="Categorie" id="Categorie" value={Categorie}  onChange={ (e) => setCategorie(e.target.value)  }required>
          <option value=" "> </option>
          <option value="X">X</option>
          </BS.Form.Control>

         
        </BS.Form.Group>

        <BS.Form.Group>
         

          <BS.Form.Label column="lg" lg={2} >Premier Prix : </BS.Form.Label>
          <BS.Form.Control size="sm" type="text" placeholder="Entrer le prix de l'article"  id="Prix1" name="Prix1" 
          value={ Prix1 } onChange={ (e) => setPrix1(e.target.value)   }  />

        <BS.Form.Label column="lg" lg={2} >Deuxième Prix</BS.Form.Label>
          <BS.Form.Control size="sm" type="text" placeholder="Entrer le prix de l'article"  id="Prix2" name="Prix2" maxLength='20' 
          value={ Prix2 } onChange={ (e) => setPrix2(e.target.value)   }  />

        <BS.Form.Label column="lg" lg={2} >Troisième Prix</BS.Form.Label>
          <BS.Form.Control size="sm" type="text" placeholder="Entrer le prix de l'article" maxLength='10'  id="Prix3" name="Prix3" 
          value={ Prix3 } onChange={ (e) => setPrix3(e.target.value)   }  />

         

        </BS.Form.Group>

          <BS.Button className="submite" variant="info" type="submit" >Enregistrer L'article</BS.Button> 

      </BS.Form>

      </BS.Container>

      

    );
  };

  export default Ajout_Articles ;





