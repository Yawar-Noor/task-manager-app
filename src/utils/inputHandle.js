// import { setLocalStorage, getLocalStorage } from "./localStorage";

// Title handler 
const inputTitleHandleFn = (setTitle) => {
  return (e) => {
    let titleVal = e.target.value;

    if (titleVal == "") {
      console.log("Please Enter a Title");
      return false;
    } else if (titleVal.length <= 3) {
      console.log("Title length must be between 3 and 20 letters");
      return false
    } else if (titleVal.length > 20) {
      console.log("Title length must be between 3 and 20 letters");
      return false
    } else {
      setTitle(titleVal);
      return true
    }


  }
};



// Date handler 
function inputDateHandleFn(setSelectedDate) {
  let now = new Date();
  return (e) => {

    let date = e.target.value

    if (date === "") {
      console.log("Please Enter a Date.")
    } else if (date < now) {
      console.log("Date can't be in past!")
      return false;
    } else {
      setSelectedDate(date)
    }
  }
};



// Submit handler 
// function submitHandleFn(setTasks, newTask, setTitle, setSelectedDate) {

function submitHandleFn(setTasks, newTask) {
  return (e) => {
    e.preventDefault()
    setTasks(prev =>[...prev, newTask])
 
    // setTitle("");
    // setSelectedDate(null)
  }
}

export { inputTitleHandleFn, inputDateHandleFn, submitHandleFn }