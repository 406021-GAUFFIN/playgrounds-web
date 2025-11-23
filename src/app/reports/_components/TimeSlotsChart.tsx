"use client";

import { Chart } from "primereact/chart";
import { TimeSlotsStats } from "../_types";

interface TimeSlotsChartProps {
  timeSlotsStats: TimeSlotsStats;
}

export default function TimeSlotsChart({ timeSlotsStats }: TimeSlotsChartProps) {
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
    const timeSlots = timeSlotsStats.timeSlots.map(slot => slot.timeSlot);
    
    const datasets = timeSlotsStats.sportStats.map((sport, sportIndex) => {
      const data = timeSlots.map(timeSlot => {
        const slotData = sport.timeSlotFrequency.find(slot => slot.timeSlot === timeSlot);
        return slotData ? slotData.eventCount : 0;
      });

      return {
        label: sport.sportName,
        data: data,
        backgroundColor: getSportColor(sportIndex),
        borderColor: getSportColor(sportIndex, 1),
        borderWidth: 1,
      };
    });

    return {
      labels: timeSlots,
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
      tooltip: {
        callbacks: {
          afterLabel: function(context: any) {
            const sportIndex = context.datasetIndex;
            const timeSlotIndex = context.dataIndex;
            const sport = timeSlotsStats.sportStats[sportIndex];
            const timeSlot = sport.timeSlotFrequency[timeSlotIndex];
            if (timeSlot) {
              return `Porcentaje: ${timeSlot.percentage}%`;
            }
            return '';
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: "Franjas Horarias",
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
        title: {
          display: true,
          text: "Cantidad de Eventos",
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