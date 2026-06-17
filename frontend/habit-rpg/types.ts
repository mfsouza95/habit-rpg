export interface ActivityEntry {
  category: string;
  activity: string;
  note: string;
}

export interface ActivityFormProps {
  setIsOpen: (value: boolean) => void;
}