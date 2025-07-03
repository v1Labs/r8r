import React, { useState, useEffect, useMemo } from 'react';

export interface DataPoint {
  label: string;
  value: number;
  maxValue?: number;
}

export interface Dataset {
  label: string;
  values: Record<string, number>;
  color?: string;
}

export interface R8RProps {
  /** Array of datasets to display */
  data: Dataset[];
  /** Chart structure defining the axes */
  chart: DataPoint[];
  /** Width of the chart in pixels */
  width?: number;
  /** Height of the chart in pixels */
  height?: number;
  /** Theme preset ('light' | 'dark') */
  theme?: 'light' | 'dark';
  /** Background color of the chart */
  backgroundColor?: string;
  /** Grid line color */
  gridColor?: string;
  /** Text color for labels and legend */
  textColor?: string;
  /** Legend background color */
  legendBackgroundColor?: string;
  /** Legend border color */
  legendBorderColor?: string;
  /** Array of colors for datasets (will be used if dataset doesn't specify a color) */
  colors?: string[];
  /** Whether to show grid lines */
  showGrid?: boolean;
  /** Whether to show axis labels */
  showLabels?: boolean;
  /** Whether to show data point values */
  showValues?: boolean;
  /** Whether to show legend */
  showLegend?: boolean;
  /** Title for the legend (empty string hides the title) */
  legendTitle?: string;
  /** Animation duration in milliseconds */
  animationDuration?: number;
  /** Custom CSS class name */
  className?: string;
  /** Custom CSS styles */
  style?: React.CSSProperties;
}

// Predefined themes
const themes: Record<string, {
  backgroundColor: string;
  gridColor: string;
  textColor: string;
  legendBackgroundColor: string;
  legendBorderColor: string;
}> = {
  light: {
    backgroundColor: '#ffffff',
    gridColor: '#e5e7eb',
    textColor: '#374151',
    legendBackgroundColor: '#f9fafb',
    legendBorderColor: '#e5e7eb',
  },
  dark: {
    backgroundColor: '#1f2937',
    gridColor: '#374151',
    textColor: '#f9fafb',
    legendBackgroundColor: '#111827',
    legendBorderColor: '#374151',
  },
};

// Default colors for datasets
const defaultColors = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#f97316', // orange
  '#ec4899', // pink
  '#6b7280', // gray
];

const R8R: React.FC<R8RProps> = ({
  data,
  chart,
  width = 400,
  height = 400,
  theme = 'light',
  backgroundColor,
  gridColor,
  textColor,
  legendBackgroundColor,
  legendBorderColor,
  colors = defaultColors,
  showGrid = true,
  showLabels = true,
  showValues = false,
  showLegend = true,
  legendTitle = '',
  animationDuration = 1000,
  className = '',
  style = {},
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [visibleDatasets, setVisibleDatasets] = useState<Set<number>>(new Set(data.map((_, index) => index)));

  // Merge theme with custom overrides
  const currentTheme = useMemo(() => {
    const baseTheme = themes[theme];
    return {
      backgroundColor: backgroundColor || baseTheme.backgroundColor,
      gridColor: gridColor || baseTheme.gridColor,
      textColor: textColor || baseTheme.textColor,
      legendBackgroundColor: legendBackgroundColor || baseTheme.legendBackgroundColor,
      legendBorderColor: legendBorderColor || baseTheme.legendBorderColor,
    };
  }, [theme, backgroundColor, gridColor, textColor, legendBackgroundColor, legendBorderColor]);

  // Validate data
  useEffect(() => {
    if (!data || data.length === 0) {
      console.warn('R8R: data is required and must not be empty');
    }
    if (!chart || chart.length === 0) {
      console.warn('R8R: chart is required and must not be empty');
    }
    if (chart.length > 10) {
      console.warn('R8R: Maximum 10 dimensions supported');
    }
  }, [data, chart]);

  // Calculate chart dimensions and positioning
  const chartConfig = useMemo(() => {
    const legendWidth = showLegend ? 120 : 0;
    const chartWidth = width - legendWidth;
    const centerX = chartWidth / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) * 0.7;
    const maxValue = Math.max(...chart.map(d => d.maxValue || 100));

    return {
      centerX,
      centerY,
      radius,
      maxValue,
      legendWidth,
      chartWidth,
    };
  }, [width, height, chart, showLegend]);

  // Calculate polygon points for a dataset
  const calculatePoints = (dataset: Dataset, color: string) => {
    const { centerX, centerY, radius, maxValue } = chartConfig;
    const angleStep = (2 * Math.PI) / chart.length;

    return chart.map((point, index) => {
      const angle = index * angleStep - Math.PI / 2; // Start from top
      const value = dataset.values[point.label] || 0;
      const normalizedValue = value / (point.maxValue || maxValue);
      const pointRadius = radius * normalizedValue;
      
      return {
        x: centerX + pointRadius * Math.cos(angle),
        y: centerY + pointRadius * Math.sin(angle),
        label: point.label,
        value,
        maxValue: point.maxValue || maxValue,
      };
    });
  };

  // Generate all dataset points
  const allDatasetPoints = useMemo(() => {
    return data.map((dataset, index) => ({
      dataset,
      points: calculatePoints(dataset, dataset.color || colors[index % colors.length]),
      color: dataset.color || colors[index % colors.length],
      index,
    }));
  }, [data, chart, colors, chartConfig]);

  // Generate grid circles
  const gridCircles = useMemo(() => {
    if (!showGrid) return [];
    
    const { centerX, centerY, radius } = chartConfig;
    const circles = [];
    const levels = 5;
    
    for (let i = 1; i <= levels; i++) {
      const circleRadius = (radius * i) / levels;
      circles.push({
        cx: centerX,
        cy: centerY,
        r: circleRadius,
      });
    }
    
    return circles;
  }, [showGrid, chartConfig]);

  // Generate axis lines
  const axisLines = useMemo(() => {
    const { centerX, centerY, radius } = chartConfig;
    const lines = [];
    const angleStep = (2 * Math.PI) / chart.length;
    
    for (let i = 0; i < chart.length; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const endX = centerX + radius * Math.cos(angle);
      const endY = centerY + radius * Math.sin(angle);
      
      lines.push({
        x1: centerX,
        y1: centerY,
        x2: endX,
        y2: endY,
        label: chart[i].label,
        angle,
      });
    }
    
    return lines;
  }, [chart, chartConfig]);

  // Create polygon path
  const createPolygonPath = (points: Array<{ x: number; y: number }>) => {
    if (points.length === 0) return '';
    return `M ${points.map(p => `${p.x} ${p.y}`).join(' L ')} Z`;
  };

  // Toggle dataset visibility
  const toggleDataset = (index: number) => {
    const newVisible = new Set(visibleDatasets);
    if (newVisible.has(index)) {
      newVisible.delete(index);
    } else {
      newVisible.add(index);
    }
    setVisibleDatasets(newVisible);
  };

  // Animation effect
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), animationDuration);
    return () => clearTimeout(timer);
  }, [data, chart, animationDuration]);

  return (
    <div
      className={`r8r-chart ${className}`}
      style={{
        width,
        height,
        backgroundColor: currentTheme.backgroundColor,
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        transition: `all ${animationDuration}ms ease-in-out`,
        opacity: isAnimating ? 0.8 : 1,
        ...style,
      }}
    >
      {/* Legend */}
      {showLegend && (
        <div
          style={{
            width: chartConfig.legendWidth,
            padding: '16px',
            borderRight: `1px solid ${currentTheme.legendBorderColor}`,
            backgroundColor: currentTheme.legendBackgroundColor,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <h3 style={{ 
            margin: '0 0 12px 0', 
            fontSize: '14px', 
            fontWeight: '600',
            color: currentTheme.textColor 
          }}>
            {legendTitle}
          </h3>
          {allDatasetPoints.map(({ dataset, color, index }) => {
            const isVisible = visibleDatasets.has(index);
            return (
              <div
                key={index}
                onClick={() => toggleDataset(index)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  color: currentTheme.textColor,
                  opacity: isVisible ? 1 : 0.4,
                  padding: '4px 8px',
                  borderRadius: '4px',
                  backgroundColor: isVisible ? `${color}20` : 'transparent',
                  border: `1px solid ${isVisible ? color : 'transparent'}`,
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: color,
                  borderRadius: '2px',
                  opacity: isVisible ? 1 : 0.5
                }} />
                {dataset.label}
              </div>
            );
          })}
        </div>
      )}

      {/* Chart */}
      <svg
        width={chartConfig.chartWidth}
        height={height}
        style={{
          display: 'block',
          transition: `all ${animationDuration}ms ease-in-out`,
          opacity: isAnimating ? 0.8 : 1,
        }}
      >
        {/* Grid circles */}
        {gridCircles.map((circle, index) => (
          <circle
            key={`grid-${index}`}
            cx={circle.cx}
            cy={circle.cy}
            r={circle.r}
            fill="none"
            stroke={currentTheme.gridColor}
            strokeWidth="1"
            opacity="0.3"
          />
        ))}

        {/* Axis lines */}
        {axisLines.map((line, index) => (
          <g key={`axis-${index}`}>
            <line
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke={currentTheme.gridColor}
              strokeWidth="1"
              opacity="0.5"
            />
            {showLabels && (
              <text
                x={line.x2 + Math.cos(line.angle) * 20}
                y={line.y2 + Math.sin(line.angle) * 20}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fill={currentTheme.textColor}
                fontWeight="500"
              >
                {line.label}
              </text>
            )}
          </g>
        ))}

        {/* Dataset polygons */}
        {allDatasetPoints.map(({ dataset, points, color, index }) => {
          if (!visibleDatasets.has(index)) return null;
          
          return (
            <g key={`dataset-${index}`}>
              <path
                d={createPolygonPath(points)}
                fill={color}
                fillOpacity="0.2"
                stroke={color}
                strokeWidth="2"
                strokeOpacity="0.8"
              />
              {/* Data points */}
              {points.map((point, pointIndex) => (
                <g key={`point-${index}-${pointIndex}`}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill={color}
                    stroke="white"
                    strokeWidth="2"
                  />
                  {showValues && (
                    <text
                      x={point.x}
                      y={point.y - 15}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="10"
                      fill={currentTheme.textColor}
                      fontWeight="600"
                    >
                      {point.value}
                    </text>
                  )}
                </g>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default R8R; 