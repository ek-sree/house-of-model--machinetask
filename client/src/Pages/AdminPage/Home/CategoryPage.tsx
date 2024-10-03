import Category from "../../../components/Admin/Home/Category"
import SideNavAdmin from "../../../components/Admin/Home/SideNavAdmin"

const CategoryPage = () => {
  return (
    <div className="bg-gradient-to-r from-slate-700 to-slate-900 min-h-screen p-3 flex">
    <SideNavAdmin/>
    <div className="flex-1 ml-2">
      
    <Category/>
    </div>
</div>
  )
}

export default CategoryPage