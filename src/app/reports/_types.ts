export interface DailyStat {
  date: string;
  dayOfWeek: string;
  totalEvents: number;
  eventsBySport: {
    sportId: number;
    sportName: string;
    eventCount: number;
  }[];
}

export interface WeeklyStats {
  weekStart: string;
  weekEnd: string;
  totalEvents: number;
  dailyStats: DailyStat[];
  topSports: {
    sportId: number;
    sportName: string;
    eventCount: number;
  }[];
}

export interface SportStat {
  sportId: number;
  sportName: string;
  totalEvents: number;
  totalParticipants: number;
  averageParticipants: number;
  minParticipants: number;
  maxParticipants: number;
}

export interface ParticipantsStats {
  startDate: string;
  endDate: string;
  sportStats: SportStat[];
}

export interface TimeSlotFrequency {
  timeSlot: string;
  eventCount: number;
  percentage: number;
}

export interface SportTimeSlotStat {
  sportId: number;
  sportName: string;
  timeSlotFrequency: TimeSlotFrequency[];
}

export interface TimeSlotsStats {
  startDate: string;
  endDate: string;
  timeSlots: {
    timeSlot: string;
    startHour: number;
    endHour: number;
  }[];
  sportStats: SportTimeSlotStat[];
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
    fill: boolean;
  }[];
} 