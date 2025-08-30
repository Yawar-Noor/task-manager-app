import React, { useState, useRef, useEffect } from "react";
import { IoSend } from "react-icons/io5";
import {
  subtaskTitleHandle,
  subtaskDescriptionHandle,
  subtaskDueDateHandle,
  subtaskSubmitHandleFn,
} from "../../utils/firebaseHandlers"; // Updated import

function Form({
  taskId,
  formType,
  subtask,
  isFormVisible,
  setIsFormVisible,
  setEditingTaskId,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [errors, setErrors] = useState({});

  const inputFocusRef = useRef(null);

  useEffect(() => {
    inputFocusRef.current.focus();
  }, [isFormVisible]);

  // Autofill edit form's input fields with existing value
  useEffect(() => {
    if (formType === "editForm" && subtask) {
      setTitle(subtask.title || "");
      setDescription(subtask.description);
      setDueDate(subtask.dueDate || "");
    } else if (formType !== "editForm") {
      setTitle("");
      setDescription("");
    }
  }, [formType, subtask]);

  function handleFormVisibility(result) {
    if (result.success) {
      setIsFormVisible(false);
    }
  }

  return (
    <form
      action="submit"
      className="flex flex-col justify-center px-3 py-2 w-full h-fit rounded-xl bg-white shadow-sm transition-shadow duration-200"
      onSubmit={async (e) => {
        e.preventDefault();

        if (!title.trim()) {
          setErrors((prev) => ({ ...prev, title: "Please enter a title." }));
          return;
        }

        const result = await subtaskSubmitHandleFn(
          e,
          taskId,
          formType,
          subtask,
          { title, description, dueDate },
          setTitle,
          setDescription,
          setDueDate,
          errors,
          setErrors,
          setEditingTaskId
        );

        handleFormVisibility(result);
      }}
      noValidate
    >
      <div className="w-full border-gray-400/30 rounded-xl drop-shadow-xs drop-shadow-zinc/50">
        <div className="flex gap-2 flex-col justify-between w-full h-fit rounded-xl mb-2">
          {/* Title Input */}
          <input
            className="w-full h-6 px-1 text-zinc-700/90 sm:text-xs/4.75 tracking-tight rounded-xl placeholder:text-gray-400/90 focus:outline-none"
            type="text"
            value={title}
            onChange={(e) => {
              subtaskTitleHandle(e, setTitle, setErrors);
            }}
            name="title"
            id="subtask-title"
            placeholder="Enter subtask..."
            ref={inputFocusRef}
            required
          />

          <div className="flex overflow-visible">
            <textarea
              className="textarea w-full min-h-7 max-h-40 overflow-auto text-gray-700/80 sm:text-xs/4.75 border border-zinc-400/20 rounded-xl px-2 py-1 placeholder:text-gray-400/90 focus:outline-none"
              type="description"
              value={description}
              onChange={(e) => {
                subtaskDescriptionHandle(e, setDescription);
              }}
              name="description"
              id="subtask-description"
              placeholder="Description"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            {/* Date Input */}
            
              <label htmlFor="task_date" className="flex items-end text-sm sm:text-xs text-gray-400/90">
                Due Date: &nbsp; 
              <input
                type="date"
                className=" p-1 text-xs cursor-pointer rounded-lg focus:outline-none ring-1 ring-gray-500/50"
                value={dueDate || ""}
                onChange={(e) => subtaskDueDateHandle(e, setDueDate, setErrors)}
                name=""
                id="subtask_date"
                required
                />
                </label>
       

            {/* Submit Button */}
            <button type="submit" className="sm:bg-zinc-700 rounded-xl px-2 py-0.5">
              <IoSend type="submit" className={`sm:hidden text-2xl text-center `} />
             <p className="hidden sm:flex text-white text-sm"> Add SubTask</p>
            </button>
          </div>
        </div>

        {Object.keys(errors).length > 0 && (
          <p className="text-red-600 text-[11px]">{Object.values(errors)[0]}</p>
        )}
      </div>
    </form>
  );
}

export default Form;
