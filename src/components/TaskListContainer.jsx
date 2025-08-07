import React, { useState, useEffect, useRef } from "react";
import Task from "./Task";
import Sidebar from "./Sidebar";
import TaskForm from "./TaskForm";
import { filterTasks } from "../utils/filterTasksCallback";
import { sortTasks } from "../utils/handleSort";
import { useAuth } from "../contexts/AuthContext";
import { useTasks } from "../hooks/firebase/useFirestore";

import { TiThMenu } from "react-icons/ti";
import { IoMenuOutline } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";

function TaskListContainer() {
  const { currentUser } = useAuth();

  // Replace localStorage with Firebase
  const { tasks, loading, error } = useTasks(currentUser?.uid);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCompletedTaskVisible, setIsCompletedTaskVisible] = useState(false);
  const [isTaskFormVisible, setIsTaskFormVisible] = useState(false);
  const [fullCardView, setFullCardView] = useState(false);
  const [taskCardOpenId, setTaskCardOpenId] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");

  const sortedTasks = sortTasks(tasks, sortField, sortDirection);

  const filteredTasks = sortedTasks.filter((task) =>
    filterTasks(task, searchTerm)
  );

  const containerRef = useRef(null);

  // Scrolling in listView used to pull tasks up in gridview too, even though gridView has scroll-y-hidden
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
      containerRef.current.scrollLeft = 0;
    }
  }, [viewMode]);

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div>Loading your projects...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <main className="relative flex w-full h-full bg-zinc-100 text-zinc-700">
      <Sidebar
        tasks={tasks}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        viewMode={viewMode}
        setViewMode={setViewMode}
        setIsTaskFormVisible={setIsTaskFormVisible}
        setIsCompletedTaskVisible={setIsCompletedTaskVisible}
        setFullCardView={setFullCardView}
        setTaskCardOpenId={setTaskCardOpenId}
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Main Container */}
      <div
        className={`
          relative w-full  h-full flex flex-col p-2 sm:px-5 gap-2 
          ${isSidebarOpen && "blur-xs md:blur-none"}
          ${isSidebarOpen && "pointer-events-none "}`}
        onClick={() => {
          isTaskFormVisible && setIsTaskFormVisible((prev) => (prev = false));
          fullCardView && setFullCardView((prev) => (prev = false));
        }}
      >
        {/* Section Header*/}
        <div className={`flex items-center md:gap-0 justify-between`}>
          {/* Mobile screen menu btn */}
          <button
            className="flex md:hidden justify-center items-center text-center md:bg-zinc-100 active:bg-gray-200 text-zinc-700 text-2xl cursor-pointer font-extrabold p-0 rounded"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <IoMenuOutline className="text-4xl text-zinc-700/90" />
          </button>

          <h3 className="flex items-baseline text-xl font-bold tracking-tight">
            <span className="text-base text-gray-500 font-medium ">
              {isCompletedTaskVisible ? "Completed" : "In Progress"}
            </span>
          </h3>

          {/* Mobile screen add task plus icon */}
          <button
            className="flex  md:hidden justify-center  items-center  md:bg-zinc-100 active:bg-gray-200 text-zinc-600 text-4xl   cursor-pointer rounded"
            onClick={() => {
              setIsTaskFormVisible((prev) => (prev = !prev));
            }}
          >
            <FiPlus />
          </button>

            {/* SubTask form */}
          {isTaskFormVisible && (
            <TaskForm
              taskFormType="mainForm"
              isTaskFormVisible={isTaskFormVisible}
              setIsTaskFormVisible={setIsTaskFormVisible}
            />
          )}
        </div>

        {/* SubTasks Container */}
        <div
          ref={containerRef}
          className={`w-full h-full flex flex-col gap-3 rounded-2xl px-1
              ${isTaskFormVisible && "blur-sm overflow-y-hidden"}
              ${fullCardView && "pointer-events-none blur-3xl "}
              ${
                viewMode === "grid"
                  ? "flex-wrap content-start overflow-x-auto overflow-y-hidden"
                  : "task-task-container overflow-x-hidden overflow-y-auto items-center"
              }`}
        >
          {filteredTasks.map((task) =>
            !isCompletedTaskVisible
              ? !task.isTaskCompleted && (
                  <>
                    <Task
                      viewMode={viewMode}
                      key={task.id}
                      task={task}
                      isTaskFormVisible={isTaskFormVisible}
                      setFullCardView={setFullCardView}
                      setTaskCardOpenId={setTaskCardOpenId}
                    />
                  </>
                )
              : task.isTaskCompleted && (
                  <>
                    <Task
                      viewMode={viewMode}
                      key={task.id}
                      task={task}
                      isTaskFormVisible={isTaskFormVisible}
                      setFullCardView={setFullCardView}
                      setTaskCardOpenId={setTaskCardOpenId}
                    />
                  </>
                )
          )}
        </div>

        {/* Task Card Shown  */}
        {fullCardView && (
          <Task
            task={tasks.find((task) => task.id === taskCardOpenId)}
            isTaskFormVisible={isTaskFormVisible}
            fullCardView={fullCardView}
            setFullCardView={setFullCardView}
          />
        )}
      </div>
    </main>
  );
}

export default TaskListContainer;
