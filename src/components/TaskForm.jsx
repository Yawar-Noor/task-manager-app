import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  taskTitleHandle,
  taskDescriptionHandle,
  taskDueDateHandle,
  taskSubmitHandleFn,
} from "../utils/firebaseHandlers"; 

function TaskForm({ task, isTaskFormVisible, setIsTaskFormVisible, taskFormType, setEditTaskForm}) {
  const { currentUser } = useAuth(); 
  
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDueDate, setTaskDueDate] = useState(null);
  const [taskDescription, setTaskDescription] = useState("");
  const [taskErrors, setTaskErrors] = useState({ title: "" });

  const inputFocusRef = useRef(null);
  const taskDueDatePickerRef = useRef(null);


  // Autofill task edit form
useEffect(() => {

  if(taskFormType === "editTaskForm"){
    setTaskTitle(task.taskTitle || "");
    setTaskDescription(task.taskDescription || "");
    
    // Handle the due date for editing
    if (task.taskDueDate) {
      let dateValue = "";
      
      if (task.taskDueDate && typeof task.taskDueDate === 'object' && task.taskDueDate.toDate) {
        // Firebase Timestamp
        dateValue = task.taskDueDate.toDate().toISOString().split("T")[0];
      } else if (task.taskDueDate instanceof Date) {
        // Regular Date object
        dateValue = task.taskDueDate.toISOString().split("T")[0];
      } else if (typeof task.taskDueDate === 'string') {
        // String date
        dateValue = task.taskDueDate.split("T")[0];
      }
      
      setTaskDueDate(dateValue);
    } else {
      setTaskDueDate("");
    }
  } else {

    setTaskTitle("")
    setTaskDescription("")
    setTaskDueDate(null)
  }
}, [taskFormType, task])

  

  useEffect(() => {
    inputFocusRef.current.focus();
  }, [isTaskFormVisible]);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!taskTitle.trim()) {
          setTaskErrors((prev) => ({ ...prev, title: "Please enter a title." }));
          return;
        }

        {taskFormType !== "editTaskForm" ? setIsTaskFormVisible(false): setEditTaskForm(false);}

        
        const result = await taskSubmitHandleFn(
          currentUser.uid,
          task ? task : undefined,
          taskFormType,
          taskTitle, 
          setTaskTitle,  
          taskDescription, 
          setTaskDescription, 
          taskDueDate, 
          setTaskDueDate, 
          taskErrors,
        );
        
        if (!result.success) {
          console.error("Failed to save the project!")
        }

      }}
      onClick={(e) => e.stopPropagation()}
      className={`flex flex-col justify-between h-fit  ${taskFormType !== "editTaskForm" ? "w-[95%] sm:w-170 absolute left-[50%] top-[50%] z-9999 translate-[-50%]":" w-full static"} p-2 gap-3 border border-zinc-400/50 rounded-[10px] bg-white drop-shadow-xs drop-shadow-zinc/50`}
    >
      <input
        type="text"
        placeholder={`${taskFormType === "editTaskForm" ?"Enter New Task Name": "Enter Task Name"}`}
        value={taskTitle}
        onChange={(e) => {
          taskTitleHandle(e, setTaskTitle, setTaskErrors);
        }}
        className="w-full h-6 text-zinc-700/90 sm:text-sm/4.75  rounded-xl border-gray-700  px-1 placeholder:text-gray-400/70 focus:outline-none"
        name="Task"
        id=""
        ref={inputFocusRef}
      />

        <textarea
          className="textarea w-full  min-h-7 max-h-40 overflow-auto text-gray-700/80 sm:text-sm/4.75 border border-zinc-400/20
           rounded-xl px-2 py-1 placeholder:text-gray-400/70 focus:outline-none focus:ring-1 focus:ring-zinc-400/70"
          type="description"
          value={taskDescription}
          onChange={(e) => {
            taskDescriptionHandle(e, setTaskDescription);
          }}
          name="title"
          id="task-title"
          placeholder="Description"
        />


          <div className="w-full flex items-center justify-between">
            <label htmlFor="task_duedate" className="text-sm sm:text-xs text-gray-700/50">Due Date: &nbsp;
            <input
              type="date"
              className="p-1 text-xs cursor-pointer rounded-lg focus:outline-none ring-1 ring-gray-500/50"
              value={taskDueDate || ''}
              onChange={(e) => taskDueDateHandle(e, setTaskDueDate, setTaskErrors)}
              ref={taskDueDatePickerRef}
              name=""
              id="task_duedate"
              />
              </label>
        
        {/* Submit Button */}
        <button type="submit" className="bg-zinc-700 rounded-xl px-3 py-1.5 sm:py-1">
                      {/* <IoSend type="submit" className={`sm:hidden text-2xl text-center `} /> */}
                     <p className="flex text-white text-sm"> Submit Task</p>
                    </button>
          </div>
      
      {Object.keys(taskErrors).length > 0 && (
        <p className="text-red-600 text-[11px]">{Object.values(taskErrors)[0]}</p>
      )}
      
    </form>
  );
}

export default TaskForm;
