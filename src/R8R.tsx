import React, { useState, useEffect, useMemo } from 'react';

export interface DataPoint {
  label: string;
  value: number;
  maxValue?: number;
}

export interface R8RProps {
  /** Primary dataset to display */
  primaryData: DataPoint[];
  /** Secondary dataset for comparison (optional) */
  secondaryData?: DataPoint[];
  /** Width of the chart in pixels */
  width?: number;
  /** Height of the chart in pixels */
  height?: number;
  /** Primary data color (hex or CSS color) */
  primaryColor?: string;
  /** Secondary data color (hex or CSS color) */
  secondaryColor?: string;
  /** Background color of the chart */
  backgroundColor?: string;
  /** Grid line color */
  gridColor?: string;
  /** Whether to show grid lines */
  showGrid?: boolean;
  /** Whether to show axis labels */
  showLabels?: boolean;
  /** Whether to show data point values */
  showValues?: boolean;
  /** Animation duration in milliseconds */
  animationDuration?: number;
  /** Custom CSS class name */
  className?: string;
  /** Custom CSS styles */
  style?: React.CSSProperties;
}

const R8R: React.FC<R8RProps> = ({
  primaryData,
  secondaryData = [],
  width = 400,
  height = 400,
  primaryColor = '#3b82f6',
  secondaryColor = '#ef4444',
  backgroundColor = '#ffffff',
  gridColor = '#e5e7eb',
  showGrid = true,
  showLabels = true,
  showValues = false,
  animationDuration = 1000,
  className = '',
  style = {},
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  // Validate data
  useEffect(() => {
    if (!primaryData || primaryData.length === 0) {
      console.warn('R8R: primaryData is required and must not be empty');
    }
    if (primaryData.length > 10) {
      console.warn('R8R: Maximum 10 dimensions supported');
    }
  }, [primaryData]);

  // Calculate chart dimensions and positioning
  const chartConfig = useMemo(() => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) * 0.7;
    const maxValue = Math.max(
      ...primaryData.map(d => d.maxValue || 100),
      ...secondaryData.map(d => d.maxValue || 100)
    );

    return {
      centerX,
      centerY,
      radius,
      maxValue,
    };
  }, [width, height, primaryData, secondaryData]);

  // Calculate polygon points
  const calculatePoints = (data: DataPoint[], color: string) => {
    const { centerX, centerY, radius, maxValue } = chartConfig;
    const angleStep = (2 * Math.PI) / data.length;

    return data.map((point, index) => {
      const angle = index * angleStep - Math.PI / 2; // Start from top
      const normalizedValue = point.value / (point.maxValue || maxValue);
      const pointRadius = radius * normalizedValue;
      
      return {
        x: centerX + pointRadius * Math.cos(angle),
        y: centerY + pointRadius * Math.sin(angle),
        label: point.label,
        value: point.value,
        maxValue: point.maxValue || maxValue,
      };
    });
  };

  const primaryPoints = useMemo(() => calculatePoints(primaryData, primaryColor), [primaryData, primaryColor, chartConfig]);
  const secondaryPoints = useMemo(() => calculatePoints(secondaryData, secondaryColor), [secondaryData, secondaryColor, chartConfig]);

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
    const angleStep = (2 * Math.PI) / primaryData.length;
    
    for (let i = 0; i < primaryData.length; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const endX = centerX + radius * Math.cos(angle);
      const endY = centerY + radius * Math.sin(angle);
      
      lines.push({
        x1: centerX,
        y1: centerY,
        x2: endX,
        y2: endY,
        label: primaryData[i].label,
        angle,
      });
    }
    
    return lines;
  }, [primaryData, chartConfig]);

  // Create polygon path
  const createPolygonPath = (points: Array<{ x: number; y: number }>) => {
    if (points.length === 0) return '';
    return `M ${points.map(p => `${p.x} ${p.y}`).join(' L ')} Z`;
  };

  // Animation effect
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), animationDuration);
    return () => clearTimeout(timer);
  }, [primaryData, secondaryData, animationDuration]);

  return (
    <div
      className={`r8r-chart ${className}`}
      style={{
        width,
        height,
        backgroundColor,
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        ...style,
      }}
    >
      <svg
        width={width}
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
            stroke={gridColor}
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
              stroke={gridColor}
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
                fill="#6b7280"
                fontWeight="500"
              >
                {line.label}
              </text>
            )}
          </g>
        ))}

        {/* Secondary data polygon */}
        {secondaryData.length > 0 && (
          <path
            d={createPolygonPath(secondaryPoints)}
            fill={secondaryColor}
            fillOpacity="0.2"
            stroke={secondaryColor}
            strokeWidth="2"
            strokeOpacity="0.8"
          />
        )}

        {/* Primary data polygon */}
        <path
          d={createPolygonPath(primaryPoints)}
          fill={primaryColor}
          fillOpacity="0.2"
          stroke={primaryColor}
          strokeWidth="3"
          strokeOpacity="0.9"
        />

        {/* Data points */}
        {primaryPoints.map((point, index) => (
          <g key={`point-${index}`}>
            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill={primaryColor}
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
                fill="#374151"
                fontWeight="600"
              >
                {point.value}
              </text>
            )}
          </g>
        ))}

        {secondaryData.length > 0 && secondaryPoints.map((point, index) => (
          <g key={`secondary-point-${index}`}>
            <circle
              cx={point.x}
              cy={point.y}
              r="3"
              fill={secondaryColor}
              stroke="white"
              strokeWidth="1.5"
            />
            {showValues && (
              <text
                x={point.x}
                y={point.y + 15}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="10"
                fill="#374151"
                fontWeight="600"
              >
                {point.value}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
};

export default R8R; 