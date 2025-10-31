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

const AddUserForm = ({ showModal, setShowModal, onUserAdded }) => {
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    number: "",
    phone: "",
    role: Role.CS_STUDENT,
    partner: true,
  });
  const [loader, setLoader] = useState(false);

  async function addUser() {
    setLoader(true);
    try {
      const res = await axios.post("/api/users", newUser);
      
      toast.success("User adicionado à base de dados.");
      
      if (res.data.sheet_error === true) {
        toast.error("Erro a adicionar o user à folha de sócios.");
      } else {
        toast.success("User adicionado à folha de sócios.");
      }
      
      // Reset form
      setNewUser({
        name: "",
        email: "",
        number: "",
        phone: "",
        role: Role.CS_STUDENT,
        partner: true,
      });
      
      
      if (onUserAdded) {
        onUserAdded();
      }
      
      setTimeout(() => setShowModal(false), 1000);
    } catch (err) {
      console.error("Erro ao adicionar user:", err);
      toast.error("Erro a adicionar o user à base de dados.");
    } finally {
      setLoader(false);
    }
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
              id="name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="José Bernardo"
              value={newUser.name}
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
              placeholder="aXXXXXX@alunos.uminho.pt"
              value={newUser.email}
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
              id="number"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="AXXXXXX"
              value={newUser.number}
              onChange={(e) =>
                setNewUser({ ...newUser, number: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Telemóvel
            </label>
            <input
              type="tel"
              id="phone"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="923123142"
              value={newUser.phone}
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
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value={Role.CS_STUDENT}>CS_STUDENT</option>
              <option value={Role.OUTSIDER}>OUTSIDER</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Sócio
            </label>
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              value={newUser.partner}
              onChange={(e) =>
                setNewUser({ ...newUser, partner: e.target.value === "true" })
              }
            >
              <option value="true">SIM</option>
              <option value="false">NÃO</option>
            </select>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700"
            onClick={addUser}
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

const useDelayedValue = (inputValue, delay) => {
  const [delayedValue, setDelayedValue] = useState(inputValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDelayedValue(inputValue);
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
  const [filterUsers, setFilterUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Número");

  const [showModal, setShowModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const delayedSearchTerm = useDelayedValue(search, 400);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`/api/users`);
      setUsers(response.data.users);
      setFilterUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Erro ao carregar utilizadores.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const changeFilter = (newFilter) => {
    setFilter(newFilter);
    setShowFilter(false);
  };

  const included = (string1, string2) => {
    if (string1 == null) return false;
    return string1.toLowerCase().includes(string2.toLowerCase());
  };

  useEffect(() => {
    handleSearch(delayedSearchTerm);
  }, [delayedSearchTerm, filter, users]);

  const handleSearch = (value) => {
    if (value !== "") {
      let filtered = [];
      if (filter === "Número") {
        filtered = users.filter(user => included(user.number, value));
      } else if (filter === "Nome") {
        filtered = users.filter(user => included(user.name, value));
      } else if (filter === "Email") {
        filtered = users.filter(user => included(user.email, value));
      }
      setFilterUsers(filtered);
    } else {
      setFilterUsers(users);
    }
  };

  if (!session) return <Loader />;

  return (
    <div className="bg-white h-screen pt-24">
      <div className="ml-auto mr-auto px-8 md:px-16">
        <AddUserForm 
          showModal={showModal} 
          setShowModal={setShowModal}
          onUserAdded={fetchUsers}
        />
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
              <button onClick={() => setShowFilter(!showFilter)} className="gap-1.5 flex flex-row bg-blue-500 hover:bg-blue-600 basis-1/4 justify-center items-center"> 
                {filter} {showFilter && <FaAngleLeft />} {!showFilter && <FaAngleRight />} 
              </button>
            </div>
          </div>
          <div className="basis-1/4">
            <div className="flex flex-row-reverse">
              <div className="flex-none w-auto">
                <button
                  type="button"
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
          <DataTable users={filterUsers} />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}