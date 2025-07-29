import React from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { handleEditFn, handleDltFn } from "../utils/handleControlBtns";

function Task({ task, setTasks, handleToggleTask }) {
  const handleDlt = handleDltFn(task, setTasks);
  const handleEdit = handleEditFn(task, setTasks);

  return (
    <div className="flex flex-col gap-1  text-gray-800 w-[230px] min-h-fit overflow-hidden bg-gray-300 rounded-2xl">
      <div className="flex items-start justify-between mx-4 mt-3">
        <div>
          <h1 className="text-[13px] leading-3.5 truncate w-43 cursor-pointer">
            {task.title}
          </h1>
          <p className="text-[11px] font-medium opacity-50">{task.date}</p>
        </div>

        <input
          type="checkbox"
          checked={task.isCompleted}
          onChange={() => {
            handleToggleTask(task.uniqueId);
          }}
          name=""
          id=""
          className="w-[14px] h-[14px] cursor-pointer"
        />
      </div>

      <div className="flex justify-center w-full py-[3px] gap-2 rounded-b-2xl">
        <button
          onClick={handleEdit}
          className="flex items-center justify-center w-[21px] h-[21px] p-[2.5px] cursor-pointer rounded-full bg-zinc-700"
        >
          <FaEdit className="text-xs  text-zinc-300 " />
        </button>
        <button
          onClick={handleDlt}
          className="flex items-center justify-center w-[21px] h-[21px] p-[2.5px] cursor-pointer rounded-full bg-zinc-700"
        >
          <MdDelete className="text-sm  text-zinc-300 " />
        </button>
      </div>
    </div>
  );
}

export default Task;
