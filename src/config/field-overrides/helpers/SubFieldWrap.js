import React from 'react';

const styles = {
    formFieldSubFields: {
        transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
        boxSizing: 'content-box',
        borderRadius: '2px',
        padding: '1rem',
        width: '100%',
        backgroundColor: 'rgb(250, 250, 250)',
        marginLeft: '-5rem',
        paddingLeft: '7rem',
        paddingRight: '3rem',
    },
};

export default function SubFieldWrap({ children }) {
    return (
        <div style={styles.formFieldSubFields}>
            {children}
        </div>
    );
}
