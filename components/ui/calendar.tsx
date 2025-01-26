"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export function Calendar({
  className = "",
  classNames = {},
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <div className={`p-4 bg-white rounded-lg shadow-md w-full h-full ${className}`}>
      <DayPicker
        showOutsideDays={showOutsideDays}
        classNames={{
          months: "grid grid-cols-1 lg:grid-cols-1 gap-2 w-full",
          month: "space-y-2",
          caption: "flex justify-between items-center text-center pb-2 border-b border-gray-200",
          caption_label: "text-base font-semibold text-gray-700 lg:text-lg",
          nav: "flex items-center space-x-2",
          nav_button:
            "h-8 w-8 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
          nav_button_previous: "ml-2",
          nav_button_next: "mr-2",
          table: "w-full border-collapse",
          head_row: "flex w-full",
          head_cell:
            "text-gray-600 font-medium flex-1 h-12 text-center flex items-center justify-center text-sm lg:text-base",
          row: "flex w-full",
          cell: "flex-1 h-12 text-center flex items-center justify-center relative",
          day:
            "flex items-center justify-center w-full h-full rounded-md transition-colors bg-transparent hover:ring-2 ring-primary hover:text-primary",
          day_selected:
            "focus:bg-primary focus:text-white focus:font-bold rounded-md",
          day_today: "bg-gray-200 text-gray-900 font-bold",
          day_outside: "text-gray-400",
          day_disabled: "text-gray-300 cursor-not-allowed",
          day_range_middle: "bg-primary-light text-white",
          day_hidden: "invisible",
          ...classNames,
        }}
        styles={{
          day: {
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          },
        }}
        {...props}
      />
    </div>
  );
}
