import { Star, IndianRupee } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 
import { FC } from 'react';
import { IProduct } from '../../../interface/ProductInterface/AddProduct';


interface ProductCardProps {
  products: IProduct;
}

const ProductCard: FC<ProductCardProps> = ({ products }) => {
  const navigate = useNavigate();

  const handleShopNow = () => {
    navigate(`/single-product/${products._id}`); 
  };

  return (
    <div className='text-white w-full sm:w-64 max-w-sm ml-4 mt-7 relative hover:scale-105 transition-transform duration-500'>
      <img
        src={products.companyLogo}
        alt="Brand logo"
        className="w-11 h-9 rounded-full absolute left-2 top-2 z-10"
      />
      <div className="relative">
        <img
          src={products.image[0]}
          alt="Product"
          className="w-full h-64 sm:h-80 object-cover rounded-xl"
        />
        <div className='absolute bottom-2 left-2 right-2 p-2 rounded'>
          <span className="bg-slate-100 text-black text-xs px-2 py-1 rounded-xl flex items-center gap-1 mb-2 w-fit">
            4.6 <Star className="w-3 h-3" />
          </span>
          <p className='text-slate-100 font-normal text-sm'>{products.productName}</p>
          <p className='text-base mt-1'>{products.productShorts}</p>
          <div className='flex justify-between items-center mt-2'>
            <p className='flex items-center text-xl sm:text-2xl font-medium'>
              <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 font-bold" />{products.productPrice}
            </p>
            <button onClick={handleShopNow} className='bg-slate-300 bg-opacity-50 text-white px-2 sm:px-3 py-1 rounded-xl hover:bg-slate-200 hover:text-black transition-colors'>
              Shop Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
