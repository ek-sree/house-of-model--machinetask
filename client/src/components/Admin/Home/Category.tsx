import { useEffect, useState } from "react";
import AddCategoryModal from "./AddCategoryModal";
import {  createAdminAxios } from "../../../constraints/axios/adminAxios";
import { adminEndpoints } from "../../../constraints/endpoints/adminEndpoints";
import { ICategory } from "../../../interface/ProductInterface/CategoryInterface";
import { toast, Toaster } from "sonner";
import { RootState } from "../../../redux/store/store";
import { useSelector } from "react-redux";

const Category = () => {

    const [IsModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [category, setCategory] = useState<ICategory[]>([])

    const token = useSelector((state: RootState) => state.Auth.token);
    const adminAxios = createAdminAxios(token);

    async function fetchCategory(){
        try {
            const response = await adminAxios.get(adminEndpoints.fetchCategory);
            console.log(response);
            if(response.status==200){
                setCategory(response.data.data)
            }
            
        } catch (error : any) {
            const errorMessage = error?.response?.data?.data?.message;
            toast.error(errorMessage)
           console.log("Error fetching category",error);
        }
    }

    const handleBlock = async (categoryId: string) => {
        try {
            const response = await adminAxios.put(`${adminEndpoints.blockCategory}/${categoryId}`);
            if (response.status == 200) {
                setCategory((prevUsers) =>
                    prevUsers.map((categ) =>
                        categ._id === categoryId ? { ...categ, isStatus: !categ.isStatus } : categ
                    )
                );
                toast.success(response.data.message);
            }
        } catch (error) {
            console.log("Error occurred blocking users", error);
            toast.error("An error occurred, please try again later!!");
        }
    };

    const handleSuccess=(category: ICategory)=>{
        setCategory(prev=> [...prev, category])
        toast.success("Category created")
    }


    useEffect(()=>{
        fetchCategory()
    },[])

      const handleOpenModal = ()=>{
        setIsModalOpen(true)
      }

  return (
    <div className='bg-gradient-to-b from-black to-slate-900 rounded-lg min-h-[710px]'>
        <Toaster position="top-center" expand={false} richColors/>
        <div className='text-4xl font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent pl-8 pt-7 justify-center flex'>
          Category
        </div>
  
        <div className="flex justify-end mr-10 mt-4">
          <button onClick={handleOpenModal} className="bg-fuchsia-600 py-2 px-4 rounded-lg text-white font-medium">
            Add Category
          </button>
        </div>
  
        <div className="overflow-x-auto p-8 justify-center flex">
        <table className="table-auto w-1/2 text-left">
            <thead>
              <tr className="text-white bg-gray-800">
                <th className="p-3">Name</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {category.map((categ) => (
                <tr key={categ._id} className="bg-gray-700 text-slate-300">
                  <td className="p-3">{categ.categoryName}</td>
                  <td className="p-3">{categ.isStatus ? 'Active': 'Blocked'}</td>
                  <td className="p-3 flex gap-4">
                    <button onClick={()=>handleBlock(categ._id)}  className={`px-3 py-1 rounded-lg text-white ${categ.isStatus ? 'bg-red-600' : 'bg-green-600'}`}>
                      {categ.isStatus ? 'Block':'Unblock'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {
          IsModalOpen &&(
            <AddCategoryModal 
            isOpen={IsModalOpen}
            onClose={()=>setIsModalOpen(false)}
            onSuccess={handleSuccess}
            />
          )
        }
      </div>
  )
}

export default Category