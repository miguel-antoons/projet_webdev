import PropTypes from 'prop-types';

const Button = ({color, home_button_text}) => {
    return (
        <button 
        style={{}}
        className=''>
            {home_button_text}
        </button>
    );
};

Button.defaultProps = {
    color: 'black',
    home_button_text: 'no_text'
};

Button.PropTypes = {
    text: PropTypes.string,
    color: PropTypes.string
};