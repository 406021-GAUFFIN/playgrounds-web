"use client";

import { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { useRequireAuth } from "@/context/AuthContext";
import {
  format,
  startOfWeek,
  addDays,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { es } from "date-fns/locale";
import { reportService } from "../services/reportService";
import { WeeklyStats, ParticipantsStats, TimeSlotsStats } from "./_types";
import WeeklyEventsChart from "./_components/WeeklyEventsChart";
import WeeklyStatsCards from "./_components/WeeklyStatsCards";
import ParticipantsChart from "./_components/ParticipantsChart";
import TimeSlotsChart from "./_components/TimeSlotsChart";
import DateRangeControls from "./_components/DateRangeControls";

export default function ReportsPage() {
  const { user } = useRequireAuth(["ADMIN"]);

  // Estados para el gráfico semanal
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<Date>(
    startOfWeek(new Date())
  );
  const [weeklyLoading, setWeeklyLoading] = useState(false);

  // Estados para el gráfico de participantes
  const [participantsStats, setParticipantsStats] =
    useState<ParticipantsStats | null>(null);
  const [participantsStartDate, setParticipantsStartDate] = useState<Date>(
    startOfMonth(new Date())
  );
  const [participantsEndDate, setParticipantsEndDate] = useState<Date>(
    endOfMonth(new Date())
  );
  const [participantsLoading, setParticipantsLoading] = useState(false);

  // Estados para el gráfico de franjas horarias
  const [timeSlotsStats, setTimeSlotsStats] = useState<TimeSlotsStats | null>(
    null
  );
  const [timeSlotsStartDate, setTimeSlotsStartDate] = useState<Date>(
    startOfMonth(new Date())
  );
  const [timeSlotsEndDate, setTimeSlotsEndDate] = useState<Date>(
    endOfMonth(new Date())
  );
  const [timeSlotsLoading, setTimeSlotsLoading] = useState(false);

  const fetchWeeklyStats = async (weekStart: Date) => {
    setWeeklyLoading(true);
    try {
      const formattedDate = format(weekStart, "yyyy-MM-dd");
      const data = await reportService.getWeeklyStats(formattedDate);
      setWeeklyStats(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setWeeklyLoading(false);
    }
  };

  const fetchParticipantsStats = async (startDate: Date, endDate: Date) => {
    setParticipantsLoading(true);
    try {
      const formattedStartDate = format(startDate, "yyyy-MM-dd");
      const formattedEndDate = format(endDate, "yyyy-MM-dd");
      const data = await reportService.getParticipantsStats(
        formattedStartDate,
        formattedEndDate
      );
      setParticipantsStats(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setParticipantsLoading(false);
    }
  };

  const fetchTimeSlotsStats = async (startDate: Date, endDate: Date) => {
    setTimeSlotsLoading(true);
    try {
      const formattedStartDate = format(startDate, "yyyy-MM-dd");
      const formattedEndDate = format(endDate, "yyyy-MM-dd");
      const data = await reportService.getTimeSlotsStats(
        formattedStartDate,
        formattedEndDate
      );
      setTimeSlotsStats(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setTimeSlotsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetchWeeklyStats(selectedWeek);
    }
  }, [selectedWeek, user]);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetchParticipantsStats(participantsStartDate, participantsEndDate);
    }
  }, [participantsStartDate, participantsEndDate, user]);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetchTimeSlotsStats(timeSlotsStartDate, timeSlotsEndDate);
    }
  }, [timeSlotsStartDate, timeSlotsEndDate, user]);

  const handleWeekChange = (date: Date | null) => {
    if (date) {
      setSelectedWeek(startOfWeek(date));
    }
  };

  const handlePreviousWeek = () => {
    setSelectedWeek((prev) => addDays(prev, -7));
  };

  const handleNextWeek = () => {
    setSelectedWeek((prev) => addDays(prev, 7));
  };

  const handleParticipantsStartDateChange = (date: Date | null) => {
    if (date) {
      setParticipantsStartDate(date);
    }
  };

  const handleParticipantsEndDateChange = (date: Date | null) => {
    if (date) {
      setParticipantsEndDate(date);
    }
  };

  const handleTimeSlotsStartDateChange = (date: Date | null) => {
    if (date) {
      setTimeSlotsStartDate(date);
    }
  };

  const handleTimeSlotsEndDateChange = (date: Date | null) => {
    if (date) {
      setTimeSlotsEndDate(date);
    }
  };

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2">Reportes</h1>
      </div>

      <div className="grid gap-3 mb-4">
        <Card className="col">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">
              Eventos por Deporte - Semana
            </h2>
            {weeklyStats && (
              <p className="text-gray-600">
                Total de eventos: {weeklyStats.totalEvents}
              </p>
            )}
          </div>

          {weeklyLoading ? (
            <div
              className="flex items-center justify-center"
              style={{ height: "1024px", minHeight: "1024px" }}
            >
              <i className="pi pi-spin pi-spinner text-2xl"></i>
            </div>
          ) : weeklyStats ? (
            <WeeklyEventsChart weeklyStats={weeklyStats} />
          ) : (
            <div
              className="flex items-center justify-center text-gray-500"
              style={{ height: "1024px", minHeight: "1024px" }}
            >
              No hay datos disponibles
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex align-items-center flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <label className="font-medium whitespace-nowrap">Semana:</label>
                <Calendar
                  value={selectedWeek}
                  onChange={(e) => handleWeekChange(e.value || null)}
                  dateFormat="dd/mm/yy"
                  showIcon
                  placeholder="Seleccionar semana"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  icon="pi pi-chevron-left"
                  onClick={handlePreviousWeek}
                  severity="secondary"
                  text
                />
                <Button
                  icon="pi pi-chevron-right"
                  onClick={handleNextWeek}
                  severity="secondary"
                  text
                />
              </div>
              <div className="text-sm text-gray-600">
                {weeklyStats && (
                  <>
                    {format(new Date(weeklyStats.weekStart), "dd/MM/yyyy", {
                      locale: es,
                    })}{" "}
                    -
                    {format(new Date(weeklyStats.weekEnd), "dd/MM/yyyy", {
                      locale: es,
                    })}
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card className="col">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">
              Promedio de Participantes por Deporte
            </h2>
          </div>

          <div className="mb-4">
            <DateRangeControls
              startDate={participantsStartDate}
              endDate={participantsEndDate}
              onStartDateChange={handleParticipantsStartDateChange}
              onEndDateChange={handleParticipantsEndDateChange}
              title="Período"
            />
          </div>

          {participantsLoading ? (
            <div
              className="flex items-center justify-center"
              style={{ height: "1024px", minHeight: "1024px" }}
            >
              <i className="pi pi-spin pi-spinner text-2xl"></i>
            </div>
          ) : participantsStats ? (
            <ParticipantsChart participantsStats={participantsStats} />
          ) : (
            <div
              className="flex items-center justify-center text-gray-500"
              style={{ height: "1024px", minHeight: "1024px" }}
            >
              No hay datos disponibles
            </div>
          )}
        </Card>
      </div>

      <div className="grid">
        <Card className="col">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">
              Frecuencia de Eventos por Franja Horaria
            </h2>
          </div>

          <div className="mb-4">
            <DateRangeControls
              startDate={timeSlotsStartDate}
              endDate={timeSlotsEndDate}
              onStartDateChange={handleTimeSlotsStartDateChange}
              onEndDateChange={handleTimeSlotsEndDateChange}
              title="Período"
            />
          </div>

          {timeSlotsLoading ? (
            <div
              className="flex items-center justify-center"
              style={{ height: "1024px", minHeight: "1024px" }}
            >
              <i className="pi pi-spin pi-spinner text-2xl"></i>
            </div>
          ) : timeSlotsStats ? (
            <TimeSlotsChart timeSlotsStats={timeSlotsStats} />
          ) : (
            <div
              className="flex items-center justify-center"
              style={{ height: "1024px", minHeight: "1024px" }}
            >
              No hay datos disponibles
            </div>
          )}
        </Card>
        <div className="col">
          {weeklyStats && <WeeklyStatsCards weeklyStats={weeklyStats} />}
        </div>
      </div>
    </div>
  );
}
