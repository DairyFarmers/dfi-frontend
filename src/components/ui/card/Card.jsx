import React from "react";
import "./Card.scss";

const Card = ({ title, number, icon: Icon, className }) => {
  return (
    <div className={`card-box d-flex align-items-center ${className}`}>
      {Icon && <Icon className="icon me-3" />}
      <div>
        <h5 className="title">{title}</h5>
        <p className="number">{number}</p>
      </div>
    </div>
  );
};

export default Card;