import Home from "../../../components/User/Home/Home"
import Search from "../../../components/User/Home/Search"
import SideNav from "../../../components/User/Home/SideNav"

const LandingPage = () => {
  return (
    <div className="bg-gradient-to-r from-slate-700 to-slate-900 min-h-screen p-3 flex">
        <SideNav/>
        <div className="flex-1 ml-2">
          
        <Home/>
        </div>
        <Search/>
    </div>
  )
}

export default LandingPage