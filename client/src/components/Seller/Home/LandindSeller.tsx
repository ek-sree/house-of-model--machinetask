import { useSelector } from "react-redux"
import { RootState } from "../../../redux/store/store"

const LandindSeller = () => {

  const userName = useSelector((store:RootState)=>store.Auth.authdata?.userName)
  const isAuthenticated = useSelector((store:RootState)=>store.Auth.isAuthenticated)

  return (
    <div className='bg-gradient-to-b from-black to-slate-900 rounded-lg min-h-[710px]'>
    <div className='text-4xl font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent pl-8 pt-7'>
        Hello, {userName}</div>: <div className='text-5xl font-bold bg-gradient-to-r from-fuchsia-500 to-violet-700 bg-clip-text text-transparent pl-8 pt-7'>
        Your are {isAuthenticated ? 'online now' : 'offline now'}..</div>
        <p className='text-slate-400 text-4xl pl-8 pt-4'>How Can i help you today?</p>
        <div>
        </div>
        
</div>
  )
}

export default LandindSeller