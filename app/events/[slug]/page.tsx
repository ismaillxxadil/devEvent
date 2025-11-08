import { BookEvent } from "@/component/ui/BookEvent";
import { EventCard } from "@/component/ui/EventCard";
import { IEvent } from "@/database";
import { getSimilarEvents } from "@/lib/actions/event.ation";
import Image from "next/image";
import { notFound } from "next/navigation";

const EventDetailsItem = ({
  icon,
  alt,
  content,
}: {
  icon: string;
  alt: string;
  content: string;
}) => (
  <div className="flex-row-gap-2 items-center ">
    <Image src={icon} alt={alt} width={14} height={14} />
    <p>{content}</p>
  </div>
);
const Agenda = ({ agenda }: { agenda: string[] }) => (
  <div className="agenda">
    <h2>Agenda</h2>
    <ul>
      {agenda.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
);

const Tags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-wrap gap-2">
    {tags.map((tag, index) => (
      <div key={index} className="pill">
        {tag}
      </div>
    ))}
  </div>
);
/**
 * Renders the event details page for the event identified by `params.slug`.
 *
 * Fetches the event data and similar events, and renders the poster, overview,
 * details (date, time, location, mode), agenda, organizer, tags, booking panel,
 * and a list of similar events.
 *
 * @param params - An object containing a promise that resolves to `{ slug: string }`.
 * @returns The React element for the event details page.
 *
 * @remarks
 * If the event cannot be found, this component invokes `notFound()` to trigger a 404 response.
 */
export default async function EventDetails({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const bookings = 10;
  const { slug } = await params;
  const similarEvents = (await getSimilarEvents(slug)) as unknown as IEvent[];
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${slug}`
  );
  const { event } = await res.json();
  if (!event) notFound();
  console.log(event.image);
  return (
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p>{event.description}</p>
      </div>
      <div className="details">
        {/* left side*/}
        <div className="content">
          <Image
            src={event.image}
            alt={event.title}
            className="poster"
            width={800}
            height={800}
          />
          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{event.overview}</p>
          </section>
          <section className="flex-col-gap-2">
            <h2> Details</h2>
            <EventDetailsItem
              icon="/icons/calendar.svg"
              alt="date"
              content={event.date}
            />
            <EventDetailsItem
              icon="/icons/clock.svg"
              alt="time"
              content={event.date}
            />
            <EventDetailsItem
              icon="/icons/pin.svg"
              alt="location"
              content={event.location}
            />
            <EventDetailsItem
              icon="/icons/mode.svg"
              alt="mode"
              content={event.mode}
            />
          </section>
          <Agenda agenda={event.agenda} />

          <section className="flex-col-gap-2">
            <h2>About the Organizer</h2>
            <p>{event.organizer}</p>
          </section>
          <Tags tags={event.tags} />
        </div>
        {/* right side*/}
        <aside className="booking flex-col-gap-1">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            {bookings > 0 ? (
              <p className="text-sm">
                Joins {bookings} Devs Who Already Booked This Event
              </p>
            ) : (
              <p className="text-sm">Be the first to book this event</p>
            )}
            <BookEvent />
          </div>
        </aside>
      </div>
      <div className="w-full flex flex-col gap-4 pt-20">
        <h2>Similar Events</h2>
        <div className="events">
          {similarEvents.map((event, index) => (
            <EventCard key={index} {...event} />
          ))}
        </div>
      </div>
    </section>
  );
}