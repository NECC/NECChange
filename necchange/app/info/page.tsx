"use client"; // This is a client component

import React, { useEffect } from 'react';
import axios from 'axios';
import data from './schedule.json'


export default function Data() {

    

    
    const teste = () => {
        axios.post('../api/data_script', {
            params: {
                body: "pornografia gay",
            },
        }
    ).then(response => {
            // Handle response
            console.log("testeeee", response.data);
        });
    };
    

  return (
    <button onClick={() => teste()}> Info</button>
  )
}
