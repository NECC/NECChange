"use client";

import { useEffect, useState } from "react";
import { Role } from "@prisma/client";
import { useParams } from "next/navigation";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "@/components/globals/Loader";

export default function UserPage() {
  const { user_id } = useParams();
  const [userProfile, setUserProfile] = useState({
    name: "",
    role: "",
    phone: "",
    partner: false,
    email: "",
    partnerNumber: "",
  });
  const [loader, setLoader] = useState(false);

  async function updateUser() {
    setLoader(true);
    await axios
      .put(`/api/users`, {
        params: {
          userProfile: userProfile,
          userId: user_id,
        },
      })
      .then((res) => {
        setLoader(false);
        toast.success("User atualizado.");
        console.log(res);
      })
      .catch((err) => {
        toast.error("Erro ao atualizar user.");
        console.log(err);
      });
  }

  /* Erro ao dar delete */
  async function deleteUser() {
    console.log(user_id);
    await axios
      .get(`/api/users/delete_user/${user_id}`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    const get_user_data = async () => {
      await axios
        .get(`/api/users/user_profile/${user_id}`)
        .then((res) => {
          setUserProfile(res.data.profile);
        })
        .catch((err) => console.log(err));
    };

    get_user_data();
  }, [user_id]);

  return (
    <div className="flex justify-center items-center h-screen text-black dark:bg-slate-600">
      <div className="w-2/5 h-1/2 rounded-lg font-semibold  text-black dark:bg-gray-800 dark:text-white">
        <div className="w-full p-3 rounded-t-lg text-white bg-gray-400 dark:bg-gray-700">
          User Profile
        </div>
        <div className="grid gap-6 p-6 md:grid-cols-4">
          <div className="col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Nome
            </label>
            <input
              type="text"
              id="first_name"
              className="block w-full p-2.5 border border-gray-300 text-gray-900 text-sm rounded-lg bg-gray-50 focus:none dark:bg-gray-700 dark:border-gray-600  dark:text-white"
              value={userProfile.name}
              onChange={(e) =>
                setUserProfile({ ...userProfile, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Role
            </label>
            {console.log("profile", userProfile.role)}
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              value={userProfile.role}
              onChange={(e) => {
                setUserProfile({ ...userProfile, role: e.target.value });
                console.log(userProfile);
              }}
            >
              <option value={Role.STUDENT}>{Role.STUDENT}</option>
              <option value={Role.SUPER_USER}>{Role.SUPER_USER}</option>
              <option value={Role.PROFESSOR}>{Role.PROFESSOR}</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Sócio
            </label>
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              value={userProfile.partner}
              onChange={(e) =>
                setUserProfile({ ...userProfile, partner: e.target.value })
              }
            >
              <option value={true}>Sim</option>
              <option value={false}>Não</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="john.doe@company.com"
              value={userProfile.email}
              onChange={(e) => {
                setUserProfile({ ...userProfile, email: e.target.value });
              }}
              required
            />
          </div>
          <div className="col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Telemóvel
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
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
            className="px-5 py-2.5 w-full rounded-lg text-sm text-white font-medium text-center bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
            onClick={() => {
              updateUser();
            }}
          >
            Update
          </button>
          <button
            className="mt-2 px-5 py-2.5 w-full rounded-lg text-sm text-white font-medium text-center bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
            onClick={() => {
              deleteUser();
            }}
          >
            Delete User
          </button>
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
