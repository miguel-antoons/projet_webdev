import React from 'react';
import Ticket from './Ticket';
import './etiquetage.css';
import './commandesEtiquettes.css';


const Row = ({rowContent, fuseMergePreview, rowIndex, writeCells, setBold, resetTimer, changeColor, clearPreview, writeCNumber, setCNumberBold, changeCNumberColor, fuseMergeCells}) => {
    return (
        <>
            <tr className="fuseMergeRow">
                {rowContent.map((column, index) => (
                    <td 
                        className="fuseMergeCell" 
                        key={index} 
                        colSpan={column.colspan} 
                        onMouseOver={() => fuseMergePreview(rowIndex, index)}
                        onMouseOut={() => clearPreview(rowIndex)}
                        onContextMenu={(event) => fuseMergeCells(event, rowIndex, index)}
                        onClick={(event) => fuseMergeCells(event, rowIndex, index)}
                    >
                    {index? "" : rowIndex + 1}
                    </td>
                ))}
            </tr>
            <tr className="ticket">
                {rowContent.map((column, index) => (
                    <Ticket 
                        ticketInfo={column} 
                        rowIndex={rowIndex} 
                        index={index} 
                        writeCells={writeCells}
                        writeCNumber={writeCNumber}
                        key={index} 
                        setBold={setBold}
                        setCNumberBold={setCNumberBold}
                        resetTimer={resetTimer} 
                        changeColor={changeColor}
                        changeCNumberColor={changeCNumberColor}
                    />
                ))}
            </tr>
        </>
    );
};



export default Row;

