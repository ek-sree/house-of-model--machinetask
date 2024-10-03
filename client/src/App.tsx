import { Route, Routes } from 'react-router-dom';
import UserRouter from './Routes/UserRouter'
import SellerRouter from './Routes/SellerRouter';
import AdminRouter from './Routes/AdminRouter';

function App() {
  
  return (
    <Routes>
      <Route path='/*' element={<UserRouter/>}/>
      <Route path='/seller/*' element={<SellerRouter/>}/>
      <Route path='/admin/*' element={<AdminRouter/>}/>
    </Routes>
  )
}

export default App
