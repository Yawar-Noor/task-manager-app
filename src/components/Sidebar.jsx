import React, { useState, useEffect, useRef } from "react";
import { TbLayoutSidebarRightExpandFilled } from "react-icons/tb";
import { RiArrowDownSLine } from "react-icons/ri";
import { RiArrowUpSLine } from "react-icons/ri";
import Sort from "./Sort";
import { auth } from "../config/firebase.js";
import { signOut } from "firebase/auth";
import Dropdown from "./ui/Dropdown.jsx";
import { CiViewList } from "react-icons/ci";
import { CiGrid42 } from "react-icons/ci";

import { IoMenuOutline } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";

function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  viewMode,
  setViewMode,
  setIsTaskFormVisible,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  searchTerm,
  setSearchTerm,
}) {
  const sidebarRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    }

    {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    };
  }, []);

  //   Log out...
  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section
      ref={sidebarRef}
      className={`absolute z-10000 md:static flex flex-col justify-center md:justify-start rounded-r-2xl border-r border-t border-b border-zinc-400/60 text-zinc-700 transition-all duration-300 ease-out ${
        isSidebarOpen
          ? "w-60 min-w-50 sm:max-w-47 sm:w-47 h-full overflow-hidden"
          : "w-0 md:w-9"
      }`}
    >
      {/* Future Responsive behaviour to be added: at mobile or tab screens click on other than sidebar collapses the sidebar */}
      {isSidebarOpen ? (
        <div className="flex flex-col p-2 py-3 gap-1.5 h-[95%] md:h-full  bg-white sm:bg-zinc-100 ">

          {/* Name & Toggle sidebar btn */}
          <div className="w-full flex justify-between items-center px-2 pb-3 border-b-gray-600/30">

            <h2 className=" text-2xl text-zinc-600 font-extrabold">Tasky</h2>

            <button
              className="flex justify-center items-center text-center  text-zinc-600 bg-white shadow-sm rounded"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <TbLayoutSidebarRightExpandFilled size={25} />
            </button>

          </div>

          {/* Add Task button + viewMode */}
          <div className="flex w-full justify-between gap-2 mb-1">

            {/* Add Task button */}
            <button
              className="flex-1 bg-white text-sm sm:text-xs tracking-wide font-medium text-zinc-600 px-3 py-1 sm:py-1 rounded-md shadow-sm hover:brightness-105 transition text-nowrap"
              onClick={() => { setIsTaskFormVisible((prev) => (prev = !prev)); }}
            >
              Add SubTask
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center overflow-hidden px-1 text-zinc-700 rounded drop-shadow-xs drop-shadow-black/30 cursor-pointer ">
              <CiViewList
                className={`transition-colors duration-300 rounded-l text-[1.8rem] sm:text-xl shrink-0 ${
                  viewMode === "list"
                    ? "bg-zinc-600 text-white"
                    : "bg-white text-zinc-600 "
                }  `}
                onClick={() => {
                  setViewMode("list");
                }}
              />

              <CiGrid42
                className={`transition-colors duration-300 rounded-r text-[1.8rem] sm:text-xl shrink-0 ${
                  viewMode === "grid"
                    ? "bg-zinc-600 text-white"
                    : "bg-white text-zinc-600 "
                } `}
                onClick={() => {
                  setViewMode("grid");
                }}
              />
            </div>
          </div>

          {/* Search bar */}
          <input
            type="text"
            placeholder="Search projects or tasks..."
            className="w-full px-1 sm:py-0.5 mb-1 text-sm py-1 md:text-xs/4.75 text-zinc-700/90 border border-zinc-400/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-400/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />


          {/* Sort Component */}
          <Sort
            variant={"sidebar"}
            sortField={sortField}
            setSortField={setSortField}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
          />

          <button
            onClick={logOut}
            className="flex w-full mt-auto text-sm font-medium border-t border-zinc-400/70 text-zinc-600  text-nowrap"
          >
            Log Out
          </button>

        </div>
      ) : (
        <div className="w-full p-2 py-3 hidden md:flex flex-col items-center">
          <button
            className="flex justify-center items-center text-center text-zinc-600 text-2xl  w-[24px] h-[24px]  cursor-pointer rounded-xs mb-1"
            // shadow-[0_6px_4px_-5px_rgba(0,0,0,0.2),0_-6px_4px_-5px_rgba(0,0,0,0.2)]
            onClick={() => {
              setIsTaskFormVisible((prev) => (prev = !prev));
            }}
          >
            <FiPlus />
          </button>

          <button
            className="flex justify-center items-center text-center text-zinc-500 text-2xl cursor-pointer  w-[24px] h-[24px] p-0 rounded-xs mb-1"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <IoMenuOutline className="text-zinc-600" />
          </button>
        </div>
      )}
    </section>
  );
}

export default Sidebar;
