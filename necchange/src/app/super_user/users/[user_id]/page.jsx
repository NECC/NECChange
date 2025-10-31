"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "@/components/globals/Loader";

const Role = {
  CS_STUDENT: "CS_STUDENT",
  OUTSIDER: "OUTSIDER",
  SUPER_USER: "SUPER_USER"
};

export default function UserPage() {
  const params = useParams();
  const router = useRouter();
  const user_id = params?.user_id;
  
  console.log("All params:", params);
  console.log("User ID:", user_id);
  
  const [userProfile, setUserProfile] = useState({
    name: "",
    role: "",
    phone: "",
    partner: false,
    email: "",
  });
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    console.log("useEffect triggered, user_id:", user_id);
    
    if (!user_id || user_id === "undefined") {
      console.error("Invalid user_id:", user_id);
      toast.error("ID de utilizador inválido");
      return;
    }

    const get_user_data = async () => {
      try {
        console.log("Fetching user profile for ID:", user_id);
        const res = await axios.get(`/api/users/user_profile/${user_id}`);
        console.log("Profile data received:", res.data);
        setUserProfile(res.data.profile);
      } catch (err) {
        console.error("Erro ao carregar perfil:", err);
        toast.error("Erro ao carregar perfil do utilizador.");
      }
    };
    
    get_user_data();
  }, [user_id]);

  const updateUser = async () => {
    if (!user_id || user_id === "undefined") {
      toast.error("ID de utilizador inválido");
      return;
    }

    try {
      setLoader(true);
      console.log("Updating user:", user_id, userProfile);
      await axios.put(`/api/users/${user_id}`, userProfile);
      toast.success("Utilizador atualizado.");
    } catch (err) {
      console.error("Erro ao atualizar utilizador:", err);
      toast.error("Erro ao atualizar utilizador.");
    } finally {
      setLoader(false);
    }
  };

  const deleteUser = async () => {
    if (!user_id || user_id === "undefined") {
      toast.error("ID de utilizador inválido");
      return;
    }
    try {
      setLoader(true);
      console.log("Delete user:", user_id, userProfile);
      await axios.delete(`/api/users/${user_id}`, userProfile);
      toast.success("Utilizador apagado.");
    } catch (err) {
      console.error("Erro ao atualizar utilizador:", err);
      toast.error("Erro ao atualizar utilizador.");
    } finally {
      setLoader(false);
    }
    }
  

  if (!user_id || user_id === "undefined") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">ID de utilizador inválido</div>
      </div>
    );
  }


  return (
    <div className="flex justify-center items-center h-screen text-black dark:bg-slate-600">
      <div className="w-2/5 h-1/2 rounded-lg text-black dark:bg-gray-800 dark:text-white">
        <div className="w-full p-3 rounded-t-lg font-semibold text-white bg-gray-400 dark:bg-gray-700">
          User Profile
        </div>
        <div className="grid gap-6 p-6 md:grid-cols-4">
          <div className="col-span-2">
            <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">
              Nome
            </label>
            <input
              type="text"
              id="first_name"
              className="block w-full p-2.5 border border-gray-300 text-gray-900 text-sm rounded-lg bg-gray-50 focus:none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={userProfile.name}
              onChange={(e) =>
                setUserProfile({ ...userProfile, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">
              Role
            </label>
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              value={userProfile.role}
              onChange={(e) => {
                setUserProfile({ ...userProfile, role: e.target.value });
              }}
            >
              <option value={Role.CS_STUDENT}>{Role.CS_STUDENT}</option>
              <option value={Role.OUTSIDER}>{Role.OUTSIDER}</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">
              Sócio
            </label>
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              value={userProfile.partner}
              onChange={(e) =>
                setUserProfile({ 
                  ...userProfile, 
                  partner: e.target.value === "true" 
                })
              }
            >
              <option value="true">Sim</option>
              <option value="false">Não</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="john.doe@company.com"
              value={userProfile.email}
              onChange={(e) => {
                setUserProfile({ ...userProfile, email: e.target.value });
              }}
              required
            />
          </div>
          <div className="col-span-2">
            <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">
              Telemóvel
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="923123142"
              value={userProfile.phone}
              onChange={(e) => {
                setUserProfile({ ...userProfile, phone: e.target.value });
              }}
              required
            />
          </div>
        </div>
        <div className="pt-10 pl-6 pr-6">
          <button
            className="px-5 py-2.5 w-full rounded-lg text-sm text-white font-semibold text-center bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
            onClick={updateUser}
          >
            Update
          </button>
          {
          <button
            className="mt-2 px-5 py-2.5 w-full rounded-lg text-sm text-white font-semibold text-center bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
            onClick={deleteUser}
          >
            Delete User
          </button>
          }
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {loader && <Loader />}
    </div>
  );
}