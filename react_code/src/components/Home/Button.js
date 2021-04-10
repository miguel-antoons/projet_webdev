import PropTypes from 'prop-types';
import React from 'react';
import Icon from './Icon.js';
import { LinkContainer } from 'react-router-bootstrap';
import './Button.css';
import * as BS from "react-bootstrap";

const Button = ({bd_color, text, icon, destination, icon_color}) => {
    const style = {
        borderColor: bd_color,
        borderWidth: 3,
    }

    return (
        <LinkContainer to={{ pathname: destination }} className="home_btn" style={ style } >
            <BS.Button className='home_btn' variant='light' size="lg">
                <p>
                    <Icon icon={ icon } color={ icon_color } /> <br />
                    {text}
                </p>
            </BS.Button>
        </LinkContainer>
    );
};

Button.defaultProps = {
    color: 'black',
    text: 'no_text'
};

Button.propTypes = {
    color: PropTypes.string,
    htext: PropTypes.string
};

export default Button;
