import React from "react";
import PropTypes from "prop-types";

const ShowRescues = ({rescues}) => {
    return (
      <div className="pbRescuesMade">
        {rescues === 0 && 'No escapes'}
        {rescues === 1 && '1 escape'}
        {rescues > 1 && `${rescues} escapes`}
      </div>
    );
};
  
ShowRescues.propTypes = {
  rescues: PropTypes.number.isRequired
};

export default ShowRescues;