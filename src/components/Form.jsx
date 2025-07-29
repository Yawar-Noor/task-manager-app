import React, { useState, useRef } from "react";
import { IoSend } from "react-icons/io5";
import { inputTitleHandleFn, inputDateHandleFn,submitHandleFn } from "../utils/inputHandle";
import { MdDateRange } from "react-icons/md";


function Form({setTasks}) {
  
  const [title, setTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  
  let newTask = { title, date: selectedDate, uniqueId: Date.now(), isCompleted:false};

  let inputTitleHandle = inputTitleHandleFn(setTitle);
  let submitHandle =submitHandleFn(setTasks, newTask, setTitle, setSelectedDate)
  const inputDateHandle = inputDateHandleFn(setSelectedDate); 

  const datePickerRef = useRef(null);

  // Trigger date picker when calender icon, by which original date input icon was replaced, is clicked
  const triggerPicker = () => {
    if (datePickerRef.current) {
      datePickerRef.current.showPicker();
    }
  };


  return (
    <form
      action="submit"
      className="flex justify-center items-center w-fit h-fit fixed bottom-0 right-0 px-3 py-2 mx-3 my-3 bg-gray-300 rounded-2xl"
      onSubmit={submitHandle}

    >
      {/* Title Input */}
      <input
        className="text-gray-700 text-[14px] font-semibold leading-3.5 border-1 border-gray-700 rounded-full px-3 py-1 placeholder:text-gray-300 focus:outline-none"
        type="text"
        // value={title}
        name="title"
        id="task-title"
        placeholder="Enter your task title"
        onChange={inputTitleHandle}
        required
      />



      {/* Date Input */}
    <div className="flex items-center justify-between">
      <MdDateRange onClick={triggerPicker} className="text-3xl text-gray-700" />
      <input
        type="datetime-local"
        className=" w-0 h-0"
        selected={selectedDate}
        onChange={inputDateHandle}
        ref={datePickerRef}
        name=""
        id=""
        required
      />
    </div>



      {/* Submit Nutton */}

      <button
        type="submit"
        className="relative flex items-center justify-center text-center pl-2 text-[26px] rounded-full"
      >
        <IoSend className="text-gray-700 text-center" />
      </button>
    </form>
  );
}

export default Form;
