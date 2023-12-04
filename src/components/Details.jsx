/* eslint-disable react/prop-types */
import classes from "./Details.module.css";
import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "../http";
import { useParams, useRouteLoaderData } from "react-router-dom";
export const Details = () => {
  const credentials = useRouteLoaderData("root");
  console.log(credentials?.isAdmin);
  const { userId } = useParams();
  const { data: user, isPending } = useQuery({
    queryKey: ["users", userId],
    queryFn: () => fetchUser(userId),
  });

  return (
    <>
      {isPending && <div>Loading...</div>}
      {user && (
        <>
          <div className={classes.card}>
            <div className={classes.cardheader}>
              <div className={classes.user}>
                <div className={classes.dates}>
                  <img src={user.avatarUrl} alt={user.displayName} />
                  <div>
                    <h4>{user.displayName}</h4>
                    <small>{user.email}</small>
                  </div>
                </div>
                <h3>{user.description}</h3>
              </div>

              <div className={classes.cardbody}>
                <img
                  src={user.photoUrl}
                  alt={user.displayName}
                  className={classes.image}
                />
              </div>
            </div>
            {credentials?.isAdmin && (
              <div className={classes.btn}>
                <button className={classes.btnDelete}>Delete</button>
                <button className={classes.btnEdit}>Edit</button>
              </div>
            )}
            {!credentials?.isAdmin && credentials?.uid === userId && (
              <div className={classes.btn}>
                <button className={classes.btnEdit}>Edit</button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};
