import { FC, useEffect, useState } from "react";
import { RootState } from "../../../redux/store/store";
import { useSelector } from "react-redux";
import { createAdminAxios } from "../../../constraints/axios/adminAxios";
import { toast, Toaster } from "sonner";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { IOffer } from "../../../interface/ProductInterface/IOffer";
import CircularProgress from '@mui/material/CircularProgress';
import { adminEndpoints } from "../../../constraints/endpoints/adminEndpoints";




interface ErrorOffer{
    name:string;
    image:string;
    searchQuery:string;
    category:string;
}


interface OfferProps{
    isOpen:boolean;
    onClose:()=>void;
    onSuccess:(offer:IOffer)=>void
}

const AddOffer:FC<OfferProps> = ({isOpen, onClose, onSuccess}) => {
    const [offer, setOffer] = useState<string>('')
    const [image, setImage] = useState<File | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [category, setCategory] = useState<string>('')
    const [categories, setCategories] = useState<{ _id: string; categoryName: string }[]>([]);
    const [loading, setLoading] = useState<boolean>(false)
    const [errors, setErrors] = useState<ErrorOffer>({name: "",
        image:'',
        searchQuery:'',
        category:''
    });

    const token = useSelector((state: RootState) => state.Auth.token);
    const adminAxios = createAdminAxios(token);

    const validateForm = (): boolean => {
        let isValid = true;
        const newErrors: ErrorOffer = {
            name: "",
            image:'',
            searchQuery:'',
            category:''
        };
    

    if (!offer.trim()) {
      newErrors.name = "Offer name is required";
      isValid = false;
    }
    if(!searchQuery.trim()){
        newErrors.searchQuery='Search query is required';
        isValid = false
    }
    if (!image) {
        newErrors.image = "Company logo is required"; 
        isValid = false;
      }
    if(!category.trim()){
        newErrors.category='Category is required';
        isValid=false;
    }
        setErrors(newErrors);
        return isValid;
      };


      async function getCategory(){
        try {
            const response = await adminAxios.get(adminEndpoints.fetchCategory)
            setCategories(response.data.data)
        } catch (error:any) {
            console.log("Error while fetching category",error);
            const errorMessage = error?.response?.data?.data;
            toast.error(errorMessage)
        }
      }


    const handleSubmit = async() => {
        setLoading(true)
        try {
            if (validateForm()) {
                const formData = new FormData();

                formData.append('name', offer);
                formData.append('searchQuery', searchQuery);
                formData.append('category', category)
                if (image) {
                  formData.append('image', image); 
                }
            const response = await adminAxios.post(adminEndpoints.addOffer,formData,  {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
            });
            console.log("res ca",response);
            
            if(response.status==201){
                onSuccess(response.data.data)
                onClose()
            }
        } 
            }  catch (error : any) {
            const errorMessage = error?.response?.data?.message || "Error occured";
            toast.error(errorMessage)
            console.log("Error occured while adding category",error);
        }finally{
            setLoading(false)
        }
       
      };

      const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
          const file = e.target.files[0];
          setImage(file); 
          setErrors(prev => ({ ...prev, companyLogo: "" }));
        }
      };



      useEffect(()=>{
        getCategory()
      },[isOpen])


      if(!isOpen) return null
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
            <label htmlFor="name" className="block text-sm font-medium text-white mb-1">Offer Name*</label>
            <input
              type="text"
              className="w-full p-3 bg-white bg-opacity-20 rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Enter product name"
              value={offer}
              onChange={(e) => setOffer(e.target.value)}
            />
            {errors.name && <p className="mt-1 text-red-300 text-sm">{errors.name}</p>}
          </div>


          <div>
            <label htmlFor="image" className="block text-sm font-medium text-white mb-1">Image Logo*</label>
            <input
              type="file"
              className="w-full p-3 bg-white bg-opacity-20 rounded-md text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-white file:text-purple-700 hover:file:bg-gray-100"
              onChange={handleImage}
            />
            {errors.image && <p className="mt-1 text-red-300 text-sm">{errors.image}</p>}
            {image && (
              <div className="mt-2">
                <h4 className="text-sm font-medium text-white mb-2">Selected image Logo:</h4>
                <img
                  src={URL.createObjectURL(image)}
                  alt="image"
                  className="h-20 w-20 object-cover rounded-md"
                />
              </div>
            )}
          </div>


          <div>
            <label htmlFor="category" className="block text-sm font-medium text-white mb-1">SearchQuery</label>
            <select
              className="w-full p-3 bg-gradient-to-br from-purple-500 to-indigo-600 bg-opacity-20 rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="" className="bg-slate-800 text-white">Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category.categoryName} className="bg-slate-600 text-white">
                  {category.categoryName}
                </option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-red-300 text-sm">{errors.category}</p>}
          </div>

          <div>
      <label htmlFor="shorts" className="block text-sm font-medium text-white mb-1">
        SearchQuery*
      </label>
      <input
        type="text"
        className="w-full p-3 bg-white bg-opacity-20 rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
        placeholder="Short description"
        value={searchQuery}
        onChange={(e)=> setSearchQuery(e.target.value)}
      />
      {errors.searchQuery && <p className="mt-1 text-red-300 text-sm">{errors.searchQuery}</p>}
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
  )
}

export default AddOffer