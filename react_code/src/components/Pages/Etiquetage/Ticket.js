import React from 'react';

const Ticket =  ({ticketInfo, rowIndex, index, writeCells, setBold, resetTimer, changeColor, writeCNumber, setCNumberBold, changeCNumberColor}) => {
    // set the different element classes depending on the state color values
    let circuitClasses = "circuit " + ticketInfo.color;
    let circuitNumberClasses = "circuitNumber " + ticketInfo.circuitNumber.color;
    let cellClasses = "module ";

    // set the different elements classes depending on the state bold value
    if (ticketInfo.bold) {
        circuitClasses += "Bold";
    }
    else {
        circuitClasses += "Normal";
    }

    // set the different elements classes depending on the state bold value
    if (ticketInfo.circuitNumber.bold) {
        circuitNumberClasses += "Bold";
    }
    else {
        circuitNumberClasses += "Normal";
    }

    circuitClasses += " " + ticketInfo.tempBackground + "Back";
    circuitNumberClasses += " " + ticketInfo.tempBackground + "Back";
    cellClasses += ticketInfo.tempBackground + "Back";

    return (
        <td className={cellClasses} colSpan={ticketInfo.colspan} key={index}>
            <textarea 
                key={"a" + {index}} 
                onMouseDown={() => setBold(rowIndex, index)} 
                onMouseUp={resetTimer} 
                onChange={(event) => writeCells(event, rowIndex, index)}
                onDoubleClick={() => changeColor(rowIndex, index)}
                value={ticketInfo.value} 
                className={circuitClasses} 
                rows='7' 
                cols='5' 
                placeholder="Circuit ..."
            >
            </textarea>
            <br />
            <textarea
                key={"b" + {index}} 
                onMouseDown={() => setCNumberBold(rowIndex, index)} 
                onMouseUp={resetTimer} 
                onChange={(event) => writeCNumber(event, rowIndex, index)}
                onDoubleClick={() => changeCNumberColor(rowIndex, index)}
                value={ticketInfo.circuitNumber.value} 
                className={circuitNumberClasses} 
                rows='1' 
                cols='5' 
                placeholder='N°'
            >
            </textarea>
        </td>
    );
};




export default Ticket;

