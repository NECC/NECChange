"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AlertDate from "./AlertDate";

export default function DataTable(props) {
  const { events, setEvents } = props;

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-black dark:text-white">
        <thead className="text-xs text-gray-700 uppercase bg-gray-400 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Evento
            </th>
            <th scope="col" className="px-6 py-3">
              Data
            </th>
            <th scope="col" className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody className="w-full">
          {events.map((event, index) => (
            <tr
              key={index}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <td className="px-6 py-6">{event.title}</td>
              <td className="px-6 py-6">{event.start}</td>

              <td className="px-6 py-6">
                <AlertDate data={event} setdata={setEvents} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
