import { createTheme } from "@material-ui/core/styles";
import createBreakpoints from '@material-ui/core/styles/createBreakpoints'
const breakpoints = createBreakpoints({});

const lithOrange = "#E96036";
const black = "#000000";

export default createTheme({
  palette: {
    background: {
      default: black
    },
    common: {
      orange: lithOrange,
    },
    primary: {
      main: lithOrange
    },
    secondary: {
      main: "#FFFFFF"
    },
    action: {
      disabledBackground: '#666',
      disabled: '#ccc'
    }
  },
  typography: {
    color: "white",
    fontFamily: [
        'Rajdhani',
        'sans-serif'
    ].join(', '),
    lineHeight: '1px',
    h1: {
        color: "white",
        fontFamily: [
          'Rajdhani',
          'sans-serif'
        ].join(', '),
        fontSize: "2.5rem",
        fontWeight: 400,    
        lineHeight: 1
    },
    h2: {
        color: "white",
        fontFamily: [
          'Rajdhani',
          'sans-serif'
        ].join(', '),
        fontSize: "2.5rem",
        fontWeight: 400,    
        lineHeight: 1.5
    },
    h3: {
      color: "white",
      fontFamily: [
        'Rajdhani',
        'sans-serif'
      ].join(', '),
      fontSize: "24px",
      fontWeight: 500,
    },
    h4: {
        color: "white",
        fontFamily: [
          'Rajdhani',
          'sans-serif'
        ].join(', '),
        fontSize: "2.5rem",
        fontWeight: 400,    
        lineHeight: 1.5
    },
    h5: {
        color: "white",
        fontFamily: [
          'Rajdhani',
          'sans-serif'
        ].join(', '),
        fontSize: "2.5rem",
        fontWeight: 400,    
        lineHeight: 1.5
    },
    h6: {
        color: "white",
        fontFamily: [
          'Rajdhani',
          'sans-serif'
        ].join(', '),
        fontSize: "2.5rem",
        fontWeight: 400,    
        lineHeight: 1.5
    },
    link: {
        color: lithOrange
    }
  },
    overrides: {
        MuiCssBaseline: {
         '@global': {
            html: {
              WebkitFontSmoothing: 'auto',
            },
            body: {
              color: 'white',
              fontSize: '16px',  
              lineHeight: '1rem'
            },
          },
        },
        MuiButton: {
            root: {
              borderColor: 'transparent',
              borderRadius: '4px',
              borderStyle: 'solid', 
              borderWidth: '1px',              
              fontSize: '16px',
              textTransform: 'none',
            },
            containedPrimary: {
                backgroundColor: lithOrange,
                color: 'white',
                fontWeight: 700,  
                '&:hover': {
                    backgroundColor: 'white',
                    borderWidth: '1px',
                    borderStyle: 'solid', 
                    borderColor: lithOrange,
                    color: lithOrange + '!important',
                },
            },
            outlinedPrimary: {
                backgroundColor: 'white',
                color: lithOrange,
                fontWeight: 700,  
                '&:hover': {
                    backgroundColor: lithOrange,
                    borderWidth: '1px',
                    borderStyle: 'solid', 
                    borderColor: 'transparent',
                    color: 'white',
                },
            },    
        },
        MuiFormHelperText: {
          root: {
            marginTop: 0,
            height: 0,
            position: 'absolute',
            bottom: '1em'
          },
        },
        MuiIconButton: {
          root: {
            color: 'white'
          }
        },
        MuiInputBase: {
          root: {
            backgroundColor: '#333',            
            borderColor: 'transparent',
            borderRadius: '4px',
            borderStyle: 'solid',
            color: 'white',
            fontFamily: [
              'Rajdhani',
              'sans-serif'
            ].join(', '),
            fontSize: '16px',
            fontWeight: 700,
            height: '36px',
            margin: '0 !important',
            padding: '4px',
            textAlign: 'right'
          }
        },
        MuiInputLabel: {
          root: {
            color: '#ffffff !important',
            fontSize: '16px',
            fontWeight: 500,
            position: 'relative !important',
            '& Mui-error': {
              display: 'flex !important',
              color: '#ff0000'    
            }
          },
          formControl: {
            transform: 'none'
          }
        },
        MuiFormControlLabel: {
          root: {
            fontFamily: [
              'Rajdhani',
              'sans-serif'
            ].join(', '),
            fontSize: '16px',
            fontWeight: 700,
            '& span': {
              fontFamily: [
                'Rajdhani',
                'sans-serif'
              ].join(', '),
              fontSize: '16px',
              fontWeight: '700 !important',
              marginLeft: '4px'
            },
            marginLeft: '24px',
            [breakpoints.down('xs')]: {
              marginLeft: 0,
              marginRight: '24px',
            },       
          }
        },
        MuiTextField: {
          root: {
            alignItems: 'center !important',
            flexDirection: 'row !important',
            justifyContent: 'space-around !important',
          }
        },
        MuiRadio: {
          root: {
            backgroundColor: '#222222',
            color: '#222222',          
            height: '32px',
            width: '32px',
            fontWeight: 700
          },
          colorSecondary: {
            color: "#222222",
            '&$checked': {
              color: '#E96036'
            }
          }
        },
        MuiFormGroup: {
          root: {
            alignItems: 'center',
            display: 'flex',
            marginLeft: '8px'
          }
        }
    },
    /*
    subtitle1: {
      fontSize: "1.25rem",
      fontWeight: 300,
      color: arcGrey
    },
    subtitle2: {
      color: "white",
      fontWeight: 300,
      fontSize: "1.25rem"
    },
    body1: {
      fontSize: "1.25rem",
      color: arcGrey,
      fontWeight: 300
    },
    caption: {
      fontSize: "1rem",
      fontWeight: 300,
      color: arcGrey
    },
    learnButton: {
      borderColor: arcBlue,
      borderWidth: 2,
      textTransform: "none",
      color: arcBlue,
      borderRadius: 50,
      fontFamily: "Roboto",
      fontWeight: "bold"
    }
    */
});