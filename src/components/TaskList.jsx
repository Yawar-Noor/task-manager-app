import React from "react";
import Task from "./Task";

function TaskList({ heading, tasks, setTasks, handleToggleTask }) {

  return (
    <div className="relative flex flex-col w-[16em] h-full items-center justify-start pb-2 bg-zinc-200 border border-zinc-400 rounded-2xl">
      <div className="w-full">
        <p className="p-3 text-[14px]">{heading}</p>
      </div>
      <div className="task-list-container flex flex-col w-fit h-full gap-2 overflow-y-scroll scroll-smooth overflow-x-hidden  rounded-2xl">
        {tasks.map((task, idx) => {
          return <Task task={task} setTasks={setTasks} key={idx} handleToggleTask={handleToggleTask}/>;
         
        })}
      </div>
    </div>
  );
}

export default TaskList;
