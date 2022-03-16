import React from 'react';
import { hcl } from 'd3-color';

export default function Color({ value }) {
    const styles = {
        color: {
            backgroundColor: value,
            color: hcl(value).l < 70 ? '#FFF' : '#000',
            textAlign: 'center',
            position: 'relative',
            width: 90,
            height: 36,
            lineHeight: 2.5,
            boxShadow: '0 1px 6px rgba(0,0,0,0.12),0 1px 4px rgba(0,0,0,0.12)',
        },
    };

    return (
        <div style={styles.color}>{value}</div>
    );
}
