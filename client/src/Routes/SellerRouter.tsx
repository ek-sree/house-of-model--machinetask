import { Route, Routes } from "react-router-dom"
import LandingPage from "../Pages/SellerPage/Home/LandingPage"
import ProductsPage from "../Pages/SellerPage/Home/ProductsPage"
import PrivateRouter from "../utils/Seller/PrivateRouter"

const SellerRouter = () => {
  return (
    <Routes>
      <Route element={<PrivateRouter/>}>
        <Route path="/home" element={<LandingPage/>}/>
        <Route path="/products" element={<ProductsPage/>}/>
      </Route>
    </Routes>
  )
}

export default SellerRouter