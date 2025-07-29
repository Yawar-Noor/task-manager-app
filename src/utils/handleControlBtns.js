import React from 'react'
import { removeItemFromLocalStorage, getLocalStorage } from "../utils/localStorage"

const handleEditFn = (task, setTasks) => {
    return () => {

        console.log(`Edit`);
        console.log(`Edit ${task.uniqueId}`);
    }
};

const handleDltFn = (task, setTasks, key) => {
    return () => {

        console.log(`Delete ${task}`);
        // removeItemFromLocalStorage("task")
        localStorage.removeItem(key)
        setTasks(getLocalStorage())

    }
};

export { handleDltFn, handleEditFn }