"use client";

import { useEffect, useState } from "react";

const meetings = [
  {
    time: "09:00 - 10:00",
    title: "Team Standup",
    description: "Zoom with Dev Team",
  },
  {
    time: "13:00 - 14:00",
    title: "Client Review",
    description: "Follow-up Project ABC",
  },
];

export default function RightPanel() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      // second: "2-digit",
    });
  const formatDate = (date: Date) =>
    date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  return (
    <aside className="w-72 bg-gray-800 p-6 border-l border-gray-700 space-y-6 hidden md:flex md:flex-col">
      <div>
        <p className="text-sm text-gray-400">Current Time</p>
        <h2 className="text-3xl font-bold mt-1">{formatDate(time)}</h2>
        <h2 className="text-3xl font-bold mt-1">{formatTime(time)}</h2>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Today’s Schedule</h3>
        <ul className="space-y-4">
          {meetings.map((m, i) => (
            <li key={i} className="bg-gray-700 rounded-xl p-4">
              <p className="text-sm text-gray-300">{m.time}</p>
              <p className="text-md font-semibold">{m.title}</p>
              <p className="text-xs text-gray-400">{m.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
