  //Logic for  Searching tasks sub tasks
  // Note: filter(callback) returns true to add the task and false to don't

function filterTasks (task, searchTerm) {

    if (searchTerm.trim() === "") {
      return true;
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    const taskNameMatches = task.taskTitle.toLowerCase().includes(lowerCaseSearchTerm);
    if (taskNameMatches) {
      return true;
    }

    const anyTaskMatches =
      task.tasks && // This prevents a crash if task.tasks is undefined
      task.tasks.some((subtask) =>
        subtask.title.toLowerCase().includes(lowerCaseSearchTerm)
      );

    if (anyTaskMatches) {
      return true;
    }

    return false;   //So here, skip the task, if no match
    

  }

  export { filterTasks };