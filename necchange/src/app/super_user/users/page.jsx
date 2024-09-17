"use client";
import { Role } from "prisma/prisma-client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

import DataTable from "@/components/admin/datatable/datatable";
import Modal from "@/components/globals/Modal";
import Loader from "@/components/globals/Loader";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

const AddUserForm = ({ showModal, setShowModal }) => {
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    number: "",
    phone: "",
    role: Role.CS_STUDENT,
    partner: true,
  });
  const [loader, setLoader] = useState(false);

  /* Adicionar as variáveis de ambiente*/
  async function addUser() {
    setLoader(true);
    axios
      .post("/api/users", {
        params: newUser,
      })
      .then((res) => {
        toast.success("User adicionado à base de dados.");
        res.data.sheet_error == true
          ? toast.error("Erro a adicionar o user à folha de sócios.")
          : toast.success("User adicionado à folha de sócios.");

        setLoader(false);
      })
      .catch((err) => {
        toast.error("Erro a adicionar o user à base de dados.");
        toast.error("Erro a adicionar o user à folha de sócios.");
        setLoader(false);
      });
  }

  return (
    <Modal
      showModal={showModal}
      setShowModal={setShowModal}
      title="Adicionar utilizador"
    >
      <form action={null} onSubmit={(e) => e.preventDefault()}>
        <div className="grid gap-2 mb-6 md:grid-cols-4">
          <div className="col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Nome Completo
            </label>
            <input
              type="text"
              id="first_name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="John Doe"
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              required
            />
          </div>
          <div className="mb-6 col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="john.doe@company.com"
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value.toLowerCase() })
              }
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Número de Aluno
            </label>
            <input
              type="text"
              id="first_name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="John Doe"
              onChange={(e) =>
                setNewUser({ ...newUser, number: e.target.value.toLowerCase() })
              }
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Telemóvel
            </label>
            <input
              type="text"
              id="first_name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="John Doe"
              onChange={(e) =>
                setNewUser({ ...newUser, phone: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Role
            </label>
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value={Role.CS_STUDENT}>CS_STUDENT</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Sócio
            </label>
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              onChange={(e) =>
                setNewUser({ ...newUser, partner: e.target.value })
              }
            >
              <option value={true}>SIM</option>
              <option value={false}>NÃO</option>
            </select>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700"
            onClick={() => {
              addUser();
            }}
          >
            Submit
          </button>
        </div>
      </form>
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
    </Modal>
  );
};

const usedelayedValue = (inputValue, delay) => {
  const [delayedValue, setdelayedValue] = useState(inputValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setdelayedValue(inputValue);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, delay]);
  
  return delayedValue;
};

export default function ManageUsers() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [filterUsers, setFilterUsers] = useState([])
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Número");

  const [showModal, setShowModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const delayedSearchTerm = usedelayedValue(search, 400);

  useEffect(() => {
    const getEvents = async () => {
      try {
        const response = await axios.get(`/api/users`);
        setUsers(response.data.users);
        setFilterUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getEvents();
  }, []);

  const changeFilter = (filter) => {
    setFilter(filter);
    setShowFilter(false);
  }

  const included = (string1,string2) => {
    if (string1 == null) return false;
    else return string1.includes(string2) 
  }

  useEffect(() => {
    handleSearch(delayedSearchTerm);
  }, [delayedSearchTerm]);

  /* Future upgrade: Add a delay so that we don't make calls every time a key is pressed*/
  const handleSearch = (value) => {
    if(value != "") {
      if (filter == "Número") setFilterUsers(users.filter(user => included(user.number,value)));
      if (filter == "Nome") setFilterUsers(users.filter(user => included(user.name,value)));
      if (filter == "Email") setFilterUsers(users.filter(user => included(user.email,value)));
    } else {
      setFilterUsers(users)
    }
  }

  if (!session) return <Loader />;

  return (
    <div className="bg-white h-screen pt-24">
      <div className="ml-auto mr-auto px-8 md:px-16">
        <AddUserForm showModal={showModal} setShowModal={setShowModal} />
        <div className="flex flex-row pb-4">
          <div className="basis-3/4 flex flex-row">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white z-40 border border-gray-300 text-gray-900 text-sm rounded-l-lg block w-1/2 p-2.5 dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900"
              placeholder="Procura..."
            />
            <div className={`w-1/3 flex z-30 flex-row overflow-hidden rounded-r-lg bg-gray-400 border border-l-0 border-gray-600 text-white transition-all ease-in-out duration-400 ${showFilter ? "translate-x-0" : "-translate-x-3/4"}`}>
                  <button onClick={() => changeFilter("Número")} className="basis-1/4 hover:bg-gray-500"> Número </button>
                  <button onClick={() => changeFilter("Nome")} className="basis-1/4 hover:bg-gray-500"> Nome </button>
                  <button onClick={() => changeFilter("Email")} className="basis-1/4 hover:bg-gray-500"> Email </button>
                  <button onClick={() => setShowFilter(!showFilter)} className="gap-1.5 flex flex-row bg-blue-500 hover:bg-blue-600 basis-1/4 justify-center items-center"> {filter} {showFilter && <FaAngleLeft />} {!showFilter && <FaAngleRight />} </button>
            </div>
            
          </div>
          <div className="basis-1/4">
            <div className="flex flex-row-reverse">
              <div className="flex-none w-auto">
                <button
                  type="submit"
                  onClick={() => setShowModal(true)}
                  className="w-full h-full px-5 py-2 float-right border border-gray-600 justify-end rounded-lg leading-6 text-base text-white shadow-sm bg-blue-500 hover:bg-blue-600"
                >
                  Adicionar User
                </button>
              </div>
            </div>
          </div>
        </div>
        {session ? (
          <>
            <DataTable users={filterUsers} />
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
