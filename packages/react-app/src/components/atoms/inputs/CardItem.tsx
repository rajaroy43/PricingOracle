import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Card } from '@material-ui/core';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const useStyles = (isSelected:boolean) => makeStyles({
  root: {
    background: `${isSelected ? '#3f51b5' : 'white'}`,
    cursor: 'pointer',
    margin: '0.5em',
    maxWidth: 345,
    opacity: '100%',
    textAlign:'center',
    '&:hover': {
      background: "#3f51b5",
      color: 'white'
    },
    '& h2': {
      color: 'white'
    },
  },
  media: {
    height: 140,
  },
  title: {
    color: "black",
    fontSize: "2rem"
  }
});

export default function MediaCard({icon, title, description, isSelected, onClick}: any) {
  const classes = useStyles(isSelected)();

  return (
    <Card className={classes.root} onClick={onClick}>
      <CardActionArea>
        {icon}
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2" className={classes.title}>
            {title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
