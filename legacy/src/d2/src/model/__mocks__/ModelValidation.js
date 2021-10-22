const validation = jest.fn();

export default {
    getModelValidation() {
        return {
            validateAgainstSchema: validation,
        };
    },
};
