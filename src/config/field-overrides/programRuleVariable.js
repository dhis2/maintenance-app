
export default new Map([
    ['name', {
        validators: [{
            message: 'this_field_can_only_contain_letters_numbers_space_dash_dot_and_underscore',
            validator(value) {
                return /^[\w _.\-]+$/gim.test(value);
            },
        }],
    }],
]);
