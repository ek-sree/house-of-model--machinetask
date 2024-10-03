import { useState } from 'react';
import ProductListCard from './ProductListCard';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';

const ProductList = () => {
  const [sorting, setSorting] = useState('recommended'); 

  const searchQuery = useSelector((state: RootState) => state.search.searchQuery);


  return (
    <div className='bg-gradient-to-b from-black to-slate-900 rounded-lg min-h-[710px]'>
      <div className="p-4 sm:p-6 md:p-8 lg:p-10">
        <p className="text-white text-xl sm:text-2xl mb-4 sm:mb-5">List of Black T-shirt</p>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button
            className={`bg-gray-900 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base font-medium hover:bg-gray-800 transition-colors ${sorting === 'recommended' ? 'text-white bg-slate-500' : 'text-slate-300'}`}
            onClick={() => setSorting('recommended')}
          >
            Recommended
          </button>
          <button
            className={`bg-gray-900 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base font-medium hover:bg-gray-800 transition-colors ${sorting === 'lowPrice' ? 'text-white bg-slate-500' : 'text-slate-400'}`}
            onClick={() => setSorting('lowPrice')}
          >
            Low prices
          </button>
          <button
            className={`bg-gray-900 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base font-medium hover:bg-gray-800 transition-colors ${sorting === 'topRated' ? 'text-white bg-slate-500' : 'text-slate-500'}`}
            onClick={() => setSorting('topRated')}
          >
            Top rated
          </button>
        </div>
        <ProductListCard sorting={sorting} searchQuery={searchQuery} />
      </div>
    </div>
  );
};

export default ProductList;