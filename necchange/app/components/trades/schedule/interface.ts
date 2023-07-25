import { ClassesI } from "@/app/horario/interface"

export interface CalendarProps {
    events?: ClassesI[],
    handleTradesPopUp: () => void,
}
