import React from 'react';
import * as BS from "react-bootstrap";


const Filter = ({ onChange, recent_date, value }) => {
    let current_year = new Date().getFullYear();
    let years_since_2000 = [];

    for (let i = current_year - 1 ; i >= 2000 ; i-- ) {
        years_since_2000.push(<option key={i} value={i}>{i}</option>)
    }

    return (
        <BS.ButtonGroup>
            <select value={value} onChange={(event) => onChange(event.target.value)} className="form-control form-control-lg shadow-none bg-transparent filtre">
                <option key='3M' value={recent_date}>Il y a 3 mois</option>
                <option key='all' value="" >Tous</option>
                <option key={current_year} value={current_year}>Cette année</option>
                {years_since_2000}
            </select>
        </BS.ButtonGroup>
    );
};

export default Filter;
