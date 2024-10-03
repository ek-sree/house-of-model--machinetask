import SellerSideNav from "../../../components/Seller/Home/SellerSideNav"
import LandindSeller from "../../../components/Seller/Home/LandindSeller"

const LandingPage = () => {
  return (
    <div className="bg-gradient-to-r from-slate-700 to-slate-900 min-h-screen p-3 flex">
    <SellerSideNav/>
    <div className="flex-1 ml-2">
      
    <LandindSeller/>
    </div>
</div>
  )
}

export default LandingPage