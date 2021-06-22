import React from 'react';
import  { useState } from 'react';
import * as BS from "react-bootstrap"
import './ajoutArticle.css';
import MDBInput from '@material-ui/core/TextField';
import 'bootstrap/dist/css/bootstrap.min.css';
import Select from "react-select";

// ici le component s'appelle home puisque je travaillais dessus, ça n'a pas d'importance et chez toi il s'apellera probablemnt autrement
const Ajout_Articles = (props) => {
    // Met le state des inputs
    const [articleID, setArticleID] = useState(Number(props.match.params.id));
    const [LibelleFR, setLibelleFR] = useState('');
    const [libelleFrPluriel, setLibelleFrPluriel] = useState('');
    const [LibelleNDL, setLibelleNDL] = useState('');
    const [libelleNlPluriel, setLibelleNlPluriel] = useState('');
    const [presentation, setPresentation] = useState(0);
    const [prix1, setPrix1] = useState(0);
    const [prix2, setPrix2] = useState(0);
    const [prix3, setPrix3] = useState(0);
    const [disabled, setDisabled] = useState(true);
    const [code, setCode] = useState('');

    let presentationOptions = [
        {value: 0, label: `2 x ${libelleFrPluriel}`},
        {value: 1, label: `2 ${libelleFrPluriel}`}
    ];
    
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
            
            body: JSON.stringify({LibelleFR,LibelleNDL,presentation,prix1,prix2,prix3}) // l'objet à l'intérieur de la fonction contient l'état des 5 input
            });
    
            const data = await result.json();
        }
        catch(e){
            console.log(e);
        }
     
    };
  
    return (
        <BS.Col className="mx-auto no-margin clientAnimation" lg='4' xs='12' align='center'>
            <BS.Form onSubmit={ (event) => { sendPost(event); }}  >
                <MDBInput className="defaultInput" label="Code d'article" value={ code } onChange={ (e) => {setCode(e.target.value); setDisabled(false)} } required/>
                <MDBInput className="defaultInput" label="Libellé français" value={ LibelleFR } onChange={ (e) => {setLibelleFR(e.target.value); setDisabled(false)} } required/>
                <MDBInput className="defaultInput" label="Libellé français pluriel" value={ libelleFrPluriel } onChange={ (e) => {setLibelleFrPluriel(e.target.value); setDisabled(false)} } required/>
                <MDBInput className="defaultInput" label="Libellé néerlandais" value={ LibelleNDL } onChange={ (e) => {setLibelleNDL(e.target.value); setDisabled(false)} } required/>
                <MDBInput className="defaultInput" label="Libellé néerlandais pluriel" value={ libelleNlPluriel } onChange={ (e) => {setLibelleNlPluriel(e.target.value); setDisabled(false)} } required/>
                <MDBInput 
                    className="defaultInput"
                    label="Prix 1"
                    type="number"
                    value={ prix1 }
                    onChange={ 
                        (e) => { 
                            setPrix1((state) => {
                                if (e.target.value >= 0) {
                                    return e.target.value;
                                }
                                else {
                                    return state;
                                }
                            });
                            setDisabled(false);
                        }
                    }
                    required
                />
                <MDBInput 
                    className="defaultInput"
                    label="Prix 2"
                    type="number"
                    value={ prix2 }
                    onChange={ 
                        (e) => { 
                            setPrix2((state) => {
                                if (e.target.value >= 0) {
                                    return e.target.value;
                                }
                                else {
                                    return state;
                                }
                            });
                            setDisabled(false);
                        }
                    }
                />
                <MDBInput 
                    className="defaultInput"
                    label="Prix 3"
                    type="number"
                    value={ prix3 }
                    onChange={ 
                        (e) => { 
                            setPrix3((state) => {
                                if (e.target.value >= 0) {
                                    return e.target.value;
                                }
                                else {
                                    return state;
                                }
                            })
                        }
                    }
                />
                <Select
                    className="defaultSelect"
                    value={presentationOptions[presentation]}
                    onChange={(event) => {setPresentation(event.value); setDisabled(false)} }
                    label="Présentation"
                    options={presentationOptions}
                />
                <BS.Button className="submitArticle" variant="outline-info" type="submit" disabled={disabled}>Enregistrer</BS.Button> 
            </BS.Form>
        </BS.Col>
    );
};

  export default Ajout_Articles ;
