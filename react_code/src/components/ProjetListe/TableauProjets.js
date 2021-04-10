import React, { useEffect, useState } from 'react';
import * as BS from "react-bootstrap";
import './ProjetListe.css';
import * as icon from 'react-icons/io5'
import BoutonRapide from './BoutonRapide.js';

const TableauProjets = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            const response = await fetch('/api/devis');
            const data = await response.json();
            setProjects(data);
        }

        fetchProjects();
    }, []);
    
    console.log(projects);

    return (
        <>
            {projects.map((project) => (
                <tr key={project.id}>
                    <td>{project.id}</td>
                    <td>{project.name}</td>
                    <td>{project.chantier}</td>
                    <td>{project.date}</td>
                    <td className='last_column'>
                        <BS.Row>
                            <BS.Col className='button_container' >
                                <BoutonRapide icon={<icon.IoTrash />} text="  Suprimmer" css_variant={true} />
                            </BS.Col>
                            <BS.Col className='button_container'>
                                <BoutonRapide icon={<icon.IoPrint />} text="  Imprimer" />
                            </BS.Col>
                            <BS.Col className='button_container'>
                                <BoutonRapide icon={<icon.IoOpen />} text="  Ouvrir" />
                            </BS.Col>
                        </BS.Row>
                    </td>
                </tr>
            ))}
        </>
    );
};

export default TableauProjets;
