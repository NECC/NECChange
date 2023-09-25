import React from "react";

export const DataTableContext = React.createContext(null);

export interface DataRow {
    uniqueId: number;
    number: string;
    firstname: string;
    lastname: string;
    email: string; 
    role: string;
}                         

export default function DataTable(props: {data: DataRow[]}){
    const usersArray = props.data; 
    const [editedUsers, setEditedUser] = React.useState(new Map<number,string>());
    const updateEditedUsers = (key: number, value: string) => {
        setEditedUser(map => new Map(map.set(key, value)));
    }
    
    console.log(usersArray);
    console.log(editedUsers);

    function DropDown_Roles(props : any){
        const roles = ["STUDENT", "SUPER_USER", "PROFESSOR"];
    
        return ( 
            <select value={props.role} onChange={(e) => updateEditedUsers(props.uniqueId, e.target.value)} className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
                    {roles.map((role: string, index: number) => (
                        <option key={index} value={role}>{role}</option>
                    )) }
            </select>
        ); 
    };  


    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-black dark:text-white">
                <thead className="text-xs text-gray-700 uppercase bg-gray-400 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Numero
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Nome
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Apelido
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Email
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Role
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {usersArray.map((user : DataRow, index: number) => ( 
                    <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                        <th scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {user.number}
                        </th>
                        <td className="px-6 py-2">
                            {user.firstname}
                        </td>
                        <td className="px-6 py-2">
                            {user.lastname}
                        </td>
                        <td className="px-6 py-2">
                            {user.email}
                        </td>
                        <td className="px-6 py-2 text-right">
                            <DropDown_Roles uniqueId={user.uniqueId} role={user.role}/>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}