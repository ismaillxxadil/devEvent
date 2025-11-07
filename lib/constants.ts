export interface Event {
  image: string;
  title: string;
  slug: string;
  date: string;
  location: string;
  Time: string;
}

export const events: Event[] = [
  {
    image: "/images/event1.png",
    title: "Next.js Conference 2025",
    slug: "nextjs-conference-2025",
    date: "2025-12-15",
    location: "San Francisco",
    Time: "9:00 AM",
  },
  {
    image: "/images/event2.png",
    title: "React Global Summit",
    slug: "react-global-summit",
    date: "2026-01-20",
    location: "Virtual Event",
    Time: "8:00 AM"
  },
  {
    image: "/images/event3.png",
    title: "AI Hackathon 2026",
    slug: "ai-hackathon-2026",
    date: "2026-02-05",
    location: "New York",
    Time: "10:00 AM"
  },
  {
    image: "/images/event4.png",
    title: "TypeScript Workshop",
    slug: "typescript-workshop",
    date: "2026-03-01",
    location: "London",
    Time: "1:00 PM"
  },
  {
    image: "/images/event5.png",
    title: "Seattle Dev Meetup",
    slug: "seattle-dev-meetup",
    date: "2025-12-20",
    location: "Seattle",
    Time: "6:30 PM"
  },
  {
    image: "/images/event6.png",
    title: "Web3 Conference 2026",
    slug: "web3-conference-2026",
    date: "2026-04-15",
    location: "Berlin",
    Time: "9:00 AM"
  }
];