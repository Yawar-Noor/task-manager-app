// TaskHeader.jsx
import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { MdOutlineAdd } from "react-icons/md";
import TaskPriority from "../TaskPriority";
import Sort from "../Sort";

function TaskHeader({
  task,
  fullCardView,
  setFullCardView,
  setTaskCardOpenId,

  isOptionsVisible,
  setIsOptionsVisible,
  taskOptionsDropdownRef,

  editTaskForm,
  setEditTaskForm,

  setIsFormVisible,

  isCompletedVisible,
  setIsCompletedVisible,

  taskPriorityFn,
  taskCompletionFn,
  taskDeletionFn,

  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
}) {
  return (
    <div className="w-full flex flex-col justify-between items-center cursor-pointer px-2">
      <div className="w-full flex justify-between items-center cursor-pointer">
        <div className="group w-[67%] flex items-center sm:pb-0">
          <input
            type="checkbox"
            checked={task.isTaskCompleted}
            onClick={() => taskCompletionFn(task.id)}
            className="w-0 h-0 opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:w-2.5 group-hover:h-2.5 group-hover:mr-2 cursor-pointer"
            readOnly
          />
          <h2
            className="w-full text-[20px] tracking-[0.3px] text-zinc-600/90 wrap-break-word font-medium"
            onClick={() => {
              setFullCardView(true);
              setTaskCardOpenId(task.id);
            }}
          >
            {task.taskTitle}
          </h2>
        </div>

        {/* Task Control Buttons */}
        <div className="flex justify-center items-center gap-1">

          {/* Options Dropdown */}
          <div
            className="relative group flex justify-end items-center w-fit h-fit"
            onClick={(e) => {
              if (isOptionsVisible) e.stopPropagation();
            }}
            ref={taskOptionsDropdownRef}
          >
            <BsThreeDotsVertical
              className="text-xl cursor-pointer transition-all duration-100 text-zinc-500"
              onClick={(e) => {
                e.stopPropagation();
                setIsOptionsVisible((prev) => !prev);
              }}
            />
            <div
              className={`flex flex-col items-start justify-start w-0 h-0 opacity-0 absolute top-4 right-2 p-2 gap-1.5 rounded ${
                isOptionsVisible
                  ? "w-40 h-fit opacity-100 pointer-events-auto transition-all duration-200 ease-in-out z-999 bg-white shadow-[10px_12px_6px_-12px_rgba(0,0,0,0.2),-10px_-10px_6px_-12px_rgba(0,0,0,0.2)]"
                  : "pointer-events-none"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => {
                    setEditTaskForm((prev) => !prev);
                    setIsOptionsVisible(false);
                  }}
                  className={`rounded-full flex justify-center items-center ${
                    editTaskForm ? "w-0 opacity-0" : ""
                  }`}
                >
                  <CiEdit className="text-2xl sm:text-xl text-zinc-500" />
                </button>

                <button
                  className="rounded-full flex justify-center items-center"
                  onClick={() => {
                    setIsFormVisible((prev) => !prev);
                    setIsOptionsVisible(false);
                  }}
                >
                  <MdOutlineAdd className="text-[1.8rem] sm:text-2xl text-zinc-500" />
                </button>
              </div>

              <button
                onClick={() => {
                  setIsCompletedVisible((prev) => !prev);
                }}
                className="w-full text-start cursor-pointer text-zinc-700/90"
              >
                {isCompletedVisible ? "In Progress" : "Completed"}
              </button>

              <TaskPriority
                variant="task"
                task={task}
                handleTaskPriority={taskPriorityFn}
              />

              <Sort
                variant="task"
                sortField={sortField}
                setSortField={setSortField}
                sortDirection={sortDirection}
                setSortDirection={setSortDirection}
              />

              <button
                onClick={() => taskDeletionFn(task.id)}
                className="w-full cursor-pointer text-start"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {fullCardView && (
        <p className="w-full h-fit text-xs text-zinc-500/90">
          {task.taskDescription}
        </p>
      )}
    </div>
  );
}

export default TaskHeader;
