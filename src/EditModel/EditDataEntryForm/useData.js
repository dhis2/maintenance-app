import { useState, useEffect } from 'react'
import { getInstance as getD2 } from 'd2/lib/d2';

// Load form data, operands, indicators and flags
const loadData = async ({ modelId }) => {
    const d2 = getD2();

    return await Promise.all([
        d2.models.dataSets.get(modelId, {
            fields: 'id,displayName,dataEntryForm[id,style,htmlCode],indicators[id,displayName]',
        }),
        d2.Api.getApi().get('dataElementOperands', {
            paging: false,
            totals: true,
            fields: 'id,dimensionItem,displayName',
            dataSet: modelId,
        }),
        d2.Api.getApi().get('system/flags'),
    ]).then(([
        dataSet,
        ops,
        _flags,
    ]) => {
        // Operands with ID's that contain a dot ('.') are combined dataElementId's and categoryOptionId's
        // The API returns "dataElementId.categoryOptionId", which are transformed to the format expected by
        // custom forms: "dataElementId-categoryOptionId-val"
        const operands = ops.dataElementOperands
            .filter(op => op.dimensionItem.includes('.'))
            .reduce((out, op) => {
                const id = `${op.dimensionItem.split('.').join('-')}-val`;
                out[id] = op.displayName; // eslint-disable-line
                return out;
            }, {});

        // Data element totals have only a single ID and thus no dot ('.')
        const totals = ops.dataElementOperands
            .filter(op => !op.dimensionItem.includes('.'))
            .reduce((out, op) => {
                out[op.id] = op.displayName; // eslint-disable-line
                return out;
            }, {});

        const indicators = dataSet.indicators.toArray()
            .sort((a, b) => a.displayName.localeCompare(b.displayName))
            .reduce((out, i) => {
                out[i.id] = i.displayName; // eslint-disable-line
                return out;
            }, {});

        const flags = _flags.reduce((out, flag) => {
            out[flag.path] = flag.name; // eslint-disable-line
            return out;
        }, {});

        return { operands, totals, indicators, flags };
    })
}

export const useData = ({ modelId, onComplete }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState({});

    useEffect(() => {
        setLoading(true)

        loadData({
            modelId: params.modelId,
        }).then(({ operands, totals, indicators, flags }) => {
            setData({ operands, totals, indicators, flags })
            return onComplete({ operands, totals, indicators, flags })
        }).catch(error => {
            setError(error)
        }).finally(() => {
            setLoading(false)
        })
    }, [params.modelId]);

    const { operands, totals, indicators, flags } = data;

    return {
        loading,
        error,
        operands,
        totals,
        indicators,
        flags
    };
}
