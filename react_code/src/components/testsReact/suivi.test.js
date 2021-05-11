//eteindre react : ctrl c
//npm run test
//npm i --save-dev @testing-library/react react-test-renderer

import { render, screen, cleanup } from '@testing-library/react'
import Suivi from '../Pages/Suivi/Suivi'
import renderer from 'react-test-renderer';


test('test', () =>{
    expect(true).toBe(true);
})

//test('devrais montrer le component suivi', () =>{
    //render(<Suivi/>);
    //const suiviElement = screen.getByText('<body>');
    //expect(suiviElement).toBeInTheDocument();
//})

test('render bien la page', () => {
    const page = renderer.create(<Suivi/>).toJSON();
    expect(page).toMatchSnapshot();
  });

