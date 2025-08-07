import React, { useState, useEffect, useRef } from "react";
import SubTask from "./Subtask";
import { MdOutlineAdd } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import Form from "./Form";
import TaskForm from "./TaskForm";
import TaskPriority from "./TaskPriority";
import Sort from "./Sort";
import { BsThreeDotsVertical } from "react-icons/bs";
import { sortTasks } from "../utils/handleSort";
// for checkmark in future
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

// Add Firebase handlers import
import {
 
  handleSubtaskUpdate,
  handleSubtaskDeletion,
  
  handleTaskCompletion,
  handleTaskPriority,
  handleTaskDeletion,
} from "../utils/firebaseHandlers";

function Task({
  viewMode = "list", //Default List view
  taskId,
  task,
  isTaskFormVisible,
  fullCardView,
  setFullCardView,
  setTaskCardOpenId,
}) {
  // UseState for editing and UI change while editing
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const [isCompletedVisible, setIsCompletedVisible] = useState(false);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [editTaskForm, setEditTaskForm] = useState(false);

  const sortedTasks = sortTasks(task.subtasks, sortField, sortDirection);

  // If task controls dropdown is clicked it's other instances gets closed
  const taskOptionsDropdownRef = useRef(null);

  // close options dropdown when clicked outside it 
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        taskOptionsDropdownRef.current &&
        !taskOptionsDropdownRef.current.contains(event.target)
      ) {
        setIsOptionsVisible(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  useEffect(() => {
    if (task.isTaskCompleted) {
      setIsCompletedVisible(true);
    } else {
      setIsCompletedVisible(false);
    }
  }, [fullCardView, task.isTaskCompleted]);

  
  // ===== FIREBASE HANDLERS =====

  // Handle task deletion
  const subtaskDeletionFn = async (taskId) => {
    const taskToDelete = task.subtasks.find((subtask) => subtask.uniqueId === taskId);
    if (taskToDelete) {
      await handleSubtaskDeletion(task.id, taskToDelete);
    }
  };

  // Handle subtask completion toggle
  const subtaskCompletionFn = async (taskId) => {
    const subtask = task.subtasks.find((subtask) => subtask.uniqueId === taskId);
    if (subtask) {
      await handleSubtaskUpdate(task.id, subtask, { isCompleted: !subtask.isCompleted });
    }
  };

  // Handle subtask priority change
  const subtaskPriorityFn = async (taskId, priority) => {
    if (!priority) return;

    const subtask = task.subtasks.find((subtask) => subtask.uniqueId === taskId);
    if (subtask) {
      const result = await handleSubtaskUpdate(task.id, subtask, {
        priority: priority,
      });
    }
  };




  // Handle Task Completion change
  const taskCompletionFn = async (taskId) => {
    const updatedCompletion = !task.isTaskCompleted;


     await handleTaskCompletion(taskId, updatedCompletion);


  };

  // Handle task priority change
  const taskPriorityFn = async (taskId, priority) => {
    if (priority) {
      await handleTaskPriority(taskId, priority);
    }
  };

  // Handle task deletion
  const taskDeletionFn = async (taskId) => {
    await handleTaskDeletion(taskId);
  };

  // ===== UTILITY FUNCTIONS =====

  const formatDate = (timestamp) => {
    if (!timestamp) return "";

    let date;

    // Handle Firebase Timestamp object
    if (timestamp && typeof timestamp === "object" && timestamp.toDate) {
      // Firebase Timestamp has a toDate() method
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else if (typeof timestamp === "string") {
      date = new Date(timestamp);
    } else {
      return "";
    }

    // Check if date is valid
    if (isNaN(date.getTime())) return "";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(2);

    return `${day}:${month}:${year}`;
  };

  return (
    <div
      // task-view no scroll of tasks but grid-view scroll
      className={`flex flex-col  items-center justify-start h-fit bg-white border border-zinc-400/20 px-1 py-3 sm:p-3 rounded-2xl shadow-xs
      ${isTaskFormVisible && "blur-sm overflow-y-hidden pointer-events-none"}
      ${
        fullCardView
          ? "absolute top-[50%] left-[50%] translate-[-50%] w-[95%] sm:w-8/10 md:w-full md:max-w-170 max-h-[90%] blur-none p-4 shadow-[0_6px_45px_-8px_rgba(0,0,0,0.1),0_-6px_45px_-8px_rgba(0,0,0,0.1)]"
          : viewMode === "grid"
          ? "w-82 h-fit max-h-full border-zinc-400/50"
          : "w-full sm:w-8/10 md:w-full md:max-w-170 h-fit"
      }
     `}
      onClick={(e) => {
        fullCardView && e.stopPropagation();
        isOptionsVisible &&
          setIsOptionsVisible((prev) => false) &&
          e.stopPropagation();
      }}
    >
      {/* Task Header */}
      {!editTaskForm ? (
        <div className=" w-full flex flex-col justify-between items-center cursor-pointer px-2 pb-3">
          <div className=" w-full flex  justify-between items-center cursor-pointer">
            <div className="group w-[67%] flex items-center sm:pb-0">
              <input
                type="checkbox"
                checked={task.isTaskCompleted}
                onClick={() => {
                  taskCompletionFn(task.id);
                }}
                name=""
                id=""
                className=" w-0 h-0 opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:w-2.5 group-hover:h-2.5 group-hover:mr-2 cursor-pointer"
              />

              <h2
                className={`w-full tracking-[0.3px] text-zinc-600/90 wrap-break-word text-base/4 font-medium  `}
                onClick={() => {
                  setFullCardView((prev) => prev = true);
                  setTaskCardOpenId(task.id);
                }}
              >
                {task.taskTitle}
              </h2>
            </div>



            {/* Task Control Buttons */}
            <div className="flex justify-center items-center gap-1 ">


              {/* Options Dropdown */}
              <div
                className="relative group flex justify-end items-center w-fit h-fit"
                onClick={(e) => {
                  isOptionsVisible && e.stopPropagation();
                }}
                ref={taskOptionsDropdownRef}
              >
                <BsThreeDotsVertical
                  className="text-xl cursor-pointer transition-all duration-100 text-zinc-500"
                  onClick={(e) => {
                    setIsOptionsVisible((prev) => !prev);
                  }}
                />
                <div
                  className={`flex flex-col items-start justify-start w-0 h-0 opacity-0  absolute top-4 right-2 p-2 gap-1.5 rounded ${
                    isOptionsVisible
                      ? "text-nowrap overflow-hidden text-base sm:text-sm w-40 h-fit opacity-100 pointer-events-auto transition-all duration-200 ease-in-out z-999 bg-white shadow-[10px_12px_6px_-12px_rgba(0,0,0,0.2),-10px_-10px_6px_-12px_rgba(0,0,0,0.2)]"
                      : "pointer-events-none"
                  }`}
                >
                  <div className="flex justify-center items-center gap-2 ">
                    <button
                      onClick={() => {
                        setEditTaskForm((prev) => !prev);
                        setIsOptionsVisible((prev) => !prev);

                      }}
                      className={`rounded-full flex justify-center items-center   ${
                        editTaskForm && "w-0 opacity-0"
                      } `}
                    >
                      <CiEdit className="text-2xl sm:text-xl text-zinc-500" />
                    </button>

                    <button
                      className=" rounded-full  flex justify-center items-center  "
                      onClick={() => {
                        setIsFormVisible((prev) => (prev = !prev));
                        setIsOptionsVisible((prev) => !prev);

                      }}
                    >
                      <MdOutlineAdd className="text-[1.8rem] sm:text-2xl text-zinc-500" />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setIsCompletedVisible((prev) => !prev);
                    }}
                    className={`w-full text-start cursor-pointer text-zinc-700/90  `}
                  >
                    {isCompletedVisible ? "In Progress" : "Completed"}
                  </button>

                  <TaskPriority
                    variant={"task"}
                    task={task}
                    taskPriorityFn={taskPriorityFn}
                  />

                  <Sort
                    variant={"task"}
                    sortField={sortField}
                    setSortField={setSortField}
                    sortDirection={sortDirection}
                    setSortDirection={setSortDirection}
                  />

                  <button
                    onClick={() => {
                      taskDeletionFn(task.id);
                    }}
                    className="w-full cursor-pointer text-start"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          {fullCardView && (
            <p className="w-full h-fix text-xs text-zinc-500/90">
              {task.taskDescription}
            </p>
          )}
        </div>
      ) : (
        <TaskForm
          task={task}
          taskFormType="editTaskForm"
          setEditTaskForm={setEditTaskForm}
        />
      )}

      {
        <div className={`w-full flex items-center justify-between px-2`}>
          <p
            className={`font-medium text-[10px] text-center text-gray-400 tracking-wider `}
          >
            {isCompletedVisible ? "COMPLETED - SUB TASKS" : "TODO - SUB TASKS"}
          </p>
          <p className={`text-xs font-light tracking-[0.4px] text-gray-400`}>
            Due on:
            {task.taskDueDate && formatDate(task.taskDueDate)}
          </p>
        </div>
      }

      {/* SubTask Task container */}

      {!isCompletedVisible ? (
        <div
          className={`task-container tasks-column flex flex-col w-full h-full blur-none py-1 gap-2
          ${viewMode === "grid" && "overflow-y-auto"}
          ${fullCardView && "h-fit max-h-full overflow-y-scroll"}
          `}
        >
          {task.subtasks.filter((subtask) => !subtask.isCompleted).length > 0 ||
          isFormVisible ? (
            <>
              {sortedTasks.map(
                (subtask) =>
                  !subtask.isCompleted &&
                  (editingTaskId === subtask.uniqueId ? (
                    <Form
                      taskId={task.id}
                      formType="editForm"
                      subtask={subtask}
                      isFormVisible={isFormVisible}
                      setIsFormVisible={setIsFormVisible}
                      setEditingTaskId={setEditingTaskId}
                      key={subtask.uniqueId}
                    />
                  ) : (
                    <SubTask
                      viewMode={viewMode}
                      subtask={subtask}
                      subtaskCompletionFn={subtaskCompletionFn}
                      subtaskDeletionFn={subtaskDeletionFn}
                      subtaskPriorityFn={subtaskPriorityFn}
                      setEditingTaskId={setEditingTaskId}
                      key={subtask.uniqueId}
                    />
                  ))
              )}

              {isFormVisible && (
                <Form
                  taskId={task.id}
                  formType="mainForm"
                  isFormVisible={isFormVisible}
                  setIsFormVisible={setIsFormVisible}
                />
              )}
            </>
          ) : (
            <div className="w-full h-5 flex justify-center items-center text-sm text-zinc-600/50">
              <h1>Add sub tasks</h1>
            </div>
          )}
        </div>
      ) : (
        <div
          className={`task-container tasks-column flex flex-col w-full py-1 gap-2 h-full rounded-[10px] blur-none ${
            viewMode === "grid" && "overflow-y-auto"
          }`}
        >
          {task.subtasks.filter((subtask) => subtask.isCompleted).length > 0 ? (
            <>
              {sortedTasks.map(
                (subtask) =>
                  subtask.isCompleted && (
                    <SubTask
                      viewMode={viewMode}
                      subtask={subtask}
                      subtaskCompletionFn={subtaskCompletionFn}
                      subtaskDeletionFn={subtaskDeletionFn }
                      subtaskPriorityFn={subtaskPriorityFn}
                      setEditingTaskId={setEditingTaskId}
                      key={subtask.uniqueId}
                      completedTask={true}
                    />
                  )
              )}
            </>
          ) : (
            <div className="w-full h-5 flex justify-center items-center text-sm text-zinc-600/50 gap-2">
              <h1>Empty</h1>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Task;
