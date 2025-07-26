import { Dispatch, SetStateAction } from "react";

export interface TabComponentButtonsProps {
  currentTab: string;
  setCurrentTab: Dispatch<SetStateAction<string>>;
}
