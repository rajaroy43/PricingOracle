import React from 'react';
import Box from './Box'

const Card = ({title, text}: {title: string, text: string}) => (
    <Box>
      <h4>{title}</h4>
      <div>
        {text}
      </div>
    </Box>
);

export default Card