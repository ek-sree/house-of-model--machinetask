import { Route, Routes } from "react-router-dom"
import SignupPage from "../Pages/UserPage/Auth/SignupPage"
import LoginPage from "../Pages/UserPage/Auth/LoginPage"
import OtpPage from "../Pages/UserPage/Auth/OtpPage"
import LandingPage from "../Pages/UserPage/Home/LandingPage"
import ProductListPage from "../Pages/UserPage/Home/ProductListPage"
import SingleProductPage from "../Pages/UserPage/Home/SingleProductPage"


const UserRouter = () => {
  return (
    <Routes>
      {/* <Route element={<PrivateRouter/>}>
      </Route> */}

      {/* <Route element={<PublicRouter/>}> */}
        <Route path="/otp" element={<OtpPage/>}/>
        <Route path="/signup" element={<SignupPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/product-list" element={<ProductListPage/>}/>
        <Route path="/single-product/:productId" element={<SingleProductPage/>}/>
      {/* </Route> */}
    </Routes>
  )
}

export default UserRouter