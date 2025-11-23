"use client";

import { Chart } from "primereact/chart";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { WeeklyStats } from "../_types";

interface WeeklyEventsChartProps {
  weeklyStats: WeeklyStats;
}

export default function WeeklyEventsChart({ weeklyStats }: WeeklyEventsChartProps) {
  const getSportColor = (index: number, alpha: number = 1) => {
    const colors = [
      `rgba(54, 162, 235, ${alpha})`,
      `rgba(255, 99, 132, ${alpha})`,
      `rgba(75, 192, 192, ${alpha})`,
      `rgba(255, 205, 86, ${alpha})`,
      `rgba(153, 102, 255, ${alpha})`,
      `rgba(255, 159, 64, ${alpha})`,
      `rgba(199, 199, 199, ${alpha})`,
      `rgba(83, 102, 255, ${alpha})`,
    ];
    return colors[index % colors.length];
  };

  const getChartData = () => {
    const allSports = new Set<string>();
    weeklyStats.dailyStats.forEach(day => {
      day.eventsBySport.forEach(sport => {
        allSports.add(sport.sportName);
      });
    });

    const sportNames = Array.from(allSports);
    const datasets = sportNames.map((sportName, index) => {
      const data = weeklyStats.dailyStats.map(day => {
        const sportData = day.eventsBySport.find(s => s.sportName === sportName);
        return sportData ? sportData.eventCount : 0;
      });

      return {
        label: sportName,
        data: data,
        borderColor: getSportColor(index),
        backgroundColor: getSportColor(index, 0.2),
        tension: 0.4,
        fill: false,
      };
    });

    return {
      labels: weeklyStats.dailyStats.map(day => 
        format(new Date(day.date), "EEE dd/MM", { locale: es })
      ),
      datasets: datasets,
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div >
      <Chart
        type="line"
        data={getChartData()}
        options={chartOptions}
        style={{ height: "100%", minHeight: "512px" }}
      />
    </div>
  );
} 