import { createMuiTheme, withStyles } from '@material-ui/core/styles';
import { purple } from '@material-ui/core/colors';

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: purple[500]
    }
  },
  overrides: {
    // MuiListItemIcon: {
    //   root: {
    //     color: '#FFF !important'
    //   }
    // },
    MuiDivider: {
      root: {
        backgroundColor: '#BDBDBD'
      }
    },
    MuiCard: {
      root: {
        background:
          'linear-gradient(to bottom right, rgba(255,255,255,0.8), rgba(255,255,255,0.5))',
        backdropFilter: 'blur(1rem)'
      }
    },
    MuiButton: {
      outlined: {
        border: '1px solid rgba(110, 108, 110, .75)',
        color: 'rgba(110, 108, 110, .75)'
      },
      contained: {
        background:
          'linear-gradient(to bottom right, rgba(245, 0, 87,0.5), rgba(245, 0, 87,0.3)) !important',
        color: 'white'
      }
    },
    MuiTypography: {
      subtitle1: {
        fontWeight: 'bold'
      }
    },
    MuiPaper: {
      root: {
        backgroundColor: 'unset',
        background:
          'linear-gradient(to bottom right, rgba(255,255,255,0.8), rgba(255,255,255,0.7))',
        backdropFilter: 'blur(1rem)'
      }
    }
  }
});

export const GlobalCss = withStyles({
  // @global is handled by jss-plugin-global.
  '@global': {
    // You should target [class*="MuiButton-root"] instead if you nest themes.
    'body': {
      // backgroundColor: '#F5F6FA'
      //backgroundColor: 'rgba(156, 38, 176,0.1)'
      // background: 'linear-gradient(to bottom right, rgba(156, 38, 176,0.3), rgba(156, 38, 176,0.1))',
      backgroundColor: 'rgb(252,220,240)',
      background: 'linear-gradient(140deg, rgba(252,220,240,1) 0%, rgba(206,235,254,1) 51%, rgba(204,235,254,1) 63%, rgba(236,212,250,1) 100%)',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh'
    }
  },
})(() => null);
