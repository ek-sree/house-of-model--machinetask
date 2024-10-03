import SideNavAdmin from '../../../components/Admin/Home/SideNavAdmin'
import Offer from '../../../components/Admin/Home/Offer'

const OfferPage = () => {
    return (
        <div className="bg-gradient-to-r from-slate-700 to-slate-900 min-h-screen p-3 flex">
        <SideNavAdmin/>
        <div className="flex-1 ml-2">
          
        <Offer/>
        </div>
    </div>
      )
}

export default OfferPage