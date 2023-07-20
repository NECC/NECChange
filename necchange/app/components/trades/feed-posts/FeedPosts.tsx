import { faSlash } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import { FiChevronDown } from 'react-icons/fi';

import { FiChevronRight } from 'react-icons/fi';

export default function FeedPost(props) {
    const { postsArray } = props;

    const [isAnoFormVisible, setIsAnoFormVisible] = useState(false);
    const [isUCFormVisible, setIsUCFormVisible] = useState(false);
    const [isopen, setIsopen] = useState(false);
    const [isopen2, setIsopen2] = useState(false);
    const [isAno1FormVisible, setIsAno1FormVisible] = useState(false);
    const [isAno2FormVisible, setIsAno2FormVisible] = useState(false);
    const [isAno3FormVisible, setIsAno3FormVisible] = useState(false);

    const toggleAnoFormVisibility = () => {
        setIsAnoFormVisible(!isAnoFormVisible);
        setIsopen2(!isopen2);

    };
    const toggleAno1FormVisibility = () => {
        setIsAno1FormVisible(!isAno1FormVisible);
        setIsAno2FormVisible(false);
        setIsAno3FormVisible(false);
    };

    const toggleAno2FormVisibility = () => {
        setIsAno2FormVisible(!isAno2FormVisible);
        setIsAno1FormVisible(false);
        setIsAno3FormVisible(false);
    };
    const toggleAno3FormVisibility = () => {
        setIsAno3FormVisible(!isAno1FormVisible);
        setIsAno2FormVisible(false);
        setIsAno1FormVisible(false);

    };


    const toggleUCFormVisibility = () => {
        setIsUCFormVisible(!isUCFormVisible);
        setIsopen(!isopen);
    };


    // 1°, 2°, 3°, 4°, 5° ano
    const yearColor = [
        'text-green-500',
        'text-blue-500',
        'text-red-500',
        'text-purple-500',
        'text-orange-500'
    ];

    return (
        <div className="flex flex-grow ">
            <div className="px-6 mt-4 ">
                <div className="mb-4">
                    <div className="flex items-center">
                        <span>
                            <strong>ANO</strong>
                        </span>
                        <span className="ml-2 cursor-pointer" onClick={toggleAnoFormVisibility}>
                            {isopen2 && isAnoFormVisible ? <FiChevronDown size={24} className="transform rotate-180" /> : <FiChevronDown size={24} />}
                        </span>

                    </div>
                    {isAnoFormVisible && (
                        <form action="o decidir pelo camrgo" method="POST" className="mt-2 accent-blue-500 " >
                            <input type="radio" id="1ºAno" name="ano" value="1ºAno" className="mr-2" onClick={toggleAno1FormVisibility} />
                            <label htmlFor="1ºAno" className=" mr-2">1ºAno</label>
                            <input type="radio" id="2ºAno" name="ano" value="2ºAno" className="mr-2" onClick={toggleAno2FormVisibility} />
                            <label htmlFor="2ºAno" className=" mr-2">2ºAno</label>
                            <input type="radio" id="3ºAno" name="ano" value="3ºAno" className="mr-2" onClick={toggleAno3FormVisibility} />
                            <label htmlFor="3ºAno" className=" mr-2">3ºAno</label>
                        </form>
                    )}

                </div>


                <div>
                    <div className="flex items-center">
                        <span>
                            <strong>UC</strong>
                        </span>
                        <span className="ml-2 cursor-pointer" onClick={toggleUCFormVisibility}>
                            {isopen && isUCFormVisible ? <FiChevronDown size={24} className="transform rotate-180" /> : <FiChevronDown size={24} />}
                        </span>

                    </div>
                    {isUCFormVisible && (
                        <form action="o decidir pelo caminho" method="POST" className="mt-2 accent-blue-500 ">
                            {isAno1FormVisible && (

                                <form>
                                    <label htmlFor=" Álgebra Linear CC " className="mr-2 "> Álgebra Linear CC </label>
                                    <input type="radio" id=" Álgebra Linear CC " name="uc" value="Álgebra Linear CC" className="mb-2" /><br></br>

                                    <label htmlFor="Cálculo" className="mr-2">Cálculo</label>
                                    <input type="radio" id="Cálculo" name="uc" value="Cálculo" className="mb-2" /><br></br>

                                    <label htmlFor="Programação Funcional" className="mr-2">Programação Funcional</label>
                                    <input type="radio" id="Programação Funcional" name="uc" value="Programação Funcional" className="mb-2" /><br></br>

                                    <label htmlFor="Tópicos de Matemática" className="mr-2 ">Tópicos de Matemática</label>
                                    <input type="radio" id="Tópicos de Matemática" name="uc" value="Tópicos de Matemática" className="mb-2" /><br></br>

                                    <label htmlFor="Análise" className="mr-2 ">Análise</label>
                                    <input type="radio" id="Análise" name="uc" value="Análise" className="mb-2" /><br></br>

                                    <label htmlFor="Geometria" className="mr-2 ">Geometria</label>
                                    <input type="radio" id="Geometria" name="uc" value="Geometria" className="mb-2" /><br></br>

                                    <label htmlFor="Laboratório de Algoritmia I" className="mr-2 ">Laboratório de Algoritmia I</label>
                                    <input type="radio" id="Laboratório de Algoritmia I" name="uc" value="Laboratório de Algoritmia I" className="mb-2" /><br></br>

                                    <label htmlFor="Matemática Discreta" className="mr-2 ">Matemática Discreta</label>
                                    <input type="radio" id="Matemática Discreta" name="uc" value="Matemática Discreta" className="mb-2" /><br></br>

                                    <label htmlFor="Programação Imperativa" className="mr-2 ">Programação Imperativa</label>
                                    <input type="radio" id="Programação Imperativa" name="uc" value="Programação Imperativa" className="mb-2" /><br></br>

                                    <label htmlFor="Sistemas de Computação" className="mr-2 ">Sistemas de Computação</label>
                                    <input type="radio" id="Sistemas de Computação" name="uc" value="Sistemas de Computação" className="mb-2" /><br></br>


                                </form>
                            )}

                            {isAno2FormVisible && (
                                <form>
                                    <label htmlFor="Álgebra" className="mr-2 ">Álgebra</label>
                                    <input type="radio" id="Álgebra" name="uc" value="Álgebra" className="mb-2" /><br></br>

                                    <label htmlFor="Algoritmos e Complexidade" className="mr-2 ">Algoritmos e Complexidade</label>
                                    <input type="radio" id="Algoritmos e Complexidade" name="uc" value="Algoritmos e Complexidade" className="mb-2" /><br></br>

                                    <label htmlFor="Análise Numérica" className="mr-2 ">Análise Numérica</label>
                                    <input type="radio" id="Análise Numérica" name="uc" value="Análise Numérica" className="mb-2" /><br></br>

                                    <label htmlFor="Lógica CC" className="mr-2 ">Lógica CC</label>
                                    <input type="radio" id="Lógica CC" name="uc" value="Lógica CC" className="mb-2" /><br></br>

                                    <label htmlFor="Sistemas de Comunicações e Redes" className="mr-2 ">Sistemas de Comunicações e Redes</label>
                                    <input type="radio" id="Sistemas de Comunicações e Redes" name="uc" value="Sistemas de Comunicações e Redes" className="mb-2" /><br></br>

                                    <label htmlFor="Álgebra Universal e Categorias" className="mr-2 ">Álgebra Universal e Categorias</label>
                                    <input type="radio" id="Álgebra Universal e Categorias" name="uc" value="Álgebra Universal e Categorias" className="mb-2" /><br></br>

                                    <label htmlFor="Autómatos e Linguagens Formais" className="mr-2 ">Autómatos e Linguagens Formais</label>
                                    <input type="radio" id="Autómatos e Linguagens Formais" name="uc" value="Autómatos e Linguagens Formais" className="mb-2" /><br></br>

                                    <label htmlFor="Cálculo de Programas" className="mr-2 ">Cálculo de Programas</label>
                                    <input type="radio" id="Cálculo de Programas" name="uc" value="Cálculo de Programas" className="mb-2" /><br></br>

                                    <label htmlFor="Laboratório de Algoritmia II" className="mr-2 ">Laboratório de Algoritmia II</label>
                                    <input type="radio" id="Laboratório de Algoritmia II" name="uc" value="Laboratório de Algoritmia II" className="mb-2" /><br></br>

                                    <label htmlFor="Programação Orientada aos Objetos" className="mr-2 ">Programação Orientada aos Objetos</label>
                                    <input type="radio" id="Programação Orientada aos Objetos" name="uc" value="Programação Orientada aos Objetos" className="mb-2" /><br></br>

                                    <label htmlFor="Sistemas Operativos" className="mr-2 ">Sistemas Operativos</label>
                                    <input type="radio" id="Sistemas Operativos" name="uc" value="Sistemas Operativos" className="mb-2" /><br></br>


                                </form>

                            )}
                            {isAno3FormVisible && (
                                <form>
                                    <label htmlFor="Álgebra" className="mr-2 ">Álgebra</label>
                                    <input type="radio" id="Álgebra" name="uc" value="Álgebra" className="mb-2" /><br></br>

                                    <label htmlFor="Álgebra" className="mr-2 ">Álgebra</label>
                                    <input type="radio" id="Álgebra" name="uc" value="Álgebra" className="mb-2" /><br></br>

                                    <label htmlFor="Álgebra" className="mr-2 ">Álgebra</label>
                                    <input type="radio" id="Álgebra" name="uc" value="Álgebra" className="mb-2" /><br></br>

                                    <label htmlFor="Álgebra" className="mr-2 ">Álgebra</label>
                                    <input type="radio" id="Álgebra" name="uc" value="Álgebra" className="mb-2" /><br></br>
                                    
                                    <label htmlFor="Álgebra" className="mr-2 ">Álgebra</label>
                                    <input type="radio" id="Álgebra" name="uc" value="Álgebra" className="mb-2" /><br></br>

                                    <label htmlFor="Álgebra" className="mr-2 ">Álgebra</label>
                                    <input type="radio" id="Álgebra" name="uc" value="Álgebra" className="mb-2" /><br></br>

                                    <label htmlFor="Álgebra" className="mr-2 ">Álgebra</label>
                                    <input type="radio" id="Álgebra" name="uc" value="Álgebra" className="mb-2" /><br></br>
                                    
                                    <label htmlFor="Álgebra" className="mr-2 ">Álgebra</label>
                                    <input type="radio" id="Álgebra" name="uc" value="Álgebra" className="mb-2" /><br></br>
                                    <label htmlFor="Álgebra" className="mr-2 ">Álgebra</label>
                                    <input type="radio" id="Álgebra" name="uc" value="Álgebra" className="mb-2" /><br></br>
                                    <label htmlFor="Álgebra" className="mr-2 ">Álgebra</label>
                                    <input type="radio" id="Álgebra" name="uc" value="Álgebra" className="mb-2" /><br></br>
                                    <label htmlFor="Álgebra" className="mr-2 ">Álgebra</label>
                                    <input type="radio" id="Álgebra" name="uc" value="Álgebra" className="mb-2" /><br></br>
                                    <label htmlFor="Álgebra" className="mr-2 ">Álgebra</label>
                                    <input type="radio" id="Álgebra" name="uc" value="Álgebra" className="mb-2" /><br></br>




                                </form>
                            )}

                        </form>

                    )}
                </div>


            </div>




            <div className="flex flex-col flex-grow px-6">
                {postsArray.map((post) => (
                    <div key={post.tradeID} className="rounded-xl bg-white w-full border border-black border-black/25 m-3 shadow-lg relative flex flex-col">
                        <span className="absolute right-0 mr-3 mt-1 text-sm">
                            {post.timePassed > 0 ? `há ${post.timePassed} horas atrás` : `há menos de 1 hora`}
                        </span>

                        <div className="p-4 flex items-center">
                            <div className="w-10 h-10 rounded-full bg-white border flex justify-center items-center">
                                {post.profilePic}
                            </div>
                            <span className="ml-2 text-[1.9em]">
                                {post.displayName} (A{post.studentNumber}) -
                            </span>
                            <span className={`ml-1 text-[1.3em] ${yearColor[post.studentYear - 1]}`}>
                                {post.studentYear}°Ano
                            </span>
                        </div>

                        <span className="px-4 pb-4">
                            {post.displayName} solicitou uma troca de turno da UC <strong>{post.fromUC}</strong>
                        </span>

                        <div className="flex justify-start p-4 items-center">
                            <div className="w-10 h-10 rounded-full border flex justify-center items-center mr-1 bg-red-500 border-black">
                                <span className="text-white">TP{post.fromType}</span>
                            </div>
                            <div className="text-black">
                                <FiChevronRight size={24} />
                            </div>
                            <div className="w-10 h-10 rounded-full border flex justify-center items-center m1-2 bg-green-500 border-black">
                                <span className="text-white">TP{post.fromShift}</span>
                            </div>
                        </div>

                        <div className="absolute bottom-0 right-0 mb-4 mr-4 flex justify-end text-sm border-black/25 shadow-lg hover:bg-gray-100 rounded-lg">
                            <button className="py-2 px-3 rounded-lg border">Aceitar Troca</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

