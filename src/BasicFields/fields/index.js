//import CheckBox from './CheckBox';
import InputBox from './InputBox';
//import SelectBox from './SelectBox';
//import SelectBoxAsync from './SelectBoxAsync';
//import MultiSelectBox from './MultiSelectBox';
//import TextBox from './TextBox';

export const CHECKBOX = Symbol('CHECKBOX');
export const INPUT = Symbol('INPUT');
export const SELECT = Symbol('SELECT');
export const SELECTASYNC = Symbol('SELECTASYNC');
export const MULTISELECT = Symbol('MULTISELECT');
export const TEXT = Symbol('TEXT');

export const fieldTypeClasses = new Map([
    //[CHECKBOX, CheckBox],
    [INPUT, InputBox],
    //[SELECT, SelectBox],
    //[SELECTASYNC, SelectBoxAsync],
    //[MULTISELECT, MultiSelectBox],
    //[TEXT, TextBox],
]);

export const typeToFieldMap = new Map([
    // ['BOOLEAN', CHECKBOX],
    // ['CONSTANT', SELECT],
    ['IDENTIFIER', INPUT], //TODO: Add identifiers for the type of field...
    // ['REFERENCE', SELECTASYNC],
    ['TEXT', INPUT],
    // ['COLLECTION', MULTISELECT],
    // ['INTEGER', INPUT], // TODO: Add Numberfield!
    // ['URL', INPUT], // TODO: Add Url field?
]);
