import React from 'react';
import  { useState, useEffect } from 'react';
import * as BS from "react-bootstrap"
import './ajoutArticle.css';
import MDBInput from '@material-ui/core/TextField';
import 'bootstrap/dist/css/bootstrap.min.css';
import Select from "react-select";


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
    const [required, setRequired] = useState(false)

    let presentationOptions = [
        {value: 0, label: `2 x ${LibelleFR}`},
        {value: 1, label: `2 ${libelleFrPluriel}`}
    ];
    
    // envoi les données des inputs onSubmit
    const submitArticle = (event) => {
      
        // évite que la page se recharge onSubmit du formulaire
        event.preventDefault();

        if (articleID){
            updateArticle();
        }
        else {
            postArticle();
        }
    };

    useEffect( () => {
        if (articleID) {
            getArticle();
        }
    }, [articleID]);

    const getArticle = async () => {
        try {
            let result = await fetch(`/api/article/${articleID}`);

            let data = await result.json();

            setCode(data[0][0]);
            setLibelleFR(data[0][1]);
            setLibelleFrPluriel(data[0][2]);
            setLibelleNDL(data[0][3]);
            setLibelleNlPluriel(data[0][4]);
            setPrix1(data[0][5]);
            setPrix2(data[0][6]);
            setPrix3(data[0][7]);
            setPresentation(data[0][8]);
            setRequired(Boolean(data[0][8]));
        }
        catch (e) {
            console.log(e);
        }
    };

    const postArticle = async () => {
        try{
            let result = await fetch('/api/articles', {
                method: 'post',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        code,
                        LibelleFR,
                        libelleFrPluriel,
                        LibelleNDL,
                        libelleNlPluriel,
                        prix1,
                        prix2,
                        prix3,
                        presentation
                    }
                )
            });

            const data = await result.json();

            setArticleID(data["projectID"])
        }
        catch(e) {
            console.log(e);
        }
    }

    const updateArticle = async () => {
        let result = await fetch(
            '/api/articles',
            {
                method: 'put',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        code,
                        LibelleFR,
                        libelleFrPluriel,
                        LibelleNDL,
                        libelleNlPluriel,
                        prix1,
                        prix2,
                        prix3,
                        presentation,
                        articleID
                    }
                )
            }
        );

        const data = await result.json();
        console.log(data);
    }
  
    return (
        <BS.Col className="mx-auto no-margin clientAnimation" lg='4' xs='12' align='center'>
            <BS.Form onSubmit={ (event) => { submitArticle(event); }}>
                <MDBInput 
                    className="defaultInput" label="Code raccourci" 
                    value={ code } onChange={ (e) => {setCode(e.target.value); setDisabled(false)} } 
                    required
                />
                <MDBInput
                    className="defaultInput" label="Libellé français" 
                    value={ LibelleFR } onChange={ (e) => {setLibelleFR(e.target.value); setDisabled(false)} } 
                    required
                />
                <MDBInput 
                    className="defaultInput" label="Libellé français pluriel" 
                    value={ libelleFrPluriel } onChange={ (e) => {setLibelleFrPluriel(e.target.value); setDisabled(false)} } 
                    required={required} 
                />
                <MDBInput 
                    className="defaultInput" label="Libellé néerlandais" 
                    value={ LibelleNDL } onChange={ (e) => {setLibelleNDL(e.target.value); setDisabled(false)} } 
                    required
                />
                <MDBInput 
                    className="defaultInput" label="Libellé néerlandais pluriel" 
                    value={ libelleNlPluriel } onChange={ (e) => {setLibelleNlPluriel(e.target.value); setDisabled(false)} } 
                    required={required}
                />
                <MDBInput
                    lang="fr"
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
                    onChange={(event) => {
                        setPresentation(event.value);
                        setDisabled(false);

                        if (event.value) {
                            setRequired(true);
                        }
                        else {
                            setRequired(false);
                        }
                    } }
                    label="Présentation"
                    options={presentationOptions}
                />
                <BS.Button className="submitArticle" variant="outline-info" type="submit" disabled={disabled}>Enregistrer</BS.Button> 
            </BS.Form>
        </BS.Col>
    );
};

export default Ajout_Articles ;
