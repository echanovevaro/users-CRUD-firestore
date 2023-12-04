import { Cards } from "../components/Cards";
import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../http";
import { Outlet } from "react-router-dom";
// import { Details } from "../components/Details"

function HomePage() {
  const { data, isPending } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  return (
    <>
      <Outlet />
      {isPending && <div>Loading...</div>}
      {data && (
        <>
          <Cards users={data} />
        </>
      )}
    </>
  );
}

export default HomePage;
