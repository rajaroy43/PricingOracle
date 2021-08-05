import React from 'react';
import Flex from './Flex'

const Card = ({title, text}: {title: string, text: string}) => (
    <Flex flexDirection='column'>
      <h4>{title}</h4>
      <div>
        {text}
      </div>
    </Flex>
);

export default Card