import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../redux/slice/AuthSlice";
import HomeIcon from '@mui/icons-material/Home';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import AcUnitRoundedIcon from '@mui/icons-material/AcUnitRounded';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import { useNavigate, useLocation } from "react-router-dom";
import { RootState } from "../../../redux/store/store";
import { createSellerAxios } from "../../../constraints/axios/sellerAxios";
import { sellerEndpoints } from "../../../constraints/endpoints/sellerEndpoints";

const SellerSideNav = () => {

  const sellerAxios = createSellerAxios(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); 
  
  const isAuthenticated = useSelector((store: RootState) => store.Auth.isAuthenticated);

  const handleLogout = async () => {
    try {
      const response = await sellerAxios.post(sellerEndpoints.logout);
      if (response.status === 200) {
        dispatch(logout());
      }
    } catch (error) {
      console.log("Error logging out", error);
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
        onClick={() => handleButtonClick('/seller/home')}
        className={`text-slate-500 hover:text-white mb-6 ${
          isActive('/seller/home') ? 'bg-slate-600 text-slate-300' : ''
        } p-2 rounded-full`}
      >
        <HomeIcon />
      </button>

      <button
        onClick={() => handleButtonClick('/seller/products')}
        className={`text-slate-500 hover:text-white mb-6 ${
          isActive('/seller/products') ? 'bg-slate-600 text-slate-300' : ''
        } p-2 rounded-full`}
      >
        <AddCircleOutlinedIcon />
      </button>

      {isAuthenticated ? (
        <button onClick={handleLogout} className="text-slate-500 hover:text-white">
          <LogoutRoundedIcon />
        </button>
      ) : (
        <button
          onClick={() => handleButtonClick('/login')}
          className={`text-slate-500 hover:text-white ${
            isActive('/login') ? 'bg-slate-600 text-slate-300' : ''
          } p-2 rounded-full`}
        >
          <LoginOutlinedIcon />
        </button>
      )}
    </div>
  );
};

export default SellerSideNav;
