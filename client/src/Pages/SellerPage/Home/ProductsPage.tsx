import Products from "../../../components/Seller/Home/Products"
import SellerSideNav from "../../../components/Seller/Home/SellerSideNav"

const ProductsPage = () => {
  return (
    <div className="bg-gradient-to-r from-slate-700 to-slate-900 min-h-screen p-3 flex">
    <SellerSideNav/>
    <div className="flex-1 ml-2">
      
    <Products/>
    </div>
</div>
  )
}

export default ProductsPage