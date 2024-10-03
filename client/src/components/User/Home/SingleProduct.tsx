import { useEffect, useState } from 'react';
import AcUnitRoundedIcon from '@mui/icons-material/AcUnitRounded';
import { useParams } from 'react-router-dom';
import { createUserAxios } from '../../../constraints/axios/userAxios';
import { userEndpoints } from '../../../constraints/endpoints/userEndpoints';
import { IProduct } from '../../../interface/ProductInterface/AddProduct';

const SingleProduct = () => {
  const [selectedImage, setSelectedImage] = useState('');
  const [activeTab, setActiveTab] = useState('Overview');
  const [product, setProduct] = useState<IProduct | null>(null); 

  const userAxios = createUserAxios(null);
  const { productId } = useParams();

  async function fetchSingleProduct(){
    try {
      const response = await userAxios.get(`${userEndpoints.fetchSingleProduct}/${productId}`);
      console.log("res", response);
      if(response.status == 200){
        const productData = response.data.data;
        setProduct(productData);

        if (productData.image && productData.image.length > 0) {
          setSelectedImage(productData.image[0]);
        }
      }
    } catch (error) {
      console.log("Error occurred while fetching single product", error);
    }
  }

  useEffect(() => {
    fetchSingleProduct();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row w-full overflow-hidden gap-4 lg:gap-2 p-4 lg:p-0">
      <div className='bg-gradient-to-b from-black to-slate-900 rounded-lg min-h-[710px] w-full lg:w-[980px] flex-shrink-0 p-4'>
        <p className="text-white text-xl lg:text-3xl pl-2 lg:pl-7 mb-6 mt-6 text-center lg:text-left">
          {product?.productName || "Product Name"}
        </p>
        
        <div className="flex flex-col lg:flex-row gap-4 lg:ml-32 lg:mt-16">
          <div className="flex flex-row lg:flex-col gap-2 justify-center lg:justify-start">
            {product?.image?.map((image, index) => (
              <img 
                key={index}
                src={image}
                alt={`sample-${index}`}
                className={`w-16 h-16 lg:w-20 lg:h-20 rounded-xl cursor-pointer hover:opacity-75 transition-opacity duration-200 ${
                  selectedImage === image ? 'border-4 border-blue-500' : 'border-2 border-transparent'
                }`}
                onClick={() => setSelectedImage(image)} 
              />
            ))}
          </div>

          <div className="flex justify-center lg:block">
            <img src={selectedImage} alt="Main product" className='w-[300px] h-[18rem] lg:w-[500px] lg:h-[28rem] rounded-xl object-cover' />
          </div>
        </div>
      </div>

      <div className='bg-black rounded-lg min-h-[710px] flex-grow p-4'>
        <div className="text-purple-600 mt-5 mb-6 justify-center flex"> 
          <AcUnitRoundedIcon fontSize="large" />
        </div>

        <p className="text-white text-2xl lg:text-3xl justify-center flex font-semibold">
          {product?.productName || "House of Model"}
        </p>

        <div className='text-white bg-slate-800 flex justify-evenly rounded-md mt-4 overflow-hidden'>
          <button 
            className={`flex-grow py-2 transition-colors duration-700 pr-2 ${
              activeTab === 'Overview' ? 'bg-white text-black' : 'bg-transparent'
            }`} 
            onClick={() => setActiveTab('Overview')}
          >
            Overview
          </button>

          <button 
            className={`flex-grow py-2 transition-colors duration-700 pr-2 ${
              activeTab === 'Specification' ? 'bg-white text-black' : 'bg-transparent'
            }`} 
            onClick={() => setActiveTab('Specification')}
          >
            Specification
          </button>

          <button 
            className={`flex-grow py-2 transition-colors duration-700 pr-2 ${
              activeTab === 'Reviews' ? 'bg-white text-black' : 'bg-transparent'
            }`} 
            onClick={() => setActiveTab('Reviews')}
          >
            Reviews
          </button>
        </div>

        {activeTab === 'Overview' && (
          <div>
            <h3 className='text-white text-xl font-semibold pt-6 font-serif'>Overview</h3>
            <p className='text-slate-400 pt-4 leading-loose'>
              {product?.productDescription || "No description available."}
            </p>
          </div>
        )}

        {activeTab === 'Specification' && (
          <div>
            <h3 className='text-white text-xl font-semibold pt-6 font-serif'>Specification</h3>
            <p className='text-slate-400 pt-4 leading-relaxed'>
              {product?.productSpecifications || "No specifications available."}
            </p>
          </div>
        )}

        {activeTab === 'Reviews' && (
          <div>
            <h3 className='text-white text-xl font-semibold pt-6 font-serif'>Reviews</h3>
            <h2 className='text-slate-300 pt-4'>Sreehari</h2>
            <p className='text-slate-500'>Nice dress, worth the money</p>
            <h2 className='text-slate-300 pt-4'>Aiswarya</h2>
            <p className='text-slate-500'>Highly recommended, good one</p>
          </div>
        )}

        <div className="flex justify-center lg:justify-start">
          <button className='bg-white py-2 px-6 lg:px-14 rounded-lg mt-9 font-medium'>
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
