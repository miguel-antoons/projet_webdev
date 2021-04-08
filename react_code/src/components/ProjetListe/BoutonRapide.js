import React from 'react';
import * as BS from "react-bootstrap";
import './ProjetListe.css';

const BoutonRapide = ({icon, text, css_variant }) => {
    let style = "";

    if (css_variant) {
        style = "delete";
    }
    else {
        style = "quick_actions mb-1 mb-md-0";
    }

    return (
        <BS.Button className={style} variant='light'>
            {icon}{text}
        </BS.Button>
    );
};

export default BoutonRapide;
