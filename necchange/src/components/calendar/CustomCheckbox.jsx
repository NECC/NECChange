import { useEffect, useState } from "react"
import { AiOutlineMinus, AiOutlineCheck } from 'react-icons/ai'
import UCsObj from '../../data/filters.json'


export default function CustomCheckbox(props) {
    const { id, array, handle, scope, style } = props;
    const [isChecked, setIsChecked] = useState(false);
    const [isSomeChecked, setIsSomeChecked] = useState(false);

    // TODO: Delete the const checkIfInArray function
    useEffect(() => {
        const checkIfInArray = () => {

            if (scope == 'semester') {
                // XanoYsemestre
                const year = Number(id.charAt(0));
                const semester = Number(id.charAt(4));

                const yearUcs = UCsObj.filter((elem) => {
                    return elem.year == year && elem.semester == semester;
                }).map((elem) => elem.calendar);
                
                const res = yearUcs.every((elem) => array.includes(elem));
                const res2 = yearUcs.some((elem) => array.includes(elem));
                
                handleCheckBoxes(res, res2);

            } else if (scope == 'uc') {

                const res = array.includes(id);
                
                if (res) {
                    setIsChecked(true);
                } 
                else {
                    setIsChecked(false);
                } 

            } else if (scope == 'year') {

                const year = Number(id.charAt(0));

                const yearUcs = UCsObj.filter((elem) => {
                    return elem.year == year;
                }).map((elem) => elem.calendar);
                
                const res = yearUcs.every((elem) => array.includes(elem));
                const res2 = yearUcs.some((elem) => array.includes(elem));
                
                handleCheckBoxes(res, res2);

            } else if (scope == 'type') {

                const yearUcs = UCsObj.map((elem) => elem.calendar);
                const res = yearUcs.every((elem) => array.includes(elem));
                const res2 = yearUcs.some((elem) => array.includes(elem));
                
                handleCheckBoxes(res, res2);
            }
        }
        checkIfInArray();
    }, [array])

    const handleCheckBoxes = (res, res2) => {
        if (res) {
            setIsChecked(true);
            setIsSomeChecked(false);
        } 
        else if (res2) {
            setIsChecked(false);
            setIsSomeChecked(true)
        } else {
            setIsChecked(false);
            setIsSomeChecked(false);
        }
    }

    return (
        <div onClick={() => handle(id)} className={`${style} ml-1 border rounded-sm cursor-pointer flex justify-center items-center ${isChecked || isSomeChecked ? 'bg-blue-100 border-blue-600' : 'bg-none border-gray-400'}`} id={id}>
            <AiOutlineCheck className={`text-black text-sm h-[14px] ${isChecked ? '' : 'hidden'}`}/>
            <AiOutlineMinus className={`text-black text-sm h-[14px] ${isSomeChecked ? '' : 'hidden'}`}/>
        </div>
    )
}