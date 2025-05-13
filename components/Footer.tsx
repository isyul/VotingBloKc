import React from 'react';

const Footer: React.FC = () => {
    const footerStyle: React.CSSProperties = {
        position: 'fixed',
        bottom: 0,
        width: '100%',
        backgroundColor: '', // Background color
        color: '#a1a1a1a1', // Text color
        padding: '5px',
        textAlign: 'center'
    };

    return (
        <footer style={footerStyle}>
            <div>
                Security | Transparency | Accessibility
            </div>
            <div>
            © Developers to be added
            </div>
        </footer>
    );
}

export default Footer;
