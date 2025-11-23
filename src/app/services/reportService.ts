import { WeeklyStats, ParticipantsStats, TimeSlotsStats } from "../reports/_types";

export const reportService = {
  async getWeeklyStats(weekStart: string): Promise<WeeklyStats> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/events/stats/weekly?weekStart=${weekStart}`,
      {
        headers: {
          Authorization: `Bearer ${
            document.cookie.split("token=")[1].split(";")[0]
          }`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al cargar estadísticas semanales");
    }

    return response.json();
  },

  async getParticipantsStats(startDate: string, endDate: string): Promise<ParticipantsStats> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/events/stats/participants?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: {
          Authorization: `Bearer ${
            document.cookie.split("token=")[1].split(";")[0]
          }`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al cargar estadísticas de participantes");
    }

    return response.json();
  },

  async getTimeSlotsStats(startDate: string, endDate: string): Promise<TimeSlotsStats> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/events/stats/timeslots?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: {
          Authorization: `Bearer ${
            document.cookie.split("token=")[1].split(";")[0]
          }`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al cargar estadísticas de franjas horarias");
    }

    return response.json();
  },
}; 