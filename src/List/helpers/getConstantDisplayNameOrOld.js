const modelsThatMapToOtherDisplayName = {
    program: {
        programType: {
            WITH_REGISTRATION: 'TRACKER_PROGRAM',
            WITHOUT_REGISTRATION: 'EVENT_PROGRAM',
        },
    },
};

export default function getConstantDisplayNameOrOld(modelType, fieldName, oldVal) {
    return (modelsThatMapToOtherDisplayName[modelType] && modelsThatMapToOtherDisplayName[modelType][fieldName])
        ? modelsThatMapToOtherDisplayName[modelType][fieldName][oldVal]
        : oldVal;
}
