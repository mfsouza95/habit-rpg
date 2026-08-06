export interface ActivityEntry {
  category: string;
  activity: string;
  note: string;
}

export interface Activity {
  id: number;
  category: string;
  activity: string;
  note: string | null;
  xpEarned: number;
  timestamp: string;
}

export interface ActivityFormProps {
  setIsOpen: (value: boolean) => void;
  onSubmitted: (activity: Activity) => void;
}
