import React, { useState, useEffect, useRef } from "react";
import Task from "./task/Task";
import Sidebar from "./Sidebar";
import TaskForm from "./forms/TaskForm";
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

      {/* Main tasks Container */}
      <div
        className={`
          relative w-full  h-full flex flex-col p-2 md:px-0 gap-2
          ${isSidebarOpen && "blur-xs md:blur-none"}
          ${isSidebarOpen && "pointer-events-none "}`}
        onClick={() => {
          isTaskFormVisible && setIsTaskFormVisible((prev) => (prev = false));
          fullCardView && setFullCardView((prev) => (prev = false));
        }}
      >
        {/* Section Header*/}
        <div className={`flex items-center justify-between md:justify-center md:gap-1`}>
          {/* Mobile screen menu btn */}
          <button
            className="flex md:hidden justify-center items-center text-center md:bg-zinc-100 active:bg-gray-200 text-zinc-700 text-2xl cursor-pointer font-extrabold p-0 rounded"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <IoMenuOutline className="text-4xl text-zinc-700/90" />
          </button>

          {/* All Projects */}
          <button
            className={`text-sm md:text-base w-fit font-medium text-nowrap rounded-lg px-4 ${!isCompletedTaskVisible && "bg-zinc-300 "}`}
            onClick={() => {
              setIsCompletedTaskVisible(false);
            }}
          >
            Tasks
          </button>

          {/* Completed Projects */}
          <button
            onClick={() => {
              setIsCompletedTaskVisible(true);
            }}
            className={`text-sm md:text-base w-fit font-medium text-nowrap rounded-lg px-4 ${isCompletedTaskVisible && "bg-zinc-300"}`}
          >
            Completed Tasks
          </button>

          {/* Mobile screen add task(plus) icon */}
          <button
            className="flex  md:hidden justify-center  items-center  md:bg-zinc-100 active:bg-gray-200 text-zinc-600 text-4xl   cursor-pointer rounded"
            onClick={() => {
              setIsTaskFormVisible((prev) => (prev = !prev));
            }}
          >
            <FiPlus />
          </button>

        </div>

          {/* SubTask form */}
          {isTaskFormVisible && (
            <TaskForm
              taskFormType="mainForm"
              isTaskFormVisible={isTaskFormVisible}
              setIsTaskFormVisible={setIsTaskFormVisible}
              className="sm:shadow-lg " // Adds bigger shadow and padding on larger screens
            />
          )}

        {/* SubTasks Container */}
        <div
          ref={containerRef}
          className={`w-full h-full flex flex-col gap-3 rounded-2xl px-1 task-container
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
