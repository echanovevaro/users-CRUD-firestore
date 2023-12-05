/* eslint-disable react/prop-types */
import classes from "./Details.module.css";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteOwnUser, fetchUser, queryClient } from "../http";
import { useNavigate, useParams, useRouteLoaderData } from "react-router-dom";
export const Details = () => {
  const navigate = useNavigate();
  const credentials = useRouteLoaderData("root");
  console.log(credentials?.isAdmin);
  const { userId } = useParams();
  const { data: user, isPending } = useQuery({
    queryKey: ["users", { userId }],
    queryFn: () => fetchUser(userId),
  });

  const { mutate, isPending: isDeletePending } = useMutation({
    mutationFn: deleteOwnUser,
    onMutate: () => {
      queryClient.cancelQueries({ queryKey: ["users"] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/users", { replace: true });
    },
  });

  return (
    <>
      {(isPending || isDeletePending) && <div>Loading...</div>}
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
                {credentials?.uid === userId && (
                  <button
                    className={classes.btnDelete}
                    onClick={() => mutate(userId)}
                  >
                    Delete my account
                  </button>
                )}
                <button className={classes.btnEdit}>Edit</button>
              </div>
            )}
            {!credentials?.isAdmin && credentials?.uid === userId && (
              <div className={classes.btn}>
                <button
                  className={classes.btnDelete}
                  onClick={() => mutate(userId)}
                >
                  Delete my account
                </button>
                <button className={classes.btnEdit}>Edit</button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};
