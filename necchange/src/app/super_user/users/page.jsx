"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import DataTable from "@/components/admin/datatable/datatable";
import Modal from "@/components/globals/Modal";
import axios from "axios";

const AddUserForm = ({ showModal, setShowModal }) => {
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    number: "",
    phone: "",
    role: "",
    partner: false,
  });

  /* Adicionar as variáveis de ambiente*/
  async function addUser() {
    const new_date = new Date();
    console.log(newUser);
    /*
    axios
      .post(
        `https://sheetdb.io/api/v1/5339063taai3t`,
        {
          data: [
            {
              "": "1",
              Nº: "INCREMENT",
              Nome: newUser.name,
              "Nº Aluno": newUser.number,
              "Data de Admissão": new_date.toLocaleString(),
              Pago: 10,
              Telefone: newUser.phone,
              Email: newUser.email,
              Vitalício: "TRUE",
              Cartão: "FALSE",
            },
          ],
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Basic " + btoa(`mwbsb7wt:qbmw29mkeh557kybdnf2`),
          },
        }
      )
      .then((res) => {
        console.log(process.env.SHEETDB_ID);
        console.log(process.env.SHEETDB_LOGIN);
        console.log(process.env.SHEETDB_PASSWORD);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
      */
  }

  return (
    <Modal
      showModal={showModal}
      setShowModal={setShowModal}
      title="Adicionar utilizador"
    >
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
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
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
            onChange={(e) => setNewUser({ ...newUser, number: e.target.value })}
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
            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
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
            <option>STUDENT</option>
            <option>SUPER_USER</option>
            <option>PROFESSOR</option>
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
            <option value={false}>NÃO</option>
            <option value={true}>SIM</option>
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
    </Modal>
  );
};

export default function ManageUsers() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editedUsersMap, setEditedUsersMap] = useState(new Map());

  useEffect(() => {
    if (session) {
      const getEvents = async () => {
        try {
          const response = await axios.get(`/api/users`);
          setUsers(response.data.users);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      getEvents();
    }
  }, [session]);

  return (
    <div className="bg-white h-screen pt-24">
      <div className="ml-auto mr-auto px-8 md:px-16">
        <AddUserForm showModal={showModal} setShowModal={setShowModal} />
        <div className="flex flex-row pb-4">
          <div className="basis-1/2">
            <input
              type="text"
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900"
              placeholder="Procura..."
            />
          </div>
          <div className="basis-1/4"></div>
          <div className="basis-1/4">
            <div className="flex flex-row-reverse">
              <div className="flex-none w-auto">
                <button
                  type="submit"
                  onClick={() => setShowModal(true)}
                  className="w-full h-full px-3 py-1.5 float-right justify-end rounded-full leading-6 text-base text-white shadow-sm bg-blue-500 hover:bg-blue-600"
                >
                  Adicionar User
                </button>
              </div>
            </div>
          </div>
        </div>
        {session ? (
          <>
            <DataTable data={users} />
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
