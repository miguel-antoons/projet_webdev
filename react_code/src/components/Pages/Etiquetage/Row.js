import React from 'react';
import './etiquetage.css';
import './commandesEtiquettes.css';


const Row = ({rowContent, fuseMergePreview, rowIndex}) => {
    return (
        <>
            <tr className="fuseMergeRow">
                {rowContent.map((column, index) => (
                    <td className="fuseMergeCell" key={index} colSpan={column.colSpan} onMouseOver={(event) => fuseMergePreview(event, rowIndex, index)}></td>
                ))}
            </tr>
            <tr className="ticket">
                {rowContent.map((column, index) => (
                    <td className="module" colSpan={column.colSpan} key={index}>
                        <textarea key={"a" + {index}} className="circuit blackNormal" rows='6' cols='5' placeholder="Circuit . . ."></textarea>
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

