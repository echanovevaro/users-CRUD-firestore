import { Card } from "./Card"
import classes from "./Cards.module.css"

export const Cards = ({ users }) => {
  return (
    <ul className={classes.cards}>
      {users?.map((user) => (
        <li key={user.id} className={classes.card}>
          <Card user={user} />
        </li>
      ))}
    </ul>
  )
}
