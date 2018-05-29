
import React from 'react';
import { getFakeLanguageData } from './fakeData';
import LocaleDropDown from './LocaleDropDown.component';

const LocaleLanguageDropDown = props =>
    <LocaleDropDown {...props} getter={getFakeLanguageData} labelKey="language" />;

export default LocaleLanguageDropDown;
