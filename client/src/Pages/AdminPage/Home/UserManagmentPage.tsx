import SideNavAdmin from '../../../components/Admin/Home/SideNavAdmin'
import UserManagment from '../../../components/Admin/Home/UserManagment'

const UserManagmentPage = () => {
  return (
    <div className="bg-gradient-to-r from-slate-700 to-slate-900 min-h-screen p-3 flex">
    <SideNavAdmin/>
    <div className="flex-1 ml-2">
      
    <UserManagment/>
    </div>
</div>
  )
}

export default UserManagmentPage