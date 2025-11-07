import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formats a date string to a more readable format
export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

// Creates a URL-friendly slug from a string
export function createSlug(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

// Formats time to 12-hour format
export function formatTime(time: string) {
  return new Date(`2000/01/01 ${time}`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
}

// Checks if an event is upcoming
export function isUpcoming(date: string) {
  return new Date(date) > new Date();
}

// Gets the relative time (e.g., "in 2 days", "3 weeks ago")
export function getRelativeTime(date: string) {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const now = new Date();
  const eventDate = new Date(date);
  const diffInDays = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (Math.abs(diffInDays) <= 7) {
    return rtf.format(diffInDays, 'day');
  } else if (Math.abs(diffInDays) <= 30) {
    return rtf.format(Math.floor(diffInDays / 7), 'week');
  } else {
    return rtf.format(Math.floor(diffInDays / 30), 'month');
  }
}
