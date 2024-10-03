import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import { setSearchQuery, initiateSearch } from '../../../redux/slice/SearchSlice';

const Search: React.FC = () => {
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch = () => {
    dispatch(setSearchQuery(localSearchQuery));
    dispatch(initiateSearch());
    navigate('/product-list'); 
  };

  return (
    <div className="bg-black w-[64%] right-5 md:w-[40%] h-12 rounded-3xl fixed md:bottom-4 md:left-1/2 md:transform md:-translate-x-1/2 z-10 flex items-center border border-gray-500">
      <AddCircleOutlineOutlinedIcon className='text-gray-400 ml-2' />
      <input
        type="text"
        placeholder="Ask me anything"
        className="w-full h-full pl-2 bg-transparent text-white outline-none"
        value={localSearchQuery}
        onChange={(e) => setLocalSearchQuery(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
      />
      <button 
        className='flex items-center text-black bg-white h-9 md:px-3 mr-2 rounded-3xl'
        onClick={handleSearch}
      >
        <AutoAwesomeOutlinedIcon className='mr-1 sm:text-sm' />
        Shop
      </button>
    </div>
  );
};

export default Search;