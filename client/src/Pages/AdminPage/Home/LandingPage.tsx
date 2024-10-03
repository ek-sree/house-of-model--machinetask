import Landing from "../../../components/Admin/Home/Landing"
import SideNavAdmin from "../../../components/Admin/Home/SideNavAdmin"

const LandingPage = () => {
  return (
    <div className="bg-gradient-to-r from-slate-700 to-slate-900 min-h-screen p-3 flex">
    <SideNavAdmin/>
    <div className="flex-1 ml-2">
      
    <Landing/>
    </div>
</div>
  )
}

export default LandingPage