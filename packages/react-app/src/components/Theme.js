import { createTheme } from "@material-ui/core/styles";

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
        fontFamily: "Rajdhani",
        fontSize: "2.5rem",
        fontWeight: 400,    
        lineHeight: 1.5
    },
    h2: {
        color: "white",
        fontFamily: "Rajdhani",
        fontSize: "2.5rem",
        fontWeight: 400,    
        lineHeight: 1.5
    },
    h3: {
        color: "white",
        fontFamily: "Rajdhani",
        fontSize: "2.5rem",
        fontWeight: 400,    
        lineHeight: 1.5
    },
    h4: {
        color: "white",
        fontFamily: "Rajdhani",
        fontSize: "2.5rem",
        fontWeight: 400,    
        lineHeight: 1.5
    },
    h5: {
        color: "white",
        fontFamily: "Rajdhani",
        fontSize: "2.5rem",
        fontWeight: 400,    
        lineHeight: 1.5
    },
    h6: {
        color: "white",
        fontFamily: "Rajdhani",
        fontSize: "2.5rem",
        fontWeight: 400,    
        lineHeight: 1.5
    },
    link: {
        color: "white"
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
  /*
  overrides: {
    MuiInputLabel: {
      root: {
        color: arcBlue,
        fontSize: "1rem"
      }
    },
    MuiInput: {
      root: {
        color: arcGrey,
        fontWeight: 300
      },
      underline: {
        "&:before": {
          borderBottom: `2px solid ${arcBlue}`
        },
        "&:hover:not($disabled):not($focused):not($error):before": {
          borderBottom: `2px solid ${arcBlue}`
        }
      }
    }
  }
  */
});