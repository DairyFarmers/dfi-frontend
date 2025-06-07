import React from "react";
import "./UserCard.scss";

const UserCard = ({ title, number, icon: Icon, className  }) => {
  return (
    <div className={`user-card-box d-flex align-items-center ${className}`}>
      {Icon && <Icon className="icon me-3" />}
      <div>
        <h5 className="title">{title}</h5>
        <p className="number">{number}</p>
      </div>
    </div>
  );
};

export default UserCard;