import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Flex from '../atoms/Flex'

const useStyles = makeStyles(theme => ({
    userBalanceRow: {
        marginBottom: '8px',
        width: '100%',  
    },
    rowTitle: {
        fontSize: '14px',
        fontWeight: 500
    },
    rowValue: {
        fontSize: '16px',
        fontWeight: 600,
        textTransform: 'uppercase'
    }
}));

const UserBalanceRow = ({title, value} : { title:any, value:any}) => {
    const classes = useStyles();
    return (
        <Flex className={classes.userBalanceRow} justifyContent="space-between">
            <span className={classes.rowTitle}>{title}:</span>&nbsp;<span className={classes.rowValue}>{value} $LITH</span>
        </Flex>
    );
}

export default UserBalanceRow