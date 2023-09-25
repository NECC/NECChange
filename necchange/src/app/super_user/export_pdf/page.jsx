'use client'

import axios from 'axios'
import jsPDF from 'jspdf'
import "jspdf-autotable"

import { useEffect, useState } from "react";
import Select from "@/components/globals/Select";


export default function SuperUser() {
    const buttonStyles = "p-2 mt-2 w-full text-base border-2 border-sky-500 shadow-md rounded-md bg-white hover:bg-slate-50";

    const [ucs, setUcs] = useState([])
    const [ucSelected, setUcSelected] = useState("")
    
    useEffect(() =>{
        axios
            .get('/api/calendar/getUCS')
            .then((res) => {
                setUcs(res.data.response.map((uc) => uc.name))
            })
            .catch((err) => console.log(err))
    }, [])

    const generatePDF = (data) => {
        const doc  = new jsPDF(
            {
             orientation: 'portrait',
             unit: 'mm',
             format: 'a4',
             putOnlyUsedFonts:true
            }
        );

        for (const key in data) {
            let currentY = 10;
            if (data.hasOwnProperty(key)) {
              const values = data[key];
              
              // Create table header
              const headers = [ucSelected + " - " + key];
              
              // Prepare table data
              const table_data = values.map((value ) => [value]);
              
              doc.autoTable({
                startY: currentY,
                head: [headers],
                body: table_data,
                theme: 'grid'
              });
              
              currentY = doc.autoTable.previous.finalY + 10; // Move Y to next position
            }
            doc.addPage()
        }
          
        // Save the PDF
        doc.save('tables.pdf');
    }

    const exportPDF = () => {
        if(ucSelected != ""){
            axios
                .get(`/api/admin/uc_shifts_list/${ucSelected}`)
                .then(res => {
                    generatePDF(res.data.data)
                })
                .catch(err => console.log(err))
        }
        return 
    }
  

    return (
        <div className="flex justify-center h-screen bg-white text-black">
            <div className="m-auto w-56">
                    <Select options={ucs}
                            getOptionLabel={(option)=> option}
                            changeHandler={setUcSelected}
                            selected={"-1"}
                            placeholder="Selecionar UC" 
                            /> 
                    <button className={buttonStyles} onClick={exportPDF}>Exportar para PDF</button>
            </div>
        </div>
    )
}