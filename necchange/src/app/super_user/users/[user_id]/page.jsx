"use client"

import { useState } from "react"
import { useSession } from "next-auth/react";

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
    const [save, setSave] = useState(false)
    const { data: session } = useSession();


    return(
        <div className="flex justify-center items-center h-screen text-black dark:bg-slate-600">
            <div className="w-1/2 h-1/2 rounded-lg font-semibold  text-black dark:bg-gray-800 dark:text-white">
                <div className="w-full p-3 rounded-t-lg text-white bg-gray-400 dark:bg-gray-700">
                    User Profile 
                </div>
                <form>
                    <div className="grid gap-6 p-6 md:grid-cols-3">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Nome
                            </label>
                            <input
                                type="text"
                                id="first_name"
                                className="block w-full p-2.5 border border-gray-300 text-gray-900 text-sm rounded-lg bg-gray-50 focus:none dark:bg-gray-700 dark:border-gray-600  dark:text-white"
                                defaultValue={session.user.firstname}
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
                                placeholder="Doe"
                                defaultValue={session.user.lastname}
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Role
                            </label>
                            <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
                                <option>STUDENT</option>
                                <option>SUPER_USER</option>
                                <option>PROFESSOR</option>
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
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            placeholder="john.doe@company.com"
                            defaultValue={session.user.email}
                            required
                        />
                    </div>
                    <div className="p-6">
                        <button
                            type="submit"
                            className="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700"
                        >
                            Submit
                        </button>
                    </div>
                </form>
                
            </div>
        </div>
    )
}