"use client";

import { Calendar } from "primereact/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface DateRangeControlsProps {
  startDate: Date;
  endDate: Date;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  title: string;
}

export default function DateRangeControls({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  title,
}: DateRangeControlsProps) {
  return (
    <div className="flex align-items-center flex-wrap gap-4">
      <div className="flex align-items-center flex-wrap gap-2">
        <label className="font-medium whitespace-nowrap">{title}:</label>
        <div className="flex align-items-center flex-wrap gap-2">
          <Calendar
            value={startDate}
            onChange={(e) => onStartDateChange(e.value || null)}
            dateFormat="dd/mm/yy"
            showIcon
            placeholder="Fecha desde"
          />
          <span className="text-gray-500 whitespace-nowrap flex align-items-center flex-wrap">hasta</span>
          <Calendar
            value={endDate}
            onChange={(e) => onEndDateChange(e.value || null)}
            dateFormat="dd/mm/yy"
            showIcon
            placeholder="Fecha hasta"
          />
        </div>
      </div>
      <div className="text-sm text-gray-600 flex align-items-center flex-wrap">
        {format(startDate, "dd/MM/yyyy", { locale: es })} - 
        {format(endDate, "dd/MM/yyyy", { locale: es })}
      </div>
    </div>
  );
} 