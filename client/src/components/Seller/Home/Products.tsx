import { useEffect, useState } from "react";
import AddProductModal from "./AddProductModal";
import { IProduct } from "../../../interface/ProductInterface/AddProduct";
import { createSellerAxios } from "../../../constraints/axios/sellerAxios";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { sellerEndpoints } from "../../../constraints/endpoints/sellerEndpoints";
import { toast, Toaster } from "sonner";
import EditProductModal from "./EditProductModal";

const Products = () => {
    const token = useSelector((store: RootState) => store.Auth.token);
    const sellerAxios = createSellerAxios(token);
    const sellerId = useSelector((store: RootState) => store.Auth.authdata?._id);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [products, setProducts] = useState<IProduct[]>([]);
    const [isEditModalOpen, setEditIsModalOpen] = useState<boolean>(false);
    const [selectedProduct,setSelectedProduct] = useState<IProduct>(null)

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    async function fetchProduct() {
        try {
            const response = await sellerAxios.get(`${sellerEndpoints.getProducts}?sellerId=${sellerId}`);
            console.log(response);
            setProducts(response.data.data);
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message;
            toast.error(errorMessage);
            console.log("Error occurred while fetching data");
        }
    }


    const blockProduct = async (productId: string) => {
      try {
          const response = await sellerAxios.put(`${sellerEndpoints.blockProduct}/${productId}`);
          if (response.status == 200) {
              setProducts((prevPro) =>
                prevPro.map((pro) =>
                  pro._id === productId ? { ...pro, isStatus: !pro.isStatus } : pro
                  )
              );
              toast.success(response.data.message);
          }
      } catch (error : any) {
          const errorMessage = error?.response?.data?.message || "Error occure cant login";
          toast.error(errorMessage);
          console.log("Error occurred blocking users", error);
      }
  };

  const handleSuccess = (updatedProduct: IProduct) => {
    setProducts(prev => 
        prev.map(p => p._id === updatedProduct._id ? updatedProduct : p)
    );
    setEditIsModalOpen(false);
};

    useEffect(() => {
        fetchProduct();
    }, [token]);

    const handleEdit=(product:IProduct)=>{
      setSelectedProduct(product)
      setEditIsModalOpen(true)
    }

    return (
        <div className='bg-gradient-to-b from-black to-slate-900 rounded-lg min-h-[710px]'>
            <Toaster expand={false} position="top-center" richColors />
            <div className='text-4xl font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent pl-8 pt-7 justify-center flex'>
                Products
            </div>

            <div className="flex justify-end mr-10 mt-4">
                <button onClick={handleOpenModal} className="bg-fuchsia-600 py-2 px-4 rounded-lg text-white font-medium">
                    Add Product
                </button>
            </div>

            <div className="overflow-x-auto p-8">
                <table className="table-auto w-full text-left">
                    <thead>
                        <tr className="text-white bg-gray-800">
                            <th className="p-3">Image</th>
                            <th className="p-3">Name</th>
                            <th className="p-3">Price (INR)</th>
                            <th className="p-3">Type</th>
                            <th className="p-3">Stock</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center text-white p-5">
                                    No products added yet.
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={`${product._id}-${product.updatedAt}`} className="bg-gray-700 text-slate-300">
                                    <td className="p-3">
                                        <img
                                            src={product.image[0]}
                                            alt={product.productName}
                                            className="w-12 h-12 rounded-md"
                                        />
                                    </td>
                                    <td className="p-3">{product.productName}</td>
                                    <td className="p-3">{product.productPrice}</td>
                                    <td className="p-3">{product.productShorts}</td>
                                    <td className="p-3">{product.productStock}</td>
                                    <td className="p-3">{product.isStatus ? 'Active' : 'Blocked'}</td>
                                    <td className="p-3 flex gap-4">
                                        <button onClick={()=>handleEdit(product)} className="bg-blue-600 px-3 py-1 rounded-lg text-white">
                                            Edit
                                        </button>
                                        <button onClick={() => blockProduct(product._id)}
                                        className={`px-3 py-1 rounded-lg text-white ${product.isStatus ? 'bg-red-600' : 'bg-green-600'}`}>
                                        {product.isStatus ? "Block" : "Unblock"}
                                    </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <AddProductModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={handleSuccess}
                />
            )}
            {isEditModalOpen &&(
              <EditProductModal
              isOpen={isEditModalOpen}
              onClose={()=>setEditIsModalOpen(false)}
              onSuccess={handleSuccess}
              product={selectedProduct}
              />
            )}
        </div>
    );
};

export default Products;
