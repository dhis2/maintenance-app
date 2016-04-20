import { blue500, blue700, blue100, orange500, grey100, darkBlack, white, grey500, grey400 } from 'material-ui/lib/styles/colors';
import ColorManipulator from 'material-ui/lib/utils/color-manipulator';
import Spacing from 'material-ui/lib/styles/spacing';
import ThemeManager from 'material-ui/lib/styles/theme-manager';

const theme = {
    spacing: Spacing,
    fontFamily: 'Roboto, sans-serif',
    palette: {
        primary1Color: blue500,
        primary2Color: blue700,
        primary3Color: blue100,
        accent1Color: orange500,
        accent2Color: grey100,
        accent3Color: grey500,
        textColor: darkBlack,
        alternateTextColor: white,
        canvasColor: white,
        borderColor: grey400,
        disabledColor: ColorManipulator.fade(darkBlack, 0.3),
    },
};

function createAppTheme(style) {
    return {
        sideBar: {
            backgroundColor: '#F3F3F3',
            backgroundColorItem: 'transparent',
            backgroundColorItemActive: style.palette.accent2Color,
            textColor: style.palette.textColor,
            textColorActive: '#276696',
            borderStyle: '1px solid #e1e1e1',
        },
        forms: {
            minWidth: 350,
            maxWidth: 900,
        },
        formFields: {
            secondaryColor: style.palette.accent4Color,
        },
    };
}

const muiTheme = ThemeManager.getMuiTheme(theme);
const appTheme = createAppTheme(theme);

export default Object.assign({}, muiTheme, appTheme);
