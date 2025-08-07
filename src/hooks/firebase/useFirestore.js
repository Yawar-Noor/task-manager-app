
// hooks/firebase/useFirestore.js
import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  getDoc
} from 'firebase/firestore';
import { db } from '../../config/firebase';


// Hook to listen to user's tasks

export function useTasks(userId) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    // Initially- When user is logged out

    if (!userId) {
      setTasks([]);
      setLoading(false);
      return;
    }

// Gets the current user's date in mentioned order  
    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

// Create connection with firestore-- keep getting above mentioned data on every change -- React renders that data
    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const tasks = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          dueDate: doc.data().dueDate?.toDate(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        }));

        setTasks(tasks);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('❌ Error listening to tasks:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };

  }, [userId]);

  return { tasks, loading, error };
}



// Firebase CRUD operations
export const firestore = {

  // Create new task task

  createTask: async (userId, taskData) => {
    try {

      const docRef = await addDoc(collection(db, 'tasks'), {
        ...taskData,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('❌ Error creating task task:', error);
      return { success: false, error: error.message };
    }
  },

  // Update task

  updateTask: async (taskId, updates) => {
    try {

      await updateDoc(doc(db, 'tasks', taskId), {
        ...updates,
        updatedAt: serverTimestamp()
      });

      return { success: true };
    } catch (error) {
      console.error('❌ Error updating task task:', error);
      return { success: false, error: error.message };
    }
  },

  // Delete task
  deleteTask: async (taskId) => {
    try {

      await deleteDoc(doc(db, 'tasks', taskId));

      return { success: true };
    } catch (error) {
      console.error('❌ Error deleting task task:', error);
      return { success: false, error: error.message };
    }
  },




  // Add subtask to task
  addSubtaskToTask: async (taskId, newSubtask) => {
    try {

      // Get current document to append to existing tasks array
      const taskRef = doc(db, 'tasks', taskId);

      // Use arrayUnion to add the new task to the tasks array
      await updateDoc(taskRef, {
        subtasks: arrayUnion(newSubtask),
        updatedAt: serverTimestamp()
      });

      return { success: true };
    } catch (error) {
      console.error('❌ Error adding task to task:', error);
      return { success: false, error: error.message };
    }
  },

  // Update task in task
  updateSubtaskInTask: async (taskId, oldSubtask, updatedSubtask) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);

      // Get the current task
      const taskDoc = await getDoc(taskRef);
      
      if (!taskDoc.exists()) {
        return { success: false, error: 'Task not found' };
      }

      // Get all existing tasks
      const currentSubtasks = taskDoc.data().subtasks || [];

      // Find the task and replace it (keeps it in the same position)
      const updatedSubtasks = currentSubtasks.map(subtask => {
        // If this is the task we want to update
        if (JSON.stringify(subtask) === JSON.stringify(oldSubtask)) {
          return updatedSubtask; // Replace with new version
        }
        return subtask; // Keep other tasks as they are
      });

      // Save the updated task
      await updateDoc(taskRef, {
        subtasks: updatedSubtasks,
        updatedAt: serverTimestamp()
      });

      return { success: true };
    } catch (error) {
      console.error('❌ Error updating subtask in task:', error);
      return { success: false, error: error.message };
    }
  },


  // Delete subtask from task
  deleteSubtaskFromTask: async (taskId, subtaskToDelete) => {
    try {

      const taskRef = doc(db, 'tasks', taskId);

      await updateDoc(taskRef, {
        subtasks: arrayRemove(subtaskToDelete),
        updatedAt: serverTimestamp()
      });

      return { success: true };
    } catch (error) {
      console.error('❌ Error deleting task from task:', error);
      return { success: false, error: error.message };
    }
  },


};
