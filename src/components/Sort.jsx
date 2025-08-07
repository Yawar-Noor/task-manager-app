import React, { useState, useRef, useEffect } from "react";
import { RiArrowDownSLine } from "react-icons/ri";
import { RiArrowUpSLine } from "react-icons/ri";

function Sort({
  variant,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  setIsProjectsVisible,
  setIsCompletedProjectsVisible,
}) {
  const [isSortVisible, setIsSortVisible] = useState(false);
  const sortRef = useRef(null);

  // Close dropdown if clicked outside (add a mousedown event listener)
  useEffect(() => {
    
    function handleClickOutside(event) {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortVisible(false);
      }
    }

    {variant !== "sidebar" && document.addEventListener("mousedown", handleClickOutside);}
    return () => {
      {variant !=="sidebar" && document.removeEventListener("mousedown", handleClickOutside);}
    };

  }, []);

  const handleSortClick = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <div
      ref={sortRef}
      className={`relative flex flex-col h-fit w-full 
        ${isSortVisible && "rounded inset-shadow-[0_6px_8px_-10px_rgba(0,0,0,0.2),0_-6px_8px_-10px_rgba(0,0,0,0.2)]"}`}
    >

      <button
        className={`flex w-full items-center justify-between ${variant === "sidebar" && "sm:text-sm font-medium text-zinc-700/90" } text-nowrap`}
        onClick={() => {
        setIsSortVisible((prev) => !prev);
        !isSortVisible && setIsCompletedProjectsVisible(false)
        !isSortVisible && setIsProjectsVisible(false)
      }}
      >
        {variant === "sidebar" ? "Sort Tasks" : "Sort Sub Tasks"}
        {!isSortVisible ? (
          <RiArrowDownSLine className="text-lg sm:text-[16px]" />
        ) : (
          <RiArrowUpSLine className="text-lg sm:text-[16px]" />
        )}
      </button>


      <div
        className={`flex flex-col items-start justify-start w-full h-0 opacity-0 overflow-hidden appearance-none pl-3 rounded ${
          isSortVisible
            ? "text-nowrap h-24 pt-0 py-1 gap-1 opacity-100 appearance-auto pointer-events-auto transition-all duration-300 rounded"
            : "pointer-events-none"
        }`}
      >

        <button
          onClick={() => { setSortField(null); setIsSortVisible(false); }}
          className={`w-full h-fit text-start ${variant==="sidebar" ? "text-sm font-normal text-gray-500":"sm:text-xs"}`}
        >
          Original
        </button>

        <button
          onClick={() => { handleSortClick("date"); setIsSortVisible(false); }}
          className={`w-full text-start h-fit ${variant==="sidebar" ? "text-sm font-normal text-gray-500":"sm:text-xs"}`}
        >
          Added on{" "} {sortField === "date" ? (sortDirection === "asc" ? "↑" : "↓") : ""}
        </button>

        <button
          onClick={() => { handleSortClick("dueDate"); setIsSortVisible(false); }}
          className={`w-full text-start h-fit ${variant==="sidebar" ? "text-sm font-normal text-gray-500":"sm:text-xs"}`}
        >
          Due Date{" "} {sortField === "dueDate" ? (sortDirection === "asc" ? "↑" : "↓") : ""}
        </button>

        <button
          onClick={() => { handleSortClick("priority"); setIsSortVisible(false); }}
          className={`w-full text-start h-fit ${variant==="sidebar" ? "text-sm font-normal text-gray-500":"sm:text-xs"}`}
        >
          Priority{" "} {sortField === "priority" ? sortDirection === "asc" ? "↑" : "↓" : ""}
        </button>

      </div>
    </div>
  );
}

export default Sort;
