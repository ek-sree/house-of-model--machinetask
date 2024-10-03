import { FormikErrors, useFormik } from 'formik';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'sonner';
import { createUserAxios } from '../../../constraints/axios/userAxios';
import { userEndpoints } from '../../../constraints/endpoints/userEndpoints';
import { createSellerAxios } from '../../../constraints/axios/sellerAxios';
import { sellerEndpoints } from '../../../constraints/endpoints/sellerEndpoints';
import Cookie from 'js-cookie'
import { login } from '../../../redux/slice/AuthSlice';
import { useDispatch } from 'react-redux';


interface FormValues {
    otp: string[];
  }

  const validate = (values: FormValues) => {
    const errors: FormikErrors<FormValues> = {};
    if (values.otp.some((data) => data === "")) {
      errors.otp = "This field is required";
    }
    return errors;
  };

const Otp = () => {

  const userAxios = createUserAxios(null);

  const sellerAxios = createSellerAxios(null);

    const inputRef = useRef<(HTMLInputElement | null)[]>([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [countdown, setCountdown] = useState(120);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showResendButton, setShowResendButton] = useState(false);
  const [isBuyer, setIsbuyer] = useState<string | undefined>(undefined)

  useEffect(()=>{
    const role = Cookie.get('role');
    setIsbuyer(role);
    console.log("ROle",isBuyer);
    
  },[])



  const formik = useFormik<FormValues>({
    initialValues: {
      otp: Array(6).fill(""),
    },
    validate,
    onSubmit: async (values) => {
        console.log("value");
        const axiosInstant = isBuyer=='buyer' ? userAxios : sellerAxios;
        const endpoints = isBuyer=='buyer' ? userEndpoints : sellerEndpoints;
      try {
        const otp = values.otp.join("");
        const response = await axiosInstant.post(endpoints.otp, { otp });
        console.log("response ottt",response);
        
        if (response.status==201 && response.data.verifyOtpResponse.data.user.role === 'buyer') {
          dispatch(login({token:response.data.verifyOtpResponse.data.token, authdata:response.data.verifyOtpResponse.data.user}))
          navigate('/');
        } else if (response.status==201 && response.data.verifyOtpResponse.data.user.role === 'seller') {
          dispatch(login({token:response.data.verifyOtpResponse.data.token, authdata:response.data.verifyOtpResponse.data.user}))
          navigate('/seller/home');
        } else {
          toast.error('Entered otp is incorrect.');
        }
      } catch (error : any) {
        const errorMessage = error?.response?.data?.verifyOtpResponse?.message
        toast.error(errorMessage)
        console.log("error otp", error);
      }
    },
  });



    const handleResendOtp = async () => {
        try {
          await userAxios.post(userEndpoints.resendOtp);
          formik.resetForm();
          setCountdown(120); // Reset to 2 minutes
          setShowResendButton(false);
          if (inputRef.current[0]) {
            inputRef.current[0].focus();
          }
        } catch (error) {
          console.log("error in resend otp", error);
        }
      };


      const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = e.target;
        if (/[^0-9]/.test(value)) return;
    
        const currentOtp = [...formik.values.otp];
        currentOtp[index] = value.slice(-1);
    
        formik.setValues((prev) => ({
          ...prev,
          otp: currentOtp,
        }));
    
        if (value && index < 5) {
          inputRef.current[index + 1]?.focus();
        }
      };
    
      const handleBackSpace = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && index > 0 && !formik.values.otp[index]) {
          inputRef.current[index - 1]?.focus();
        }
      };


      const pasteText = useCallback(
        (e: ClipboardEvent) => {
          const pastedText = e.clipboardData?.getData("text") || "";
          const fieldValue: string[] = pastedText.split("").slice(0, 6);
          formik.setValues({ otp: fieldValue });
          if (inputRef.current[5]) {
            inputRef.current[5].focus();
          }
        },
        [formik]
      );
    
      useEffect(() => {
        const firstInput = inputRef.current[0];
        if (firstInput) {
          firstInput.addEventListener("paste", pasteText);
        }
        return () => {
          if (firstInput) {
            firstInput.removeEventListener("paste", pasteText);
          }
        };
      }, [pasteText]);
    
      useEffect(() => {
        if (countdown > 0) {
          const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
          return () => clearTimeout(timer);
        } else {
          setShowResendButton(true);
        }
      }, [countdown]);
    
      // useEffect(() => {
      //   const isBuyer = localStorage.getItem('isRecruiter') ?? undefined;
      //   setIsBuyer(isBuyer);
      // }, []);
    
      useEffect(() => {
        inputRef.current[0]?.focus();
      }, []);
    

    const renderInput = () => {
        return formik.values.otp.map((value, index) => (
          <input
            key={index}
            ref={(element) => (inputRef.current[index] = element)}
            type="text"
            name={`otp${index}`}
            value={value}
            className="w-12 mb-5 shadow-xl sm:w-9 md:w-14 lg:w-16 h-12 rounded-md mr-2 text-center text-xl border border-zinc-200"
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleBackSpace(e, index)}
            maxLength={1}
          />
        ));
      };


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-800">
          <Toaster position="top-center" expand={false} richColors />
          <div className="bg-white shadow-lg p-8 rounded-lg w-full max-w-md overflow-hidden flex flex-col items-center shadow-white">
            <img src='https://images.unsplash.com/photo-1727230497470-765a15f8c36b?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' alt="madras branding" className="w-20 mb-4" />
            <form onSubmit={formik.handleSubmit} className="w-full">
              <h3 className="text-3xl mb-8 text-center">Please Fill in the OTP</h3>
              <div className="flex items-center justify-center">
                {renderInput()}
              </div>
              {formik.errors.otp && (
                <p className="mt-3 text-sm text-red-400 text-center">
                  Please fill all fields
                </p>
              )}
              {countdown > 0 ? (
                <button
                  type="submit"
                  className="mt-4 w-full bg-gray-800 text-white rounded-lg py-3 hover:bg-gray-700"
                >
                  Submit
                </button>
              ) : (
                <p></p>
              )}
            </form>
            {countdown > 0 ? (
              <p className="text-center mt-4">
                Resend OTP in {Math.floor(countdown / 60)}:
                {countdown % 60 < 10 ? `0${countdown % 60}` : countdown % 60} seconds
              </p>
            ) : (
              <button
                onClick={handleResendOtp}
                className="mt-4 w-full bg-gray-800 text-white rounded-lg py-3 hover:bg-gray-700"
              >
                Resend OTP
              </button>
            )}
          </div>
          <Toaster position="top-center" expand={false} richColors />
        </div>
      );
}

export default Otp