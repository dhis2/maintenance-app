import ThemeManager from 'material-ui/lib/styles/theme-manager';
import Colors from 'material-ui/lib/styles/colors';
import ColorManipulator from 'material-ui/lib/utils/color-manipulator';
import Spacing from 'material-ui/lib/styles/spacing';

const themeConfig = {
    spacing: Spacing,
    fontFamily: 'Roboto, sans-serif',
    palette: {
        primary1Color: Colors.blue500,
        primary2Color: Colors.blue700,
        primary3Color: Colors.lightBlack,
        accent1Color: Colors.blueA200,
        accent2Color: Colors.grey100,
        accent3Color: Colors.grey500,
        accent4Color: Colors.blueGrey50,
        textColor: Colors.darkBlack,
        alternateTextColor: Colors.white,
        borderColor: Colors.grey300,
        disabledColor: ColorManipulator.fade(Colors.darkBlack, 0.3),
    },

};

const appTheme = ThemeManager.getMuiTheme(themeConfig);

appTheme.formFields = {
    secondaryColor: themeConfig.palette.accent4Color,
};

export default appTheme;
