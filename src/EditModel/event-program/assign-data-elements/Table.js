import React, { PropTypes } from 'react';

export const Table = ({ children, ...props }) => (
    <table {...props} style={{
        padding: '0 3rem',
        borderSpacing: 0,
    }}>
        {children}
    </table>
)

export const THead = ({ children, ...props }) => (
    <thead {...props} style={{
        textAlign: 'left',
        verticalAlign: 'top',
    }}>
        {children}
    </thead>
)

export const TBody = ({ children, ...props }) => (
    <tbody {...props}>
        {children}
    </tbody>
)

export const TRow = ({ children, ...props }) => (
    <tr {...props}>
        {children}
    </tr>
)

export const TCellHead = ({ children, style, ...props }) => (
    <th {...props} style={{
        height: '56px',
        padding: '0 5px 10px',
    }}>
        {children}
    </th>
)

export const TCell = ({ children, style, ...props }) => (
    <td {...props} style={{
        padding: '10px 5px',
        borderTop: '1px solid #bdbdbd',
        ...(style || {}),
    }}>
        {children}
    </td>
)
