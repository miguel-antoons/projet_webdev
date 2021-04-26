import React from 'react';
import './etiquetage.css';
import './commandesEtiquettes.css';


const Row = ({rowContent}) => {
    return (
        <>
            <tr className="fuseMergeRow">
                {rowContent.map((column, index) => (
                    <td className="fuseMergeCell" key={index}>hey</td>
                ))}
            </tr>
            <tr className="ticket">
                {rowContent.map((column, index) => (
                    <td className="module" key={index}>
                        <textarea key={"a" + {index}} className="circuit blackNormal" rows='7' cols='5' placeholder="Circuit . . ."></textarea>
                        <br />
                        <textarea key={"b" + {index}} className='circuitNumber blackNormal' rows='1' cols='5' placeholder='N°'></textarea>
                        {column.value}
                    </td>
                ))}
            </tr>
        </>
    );
};



export default Row;

