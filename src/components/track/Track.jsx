import React, { useContext } from 'react'
import myContext from '../../context/data/myContext'

function Track() {
    const context = useContext(myContext)
    const { toggleMode, mode } = context
    return (
        <div>
            <section className="text-gray-600 body-font">
                <div className="container px-5 md:py-5  mx-auto">
                    <div className="flex flex-wrap -m-4 text-center">
                        <div className="p-4 md:w-1/3 sm:w-1/2 w-full">
                            <div className=" bg-gray-100 border  rounded-lg" style={{ backgroundColor: mode === 'dark' ? 'black' : '', color: mode === 'dark' ? 'white' : '', }} >




                            </div>
                        </div>

                        <div className="p-4 md:w-1/3 sm:w-1/2 w-full">
                            <div className="border-2  border-gray-200 bg-gray-100  px-4 py-6 rounded-lg" style={{ backgroundColor: mode === 'dark' ? 'black' : '', color: mode === 'dark' ? 'white' : '', }} >



                            </div>
                        </div>
                        <div className="p-4 md:w-1/3 sm:w-1/2 w-full">
                            <div className="border-2  border-gray-200 bg-gray-100 shadow-[inset_0_0_2px_rgba(0,0,0,0.6)] px-4 py-6 rounded-lg" style={{ backgroundColor: mode === 'dark' ? 'black' : '', color: mode === 'dark' ? 'white' : '', }} >



                            </div>
                        </div>
                    </div>
                </div>
            </section >
        </div >
    )
}

export default Track