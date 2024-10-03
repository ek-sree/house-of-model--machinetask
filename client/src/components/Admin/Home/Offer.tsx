import React, { useEffect, useState } from 'react'
import { createAdminAxios } from '../../../constraints/axios/adminAxios';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import { toast, Toaster } from 'sonner';
import { IOffer } from '../../../interface/ProductInterface/IOffer';
import { adminEndpoints } from '../../../constraints/endpoints/adminEndpoints';
import AddOffer from './AddOffer';

const Offer = () => {
    const [IsModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [offer, setOffer] = useState<IOffer[]>([])
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(3); 
    const [totalPages, setTotalPages] = useState(0);

    const token = useSelector((state: RootState) => state.Auth.token);
    const adminAxios = createAdminAxios(token);

async function fetchOffer(page:number=1){
    try {
        const response = await adminAxios.get(`${adminEndpoints.getOffer}?page=${page}&limit=${limit}`);
        console.log("ressssss",response);
        setTotalPages(response.data.data.totalPages);
        setOffer(response.data.data)
    } catch (error) {
        console.log("Error occurred fetching offer users", error);
        toast.error("An error occurred, please try again later!!");
    }
}

    const handleBlock = async (offerId: string) => {
        try {
            const response = await adminAxios.put(`${adminEndpoints.blockOffer}/${offerId}`);
            if (response.status == 200) {
                setOffer((prevOff) =>
                    prevOff.map((off) =>
                        off._id === offerId ? { ...off, isStatus: !off.isStatus } : off
                    )
                );
                toast.success(response.data.message);
            }
        } catch (error) {
            console.log("Error occurred blocking users", error);
            toast.error("An error occurred, please try again later!!");
        }
    };

    const handleSuccess=(offer: IOffer)=>{
        setOffer(prev=> [...prev, offer])
        toast.success("Category created")
    }


    useEffect(()=>{
        fetchOffer(currentPage)
    },[currentPage])

      const handleOpenModal = ()=>{
        setIsModalOpen(true)
      }


      const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

  return (
    <div className='bg-gradient-to-b from-black to-slate-900 rounded-lg min-h-[710px]'>
        <Toaster position="top-center" expand={false} richColors/>
        <div className='text-4xl font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent pl-8 pt-7 justify-center flex'>
          Offer Page
        </div>
  
        <div className="flex justify-end mr-10 mt-4">
          <button onClick={handleOpenModal} className="bg-fuchsia-600 py-2 px-4 rounded-lg text-white font-medium">
            Add offer
          </button>
        </div>
  
        <div className="overflow-x-auto p-8 justify-center flex">
  <table className="table-auto w-1/2 text-left">
    <thead>
      <tr className="text-white bg-gray-800">
        <th className="p-3">Name</th>
        <th className="p-3">Image</th>
        <th className="p-3">Search Query</th>
        <th className="p-3">Category</th>
        <th className="p-3">Status</th>
        <th className="p-3">Actions</th>
      </tr>
    </thead>
    <tbody>
      {offer.length === 0 ? (
        <tr>
          <td colSpan={6} className="text-center p-4 text-slate-300">
            No offers added yet
          </td>
        </tr>
      ) : (
        offer.map((off) => (
          <tr key={off._id} className="bg-gray-700 text-slate-300">
            <td className="p-3 w-48">{off.name}</td>
            <td><img src={off.image} alt="image logo" className="w-20 rounded-full" /></td>
            <td className="p-3 w-40">{off.searchQuery}</td>
            <td className="p-3">{off.category}</td>
            <td className="p-3">{off.isStatus ? 'Active' : 'Blocked'}</td>
            <td className="p-3 flex gap-4">
              <button onClick={() => handleBlock(off._id)} className={`px-3 py-1 rounded-lg text-white ${off.isStatus ? 'bg-red-600' : 'bg-green-600'}`}>
                {off.isStatus ? 'Block' : 'Unblock'}
              </button>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>
<div className="flex justify-center mt-5">
                <button
                    className={`px-3 py-1 rounded-lg ${currentPage === 1 ? 'bg-gray-500' : 'bg-blue-500'}`}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span className="mx-3 text-white">Page {currentPage} of {totalPages}</span>
                <button
                    className={`px-3 py-1 rounded-lg ${currentPage === totalPages ? 'bg-gray-500' : 'bg-blue-500'}`}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        {
          IsModalOpen &&(
            <AddOffer
            isOpen={IsModalOpen}
            onClose={()=>setIsModalOpen(false)}
            onSuccess={handleSuccess}
            />
          )
        }
      </div>
  )
}

export default Offer