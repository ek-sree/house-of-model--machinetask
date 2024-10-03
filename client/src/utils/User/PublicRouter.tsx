import { useSelector } from "react-redux"
import { RootState } from "../../redux/store/store"
import { Navigate, Outlet } from "react-router-dom";

const PublicRouter = () => {
  const isAuthenticated = useSelector((state:RootState)=>state.Auth.isAuthenticated);
  return isAuthenticated ? <Navigate to='/' replace /> : <Outlet/>;
}

export default PublicRouter