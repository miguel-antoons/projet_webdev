import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';


import Etiquetage from '../Pages/Etiquetage/Etiquetage';
import Ticket from '../Pages/Etiquetage/Ticket'
import { ExpansionPanelActions } from '@material-ui/core';

Enzyme.configure({ adapter: new Adapter() })

describe('Ticket', () => {
    it('should render textareas inside a table cell', () => {
        const wrapper = shallow(<Ticket />);
        const ticket = wrapper.find('td');
        ExpansionPanelActions(ticket).toHaveLength(1);
    })
});
