import { FC, useState } from 'react';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { toast, Toaster } from 'sonner';
import {  createAdminAxios } from '../../../constraints/axios/adminAxios';
import { adminEndpoints } from '../../../constraints/endpoints/adminEndpoints';
import { ICategory } from '../../../interface/ProductInterface/CategoryInterface';
import { RootState } from '../../../redux/store/store';
import { useSelector } from 'react-redux';


interface ErrorCategory{
    categoryName:string
}


interface CategoryProps{
    isOpen:boolean;
    onClose:()=>void;
    onSuccess:(category:ICategory)=>void
}


const AddCategoryModal: FC<CategoryProps> = ({isOpen, onClose, onSuccess}) => {
    const [categoryName, setCategoryName] = useState<string>('')
    const [errors, setErrors] = useState<ErrorCategory>({categoryName: "",});

    const token = useSelector((state: RootState) => state.Auth.token);
    const adminAxios = createAdminAxios(token);

    const validateForm = (): boolean => {
        let isValid = true;
        const newErrors: ErrorCategory = {
            categoryName: "",
        };
    
    const onlyAlphabets = /^[A-Za-z\s]+$/;

    if (!categoryName.trim()) {
      newErrors.categoryName = "Category name is required";
      isValid = false;
    } else if (!onlyAlphabets.test(categoryName)) {
      newErrors.categoryName = "Category name should contain only alphabets";
      isValid = false;
    }
        setErrors(newErrors);
        return isValid;
      };


    const handleSubmit = async() => {
        try {
            if (validateForm()) {
                console.log('ffff',categoryName);
                
            const response = await adminAxios.post(adminEndpoints.addCategory, {categoryName,
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
        }
       
      };

      if(!isOpen) return null
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <Toaster position='top-center' richColors expand={false}/>
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
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
              {errors.categoryName && <p className="mt-1 text-red-300 text-sm">{errors.categoryName}</p>}
            </div>   
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-white text-purple-700 p-3 rounded-md font-semibold hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-500"
        >
          Submit Product
        </button>
      </div>
    </div>
  )
}

export default AddCategoryModal