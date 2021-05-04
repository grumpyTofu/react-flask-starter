import { createMuiTheme, withStyles } from '@material-ui/core/styles';
import { orange } from '@material-ui/core/colors';

export const theme = createMuiTheme({
  palette: {
      primary: {
          main: '#3c32bc'
      }
  },
  overrides: {
    MuiListItemIcon: {
      root: {
        color: '#FFF !important'
      }
    },
    MuiDivider: {
      root: {
        backgroundColor: '#BDBDBD'
      }
    }
  }
});

export const GlobalCss = withStyles({
    // @global is handled by jss-plugin-global.
    '@global': {
      // You should target [class*="MuiButton-root"] instead if you nest themes.
      'body': {
        backgroundColor: '#F5F6FA'
      }
    },
  })(() => null);
