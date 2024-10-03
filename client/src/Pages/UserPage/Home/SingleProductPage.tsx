import Search from "../../../components/User/Home/Search"
import SideNav from "../../../components/User/Home/SideNav"
import SingleProduct from "../../../components/User/Home/SingleProduct"

const SingleProductPage = () => {
  return (
    <div className="bg-gradient-to-r from-slate-700 to-slate-900 min-h-screen p-3 flex">
    <SideNav/>
    <div className="flex-1 ml-2">
      
    <SingleProduct/>
    </div>
    <Search/>
</div>
  )
}

export default SingleProductPage