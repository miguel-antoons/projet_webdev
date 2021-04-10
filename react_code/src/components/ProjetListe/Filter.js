import React from 'react';
import * as BS from "react-bootstrap";


const Filter = () => {
    let current_year = new Date().getFullYear();
    let years_since_2000 = [];

    for (let i = current_year - 1 ; i >= 2000 ; i-- ) {
        years_since_2000.push(<option key={i}>{i}</option>)
    }

    return (
        <BS.ButtonGroup>
            <select className="form-control form-control-lg shadow-none bg-transparent filtre">
                <option key="3M">Il y a 3 mois</option>
                <option key={current_year}>Cette année</option>
                {years_since_2000}
            </select>
        </BS.ButtonGroup>
    );
};

export default Filter;
