import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import { createUserAxios } from '../../../constraints/axios/userAxios';
import { userEndpoints } from '../../../constraints/endpoints/userEndpoints';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';
import { IProduct } from '../../../interface/ProductInterface/AddProduct';
import ProductCard from './ProductCard';

const ProductListCard = ({ sorting }: { sorting: string }) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const productsPerPage = 4;

  const searchQuery = useSelector((state: RootState) => state.search.searchQuery);
  const isSearching = useSelector((state: RootState) => state.search.isSearching);

  const userAxios = createUserAxios(null);

  async function fetchAllProduct(page: number, sorting: string, search: string) {
    setLoading(true);
    try {
      const response = await userAxios.get(`${userEndpoints.fetchAllProducts}?page=${page}&limit=${productsPerPage}&sort=${sorting}&search=${search}`);
      if (response.status === 200) {
        const newProducts = response.data.data;
        if (newProducts.length < productsPerPage) {
          setHasMore(false);
        }
        setProducts((prevProducts) => (page === 1 ? newProducts : [...prevProducts, ...newProducts]));
      }
    } catch (error) {
      console.log("Error occurred while fetching all products", error);
    } finally {
      setLoading(false);
    }
  }

  const handleShowMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    setProducts([]);
    setCurrentPage(1);
    setHasMore(true);
    fetchAllProduct(1, sorting, searchQuery);
  }, [sorting, searchQuery]);

  useEffect(() => {
    if (currentPage > 1) {
      fetchAllProduct(currentPage, sorting, searchQuery);
    }
  }, [currentPage]);

  return (
    <div className='relative'>
      {isSearching && (
        <h2 className="text-white text-xl sm:text-2xl mb-4 sm:mb-5">Search Results for "{searchQuery}"</h2>
      )}
      {products.length === 0 && isSearching ? (
        <p className="text-white text-lg">No products found for your search.</p>
      ) : (
        <div className='flex flex-wrap justify-center'>
          {products.map((product) => (
            <ProductCard key={product._id} products={product} />
          ))}
        </div>
      )}
      
      {hasMore && (
        <div className="flex justify-center mt-14 mb-10">
          <button
            onClick={handleShowMore}
            className='text-white border flex items-center px-8 sm:px-10 py-2 rounded shadow-md hover:bg-gray-100 transition-colors hover:text-black font-serif'
            disabled={loading} 
          >
            <AutoAwesomeOutlinedIcon className="mr-2" />
            {loading ? 'Loading...' : 'Shop More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductListCard;