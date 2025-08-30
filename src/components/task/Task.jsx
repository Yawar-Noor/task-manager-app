import React, { useState, useEffect, useRef } from "react";
import TaskHeader from "./TaskHeader";
import SubTask from "../Subtask";
import Form from "../forms/Form";
import TaskForm from "../forms/TaskForm";
import { sortTasks } from "../../utils/handleSort";
import formatDate from "../../utils/formatDate";


// Add Firebase handlers import
import {
  handleSubtaskUpdate,
  handleSubtaskDeletion,
  handleTaskCompletion,
  handleTaskPriority,
  handleTaskDeletion,
} from "../../utils/firebaseHandlers";

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

  // Handle subtask deletion
  const subtaskDeletionFn = async (taskId) => {
    const taskToDelete = task.subtasks.find(
      (subtask) => subtask.uniqueId === taskId
    );
    if (taskToDelete) {
      await handleSubtaskDeletion(task.id, taskToDelete);
    }
  };

  // Handle subtask completion toggle
  const subtaskCompletionFn = async (taskId) => {
    const subtask = task.subtasks.find(
      (subtask) => subtask.uniqueId === taskId
    );
    if (subtask) {
      await handleSubtaskUpdate(task.id, subtask, {
        isCompleted: !subtask.isCompleted,
      });
    }
  };

  // Handle subtask priority change
  const subtaskPriorityFn = async (taskId, priority) => {
    if (!priority) return;

    const subtask = task.subtasks.find(
      (subtask) => subtask.uniqueId === taskId
    );
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

  return (
    <div
      // task-view --> no scroll of tasks, but grid-view --> scroll
      className={`flex flex-col  items-center justify-start h-fit bg-white border border-zinc-400/20 px-1 py-3 sm:p-3 rounded-xs shadow-xs
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
        <TaskHeader
          task={task}
          fullCardView={fullCardView}
          setFullCardView={setFullCardView}
          setTaskCardOpenId={setTaskCardOpenId}

          isOptionsVisible={isOptionsVisible}
          setIsOptionsVisible={setIsOptionsVisible}

          taskOptionsDropdownRef={taskOptionsDropdownRef}

          editTaskForm={editTaskForm}
          setEditTaskForm={setEditTaskForm}
          
          setIsFormVisible={setIsFormVisible}

          isCompletedVisible={isCompletedVisible}
          setIsCompletedVisible={setIsCompletedVisible}

          taskPriorityFn={taskPriorityFn}
          taskCompletionFn={taskCompletionFn}
          taskDeletionFn={taskDeletionFn}

          sortField={sortField}
          setSortField={setSortField}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
        />
      ) : (
        // <
        <TaskForm
          task={task}
          taskFormType="editTaskForm"
          setEditTaskForm={setEditTaskForm}
          className="bg-gray-50 border-gray-300 md:p-2" 
        />
      )}

      {/* Task Status & Due date */}
        <div className={`w-full flex items-center justify-between px-2 mt-2`}>
          <p
            className={`font-medium text-[10px] text-center text-gray-400 tracking-wider `}
          >
            {isCompletedVisible ? "COMPLETED" : "PENDING"} SUBTASKS
          </p>
          <p className={`text-xs font-light tracking-[0.4px] text-gray-400`}>
            Due on:
            {task.taskDueDate && formatDate(task.taskDueDate)}
          </p>
        </div>

      {/* SubTask Task container */}

      {!isCompletedVisible ? (
        <div
          className={`task-container tasks-column flex flex-col w-full h-full blur-none py-3 bg-zinc-100/40
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
                      subtaskDeletionFn={subtaskDeletionFn}
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
