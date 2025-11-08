"use client";
import React, { useState } from "react";

export const BookEvent = () => {
  const [email, setEmail] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const handelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
      setIsSubmit(true);
    }, 1000);
  };
  return (
    <div id="book-event">
      {isSubmit ? (
        <p className="text-sm">Thank you for booking the event!</p>
      ) : (
        <form onSubmit={handelSubmit}>
          <label htmlFor="email">Email Address:</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#182830] p-2 m-0 rounded-md w-full  text-sm"
          />
          <button type="submit">Book Event</button>
        </form>
      )}
    </div>
  );
};
