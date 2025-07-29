
function setLocalStorage(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks))
}


function getLocalStorage() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
        
}

function removeItemFromLocalStorage(ref){
    localStorage.removeItem()
}


export { setLocalStorage, getLocalStorage, removeItemFromLocalStorage }