/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
// import classes from "./Card.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Card from "react-bootstrap/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import Stack from "react-bootstrap/Stack";

export const UserCard = ({ user }) => {
  return (
    // <>
    //   <div className={classes.cardheader}>
    //     <div className={classes.user}>
    //       <img src={user.avatarUrl} alt={user.displayName} />
    //       <div>
    //         <h4>{user.displayName}</h4>
    //         <small style={{ color: "white" }}>{user.email}</small>
    //       </div>
    //     </div>
    //     <img
    //       src={user.photoUrl}
    //       alt={user.displayName}
    //       className={classes.image}
    //     />
    //   </div>

    //   <div className={classes.cardbody}>
    //     <Link to={`/users/${user.id}`} className={classes.tag}>
    //       Details
    //     </Link>
    //     {/* <h4>{user.description}</h4> */}
    //     {/* <span>{user.catchPhraseNoun}</span>
    //     <small>{user.email}</small> */}
    //   </div>
    // </>
    <Card className="card d-flex flex-column p-0 col link">
      <Card.Img src={user.photoUrl} />
      <Card.Body className="d-flex flex-column justify-content-start align-items-center">
        <div>
          <Stack className="d-flex justify-content-start align-items-center mb-4">
            <Card.Title className="mb-1">{user.displayName}</Card.Title>

            <span className="text-muted">{user.email}</span>
          </Stack>
          <Card.Text>{user.description}</Card.Text>
        </div>
      </Card.Body>
      {/* <Card.Footer className="d-flex justify-content-center align-items-center bg-white border-0 m-2">
        <Button variant="outline-primary">Learn more</Button>
      </Card.Footer> */}
      <Card.Footer className="text-primary">
        <Stack
          direction="horizontal"
          className="d-flex justify-content-between align-items-center m-2"
        >
          <h6 className="lh-0 mb-0">60 €/hour</h6>
          <Stack
            direction="horizontal"
            className="d-flex justify-content-center align-items-center gap-2"
          >
            <small>
              <FontAwesomeIcon icon={faThumbsUp} className="ms-2" />
            </small>
            <small className="mb-0">8</small>
          </Stack>
        </Stack>
        <Link to={`/users/${user.id}`} className="stretched-link" />
        {/* <Button variant="outline-primary">Learn more</Button> */}
      </Card.Footer>
    </Card>
  );
};
