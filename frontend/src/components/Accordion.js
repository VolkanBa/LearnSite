import React, { useState } from 'react';

const Accordion = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div style={styles.container}>
            <div style={styles.header} onClick={toggleAccordion}>
                <h3 style={styles.title}>{title}</h3>
                <button style={styles.toggleButton}>{isOpen ? '-' : '+'}</button>
            </div>
            {isOpen && <div style={styles.content}>{children}</div>}
        </div>
    );
};

const styles = {
    container: {
        marginBottom: '20px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        overflow: 'hidden',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 15px',
        backgroundColor: '#f4f4f4',
        cursor: 'pointer',
    },
    title: {
        margin: 0,
        fontSize: '18px',
    },
    toggleButton: {
        fontSize: '16px',
        cursor: 'pointer',
        border: 'none',
        background: 'none',
    },
    content: {
        padding: '15px',
        backgroundColor: '#fff',
    },
};

export default Accordion;
