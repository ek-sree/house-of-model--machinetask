import { useFormik } from "formik";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import * as Yup from 'yup';
import { createUserAxios } from "../../../constraints/axios/userAxios";
import { userEndpoints } from "../../../constraints/endpoints/userEndpoints";
import { toast, Toaster } from "sonner";
import { createSellerAxios } from "../../../constraints/axios/sellerAxios";
import { sellerEndpoints } from "../../../constraints/endpoints/sellerEndpoints";
import { useDispatch } from "react-redux";
import { login } from "../../../redux/slice/AuthSlice";

const Login = () => {

  const userAxios = createUserAxios(null);

  const sellerAxios = createSellerAxios(null);

    const [isBuyer, setIsBuyer] = useState<string>('buyer'); 

    const navigate = useNavigate();
    const dispatch = useDispatch();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async(values) => {
      try {

        const axiosInstance = isBuyer=='buyer' ? userAxios : sellerAxios;
        const endpoints = isBuyer=='buyer' ? userEndpoints : sellerEndpoints;

        const response = await axiosInstance.post(endpoints.login, values)
        console.log("Login response",response);
        if(response.status==200 && response.data.data.user.role=='buyer'){
          dispatch(login({token:response.data.data.token, authdata:response.data.data.user}))
          navigate('/')
        }
        else if(response.status==200 && response.data.data.user.role =="seller"){
          dispatch(login({token:response.data.data.token, authdata:response.data.data.user}))
          navigate('/seller/home')
        }else{
          toast.error("Credientials doesnt match")
        }
      } catch (error:any) {
        const errorMessage = error?.response?.data?.message || "Error occure cant login";
        toast.error(errorMessage)
        console.log("Error loggin in",error);
      }
    },
  });

  return (
    <div className="bg-slate-950 min-h-screen w-full flex flex-col md:flex-row">
       <Toaster position="top-center" expand={false} richColors />
 <div className="md:flex-1 flex items-center justify-center p-4">
        <div className="shadow-md shadow-slate-100 border border-white flex flex-col p-4 w-full max-w-[450px] rounded-md bg-zinc-900">
          <h1 className="text-white text-center mb-4 text-xl"> Welcome, Login {isBuyer === 'buyer' ? 'Buyer' : 'Seller'}</h1>

          <div className="flex justify-center mb-4">
            <button
              onClick={() => setIsBuyer('buyer')}
              className={`px-4 py-2 rounded-l-md ${isBuyer === 'buyer' ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white' : 'bg-slate-700 text-gray-300'}`}
            >
              Buyer
            </button>
            <button
              onClick={() => setIsBuyer('seller')}
              className={`px-4 py-2 rounded-r-md ${isBuyer === 'seller' ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white' : 'bg-slate-700 text-gray-300'}`}
            >
              Seller
            </button>
          </div>

          <form onSubmit={formik.handleSubmit} className="text-white flex flex-col">

            <label htmlFor="email" className="mb-2">Email</label>
            <input
              type="text"
              name="email"
              id="email"
              className="mb-4 p-2 rounded-xl bg-slate-800"
              placeholder="Enter your email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500 mb-4">{formik.errors.email}</div>
            ) : null}


            <label htmlFor="password" className="mb-2">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              className="mb-4 p-2 rounded-xl bg-slate-800"
              placeholder="Enter Password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="text-red-500 mb-4">{formik.errors.password}</div>
            ) : null}


            <div className="flex justify-center">
              <button type="submit" className="bg-gradient-to-r from-violet-500 to-fuchsia-500 w-full md:w-36 min-h-10 rounded-md">
                Submit
              </button>
            </div>
          </form>

         <Link to='/signup'> <div className="text-center mt-4 cursor-pointer">
            <p className="text-white">
              Click here to <span className="text-blue-500">Sign up</span>
            </p>
          </div></Link>
        </div>
      </div>

      <div className="md:flex-1 flex items-center justify-center mr-8 p-4 md:p-0">
        <img
          src="https://images.unsplash.com/photo-1727230497470-765a15f8c36b?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Signup"
          className={`object-cover h-[100px] md:h-[400px] w-full rounded-md shadow-sm shadow-white`}
        />
      </div>

    </div>
  )
}

export default Login