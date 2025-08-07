// utils/firebaseHandlers.js
import { firestore } from "../hooks/firebase/useFirestore";

// ===== VALIDATION FUNCTIONS =====

// Title input validation
function titleValidation(title, setErrors) {
  if (!title.trim()) {
    setErrors(prev => (
      { ...prev, title: "Please enter a title." })
    )
  } else if (title.length > 50) {
    setErrors(prev => (
      { ...prev, title: "Please keep Title less than 50 letters" })
    )
  } else {
    setErrors(prev => {
      const { title, ...restOfErrors } = prev;
      return restOfErrors;
    })
  }
}

// Date input validation
function dateValidation(dueDate, setErrors) {
  if (!dueDate) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to the beginning of the day

  const inputDate = new Date(dueDate);

  if (inputDate < today) {
    setErrors(prev => ({
      ...prev,
      dueDate: "Date can't be in the past",
    }));
  } else {
    // If date is valid (today or future), remove the error
    setErrors(prev => {
      const { date, ...restOfErrors } = prev; // Destructure to remove 'date'
      return restOfErrors;
    });
  }
}


// ======================================================================================================================
// =============================================   SUBTASK HANDLERS   ======================================================
// ======================================================================================================================



const subtaskTitleHandle = (e, setTitle, setErrors) => {
  setTitle(e.target.value);
  titleValidation(e.target.value, setErrors);
};

function subtaskDescriptionHandle(e, setDescription) {
  setDescription(e.target.value);
}

function subtaskDueDateHandle(e, setDueDate, setErrors) {
  setDueDate(e.target.value);
  dateValidation(e.target.value, setErrors);
}

// Handle both subtask completion toggle and SubTask Priority
async function handleSubtaskUpdate(taskId, subtask, updates) {
  try {

    const updatedTask = {
      ...subtask,
      ...updates
    };

    const result = await firestore.updateSubtaskInTask(taskId, subtask, updatedTask);

    if (result.success) {
      return { success: true };
    } else {
      console.error('❌ Failed to update task completion:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('❌ Error updating task completion:', error);
    return { success: false, error: 'Failed to update task' };
  }
}

// Handle subtask deletion
async function handleSubtaskDeletion(taskId, subtask) {
  try {

    const result = await firestore.deleteSubtaskFromTask(taskId, subtask);

    if (result.success) {
      return { success: true };
    } else {
      console.error('❌ Failed to delete subtask:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('❌ Error deleting subtask:', error);
    return { success: false, error: 'Failed to delete subtask' };
  }
}

// =======TASK SUBMIT HANDLER=======

async function subtaskSubmitHandleFn(
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
  setEditingTaskId,
) {
  if (Object.keys(errors).length > 0) {
    return { success: false, error: "Please fix validation errors" };
  }


  try {
    if (formType === "editForm") {

      // Create updated subtask
      const updatedSubtask = {
        ...subtask,
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate
      };

      // Update in Firebase using the specific subtask update method
      const result = await firestore.updateSubtaskInTask(taskId, subtask, updatedSubtask);

      if (result.success) {
        setEditingTaskId && setEditingTaskId(null);
        setTitle("");
        setDueDate(null);
        return { success: true };
      } else {
        setErrors(prev => ({ ...prev, submit: result.error }));
        return { success: false, error: result.error };
      }
    } else {

      const newSubtask = {
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate,
        uniqueId: Date.now(),
        priority: "Medium",
        isCompleted: false
      };

      const result = await firestore.addSubtaskToTask(taskId, newSubtask);

      if (result.success) {
        setTitle("");
        setDueDate(null);
        return { success: true };
      } else {
        setErrors(prev => ({ ...prev, submit: result.error }));
        return { success: false, error: result.error };
      }
    }
  } catch (error) {
    const errorMsg = 'Something went wrong. Please try again.';
    setErrors(prev => ({ ...prev, submit: errorMsg }));
    return { success: false, error: errorMsg };
  } finally {
    console.log("Thanks");
  }
}



// ======================================================================================================================
// =============================================   TASK HANDLERS   ======================================================
// ======================================================================================================================



function taskTitleHandle(e, setTaskTitle, setTaskErrors) {
  setTaskTitle(e.target.value);
  titleValidation(e.target.value, setTaskErrors);
};

function taskDescriptionHandle(e, setTaskDescription) {
  setTaskDescription(e.target.value);
};

function taskDueDateHandle(e, setTaskDueDate, setTaskErrors) {
  setTaskDueDate(e.target.value);
  dateValidation(e.target.value, setTaskErrors);
};


// Handle task completion change
async function handleTaskCompletion(taskId, completionUpdate) {
  try {
    const result = await firestore.updateTask(taskId, { isTaskCompleted: completionUpdate });
    if (result.success) {
      return { success: true };
    } else {
      console.error('❌ Failed to update task completion:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('❌ Error updating task completion:', error);
    return { success: false, error: 'Failed to update completion' };
  }
};


// Handle task priority change
async function handleTaskPriority(taskId, newPriority) {
  if (!newPriority) return { success: false, error: 'No priority provided' };

  try {

    const result = await firestore.updateTask(taskId, {
      priority: newPriority
    });

    if (result.success) {
      return { success: true };
    } else {
      console.error('❌ Failed to update task priority:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('❌ Error updating task priority:', error);
    return { success: false, error: 'Failed to update priority' };
  }
}


// Handle task deletion
async function handleTaskDeletion(taskId) {
  try {

    const result = await firestore.deleteTask(taskId);

    if (result.success) {
      return { success: true };
    } else {
      console.error('❌ Failed to delete task:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('❌ Error deleting task:', error);
    return { success: false, error: 'Failed to delete task' };
  }
}


// ======= LIST SUBMIT HANDLER========

async function taskSubmitHandleFn(
  currentUserId,
  task,
  taskFormType,
  taskTitle,
  setTaskTitle,
  taskDescription,
  setTaskDescription,
  taskDueDate,
  setTaskDueDate,
  taskErrors,
) {

  if (taskFormType === "mainForm" && Object.keys(taskErrors).length > 0) {
    return { success: false, error: "Please fix validation errors" };
  }
  

  try {
    
    let result;
    if (taskFormType === "mainForm") {

      const newTask = {
      taskTitle: taskTitle.trim(),
      taskDescription: taskDescription.trim(),
      taskDueDate: taskDueDate ? new Date(taskDueDate) : null,
      priority: "Medium",
      isTaskCompleted: false,
      subtasks: task?task.subtasks : []
    }

      result = await firestore.createTask(currentUserId, newTask);

    } else if (taskFormType === "editTaskForm") {
      const updatedTask = {
      taskTitle: taskTitle.trim() || task.taskTitle,
      taskDescription: taskDescription.trim() || task.taskDescription,
      taskDueDate: taskDueDate ? new Date(taskDueDate) : task.taskDueDate || null,
    }

      result = await firestore.updateTask(task.id, updatedTask)

    }

    if (result.success) {
     if (taskFormType === "mainForm") {

       // Clear form
       setTaskTitle("");
       setTaskDescription("");
       setTaskDueDate(null);
      }

      return { success: true };
    } else {
      console.error('❌ Failed to create task:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return { success: false, error: 'Something went wrong. Please try again.' };
  } finally {
    console.log("Thanks")

  }
}

export {
  subtaskTitleHandle,
  subtaskDescriptionHandle,
  subtaskDueDateHandle,
   handleSubtaskUpdate,
  handleSubtaskDeletion,
  subtaskSubmitHandleFn,

  taskTitleHandle,
  taskDescriptionHandle,
  taskDueDateHandle,
  handleTaskCompletion,
  handleTaskPriority,
  handleTaskDeletion,
  taskSubmitHandleFn,
};
