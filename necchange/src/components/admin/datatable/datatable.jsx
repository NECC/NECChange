
import { useRouter } from "next/navigation";
import React from "react";

export const DataTableContext = React.createContext(null);

export default function DataTable({users}) {
  const router = useRouter();

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-black dark:text-white">
        <thead className="text-xs text-gray-700 uppercase bg-gray-400 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Número
            </th>
            <th scope="col" className="px-6 py-3">
              Nome Completo
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3">
              Telemóvel
            </th>
            <th scope="col" className="px-6 py-3">
              Sócio
            </th>
            <th scope="col" className="px-6 py-3">
              Role
            </th>
          </tr>
        </thead>
        <tbody className="w-full">
          {users.map((user, index) => (
              <tr key={index} onClick={()=>{router.push(`/super_user/users/${user.uniqueId}`)}} 
                              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 hover:cursor-pointer">
                    <th
                      scope="row"
                      className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                        {user.number}
                    </th>
                    <td className="px-6 py-6">{user.name}</td>
                    <td className="px-6 py-6">{user.email}</td>
                    <td className="px-6 py-6">{user.phone}</td>
                    <td className="px-6 py-6">
                        <input type="checkbox" defaultChecked={user.partner} />
                    </td>
                    <td className="pl-3 py-6">
                      {user.role}
                    </td>
              </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
