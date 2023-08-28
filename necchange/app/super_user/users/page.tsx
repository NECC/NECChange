"use client"

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from 'axios'

import DataTable, { DataRow } from "../../components/admin/datatable/datatable";
import Modal from "../../components/globals/Modal";


function filterUsers(user: DataRow, loweredCasedSearch: string){
    const searchIsEmpty = loweredCasedSearch === '';
    const checkNumber = user.number.toLowerCase().includes(loweredCasedSearch); 
    const checkFirstName = user.firstname.toLowerCase().includes(loweredCasedSearch); 
    const checkLastName = user.lastname.toLowerCase().includes(loweredCasedSearch); 
    const checkEmail = user.email.toLowerCase().includes(loweredCasedSearch);
 
    return searchIsEmpty || checkFirstName || checkLastName || checkEmail || checkNumber;
}

export default function ManageUsers(){
    const { data: session } = useSession();
    const [users, setUsers] = useState(new Array<DataRow>()); 
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editedUsersMap, setEditedUsersMap] = useState(new Map<number, string>());

    useEffect(() => {
        if (session) {
            const getEvents = async () => {
                try {
                    const response = await axios.get(`../api/users`);
                    setUsers(response.data.users);

                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
        
            getEvents();
        }
    }, [session]);
    
    return(
        <div className="bg-white h-screen pt-24">
            <div className="ml-auto mr-auto px-8 md:px-16">
            <Modal 
            showModal={showModal}
            setShowModal={setShowModal}
            title="Adicionar utilizador">
                
                <form>
                    <div className="grid gap-6 mb-6 md:grid-cols-3">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome</label>
                            <input type="text" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required/>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Apelido</label>
                            <input type="text" id="last_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Doe" required/>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Role</label>
                            <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option>STUDENT</option>
                                <option>SUPER_USER</option>
                                <option>PROFESSOR</option>
                            </select>
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                        <input type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="john.doe@company.com" required/>
                    </div> 
                    <div>
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                    </div>
                </form>

            </Modal>
                
                <div className="flex flex-row pb-4">
                    <div className="basis-1/2">
                        <input type="text" onChange={(e) => setSearch(e.target.value)} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Procura..."/>
                    </div>
                    <div className="basis-1/4"></div>
                    <div className="basis-1/4">
                        <div className="flex flex-row-reverse">
                            <div className="flex-none w-42">
                                <button type="submit" onClick={() => setShowModal(true)} className="w-full h-full float-right justify-end rounded-full bg-blue-500  px-3 py-1.5 text-xl font-semibold leading-6 text-white shadow-sm hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                    +
                                </button>
                            </div>
                            <div className="flex-auto px-6 invisible">
                                <button type="submit" className="w-full h-full justify-center rounded-md bg-green-600  px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>                    
                </div>
                {
                    //<DataTable data={users.filter((user) => {return filterUsers(user, search.toLowerCase()) })}/>
                }
            </div>
        </div>
    )
}