import { FC, useEffect, useState } from "react";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { ErrorStates } from "../../../interface/SellerInterface/ErrorInterface";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { createSellerAxios } from "../../../constraints/axios/sellerAxios";
import { sellerEndpoints } from "../../../constraints/endpoints/sellerEndpoints";
import { toast, Toaster } from "sonner";
import CircularProgress from '@mui/material/CircularProgress';
import { IProduct } from "../../../interface/ProductInterface/AddProduct";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess:(Product:IProduct)=>void;
}

const AddProductModal: FC<AddProductModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [productName, setProductName] = useState("");
  const [productShorts, setProductShorts] = useState("");
  const [productPrice, setProductPrice] = useState<number | string>("");
  const [productDescription, setProductDescription] = useState("");
  const [productSpecifications, setProductSpecifications] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(""); 
  const [categories, setCategories] = useState<{ _id: string; categoryName: string }[]>([]);
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [productStock, setProductStock] = useState<number | string>("")
  const [loading, setLoading] = useState<boolean>(false);
  const maxShortLength = 50; 
  const [errors, setErrors] = useState<ErrorStates>({
    productName: "",
    productShorts: "",
    productPrice: "",
    productDescription: "",
    productSpecifications: "",
    images: "",
    category:'',
     companyLogo: "",
     productStock:""
  });

  const token = useSelector((store: RootState) => store.Auth.token);
  const sellerId = useSelector((store: RootState)=>store.Auth.authdata?._id);
  const sellerAxios = createSellerAxios(token);

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors: ErrorStates = {
      productName: "",
      productShorts: "",
      productPrice: "",
      productDescription: "",
      productSpecifications: "",
      images: "",
      category:"",
       companyLogo: "",
       productStock:''
    };

    if (!productName.trim()) {
      newErrors.productName = "Product name is required";
      isValid = false;
    }

    if (!productShorts.trim()) {
      newErrors.productShorts = "Product shorts is required";
      isValid = false;
    }

    if (!productPrice) {
      newErrors.productPrice = "Product price is required";
      isValid = false;
    }

    if (!productStock) {
      newErrors.productStock = "Product stock is required";
      isValid = false;
    }

    if (!productDescription.trim()) {
      newErrors.productDescription = "Product description is required";
      isValid = false;
    }

    if (!productSpecifications.trim()) {
      newErrors.productSpecifications = "Product specifications are required";
      isValid = false;
    }

    if (images.length < 1) {
      newErrors.images = "At least 1 image is required";
      isValid = false;
    } else if (images.length > 4) {
      newErrors.images = "Maximum 4 images are allowed";
      isValid = false;
    }

    if (!selectedCategory) { 
      newErrors.category = "Category is required";
      isValid = false;
    }

    if (!companyLogo) {
      newErrors.companyLogo = "Company logo is required"; 
      isValid = false;
    }


    setErrors(newErrors);
    return isValid;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const newImages = [...images, ...selectedFiles];

      if (newImages.length > 4) {
        setErrors(prev => ({ ...prev, images: "Maximum 4 images are allowed" }));
      } else {
        setImages(newImages);
        setErrors(prev => ({ ...prev, images: "" }));
      }
    }
  };


  const handleCompanyLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setCompanyLogo(file); 
      setErrors(prev => ({ ...prev, companyLogo: "" }));
    }
  };


  async function fetchCategory(){
    try {
      const response = await sellerAxios.get(sellerEndpoints.getCategory);
            console.log(response);
            if(response.status==200){
              setCategories(response.data.data)
            }
    } catch (error) {
      console.log("Error while fetching category",error);
      
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      if(!sellerId){
        toast.error("Some credientials are missing, please login again")
        return
      }
      if (validateForm()) {
        const formData = new FormData();

        formData.append('productName', productName);
        formData.append('productShorts', productShorts);
        formData.append('productPrice', productPrice.toString());
        formData.append('productStock', productStock.toString());
        formData.append('productDescription', productDescription);
        formData.append('productSpecifications', productSpecifications);
        formData.append('category', selectedCategory);
        if (companyLogo) {
          formData.append('companyLogo', companyLogo); 
        }
        images.forEach((image) => {
          formData.append('images', image);
        });

        const response = await sellerAxios.post(`${sellerEndpoints.addProduct}?sellerId=${sellerId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(response);
        
        if (response.status === 201) {
          onSuccess(response.data.data)
          toast.success("Product added successfully!");
          onClose();
        }
      }
    } catch (error) {
      console.log("Error occurred while uploading product", error);
      toast.error("Can't add product now, something happened!");
    }finally{
      setLoading(false)
    }
  };

  const handleProductShortsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= maxShortLength) {
      setProductShorts(value);
    }
  };

  useEffect(()=>{
    fetchCategory()
  },[isOpen])

  useEffect(() => {
    return () => {
      if (companyLogo) URL.revokeObjectURL(companyLogo);
      images.forEach(image => URL.revokeObjectURL(image));
    };
  }, [images]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <Toaster expand={false} position="top-center" richColors />
      <div className="w-full max-w-2xl bg-gradient-to-br from-purple-500 to-indigo-600 p-8 rounded-lg shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">Add Product</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
            <CloseOutlinedIcon fontSize="large" />
          </button>
        </div>

        <div className="custom-scrollbar overflow-y-auto max-h-[65vh] pr-4">
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white mb-1">Product Name*</label>
              <input
                type="text"
                className="w-full p-3 bg-white bg-opacity-20 rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
                placeholder="Enter product name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
              {errors.productName && <p className="mt-1 text-red-300 text-sm">{errors.productName}</p>}
            </div>


            <div>
              <label htmlFor="companyLogo" className="block text-sm font-medium text-white mb-1">Company Logo*</label>
              <input
                type="file"
                className="w-full p-3 bg-white bg-opacity-20 rounded-md text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-white file:text-purple-700 hover:file:bg-gray-100"
                onChange={handleCompanyLogoChange}
              />
              {errors.companyLogo && <p className="mt-1 text-red-300 text-sm">{errors.companyLogo}</p>}
              {companyLogo && (
                <div className="mt-2">
                  <h4 className="text-sm font-medium text-white mb-2">Selected Company Logo:</h4>
                  <img
                    src={URL.createObjectURL(companyLogo)}
                    alt="company-logo"
                    className="h-20 w-20 object-cover rounded-md"
                  />
                </div>
              )}
            </div>


            <div>
              <label htmlFor="category" className="block text-sm font-medium text-white mb-1">Category</label>
              <select
                className="w-full p-3 bg-gradient-to-br from-purple-500 to-indigo-600 bg-opacity-20 rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="" className="bg-slate-800 text-white">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id} className="bg-slate-600 text-white">
                    {category.categoryName}
                  </option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-red-300 text-sm">{errors.category}</p>}
            </div>

            <div>
        <label htmlFor="shorts" className="block text-sm font-medium text-white mb-1">
          Product Shorts* (Max {maxShortLength} characters)
        </label>
        <input
          type="text"
          className="w-full p-3 bg-white bg-opacity-20 rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
          placeholder="Short description"
          value={productShorts}
          onChange={handleProductShortsChange}
        />
        <p className="mt-1 text-red-600 text-sm">
          {maxShortLength - productShorts.length} <span className="text-white"> characters remaining</span>
        </p>
        {errors.productShorts && <p className="mt-1 text-red-300 text-sm">{errors.productShorts}</p>}
      </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-white mb-1">Product Price*</label>
              <input
                type="number"
                className="w-full p-3 bg-white bg-opacity-20 rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
                placeholder="Enter price"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
              />
              {errors.productPrice && <p className="mt-1 text-red-300 text-sm">{errors.productPrice}</p>}
            </div>


            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-white mb-1">Product Stock*</label>
              <input
                type="number"
                className="w-full p-3 bg-white bg-opacity-20 rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
                placeholder="Enter stock"
                value={productStock}
                onChange={(e) => setProductStock(e.target.value)}
              />
              {errors.productPrice && <p className="mt-1 text-red-300 text-sm">{errors.productStock}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-white mb-1">Product Description*</label>
              <textarea
                className="w-full p-3 bg-white bg-opacity-20 rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
                placeholder="Detailed description"
                rows={4}
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
              />
              {errors.productDescription && <p className="mt-1 text-red-300 text-sm">{errors.productDescription}</p>}
            </div>

            <div>
              <label htmlFor="specifications" className="block text-sm font-medium text-white mb-1">Product Specifications*</label>
              <textarea
                className="w-full p-3 bg-white bg-opacity-20 rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
                placeholder="Product specifications"
                rows={4}
                value={productSpecifications}
                onChange={(e) => setProductSpecifications(e.target.value)}
              />
              {errors.productSpecifications && <p className="mt-1 text-red-300 text-sm">{errors.productSpecifications}</p>}
            </div>

            
            <div>
              <label htmlFor="images" className="block text-sm font-medium text-white mb-1">Upload Images* (Min & Max 4)</label>
              <input
                type="file"
                multiple
                className="w-full p-3 bg-white bg-opacity-20 rounded-md text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-white file:text-purple-700 hover:file:bg-gray-100"
                onChange={handleImageChange}
              />
              {errors.images && <p className="mt-1 text-red-300 text-sm">{errors.images}</p>}
              {images.length > 0 && (
                <div className="mt-2">
                  <h4 className="text-sm font-medium text-white mb-2">Selected Images: {images.length}/4</h4>
                  <div className="flex flex-wrap gap-2">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`image-${index}`}
                          className="h-20 w-20 object-cover rounded-md"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                          <button
                            className="text-white text-xs"
                            onClick={() => {
                              setImages(images.filter((_, i) => i !== index));
                              setErrors(prev => ({ ...prev, images: "" }));
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-white bg-opacity-20 text-white rounded-md hover:bg-opacity-30 transition-colors flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} className="text-white" /> 
                ) : (
                  "Add Product"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
