"use client"

import { useEffect, useState } from "react"
import {Role} from "@prisma/client"
import { useParams } from "next/navigation";
import axios from 'axios'


function DropDown_Roles(props) {
    const roles = ["STUDENT", "SUPER_USER", "PROFESSOR"];

    return (
      <select
        value={props.role}
        onChange={(e) => updateEditedUsers(props.uniqueId, e.target.value)}
        className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
        id="grid-state"
      >
        {roles.map((role, index) => (
          <option key={index} value={role}>
            {role}
          </option>
        ))}
      </select>
    );
}

export default function UserPage(){
    const {user_id} = useParams()
    const [userProfile, setUserProfile] = useState({firstname: "", lastname: "", role:"", partner: null, email: ""})


    function updateUser(){
        return
    }

    function deleteUser(){
        return
    }

    useEffect(()=>{
        console.log("id", user_id);
        axios.get(`/api/users/user_profile/${user_id}`)
        .then((res)=>{
            console.log(res.data.profile);
            setUserProfile(res.data.profile)
        })
        .catch(
            err=>console.log(err)
        )

    },[user_id])




    return(
        <div className="flex justify-center items-center h-screen text-black dark:bg-slate-600">
            <div className="w-2/5 h-1/2 rounded-lg font-semibold  text-black dark:bg-gray-800 dark:text-white">
                <div className="w-full p-3 rounded-t-lg text-white bg-gray-400 dark:bg-gray-700">
                    User Profile 
                </div>
                <div className="grid gap-6 p-6 md:grid-cols-3">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Nome
                        </label>
                        <input
                            type="text"
                            id="first_name"
                            className="block w-full p-2.5 border border-gray-300 text-gray-900 text-sm rounded-lg bg-gray-50 focus:none dark:bg-gray-700 dark:border-gray-600  dark:text-white"
                            defaultValue={userProfile.firstname}
                            onChange={(e) => setUserProfile({...userProfile, firstname: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Apelido
                        </label>
                        <input
                            type="text"
                            id="last_name"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:none block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            defaultValue={userProfile.lastname}
                            onChange={(e) => setUserProfile({...userProfile, lastname: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Role
                        </label>
                        <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                defaultValue={userProfile.role}
                                onChange={(e) => setUserProfile({...userProfile, role: e.target.value})}
                        >
                            <option value={Role.STUDENT}>{Role.STUDENT}</option>
                            <option value={Role.SUPER_USER}>{Role.SUPER_USER}</option>
                            <option value={Role.PROFESSOR}>{Role.PROFESSOR}</option>
                        </select>
                    </div>
                </div>
                <div className="p-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        placeholder="john.doe@company.com"
                        defaultValue={userProfile.email}
                        onChange={(e) => {setUserProfile({...userProfile, email: e.target.value})}}
                        required
                    />
                </div>
                <div className="p-6">
                    <button
                        className="px-5 py-2.5 w-full rounded-lg text-sm text-white font-medium text-center bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                        onClick={() => {updateUser()}}    
                    >
                        Submit
                    </button>
                    <button
                        className="mt-2 px-5 py-2.5 w-full rounded-lg text-sm text-white font-medium text-center bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
                        onClick={() => {deleteUser()}}    
                    >
                        Delete User
                    </button>
                </div>
            </div>
        </div>
    )
}