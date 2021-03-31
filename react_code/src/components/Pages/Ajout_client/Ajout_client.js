import React from 'react';
import  { useState } from 'react';

// ici le component s'appelle home puisque je travaillais dessus, ça n'a pas d'importance et chez toi il s'apellera probablemnt autrement
const Client = () => {
    // Met le state des inputs
    const [name, setName] = useState('');
    const [firstName, setFirstName] = useState('');
  
    // envoi les données des inputs onSubmit
    const sendPost = async (event) => {
      
      // évite que la page se recharge onSubmit du formulaire
      event.preventDefault();
  
      try{
        let result = await fetch('/api/test', {
          method: 'post',
          //mode: 'no-cors', // --> pas besoin de cette ligne
          headers: {
            //'Accept': 'application/json', // --> pas besoin de cette ligne non-plus
            'Content-type': 'application/json',
          },
          body: JSON.stringify( {name, firstName} ) // l'objet à l'intérieur de la fonction contient l'état des 2 input
        });
  
        const data = await result.json();
  
        console.log(data);
      }
      catch(e){
        console.log(e);
      }
    };
  
    return (
      <form onSubmit={ (event) => { sendPost(event); }}>
        <label>Nom</label>
        <input type='text' value={ name } onChange={ (e) => setName(e.target.value) }></input>
        <label>Prénom</label>
        <input type='text' value={ firstName } onChange={ (e) => setFirstName(e.target.value) }></input>
        <input type='submit' value='SAVE' />
      </form>
    );
  };

  export default Client ;