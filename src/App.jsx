import React, { useState, useEffect } from "react";
import TaskListSection from "./components/TaskListSection";

const App = () => {
 

  return (
    <div className="w-[100vw] h-[100vh] flex items-end justify-end bg-zinc-300">
      <TaskListSection />
    </div>
  );
};

export default App;
