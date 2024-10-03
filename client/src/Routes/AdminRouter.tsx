import { Route, Routes } from 'react-router-dom'
import LoginPage from '../Pages/AdminPage/Auth/LoginPage'
import LandingPage from '../Pages/AdminPage/Home/LandingPage'
import CategoryPage from '../Pages/AdminPage/Home/CategoryPage'
import UserManagmentPage from '../Pages/AdminPage/Home/UserManagmentPage'
import SellerManagmentPage from '../Pages/AdminPage/Home/SellerManagmentPage'
import PublicRouter from '../utils/Admin/PublicRouter'
import PrivateRouter from '../utils/Admin/PrivateRouter'
import OfferPage from '../Pages/AdminPage/Home/OfferPage'

const AdminRouter = () => {
  return (
    <Routes>
      <Route element={<PublicRouter/>}> 
        <Route path="/" element={<LoginPage/>}/>
      </Route>


    <Route element={<PrivateRouter/>}>
       <Route path='/dashboard' element={<LandingPage/>}/>
       <Route path='/category' element={<CategoryPage/>}/>
       <Route path='/usermanagment' element={<UserManagmentPage/>}/>
       <Route path='/sellermanagment' element={<SellerManagmentPage/>}/>
       <Route path='/offer' element={<OfferPage/>}/>
    </Route>
</Routes>
  )
}

export default AdminRouter