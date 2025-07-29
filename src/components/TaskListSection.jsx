import React, { useState, useEffect } from "react";
import Form from "./Form";
import TaskList from "./TaskList";
import { setLocalStorage, getLocalStorage } from "../utils/localStorage";

function TaskListSection() {
  const [tasks, setTasks] = useState(getLocalStorage());

  function handleToggleTask(taskId) {
    setTasks((prev) =>
      prev.map((task) =>
        task.uniqueId == taskId
          ? { ...task, isCompleted: !task.isCompleted }
          : task
      )
    );
  }

  const activeTasks = tasks.filter((task) => !task.isCompleted);
  const completedTasks = tasks.filter((task) => task.isCompleted);

  useEffect(() => {
    setLocalStorage(tasks);
  }, [tasks]);

  return (
    <section className="tasksSection relative flex justify-between w-[85%] h-[90vh]  bg-zinc-300 p-3 text-zinc-700 border border-zinc-400 rounded-2xl">
      <div className="w-[32.5em] flex justify-between border border-zinc-400 rounded-2xl">
        <TaskList
          heading={"Active Tasks"}
          tasks={activeTasks}
          setTasks={setTasks}
          handleToggleTask={handleToggleTask}
        />
        {/* <TaskList heading={"In Progress"} tasks={tasks} setTasks={setTasks} /> */}
        <TaskList
          heading={"Completed"}
          tasks={completedTasks}
          setTasks={setTasks}
          handleToggleTask={handleToggleTask}
        />
      </div>

      <Form setTasks={setTasks} />
    </section>
  );
}

export default TaskListSection;
