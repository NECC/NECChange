import { ClassesI } from "@/app/trades/interface"

export interface CalendarProps {
    events?: ClassesI[],
    handleTradesPopUp: () => void,
}
