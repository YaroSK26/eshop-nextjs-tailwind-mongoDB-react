/* eslint-disable @next/next/no-img-element */
import {useSession } from "next-auth/react"

const HomeHeader = () => {
    const {data:session}= useSession()
  return (
    <div className="flex justify-between items-center mt-2 mb-6 ">
      <h2>
        <div className="flex gap-2 items-center ">
          <img
            className="w-6 h-6 rounded-md sm:hidden"
            src={session?.user?.image}
            alt=""
          />
          <div>
            Hello, <b className="text-primary">{session?.user?.name}</b>
          </div>
        </div>
      </h2>
      <div className=" bg-gray-300 text-black gap-1 rounded-lg overflow-hidden w-18 h-6  hidden sm:flex">
        <img className="w-6 h-6" src={session?.user?.image} alt="" />
        <span className="px-2 "> {session?.user?.name}</span>
      </div>
    </div>
  );
}

export default HomeHeader
