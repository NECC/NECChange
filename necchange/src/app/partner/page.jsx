"use client"

import { BrowserQRCodeReader, BrowserCodeReader } from '@zxing/browser';
import { useCallback, useState, useEffect, useRef } from 'react';

const PartnerPage = () => {
    const videoEl = useRef(null)
    const [codeReader, setCodeReader] = useState(null)
    const [selectedDeviceId, setSelectedDeviceId] = useState(null)
    const [result, setResult] = useState("")

    const scanHandler = useCallback(async () => {
        setResult("")
        // Throws one error in Firefox for not being able to access all the details
        codeReader.decodeFromVideoDevice(selectedDeviceId, videoEl.current, (res, err, con) => {
            if (res) {
                setResult(res.text)
                con.stop()
            }
        })
    }, [codeReader, selectedDeviceId, videoEl])

    useEffect(() => {
        setCodeReader(new BrowserQRCodeReader())
        // back camera is usually at index 1 but we reverse() in case only one camera exists
        BrowserCodeReader
            .listVideoInputDevices()
            .then(videoInputDevices => {
                videoInputDevices.reverse();
                setSelectedDeviceId(videoInputDevices[0].deviceId)
            })
    }, [])

    return (
        <main className="grow flex flex-col justify-center min-h-screen items-center bg-zinc-50 text-gray-900">
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 place-items-center px-12">
                <div className="col-span-1 grid grid-cols-1 place-items-center">
                    <figure className="border-4 border-blue-500 rounded-xl overflow-hidden bg-slate-100">
                        <video ref={videoEl} className="w-60 h-60"></video>
                    </figure>

                    <button
                        onClick={scanHandler}
                        className="py-2 px-4 rounded font-semibold bg-gradient-to-br from-blue-400 via-indigo-500 to-indigo-500 text-white w-full mt-6"
                    >
                        SCAN
                    </button>
                </div>

                <span id="result" className="bg-gray-200 p-4 col-span-1 md:col-span-2">
                    {result}
                </span>
            </section>
        </main>
    )
};

export default PartnerPage