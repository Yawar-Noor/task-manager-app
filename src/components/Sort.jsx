import React, { useState, useRef, useEffect } from "react";
import Dropdown from "./ui/Dropdown";

function Sort({
  variant,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
}) {
  const sortRef = useRef(null);

  const handleSortClick = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <Dropdown
      ref={sortRef}
      // closeOnSelect={true}
      trigger={
        <button
          className={`flex  ${
            variant === "sidebar" && "text-sm md:text-base font-medium text-zinc-700/90 "
          } `}
          onClick={() => {}}
        >
          {variant === "sidebar" ? "Sort Tasks" : "Sort Subtasks"}
        </button>
      }
      className={`relative flex flex-col h-fit w-full`}
    >
      <button
        onClick={() => {
          setSortField(null);
        }}
        className={`w-full h-fit text-start text-sm`}
      >
        Original
      </button>

      <button
        onClick={() => {
          handleSortClick("date");
        }}
        className={`w-full text-start h-fit text-sm`}
      >
        Added on{" "}
        {sortField === "date" ? (sortDirection === "asc" ? "↑" : "↓") : ""}
      </button>

      <button
        onClick={() => {
          handleSortClick("dueDate");
        }}
        className={`w-full text-start h-fit text-sm`}
      >
        Due Date{" "}
        {sortField === "dueDate" ? (sortDirection === "asc" ? "↑" : "↓") : ""}
      </button>

      <button
        onClick={() => {
          handleSortClick("priority");
        }}
        className={`w-full text-start h-fit text-sm`}
      >
        Priority{" "}
        {sortField === "priority" ? (sortDirection === "asc" ? "↑" : "↓") : ""}
      </button>
    </Dropdown>
  );
}

export default Sort;
