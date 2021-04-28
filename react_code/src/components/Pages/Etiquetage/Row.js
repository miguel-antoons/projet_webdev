import React from 'react';
import './etiquetage.css';
import './commandesEtiquettes.css';


const Row = ({rowContent, fuseMergePreview, rowIndex, writeCells}) => {
    let circuitClasses;
    let circuitNumberClasses;
    let cellClasses;

    if (rowContent.bold) {
        circuitClasses = "circuit greenBold";
        circuitNumberClasses = "circuitNumber greenBold"
        cellClasses = "module";
        console.log("this is supossed to be bold");
    }
    else {
        circuitClasses = "circuit blackNormal";
        circuitNumberClasses = "circuitNumber blackNormal";
        cellClasses = "module";
        console.log(rowContent);
    }
    // const cssTicket = {
    //     color: rowContent.color,
    //     backgroundColor: rowContent.tempBackground,
    //     fontStyle: rowContent.bold
    // };


    return (
        <>
            <tr className="fuseMergeRow">
                {rowContent.map((column, index) => (
                    <td className="fuseMergeCell" key={index} colSpan={column.colSpan} onMouseOver={(event) => fuseMergePreview(event, rowIndex, index)}></td>
                ))}
            </tr>
            <tr className="ticket">
                {rowContent.map((column, index) => (
                    <td className={cellClasses} colSpan={column.colSpan} key={index}>
                        <textarea key={"a" + {index}} onChange={(event) => writeCells(event, rowIndex, index)} value={rowContent.value} className={circuitClasses} rows='6' cols='5' placeholder="Circuit . . ."></textarea>
                        <br />
                        <textarea key={"b" + {index}} className={circuitNumberClasses} rows='1' cols='5' placeholder='N°'></textarea>
                    </td>
                ))}
            </tr>
        </>
    );
};



export default Row;

