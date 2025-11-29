"use client";

import { Card } from "primereact/card";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { WeeklyStats } from "../_types";

interface WeeklyStatsCardsProps {
  weeklyStats: WeeklyStats;
}

export default function WeeklyStatsCards({
  weeklyStats,
}: WeeklyStatsCardsProps) {
  const getSportColor = (index: number) => {
    const colors = [
      "rgba(54, 162, 235, 1)",
      "rgba(255, 99, 132, 1)",
      "rgba(75, 192, 192, 1)",
      "rgba(255, 205, 86, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
      "rgba(199, 199, 199, 1)",
      "rgba(83, 102, 255, 1)",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
      <Card>
        <h3 className="text-lg font-semibold mb-4">Deportes Más Populares</h3>
        <div className="space-y-2">
          {weeklyStats.topSports.map((sport, index) => (
            <div
              key={sport.sportId}
              className="flex justify-content-between flex-wrap items-center p-3  rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: getSportColor(index) }}
                ></div>
                <span className="font-medium">{sport.sportName}</span>
              </div>
              <span className="text-lg font-bold">{sport.eventCount}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-4">Resumen Diario</h3>
        <div className="space-y-2">
          {weeklyStats.dailyStats.map((day) => (
            <div
              key={day.date}
              className="flex justify-content-between flex-wrap p-3 rounded-lg"
            >
              <div>
                <div className="font-medium">
                  {format(new Date(day.date), "EEEE dd/MM", { locale: es })}
                </div>
                <div className="text-sm text-gray-600">
                  {day.eventsBySport.length > 0
                    ? day.eventsBySport.map((s) => s.sportName).join(", ")
                    : "Sin eventos"}
                </div>
              </div>
              <span className="text-lg font-bold">{day.totalEvents}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
