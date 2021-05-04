import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div>
      <h3>
        Page could not be found
      </h3>
      <Link to="/">Return Home</Link>
    </div>
  );
}

export default NotFound;
