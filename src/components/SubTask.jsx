import React from "react";
import { CiEdit } from "react-icons/ci";

import { AiOutlineDelete } from "react-icons/ai";
import TaskPriority from "./TaskPriority";

function SubTask({
  viewMode,
  subtask,
  subtaskCompletionFn,
  subtaskDeletionFn,
  subtaskPriorityFn,
  setEditingTaskId,
  completedTask,
}) {
  return (
    <div
      className={`group w-full cursor-default rounded-xs flex flex-col px-3 py-1.5 
         hover:shadow-[0_6px_10px_-8px_rgba(0,0,0,0.2),0_-6px_10px_-8px_rgba(0,0,0,0.2),6px_0px_10px_-8px_rgba(0,0,0,0.2),-6px_0px_10px_-8px_rgba(0,0,0,0.2)] transition-shadow duration-200`}
    >
      {/* Checkbox & title */}
      <div className={`flex items-center justify-between w-full`}>
        <div className="flex items-baseline">
          <input
            type="checkbox"
            checked={subtask.isCompleted}
            onChange={() => {
              subtaskCompletionFn(subtask.uniqueId);
            }}
            name=""
            id=""
            className=" w-0 h-0 opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:w-2.5 group-hover:h-2.5 group-hover:mr-2 cursor-pointer"
          />
          <h2
            className={`text-[0.9rem]/3 ${
              completedTask ? "  text-zinc-400 line-through" : "text-zinc-700/90"
            } wrap-anywhere tracking-tight `}
          >
            {subtask.title}
          </h2>
        </div>

        {/* controls */}
        <div
          className={`flex justify-start items-center mr-1 sm:mr-0 sm:gap-2 ${
            viewMode === "grid" &&
            " opacity-0 group-hover:opacity-100 transition-all duration-300"
          }`}
        >
          <button
            onClick={() => {
              setEditingTaskId(subtask.uniqueId);
            }}
            className="flex items-center justify-center text-zinc-500 cursor-pointer"
          >
            <CiEdit className="text-[1.35rem]" />
          </button>

          <button
            onClick={() => {
              subtaskDeletionFn(subtask.uniqueId);
            }}
            className="flex items-center justify-center text-zinc-500 cursor-pointer "
          >
            <AiOutlineDelete className="text-[1.1rem] ml-3.5 sm:ml-1" />
          </button>

          {/* {viewMode !== "grid" && (
            <TaskPriority
              subtask={subtask}
              subtaskPriorityFn={subtaskPriorityFn}
            />
          )} */}
        </div>
      </div>

      {/* Description */}

      {subtask.description && (
        <p className="w-full whitespace-pre-wrap text-zinc-500/80 text-[0.8rem] sm:font-light ">
          {subtask.description}
        </p>
      )}

      {/* <p className="relative text-[10px] font-extralight text-gray-600">{`${day}/${month}/${year.slice(
            2
          )} ${time}`}</p> */}
    </div>
  );
}

export default SubTask;
