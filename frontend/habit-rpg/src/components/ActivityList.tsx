import type { Activity } from '../../types';

interface ActivityListProps {
  activities: Activity[];
}

export default function ActivityList({ activities }: ActivityListProps) {
  if (activities.length === 0) {
    return <p className="text-gray-400">No activities yet - log your first one!</p>;
  }

  return (
    <ul className="w-full overflow-y-auto">
      {activities.map((entry) => (
        <li key={entry.id} className="flex items-center justify-between gap-4 border-b border-gray-700 py-2">
          <div className="flex flex-col">
            <span className="font-semibold">{entry.activity}</span>
            <span className="text-sm text-purple-300">{entry.category}</span>
            {entry.note && <span className="text-sm text-gray-400">{entry.note}</span>}
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm text-emerald-400">+{entry.xpEarned} XP</span>
            <time className="text-xs text-gray-500">{new Date(entry.timestamp).toLocaleString()}</time>
          </div>
        </li>
      ))}
    </ul>
  );
}
