import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, ChartConfiguration, ChartData, ChartOptions } from 'chart.js';
import { registerables } from 'chart.js';

// Register all Chart.js components
ChartJS.register(...registerables);

interface ChartProps {
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'polarArea';
  data: ChartData<any>;
  options?: ChartOptions<any>;
  height?: number;
  width?: number;
  className?: string;
}

const Chart: React.FC<ChartProps> = ({
  type,
  data,
  options = {},
  height,
  width,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destroy existing chart if it exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Create new chart
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const defaultOptions: ChartOptions<any> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            color: '#6B7280', // text-gray-500
            font: {
              size: 12,
            },
          },
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#F59E0B', // primary-gold
          bodyColor: '#FFFFFF',
          borderColor: '#F59E0B',
          borderWidth: 1,
        },
      },
      scales: {
        x: {
          grid: {
            color: '#E5E7EB', // gray-200
          },
          ticks: {
            color: '#6B7280', // text-gray-500
          },
        },
        y: {
          grid: {
            color: '#E5E7EB', // gray-200
          },
          ticks: {
            color: '#6B7280', // text-gray-500
          },
        },
      },
      ...options,
    };

    const config: ChartConfiguration = {
      type,
      data,
      options: defaultOptions,
    };

    chartRef.current = new ChartJS(ctx, config);

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [type, data, options]);

  // Update chart when data changes
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.data = data;
      chartRef.current.update();
    }
  }, [data]);

  return (
    <div className={`relative ${className}`} style={{ height, width }}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Chart;
