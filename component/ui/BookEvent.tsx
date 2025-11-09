"use client";
import { createBooking } from "@/lib/actions/booking.action";
import React, { useState } from "react";

export const BookEvent = ({
  eventId,
  slug,
}: {
  eventId: string;
  slug: string;
}) => {
  const [email, setEmail] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const handelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(eventId, email, slug);
    const { success } = await createBooking({
      eventId,
      email,
      slug,
    });
    if (success) {
      setIsSubmit(true);
    } else {
      console.error("Booking failed");
    }
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
