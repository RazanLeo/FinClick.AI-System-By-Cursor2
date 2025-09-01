'use client';

import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'polarArea' | 'bubble' | 'scatter';
  data: any;
  options?: any;
}

interface ChartProps {
  config: ChartConfig;
  width?: number;
  height?: number;
  className?: string;
}

export default function ChartComponent({ 
  config, 
  width = 400, 
  height = 300,
  className = ''
}: ChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Default options for FinClick.AI theme
    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#D4AF37',
            font: {
              family: 'Arial, sans-serif'
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(30, 41, 59, 0.95)',
          titleColor: '#D4AF37',
          bodyColor: '#FFFFFF',
          borderColor: '#D4AF37',
          borderWidth: 1
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#D4AF37'
          },
          grid: {
            color: 'rgba(212, 175, 55, 0.2)'
          }
        },
        y: {
          ticks: {
            color: '#D4AF37'
          },
          grid: {
            color: 'rgba(212, 175, 55, 0.2)'
          }
        }
      }
    };

    // Merge custom options with defaults
    const mergedOptions = {
      ...defaultOptions,
      ...config.options
    };

    // Create new chart
    chartRef.current = new Chart(ctx, {
      type: config.type,
      data: config.data,
      options: mergedOptions
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [config]);

  return (
    <div className={`chart-container ${className}`} style={{ width, height }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
      />
    </div>
  );
}
