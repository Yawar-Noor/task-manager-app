// Works for both task and subtasks

function sortTasks(tasks, field, direction = "asc") {
    if (!field) return tasks;

    const priorityRank = { high: 1, medium: 2, low: 3 };
    const multiplier = direction === "asc" ? 1 : -1;

    return [...tasks].sort((a, b) => {
      let diff = 0;

      if (field === "date") {
        diff = new Date(a.date) - new Date(b.date);
      } else if (field === "dueDate") {
        diff = new Date(a.dueDate) - new Date(b.dueDate);
      } else if (field === "priority") {
        const rankA = priorityRank[a.priority?.toLowerCase()] || 999;
        const rankB = priorityRank[b.priority?.toLowerCase()] || 999;
        diff = rankA - rankB;
      }

      return diff * multiplier;
    });
  }

  export {sortTasks}