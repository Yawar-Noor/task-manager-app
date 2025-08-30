
function setLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}


function getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
        
}

function removeItemFromLocalStorage(ref){
    localStorage.removeItem()
}


export { setLocalStorage, getLocalStorage, removeItemFromLocalStorage }