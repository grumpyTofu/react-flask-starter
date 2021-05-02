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
    }
  }
});

// export const GlobalCss = withStyles({
//     // @global is handled by jss-plugin-global.
//     '@global': {
//       // You should target [class*="MuiButton-root"] instead if you nest themes.
//       'div.MuiDrawer-paper > div.MuiListItemIcon-root': {
//         color: 'white',
//       },
//     },
//   })(() => null);
