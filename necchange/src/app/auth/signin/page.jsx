"use client";
import Image from "next/image";
import Loader from "@/components/globals/Loader";
import Otp from "@/components/Otp";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useState, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

export default function Home() {
  const [inputEmail, setInputEmail] = useState("");
  const [loader, setLoader] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); 
  const [showVerificationStep, setShowVerificationStep] = useState(false);

  const handleVerification = useCallback(
    (code) => {
      window.location.href = `/api/auth/callback/email?email=${encodeURIComponent(
        inputEmail
      )}&token=${code}`;
    },
    [inputEmail]
  );

  const setFinalOtp = useCallback(
    (code) => {
      handleVerification(code);
    },
    [handleVerification]
  );

  const toggleLoader = (value) => {
    setLoader(value);
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    setErrorMessage(""); 
    
    try {
      toggleLoader(true);
      const result = await email_validator();
      
      if (result === true) {
        await signIn("email", { email: inputEmail, redirect: false });
        setShowVerificationStep(true);
      }
      
      toggleLoader(false);
    } catch (error) {
      toggleLoader(false);
      toast.error("Erro ao iniciar sessão");
      console.log("Unable to sign-in: ", error);
    }
  };

  const email_validator = async () => {
    try {
      const response = await axios.get(`/api/users/user_exists/${inputEmail}`);
      
      if (response.data.response === "success") {
        return true;
      } else {
        toast.error("Email não registado no sistema!");
        return false;
      }
    } catch (error) {
      console.error("Error validating email:", error);
      toast.error("Erro ao validar email. Tenta novamente.");
      return false;
    }
  };

  return (
    <>
      <main className="flex min-h-screen items-center justify-between bg-white">
        <aside className="h-screen border-r dark:border-gray-200 dark:bg-darker focus:outline-none sm:w-1/2 w-full tall:w-full">
          <div className="flex flex-col min-h-full justify-center items-center">
            {showVerificationStep && (
              <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                  Introduz o código de verificação enviado para o teu email
                </h2>
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                  <Otp numberOfDigits={4} setFinalOtp={setFinalOtp}></Otp>
                </div>
              </div>
            )}
            {!showVerificationStep && (
              <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                  <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Entra na tua conta
                  </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                  <form className="space-y-2" onSubmit={handleSignin}>
                    <div>
                      <div className="mt-2">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="aXXXXX@alunos.uminho.pt"
                          autoComplete="email"
                          required
                          value={inputEmail}
                          className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          onChange={(e) =>
                            setInputEmail(e.target.value.toLowerCase())
                          }
                        />
                      </div>
                      {errorMessage && (
                        <p className="text-red-600 mt-2">{errorMessage}</p>
                      )}
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={loader}
                        className="flex w-full justify-center rounded-md bg-[#018ccb] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                      >
                        {loader ? "A processar..." : "Sign in"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </aside>

        <div className="flex-col w-1/2 h-screen justify-center items-center hidden sm:flex tall:hidden">
          <Image
            src="/logos/neccSticker.png"
            alt="Logo NECC"
            width={400}
            height={400}
          />
          <div className="text-[#018ccb] sm:text-5xl font-semibold">
            NECChange
          </div>
        </div>
        {loader && <Loader />}
      </main>
      
      {/* ← ADD ToastContainer HERE */}
      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </>
  );
}