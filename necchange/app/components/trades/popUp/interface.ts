import { ClassesI } from "@/app/trades/interface"

export interface PopUpI {
    student_nr: string,
    handleTradesPopUp: () => void,
    isTradesOpened: boolean,
    classes: Array<ClassesI>
}