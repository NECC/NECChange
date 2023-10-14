import { useEffect, useState } from "react"
import { AiOutlineMinus, AiOutlineCheck } from 'react-icons/ai'
import UCsObj from '../../data/filters.json'


export default function CustomCheckbox(props) {
    const { id, array, handle, scope, style } = props;
    const [isChecked, setIsChecked] = useState(true);
    const [isSomeChecked, setIsSomeChecked] = useState(false);

    useEffect(() => {
        const checkIfInArray = () => {

            if (scope == 'uc') {

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

            } else if (scope == 'type') {

                const yearUcs = UCsObj.map((elem) => elem.calendar);
                const res = yearUcs.every((elem) => array.includes(elem));
                const res2 = yearUcs.some((elem) => array.includes(elem));
                
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
        }
        checkIfInArray();
    }, [array])

    return (
        <div onClick={() => handle(id)} className={`${style} ml-1 border rounded-sm cursor-pointer flex justify-center items-center ${isChecked || isSomeChecked ? 'bg-blue-100 border-blue-600' : 'bg-none border-gray-400'}`} id={id}>
            <AiOutlineCheck className={`text-black text-sm h-[14px] ${isChecked ? '' : 'hidden'}`}/>
            <AiOutlineMinus className={`text-black text-sm h-[14px] ${isSomeChecked ? '' : 'hidden'}`}/>
        </div>
    )
}