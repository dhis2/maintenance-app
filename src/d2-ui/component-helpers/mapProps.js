import React from 'react';

export default function mapProps(mapper, BaseComponent) {
    return function (props) {
        return (
            <BaseComponent {...mapper(props)} />
        );
    };
}
