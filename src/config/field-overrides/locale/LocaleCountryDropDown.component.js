import React from 'react';
import { getFakeCountryData } from './fakeData';
import LocaleDropDown from './LocaleDropDown.component';

const LocaleCountryDropDown = props =>
    <LocaleDropDown {...props} getter={getFakeCountryData} labelKey="country" />;

export default LocaleCountryDropDown;
