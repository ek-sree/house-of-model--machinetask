import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { createUserAxios } from '../../../constraints/axios/userAxios';
import { userEndpoints } from '../../../constraints/endpoints/userEndpoints';
import { SignupFormValues } from '../../../interface/AuthInterface/IAuthInterface';
import { toast, Toaster } from 'sonner';
import { createSellerAxios } from '../../../constraints/axios/sellerAxios';
import { sellerEndpoints } from '../../../constraints/endpoints/sellerEndpoints';

const Signup = () => {

  const userAxios = createUserAxios(null);

  const sellerAxios = createSellerAxios(null);

  const [isBuyer, setIsBuyer] = useState<string>('buyer'); 

  const navigate = useNavigate();

  const validationSchema = Yup.object({
    userName: Yup.string().required('Name is required'),
  
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
  
    phone: isBuyer === 'buyer'
      ? Yup.string()
          .matches(/^\d{10}$/, "Phone number must be exactly 10 digits and contain only numbers") // Ensures 10 digits and numbers only
          .required('Phone is required')
      : Yup.string(), 
  
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm Password is required'),
  });
  
  const formik = useFormik({
    initialValues: {
      userName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values: SignupFormValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void })=> {
       try {
        console.log("isBuyer",isBuyer);
        const axiosInstance = isBuyer=='buyer' ? userAxios : sellerAxios;
        const endpoints = isBuyer=='buyer' ? userEndpoints : sellerEndpoints;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { confirmPassword, ...userData } = values;
        const dataToSend = {
          ...userData,
          role: isBuyer, 
        };
        const response = await axiosInstance?.post(endpoints?.register,dataToSend)
        console.log("res",response);
        
        if(response.status==200){
            navigate('/otp');
        }
       }catch (error: any) {  
        const errorMessage = error?.response?.data?.message || "Registration failed";
        toast.error(errorMessage);
        console.log("Error registering", error);
       }finally{
        setSubmitting(false)
       }
    },
});

  return (
    <div className="bg-slate-950 min-h-screen w-full flex flex-col md:flex-row">
       <Toaster position="top-center" expand={false} richColors />
      <div className="md:flex-1 flex items-center justify-center p-4 md:p-0">
        <img
          src="https://images.unsplash.com/photo-1727230497470-765a15f8c36b?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Signup"
          className={`object-cover md:pl-11 ${isBuyer === 'buyer' ? 'h-[300px] md:h-[650px]' : 'h-[250px] md:h-[580px]'} w-full rounded-md shadow-sm shadow-white`}
        />
      </div>
      <div className="md:flex-1 flex items-center justify-center p-4">
        <div className="shadow-md shadow-slate-100 border border-white flex flex-col p-4 w-full max-w-[450px] rounded-md bg-zinc-900">
          <h1 className="text-white text-center mb-4 text-xl">Welcome Signup as {isBuyer === 'buyer' ? 'Buyer' : 'Seller'}</h1>

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
            <label htmlFor="name" className="mb-2">Name</label>
            <input
              type="text"
              name="userName"
              id="userName"
              className="mb-4 p-2 rounded-xl bg-slate-800"
              placeholder="Enter your name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.userName}
            />
            {formik.touched.userName && formik.errors.userName ? (
              <div className="text-red-500 mb-1 text-sm">{formik.errors.userName}</div>
            ) : null}

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

            {isBuyer === 'buyer' && (
              <>
                <label htmlFor="phone" className="mb-2">Phone</label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  className="mb-4 p-2 rounded-xl bg-slate-800"
                  placeholder="Enter your phone"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.phone}
                />
                {formik.touched.phone && formik.errors.phone ? (
                  <div className="text-red-500 mb-4">{formik.errors.phone}</div>
                ) : null}
              </>
            )}

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

            <label htmlFor="confirmPassword" className="mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirm-password"
              className="mb-4 p-2 rounded-xl bg-slate-800"
              placeholder="Confirm Password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <div className="text-red-500 mb-4">{formik.errors.confirmPassword}</div>
            ) : null}

            <div className="flex justify-center">
              <button type="submit" className="bg-gradient-to-r from-violet-500 to-fuchsia-500 w-full md:w-36 min-h-10 rounded-md">
                Submit
              </button>
            </div>
          </form>

         <Link to='/login'> <div className="text-center mt-4 cursor-pointer">
            <p className="text-white">
              Already have an account.? <span className="text-blue-500 underline">Login</span>
            </p>
          </div></Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;