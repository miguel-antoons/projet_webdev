import React from 'react';
import * as BS from "react-bootstrap";
import './RassemblementProjets.css';

const BoutonRapide = ({icon, text, css_variant, id, onDelete }) => {
    let style = "";

    if (css_variant) {
        style = "delete";
    }
    else {
        style = "quick_actions mb-1 mb-md-0";
    }

    return (
        <BS.Button onClick={() => onDelete(id)} className={style} variant='light'>
            {icon}{text}
        </BS.Button>
    );
};

BoutonRapide.defaultProps = {
    onDelete: (id) => {console.log("");}
}

export default BoutonRapide;
