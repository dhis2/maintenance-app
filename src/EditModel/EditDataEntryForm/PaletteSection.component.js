import React from 'react';
import PropTypes from 'prop-types';

const filterItems = ({ keySet, filter }) => {
    const keys = Object.keys(keySet)
    if (!filter.length) {
        return keys
    }

    return keys.filter(key => filter.every(
        f => keySet[key].toLowerCase().includes(f.toLowerCase())
    ));
};

const PaletteSection = ({
    usedIds,
    insertFn,
    keySet,
    label,
    filter,
    expanded,
    onExpand
}) => {
    const filteredItems = filterItems({ keySet, filter });

    return (
        <div className={expanded ? 'cell expanded' : 'cell'}>
            <div className="header" onClick={onExpand}>
                <div className="arrow">&#9656;</div>
                {label}:
                <div className="count">{filteredItems.length}</div>
            </div>
            <div className="items">
                {
                    filteredItems
                        .sort((a, b) => keySet[a] ? keySet[a].localeCompare(keySet[b]) : a.localeCompare(b))
                        .map(key => {
                            // Active items are items that are not already added to the form
                            const isActive = !usedIds.includes(key);
                            const className = isActive ? 'item active' : 'item inactive';
                            const name = keySet[key].name || keySet[key];

                            return (
                                <div key={key} className={className} title={name}>
                                    <a onClick={insertFn[key]}>{name}</a>
                                </div>
                            );
                        })
                }
            </div>
        </div>
    );
};

PaletteSection.propTypes = {
    usedIds: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    insertFn: PropTypes.object.isRequired,
    keySet: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    filter: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array,
    ]),
    expanded: PropTypes.bool.isRequired,
    onExpand: PropTypes.func.isRequired,
};

export default PaletteSection;
