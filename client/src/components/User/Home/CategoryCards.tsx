import { useEffect, useState } from 'react';
import { createUserAxios } from '../../../constraints/axios/userAxios';
import { userEndpoints } from '../../../constraints/endpoints/userEndpoints';
import { IOffer } from '../../../interface/ProductInterface/IOffer';
import { useDispatch } from 'react-redux';
import { initiateSearch, setSearchQuery } from '../../../redux/slice/SearchSlice';
import { useNavigate } from 'react-router-dom';

const CategoryCards = () => {

  const [offer, setOffer] = useState<IOffer[]>([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userAxios = createUserAxios(null);

  async function fetchOffer(){
    try {
      const response = await userAxios.get(userEndpoints.getOfferUser);
      console.log(response);
      if(response.status==200){
        setOffer(response.data.data)
      }
    } catch (error) {
      console.log("Error while fetching offer Card",error);
      
    }
  }

  useEffect(()=>{
    fetchOffer()
  },[])

  const handleOfferClick=(searchQuery:string)=>{
    dispatch(setSearchQuery(searchQuery))
    dispatch(initiateSearch());
    navigate('/product-list')
  }

  return (
    <div className='flex flex-wrap gap-4 justify-center sm:justify-start cursor-pointer px-4'>
     
      {offer.map((off)=>(

      <div key={off._id} onClick={() => handleOfferClick(off.searchQuery)} className="relative w-full sm:w-64 h-40 bg-gray-800 rounded-lg mt-6 hover:scale-105 transition-transform duration-500">
        <p className="text-white font-medium p-2">{off.name}</p>
        <div className='absolute bottom-3 right-3 bg-black p-1 rounded-full border-2 border-black'>
          <img
            src={off.image}
            alt="icon"
            className="w-5 h-5 filter invert rounded-full"
          />
        </div>
      </div>))}
    </div>
  );
};

export default CategoryCards;
