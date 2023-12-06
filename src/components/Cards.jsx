import { UserCard } from "./Card";
import classes from "./Cards.module.css";
import Row from "react-bootstrap/Row";

export const Cards = ({ users }) => {
  return (
    <Row className="m-2 grid">
      {users?.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </Row>
  );
};
