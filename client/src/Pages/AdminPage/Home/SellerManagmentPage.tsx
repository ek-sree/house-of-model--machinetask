import SellerManagment from "../../../components/Admin/Home/SellerManagment"
import SideNavAdmin from "../../../components/Admin/Home/SideNavAdmin"

const SellerManagmentPage = () => {
  return (
    <div className="bg-gradient-to-r from-slate-700 to-slate-900 min-h-screen p-3 flex">
    <SideNavAdmin/>
    <div className="flex-1 ml-2">
      
    <SellerManagment/>
    </div>
</div>
  )
}

export default SellerManagmentPage