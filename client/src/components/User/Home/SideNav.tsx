import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../redux/slice/AuthSlice";
import HomeIcon from '@mui/icons-material/Home';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import ViewColumnRoundedIcon from '@mui/icons-material/ViewColumnRounded';
import AcUnitRoundedIcon from '@mui/icons-material/AcUnitRounded';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import { RootState } from "../../../redux/store/store";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createUserAxios } from "../../../constraints/axios/userAxios";
import { userEndpoints } from "../../../constraints/endpoints/userEndpoints";

const SideNav = () => {

  const userAxios = createUserAxios(null);

  const dispatch = useDispatch();


  const isAuthenticated = useSelector((store:RootState)=> store.Auth.isAuthenticated)

  const handleLogout = async() => {
    try {
      const response = await userAxios.post(userEndpoints.logout);
      console.log("res",response);
      
      if(response.status==200){
        dispatch(logout());
      }
    } catch (error) {
      console.log("Error logouting",error);
      
    }
    
  };

  const navigate = useNavigate();
  const location = useLocation(); 

  const handleButtonClick = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => location.pathname === path;


  return (
    <div className="bg-gradient-to-b from-black to-slate-900 min-h-[650px] w-20 ml-2 rounded-lg flex flex-col items-center py-6">
      <div className="text-purple-600 mb-12"> 
        <AcUnitRoundedIcon fontSize="large" />
      </div>

      <button
        onClick={() => handleButtonClick('/')}
        className={`text-slate-500 hover:text-white mb-6 ${
          isActive('/') ? 'bg-slate-600 text-slate-300' : ''
        } p-2 rounded-full`}
      >
        <HomeIcon />
      </button>

      <button
        onClick={() => handleButtonClick('/product-list')}
        className={`text-slate-500 hover:text-white mb-6 ${
          isActive('/product-list') ? 'bg-slate-600 text-slate-300' : ''
        } p-2 rounded-full`}
      >
        <ViewColumnRoundedIcon />
      </button>

      {/* <button
        onClick={() => handleButtonClick('view')}
        className={`text-slate-500 hover:text-white mb-6 ${
          activeButton === 'view' ? 'bg-slate-600 text-slate-300' : ''
        } p-2 rounded-full`}
      >
        <ViewColumnRoundedIcon />
      </button> */}

      {isAuthenticated ? <button onClick={handleLogout} className="text-slate-500 hover:text-white">
        <LogoutRoundedIcon />
      </button> : <Link to='/login'><button className="text-slate-500 hover:text-white">
        <LoginOutlinedIcon />
      </button></Link>}
    </div>
  );
};

export default SideNav;
