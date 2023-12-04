/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import classes from "./Card.module.css";
export const Card = ({ user }) => {
  return (
    <>
      <div className={classes.cardheader}>
        <div className={classes.user}>
          <img src={user.avatarUrl} alt={user.displayName} />
          <div>
            <h4>{user.displayName}</h4>
            <small style={{ color: "white" }}>{user.email}</small>
          </div>
        </div>
        <img
          src={user.photoUrl}
          alt={user.displayName}
          className={classes.image}
        />
      </div>

      <div className={classes.cardbody}>
        <Link to={`/users/${user.id}`} className={classes.tag}>
          Details
        </Link>
        {/* <h4>{user.description}</h4> */}
        {/* <span>{user.catchPhraseNoun}</span>
        <small>{user.email}</small> */}
      </div>
    </>
  );
};
