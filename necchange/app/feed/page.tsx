'use client'
import { useState, useEffect } from "react";
import { FilterI } from "../components/trades/filters/interface";
import { FeedPostI } from "./interface";
import { UnidadesCurricularesI } from "./interface";
import FeedPost from "@/app/components/trades/feed-posts/FeedPosts";
import Filters from "@/app/components/trades/filters/Filters";
import axios from "axios";

export default function Feed() {
    const student_nr = 'A182920';
    const [ucsFilter, setUcsFilter] = useState<UnidadesCurricularesI>({});
    const [yearFilter, setYearFilter] = useState<FilterI>({
        ano1: false,
        ano2: false,
        ano3: false,
        ano4: false,
        ano5: false,
    })
    const [ucsArray, setUcsArray] = useState<string[]>([]);

    /* Class types */
    // 1 -> T
    // 2 -> TP
    // 3 -> PL

    const feedData: Array<FeedPostI> = [
        {
            fromUC: "Sistemas de Computação",     // UC name             
            fromType: 2,    // UC Type
            fromShift: 1,   // UC Shift
            toUC: "Sistemas de Computação", 
            toType: 2,
            toShift: 1,
            tradeID: 1,
            studentNumber: 102399,
            displayName: "Joao Dias",
            studentYear: 2,
            timePassed: 0,
            profilePic: 'PC',
            dataFrom: "SistemasDeComputacao",
            dataTo: "SistemasDeComputacao",
        },
        {
            fromUC: "Laboratório de Algoritmia I",     // UC name             
            fromType: 2,    // UC Type
            fromShift: 1,   // UC Shift
            toUC: "Laboratório de Algoritmia I", 
            toType: 2,
            toShift: 1,
            tradeID: 2,
            studentNumber: 102504,
            displayName: "Pedro Camargo",
            studentYear: 1,
            timePassed: 0,
            profilePic: 'PC',
            dataFrom: 'LaboratorioDeAlgoritmiaI',
            dataTo: 'LaboratorioDeAlgoritmiaI',
        },
        {
            fromUC: "Laboratório de Algoritmia I",     // UC name             
            fromType: 2,    // UC Type
            fromShift: 1,   // UC Shift
            toUC: "Laboratório de Algoritmia I", 
            toType: 2,
            toShift: 1,
            tradeID: 3,
            studentNumber: 696969,
            displayName: "Teste",
            studentYear: 2,
            timePassed: 0,
            profilePic: 'PC',
            dataFrom: 'LaboratorioDeAlgoritmiaI',
            dataTo: 'LaboratorioDeAlgoritmiaI',
        },
        {
            fromUC: "Laboratório de Algoritmia I",     // UC name             
            fromType: 2,    // UC Type
            fromShift: 1,   // UC Shift
            toUC: "Laboratório de Algoritmia I", 
            toType: 2,
            toShift: 1,
            tradeID: 4,
            studentNumber: 696969,
            displayName: "Teste",
            studentYear: 3,
            timePassed: 0,
            profilePic: 'PC',
            dataFrom: 'LaboratorioDeAlgoritmiaI',
            dataTo: 'LaboratorioDeAlgoritmiaI',
        },
        {
            fromUC: "Sistemas de Computação",     // UC name             
            fromType: 2,    // UC Type
            fromShift: 1,   // UC Shift
            toUC: "Sistemas de Computação", 
            toType: 2,
            toShift: 1,
            tradeID: 5,
            studentNumber: 696969,
            displayName: "Teste",
            studentYear: 2,
            timePassed: 0,
            profilePic: 'PC',
            dataFrom: 'SistemasDeComputacao',
            dataTo: 'SistemasDeComputacao',
        }
    ]

    // Function to take the student array of UCS and transform to an object to check if the user would like to filter the given UC
    const arrayToObject = (array: string[]): { [key: string]: boolean } => {

        const obj: { [key: string]: boolean } = {};

        array.map((item: string) => {

            // This little code snippet will transform a portuguese phrase in a concatenated with each word capitalized string
            // without accents and ç
            // Álgebra Universal e Categorias = AlgebraUniversalECategorias
            item = ((item
                        .split(" ")
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" "))
                        .replace(/[,\s]/g, ""))
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "");


            return obj[item] = false;
        });

        return obj;
    }

    
    useEffect(() => {
        const getEvents = async () => {
            try {
                const response = await axios.get(`api/trades/student_schedule/${student_nr}`);
                const uc_names = response.data.response.map((uc_class: any) => uc_class.uc_name);
                const studentUCs: string[] = Array.from(new Set(uc_names));

                setUcsArray(studentUCs);
                setUcsFilter(arrayToObject(studentUCs));
            
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        getEvents();
    }, []);


    return (
        <div className="pt-[85px] h-screen border-red-700 flex justify-center bg-white text-black text-sm">
            <Filters yearFilter={yearFilter} setYearFilter={setYearFilter} setUcsFilter={setUcsFilter} ucsArray={ucsArray} ucsFilter={ucsFilter}/>
            <FeedPost postsArray={feedData} yearFilters={yearFilter} ucsFilters={ucsFilter}/>
        </div>
    );
}