import React, { useState } from "react";
import { auth, googleProvider } from "../config/firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  console.log(auth?.currentUser?.email);

  //   Sign up with email and password...
  const signIn = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
    }
  };

  // Login with email n pwd
  const logIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
    }
  };

  //   Sign in with google...

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full h-full sm:w-9/10 sm:h-9/10 flex items-center justify-center sm:gap-[8%] p-3 sm:border rounded-2xl">
      <div className="h-full w-fit flex flex-col items-center justify-center">
        <h1 className="hidden sm:flex sm:text-7xl md:text-8xl tracking-tighter font-medium text-zinc-700 mb-4">
          Tasky
        </h1>
        <p className="hidden sm:flex sm:w-63 md:w-full text-zinc-600 text-xs md:text-sm text-center">
          MVP of a one stop solution for learners,... just learners!
        </p>
      </div>
      <div className="border border-zinc-400 w-9/10 sm:w-60 h-80 min-w-55 flex flex-col gap-2 items-center justify-center p-3 rounded-2xl text-zinc-700 shadow-2xl">
        <input
          placeholder="Email..."
          className="w-full border text-base sm:text-sm font-mediun placeholder:font-normal  border-zinc-400 rounded-lg p-1 focus:drop-shadow-xl drop-shadow-black/30 outline-none"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password..."
          className="w-full border text-base sm:text-sm font-mediun placeholder:font-normal border-zinc-400 rounded-lg p-1 mb-4 focus:drop-shadow-xl drop-shadow-black/30 outline-none"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={logIn}
          className="w-full bg-white sm:text-sm font-medium tracking-wide text-zinc-600 px-3 py-1 rounded-lg shadow-sm hover:brightness-105 transition"
        >
          Log In
        </button>

        <button
          onClick={signIn}
          className="w-full bg-white sm:text-sm font-medium tracking-wide text-zinc-600 px-3 py-1 rounded-lg shadow-sm hover:brightness-105 transition"
        >
          Sign In
        </button>

        <div className="text-sm font-medium tracking-wide text-zinc-600 px-3">
          Or
        </div>

        <button
          onClick={signInWithGoogle}
          className="w-full bg-white sm:text-sm font-medium tracking-wide text-zinc-600 px-3 py-1 rounded-lg shadow-sm hover:brightness-105 transition"
        >
          Sign In With Google
        </button>
      </div>
    </div>
  );
}

export default Auth;
