import { EventCard } from "@/component/ui/EventCard";
import { ExploreBtn } from "@/component/ui/ExploreBtn";
import { IEvent } from "@/database";
import { cacheLife } from "next/cache";
import React from "react";

const page = async () => {
  "use cache";
  cacheLife("hours");
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events`);
  const events: IEvent[] = await res.json();
  return (
    <section>
      <h1 className="text-center ">
        The Hub For Every Dev <br /> Event you Must&apos;n Miss
      </h1>
      <p className="text-center mt-5">
        Hackathons, Events, Conferences, All in one Place
      </p>
      <ExploreBtn />

      <div className="mt-20 space-y-1">
        Featured Event
        <ul className="events list-none p-0 mt-7">
          {events.map((event, index) => (
            <li key={index}>
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default page;
