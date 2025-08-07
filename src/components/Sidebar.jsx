import React, { useState,useEffect, useRef } from "react";
import { TbLayoutSidebarRightExpandFilled } from "react-icons/tb";
import { RiArrowDownSLine } from "react-icons/ri";
import { RiArrowUpSLine } from "react-icons/ri";
import Sort from "./Sort";
import { auth } from "../config/firebase.js";
import { signOut } from "firebase/auth";
import { CiViewList } from "react-icons/ci";
import { CiGrid42 } from "react-icons/ci";

import { IoMenuOutline } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";

function Sidebar({
  tasks,
  isSidebarOpen,
  setIsSidebarOpen,
  viewMode,
  setViewMode,
  setIsTaskFormVisible,
  setIsCompletedTaskVisible,
  setFullCardView,
  setTaskCardOpenId,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  searchTerm,
  setSearchTerm,
}) {
  const [isProjectsVisible, setIsProjectsVisible] = useState(true);
  const [isCompletedProjectsVisible, setIsCompletedProjectsVisible] = useState(false);

const sidebarRef = useRef(null)

  useEffect(() => {
    
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    }

    {document.addEventListener("mousedown", handleClickOutside);}
    return () => {
      {document.removeEventListener("mousedown", handleClickOutside);}
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
      className={`absolute z-10000  md:static flex flex-col justify-center md:justify-start text-zinc-700 transition-all duration-300 ease-out ${
        isSidebarOpen ? "w-60 min-w-50 sm:max-w-47 sm:w-47 h-full overflow-hidden" : "w-0 md:w-9"
      }`}
    >
      {/* Future Responsive behaviour to be added: at mobile or tab screens click on other than sidebar collapses the sidebar */}
      {isSidebarOpen ? (
        <div className="flex flex-col p-2 py-3 gap-1.5 h-[95%] md:h-full rounded-r-2xl border-r border-t border-b border-zinc-400/60 bg-white sm:bg-zinc-100 ">
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

          {/* viewMode + Add Task button*/}
          <div className="flex w-full justify-between gap-2 mb-1">
            <button
              className="flex-1 bg-white text-sm sm:text-xs tracking-wide font-medium text-zinc-600 px-3 py-1 sm:py-1 rounded-md shadow-sm hover:brightness-105 transition text-nowrap"
              onClick={() => {
                setIsTaskFormVisible((prev) => (prev = !prev));
                setIsSidebarOpen(false)
              }}
            >
              {" "}
              Add SubTask
            </button>
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

          {/* Projects */}
          <div
            className={`w-full h-fit ${
              isProjectsVisible &&
              " rounded inset-shadow-[0_6px_8px_-10px_rgba(0,0,0,0.2),0_-6px_8px_-10px_rgba(0,0,0,0.2)]"
            }`}
          >
            <button
              className={`flex w-full items-center justify-between sm:text-sm font-medium text-zinc-700/90 text-nowrap`}
              onClick={() => {
                setIsProjectsVisible((prev) => !prev);
                !isProjectsVisible && setIsCompletedProjectsVisible(false);
                setIsCompletedTaskVisible(false);
              }}
            >
              Tasks
              {!isProjectsVisible ? (
                <RiArrowDownSLine className="text-lg sm:text-[16px]" />
              ) : (
                <RiArrowUpSLine className="text-lg sm:text-[16px]" />
              )}{" "}
            </button>

            <ul
              className={`sidebar-task-container flex flex-col items-start w-full h-0 gap-1 ${
                isProjectsVisible && " h-fit w-full max-h-[200px]"
              } overflow-y-scroll scroll-smooth overflow-x-hidden text-700/90`}
            >
              {tasks.map((task) => (
                <li
                  className={` h-0 opacity-0 appearance-none ${
                    isProjectsVisible
                      ? " w-35 whitespace-nowrap min-h-5 pl-3 truncate opacity-100 appearance-auto pointer-events-auto"
                      : " pointer-events-none"
                  } transition-all duration-200 text-sm font-normal text-gray-500 ease-in-out cursor-pointer`}
                  onClick={() => {
                    setFullCardView((prev) => (prev = true));
                    setTaskCardOpenId(task.id);
                  }}
                >
                  {task.taskTitle}
                </li>
              ))}
            </ul>
          </div>

          <div className="">
            <button
              onClick={() => {
                setIsCompletedProjectsVisible((prev) => !prev);
                !isCompletedProjectsVisible &&
                  setIsProjectsVisible(false) &&
                  SetisSortCollapsed(true);

                setIsCompletedTaskVisible(true);
              }}
              className={`flex w-full items-center justify-between sm:text-sm font-medium text-zinc-700/90 text-nowrap`}
            >
              Completed Tasks
              {!isCompletedProjectsVisible ? (
                <RiArrowDownSLine className="text-lg sm:text-[16px]" />
              ) : (
                <RiArrowUpSLine className="text-lg sm:text-[16px]" />
              )}{" "}
            </button>
            <ul
              className={`sidebar-task-container flex flex-col items-start w-full h-0 gap-1 ${
                isCompletedProjectsVisible && " h-fit w-full max-h-[200px]"
              } overflow-y-scroll scroll-smooth overflow-x-hidden text-zinc-700/90`}
            >
              {tasks.map(
                (task) =>
                  task.isTaskCompleted == true && (
                    <li
                      onClick={() => {
                        setFullCardView((prev) => (prev = true));
                        setTaskCardOpenId(task.id);
                      }}
                      className={`h-0 opacity-0 appearance-none ${
                        isCompletedProjectsVisible
                          ? "w-35 whitespace-nowrap min-h-5 pl-3  truncate opacity-100 appearance-auto pointer-events-auto"
                          : " pointer-events-none"
                      } transition-all duration-200 text-sm font-normal text-gray-500 ease-in-out cursor-pointer`}
                    >
                      {task.taskTitle}
                    </li>
                  )
              )}
            </ul>
          </div>

          <Sort
            variant={"sidebar"}
            sortField={sortField}
            setSortField={setSortField}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
            isProjectsVisible={isProjectsVisible}
            setIsProjectsVisible={setIsProjectsVisible}
            isCompletedProjectsVisible={isCompletedProjectsVisible}
            setIsCompletedProjectsVisible={setIsCompletedProjectsVisible}
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
            className="flex justify-center items-center text-center bg-zinc-100 text-zinc-600 text-2xl  w-[24px] h-[24px]  cursor-pointer shadow-xl rounded mb-2"
            // shadow-[0_6px_4px_-5px_rgba(0,0,0,0.2),0_-6px_4px_-5px_rgba(0,0,0,0.2)]
            onClick={() => {
              setIsTaskFormVisible((prev) => (prev = !prev));
            }}
          >
            <FiPlus />
          </button>

          <button
            className="flex justify-center items-center text-center bg-zinc-100 text-zinc-500 text-2xl cursor-pointer  w-[24px] h-[24px] p-0 shadow-xl rounded mb-2"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <IoMenuOutline className="text-zinc-600"/>
          </button>
        </div>
      )}
    </section>
  );
}

export default Sidebar;
