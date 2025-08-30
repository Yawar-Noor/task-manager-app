import React, { useState, useEffect } from "react";
import TaskListContainer from "./components/TaskListContainer";
import Auth from "./components/AuthForm/Auth";
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";

// Returns either loading or Main app
function AppContent() {
  // This will rerender page everytime current user and loading state changes
  const { currentUser, loading } = useAuth();

  // loading true
  if (loading) {
    return (
      <div className="w-[100vw] h-[100dvh] flex justify-center items-center bg-zinc-700">
        <div>Loading...</div>
      </div>
    );
  }

  // currentUser state changes- when user --> TaskListContainer othewise -->login page...
  return ( 
    <div className=".app-container  w-[100vw] h-[100dvh] flex justify-center items-center bg-zinc-300">
      {currentUser ? (
        <TaskListContainer />
      ) : (
        <Auth />
      )}
    </div>
  );
}

const App = () => {

  return ( 
   <AuthProvider>
      <AppContent/>
   </AuthProvider>
  );
};

export default App;
