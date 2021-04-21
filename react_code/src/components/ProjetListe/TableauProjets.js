import React from 'react';
import * as BS from "react-bootstrap";
import './RassemblementProjets.css';
import * as icon from 'react-icons/io5'
import BoutonRapide from './BoutonRapide.js';
import { LinkContainer } from 'react-router-bootstrap';

const TableauProjets = ({ content, onDelete, pathname }) => {
    return (
        <>
            {content.map((element) => (
                <LinkContainer  key={element.id} to={{
                    pathname: pathname + String(element.id)
                }}>
                    <tr>
                        <td>{element.id}</td>
                        <td>{element.attribute1}</td>
                        <td>{element.attribute2}</td>
                        <td>{element.date}</td>
                        <td className='last_column'>
                            <ClickKiller>
                                <BS.Row>
                                    <BS.Col className='button_container' >
                                        <BoutonRapide id={element.id} onDelete={onDelete} icon={<icon.IoTrash />} text="  Suprimmer" css_variant={true} />
                                    </BS.Col>
                                    <BS.Col className='button_container'>
                                        <BoutonRapide icon={<icon.IoPrint />} text="  Imprimer" />
                                    </BS.Col>
                                    <LinkContainer to={{ 
                                        pathname: pathname + String(element.id)
                                    }}>
                                        <BS.Col className='button_container'>
                                            <BoutonRapide icon={<icon.IoOpen />} text="  Ouvrir" />
                                        </BS.Col>
                                    </LinkContainer>
                                </BS.Row>
                            </ClickKiller>
                        </td>
                    </tr>
                </LinkContainer>
            ))}
        </>
    );
};

const ClickKiller = ({ children }) => {
    return <div onClick={e => e.stopPropagation()}>{children}</div>;
  };

export default TableauProjets;
