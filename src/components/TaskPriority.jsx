import React, { useState,useEffect, useRef } from "react";
import { RiArrowDownSLine } from "react-icons/ri";
import { RiArrowUpSLine } from "react-icons/ri";


function TaskPriority({variant, task, handleTaskPriority, subtask, subtaskPriorityFn, }) {
  const [isPriorityOn, setIsPriorityOn] = useState(false);

  const dropdownRef = useRef(null);
  // const toggleDropdown = () => ;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsPriorityOn(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const priorities = ["High", "Medium", "Low"];

  function handlePriorityColor(priority) {
    if (priority == "High") {
      return "border-b-red-500";
    } else if (priority == "Medium") {
      return "border-b-yellow-500";
    } else if (priority == "Low") {
      return "border-b-green-500";
    }
  }


  return (
    <div className={`relative h-fit  flex-col ${variant ==="task" && "w-full" } ${variant !== "task" && "hidden sm:flex"}`}>
        <button
          className={`text-center sm:text-sm ${isPriorityOn ? "appearance-none pointer-events-none":" opacity-100 appearance-auto"} transition-all duration-300
           ${variant !=="task" &&  handlePriorityColor(subtask.priority) } ${variant !=="task" ? "w-16 font-light text-zinc-500 border-b-2": " w-full  flex items-center justify-between" } 
          
          `}
          onClick={()=>{
            setIsPriorityOn(prev => !prev)
          }}
        >
          {variant==="task"? task.priority : subtask.priority}
          {!isPriorityOn ? (
                    variant ==="task" && <RiArrowDownSLine className="text-[16px]"/>
                  ) : (
                     variant ==="task" &&<RiArrowUpSLine className="text-[16px]"/>
                  )}
        </button>
        
        <div className={` h-0 opacity-0 overflow-hidden appearance-none 
        ${variant !=="task" ? isPriorityOn && "h-14 opacity-100 appearance-auto" : isPriorityOn && "h-17 sm:h-14 opacity-100 appearance-auto py-1 gap-1"}
        transition-all duration-300 flex flex-col items-start justify-start 
        ${variant !=="task" && "w-15.5 absolute z-100 left-[50%] translate-x-[-50%] translate-y-[-115%] top-6 bg-white drop-shadow-sm rounded"} 
        `}
        ref={dropdownRef}
        >
          {priorities.map((priority) => (
            <button
            key={priority}
              className={`w-full h-fit ${variant !=="task" ?"text-xs text-zinc-500 font-medium text-center":"text-sm sm:text-xs  text-start pl-2" }  ${handlePriorityColor(
                priority
              )}`}
              onClick={() => {
                setIsPriorityOn(false);
                {variant==="task"? handleTaskPriority(task.id, priority) :subtaskPriorityFn(subtask.uniqueId, priority)}
              }}
            >
              {priority}
            </button>
          ))}
        </div>
    </div>
  );
}

export default TaskPriority;
