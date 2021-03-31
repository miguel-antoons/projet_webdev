import React from 'react';
import * as BS from "react-bootstrap";


const Filter = () => {

    return (
        <BS.ButtonGroup>
            <div className='form-check'>
                <input className="form-check-input" type="radio" name="sortTable" id="3_mois" value="mois" defaultChecked />
                <label className="form-check-label" for="exampleRadios1">test</label>
            </div>
            <div className='form-check'>
                <input className="form-check-input" type="radio" name="sortTable" id="1_an" value="an"/>
                <label className="form-check-label" for="exampleRadios1">test</label>
            </div>
            <div className='form-check'>
                <input className="form-check-input" type="radio" name="sortTable" id="tout" value="tout"/>
                <label className="form-check-label" for="exampleRadios1">test</label>
            </div>
        </BS.ButtonGroup>
    );
};

export default Filter;
