"use client";
import React from "react";
import AlertDate from "./AlertDate";
import UcsInput from "@/components/admin/datatable/UcsInput";
import { useState, useMemo } from "react";
import Box from "@mui/material/Box";

export default function DataTable({ events, setEvents }) {
  const allEvents = Array.isArray(events)
    ? events
    : Object.values(events).flat();

  const [selectedUC, setSelectedUC] = useState(null);

  const filterUc= useMemo(() => {
    if (!selectedUC) return allEvents;
    return allEvents.filter((event) =>
      event.uc.toLowerCase().includes(selectedUC.toLowerCase())
    );
  }, [selectedUC, allEvents]);
  

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-4">
      {/* Filtro UC */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filtrar por UC..."
          className="border border-gray-300 rounded-lg p-2 w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setSelectedUC(e.target.value)}
        />
      </div>
      <table className="w-full text-sm text-left text-black dark:text-white">
        <thead className="text-xs text-gray-700 uppercase bg-gray-400 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">UC</th>
            <th scope="col" className="px-6 py-3">Data</th>
            <th scope="col" className="px-6 py-3">Tipo</th>
          </tr>
        </thead>

        <tbody className="w-full">
          {filterUc.map((event) => (
            <tr
              key={event.id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <td className="px-6 py-6">{event.uc}</td>
              <td className="px-6 py-6">{event.day}</td>
              <td className="px-6 py-6">{event.type}</td>
              <td className="px-6 py-6 text-right">
                <AlertDate data={event} setdata={setEvents} />
              </td>
            </tr>
          ))}

          {filterUc.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-500">
                Nenhum evento encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
