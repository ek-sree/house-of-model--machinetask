import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { createAdminAxios } from "../../../constraints/axios/adminAxios";
import { adminEndpoints } from "../../../constraints/endpoints/adminEndpoints";
import { logout } from "../../../redux/slice/AuthSlice";
import HomeIcon from '@mui/icons-material/Home';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import AcUnitRoundedIcon from '@mui/icons-material/AcUnitRounded';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import PersonRemoveOutlinedIcon from '@mui/icons-material/PersonRemoveOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { Link, useLocation, useNavigate } from "react-router-dom";
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';



const SideNavAdmin = () => {

    const token = useSelector((state: RootState) => state.Auth.token);
    const adminAxios = createAdminAxios(token);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); 


  const isAuthenticated = useSelector((store:RootState)=> store.Auth.isAuthenticated)

  const handleLogout = async() => {
    try {
      const response = await adminAxios.post(adminEndpoints.logout);
      console.log("res",response);
      
      if(response.status==200){
        dispatch(logout());
      }
    } catch (error) {
      console.log("Error logouting",error);
      
    }
    
  };

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
        onClick={() => handleButtonClick('/admin/dashboard')}
        className={`text-slate-500 hover:text-white mb-6 ${
            isActive('/admin/dashboard') ? 'bg-slate-600 text-slate-300' : ''
        } p-2 rounded-full`}
      >
        <HomeIcon />
      </button>

      <button
        onClick={() => handleButtonClick('/admin/category')}
        className={`text-slate-500 hover:text-white mb-6 ${
            isActive('/admin/category') ? 'bg-slate-600 text-slate-300' : ''
        } p-2 rounded-full`}
      >
        <CategoryOutlinedIcon />
      </button>


      <button
        onClick={() => handleButtonClick('/admin/offer')}
        className={`text-slate-500 hover:text-white mb-6 ${
            isActive('/admin/offer') ? 'bg-slate-600 text-slate-300' : ''
        } p-2 rounded-full`}
      >
        <LocalOfferOutlinedIcon />
      </button>


      <button
        onClick={() => handleButtonClick('/admin/usermanagment')}
        className={`text-slate-500 hover:text-white mb-6 ${
            isActive('/admin/usermanagment') ? 'bg-slate-600 text-slate-300' : ''
        } p-2 rounded-full`}
      >
        <PersonOutlineOutlinedIcon />
      </button>

      <button
        onClick={() => handleButtonClick('/admin/sellermanagment')}
        className={`text-slate-500 hover:text-white mb-6 ${
            isActive('/admin/sellermanagment') ? 'bg-slate-600 text-slate-300' : ''
        } p-2 rounded-full`}
      >
        <PersonRemoveOutlinedIcon />
      </button>

      {isAuthenticated ? <button onClick={handleLogout} className="text-slate-500 hover:text-white">
        <LogoutRoundedIcon />
      </button> : <Link to='/admin/'><button className="text-slate-500 hover:text-white">
        <LoginOutlinedIcon />
      </button></Link>}
    </div>
  );
}

export default SideNavAdmin