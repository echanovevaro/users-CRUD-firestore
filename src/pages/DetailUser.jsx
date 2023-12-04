import { Details } from "../components/Details"
import { Outlet } from "react-router-dom"
function DetailUser() {
  return (
    <>
      <Outlet />
      <Details />
    </>
  )
}

export default DetailUser
