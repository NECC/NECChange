import { ClassesI } from "../interfaces/interfaces";

export interface PopUpI {
    student_nr: string,
    handleTradesPopUp: () => void,
    isTradesOpened: boolean,
    classes: Array<ClassesI>
}