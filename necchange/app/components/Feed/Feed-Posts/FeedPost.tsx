import React, {useEffect, useState} from "react";
import axios from 'axios'

const type_class: any = {
    1: "T",
    2: "TP",
    3: "PL"
}
const yearColor = ['text-blue-500','text-red-500', 'text-green-600'];


interface FeedPostProps {
    post: any,
    setLoader: Function,
    setFeedBack: Function
}

export default function FeedPost(props: FeedPostProps) {
    const {post, setLoader, setFeedBack} = props
    const [fromStudentNr, setFromStudentNr] = useState<string>();
    const [tradeId, setTradeId] = useState<number>();
    

    /*
    David - A95661
    Hugo  - A93646
    Simão - A94447
    */

    useEffect(() =>{
        setFromStudentNr(post.from_student.number);
        setTradeId(post.id)
    }, [post])

    const studentNrAccept = 'A94447'

    const toggleLoader = (value: boolean) => {
        setLoader(value);
    }

    const acceptTrade = () => {
        toggleLoader(true)
        axios
        .post(`api/feed/feed_post/accept_trade`, {
            params: {studentNr: studentNrAccept, tradeId: tradeId}
        })
        .then(res =>{
            console.log("Res 1", res);
            if(res.data.response == true){
                axios
                    .delete(`api/feed/feed_post/accept_trade`, {
                        data: {fromStudentNr: fromStudentNr, toStudentNr: studentNrAccept, tradeId: tradeId}
                    })
                    .then(res =>{
                        console.log("Res2" , res);
                    })
            }
            toggleLoader(false)
        }).catch(err=>{
            console.log(err);
        })
    }

    const removeTrade = () => {
        toggleLoader(true);
        axios
        .put(`api/feed/feed_post/remove_trade`, {
            params: {tradeId: tradeId}
        })
        .then(res => {
            toggleLoader(false);
            setFeedBack({message: "Pedido de troca removido", show: true, error: false})
            setTimeout(() => {
                setFeedBack({message: "", show: false, error: false})
            }, 5000)
        })
        .catch(err => {
            toggleLoader(false);
            setFeedBack({message: "Erro ao remover o pedido de troca", show: true, error: true})
            setTimeout(() => {
                setFeedBack({message: "", show: false, error: false})
            }, 5000)
            console.log(err);
        })
    }


    return (
        <div className="rounded-md text-lg bg-white p-8 m-4 ml-10 border shadow-md">
            <div className="font-bold pb-10">
                <div className="float-left text-2xl">
                    <span className="ml-1 text-lg font-normal">
                        <strong className="text-xl">{fromStudentNr}</strong>
                        - solicitou uma troca de turno da UC
                    </span>
                </div>
                <div className="text-end">
                    Publicado há ...
                </div>

            </div>
            {

                post.trade_id.map((lesson_trade: any, i: number) => {
                    let type = type_class[lesson_trade.lessonFrom.type]
                    let fromShift = lesson_trade.lessonFrom.shift
                    let toShift = lesson_trade.lessonTo.shift

                    return(
                        <div key={i}>
                            <div className="flex flex-row">
                                <div className="font-bold">
                                    {lesson_trade.lessonFrom.course.name}
                                </div>
                                <span className={`ml-1 font-bold ${yearColor[lesson_trade.lessonFrom.course.year - 1]}`}>
                                    ( {lesson_trade.lessonFrom.course.year}º Ano )
                                </span>
                                <div className="ml-1">
                                    {'- ' + type + fromShift + ' para ' + type + toShift}
                                </div>
                            </div>
                            <div className={`${studentNrAccept == fromStudentNr ? 'hidden' : '' } text-xs`}>
                                {fromStudentNr}{": " + type + fromShift + " -> " + type + toShift} || {studentNrAccept}{": " + type + toShift + " -> " + type + fromShift}
                            </div>
                        </div>
                        
                    );
                })
            }
            
            {
                <div>
                    <button className={`${studentNrAccept == post.from_student.number ? 'hidden' : '' } p-2 mt-4 bg-[#018ccb] hover:bg-[#007cb6] font-bold text-white text-md float-right rounded-lg shadow-md`}
                            onClick={acceptTrade}>
                        Aceitar Troca
                    </button>
                    <button className={`${studentNrAccept == post.from_student.number ? '' : 'hidden' } p-2 mt-4 bg-red-500 hover:bg-red-600 font-bold text-white text-md float-right rounded-lg shadow-md`}
                            onClick={removeTrade}>
                        Remover Troca
                    </button>
                </div>
            }
            
        </div>
    );
}

