"use client";

import { Chart } from "primereact/chart";
import { ParticipantsStats } from "../_types";

interface ParticipantsChartProps {
  participantsStats: ParticipantsStats;
}

export default function ParticipantsChart({ participantsStats }: ParticipantsChartProps) {
  const getSportColor = (index: number, alpha: number = 0.8) => {
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
    const labels = participantsStats.sportStats.map(sport => sport.sportName);
    const data = participantsStats.sportStats.map(sport => sport.averageParticipants);

    return {
      labels: labels,
      datasets: [
        {
          label: "Promedio de Participantes",
          data: data,
          backgroundColor: participantsStats.sportStats.map((_, index) => getSportColor(index)),
          borderColor: participantsStats.sportStats.map((_, index) => getSportColor(index, 1)),
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
        title: {
          display: true,
          text: "Promedio de Participantes",
        },
      },
      y: {
        title: {
          display: true,
          text: "Deportes",
        },
      },
    },
  };

  return (
    <div>
      <Chart
        type="bar"
        data={getChartData()}
        options={chartOptions}
        style={{ height: "100%", minHeight: "512px" }}
      />
    </div>
  );
} 