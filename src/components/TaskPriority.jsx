import React from "react";
import Dropdown from "./ui/Dropdown";

function TaskPriority({
  variant,
  task,
  handleTaskPriority,
  subtask,
  subtaskPriorityFn,
}) {
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
      <Dropdown
        trigger={
          <button
            className={` transition-all duration-300
           ${variant !== "task" && handlePriorityColor(subtask.priority)} ${
              variant !== "task"
                ? "w-16 font-light text-zinc-500 border-b-2"
                : ""
            } 
          `}
          >
            Priority
          </button>
        }
        className={`relative h-fit  flex-col ${
          variant === "task" && "w-full"
        } ${variant !== "task" && "hidden sm:flex"}`}
      >
        {priorities.map((priority) => (
          <button
            key={priority}
            className={`w-full h-fit ${
              variant !== "task"
                ? "text-xs text-zinc-500 font-medium"
                : "text-sm text-start"
            }  ${handlePriorityColor(priority)}`}
            onClick={() => {
              {
                variant === "task"
                  ? handleTaskPriority(task.id, priority)
                  : subtaskPriorityFn(subtask.uniqueId, priority);
              }
            }}
          >
            {priority}
          </button>
        ))}
      </Dropdown>

  );
}

export default TaskPriority;
