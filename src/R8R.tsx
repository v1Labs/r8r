import React, { useState, useEffect, useMemo, useRef } from 'react';

export interface DataPoint {
  label: string;
  value: number;
  maxValue?: number;
}

export interface Dataset {
  label: string;
  values: Record<string, number>;
  color?: string;
  status?: 'hidden' | 'inactive' | 'active';
  showNumbers?: boolean;
}

export interface R8RProps {
  /** Array of datasets to display */
  data: Dataset[];
  /** Chart structure defining the axes */
  chart: DataPoint[];
  /** Width of the chart in pixels */
  width?: number;
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
  /** Whether to show border around the chart */
  showBorder?: boolean;
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
    gridColor: '#dbe4ef',
    textColor: '#374151',
    legendBackgroundColor: '#f9fafb',
    legendBorderColor: '#e5e7eb',
  },
  dark: {
    backgroundColor: '#1f2937',
    gridColor: '#6b6d6f',
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
  showBorder = true,
  animationDuration = 200,
  className = '',
  style = {},
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [datasetStates, setDatasetStates] = useState<Map<number, { status: 'hidden' | 'inactive' | 'active'; showNumbers: boolean }>>(() => {
    // Initialize dataset states based on data
    const states = new Map();
    data.forEach((dataset, index) => {
      states.set(index, {
        status: dataset.status || 'active',
        showNumbers: dataset.showNumbers || false
      });
    });
    return states;
  });
  const [hoveredDataset, setHoveredDataset] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get container width
  useEffect(() => {
    const updateContainerWidth = () => {
      if (!containerRef.current) return;
      
      // Try to find the Storybook main container first
      const storybookMain = document.querySelector('body.sb-show-main');
      let observerElement: HTMLElement | null = null;
      
      if (storybookMain) {
        // Use Storybook's main container
        observerElement = storybookMain as HTMLElement;
        console.log('Using Storybook main container for width calculation');
      } else {
        // Fallback to parent element
        observerElement = containerRef.current.parentElement;
        console.log('Using parent element for width calculation');
      }
      
      if (observerElement) {
        const observerWidth = observerElement.getBoundingClientRect().width;
        // Set chart width to minimum of observer element width and width prop
        // If observer element is smaller than width prop, subtract 20px for padding
        const availableWidth = observerWidth < width ? observerWidth - 20 : Math.min(observerWidth, width);
        
        console.log('Width calculation:', {
          observerWidth,
          widthProp: width,
          availableWidth
        });
        
        setContainerWidth(availableWidth);
      } else {
        // Fallback to viewport width
        console.log('No observer element found, using viewport width:', window.innerWidth);
        setContainerWidth(Math.min(window.innerWidth, width));
      }
    };

    // Initial update
    updateContainerWidth();

    // Set up ResizeObserver
    let resizeObserver: ResizeObserver | null = null;
    
    // Try to find the Storybook main container first
    const storybookMain = document.querySelector('body.sb-show-main');
    let observerElement: HTMLElement | null = null;
    
    if (storybookMain) {
      // Use Storybook's main container
      observerElement = storybookMain as HTMLElement;
      console.log('Setting up ResizeObserver for Storybook main container');
    } else {
      // Fallback to parent element
      observerElement = containerRef.current?.parentElement || null;
      console.log('Setting up ResizeObserver for parent element');
    }
    
    if (observerElement) {
      resizeObserver = new ResizeObserver((entries) => {
        console.log('ResizeObserver triggered with', entries.length, 'entries');
        updateContainerWidth();
      });
      
      // Observe the determined element
      resizeObserver.observe(observerElement);
    }

    // Window resize listener as backup
    const handleResize = () => {
      console.log('Window resize detected');
      updateContainerWidth();
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) {
        console.log('Disconnecting ResizeObserver');
        resizeObserver.disconnect();
      }
    };
  }, [width]);

  // Mobile detection - now based on whether we should stack legend
  useEffect(() => {
    const checkMobile = () => {
      // Use the observed container width directly
      const availableWidth = containerWidth || window.innerWidth;
      const actualWidth = availableWidth >= width ? width : availableWidth;
      const shouldStackLegend = actualWidth < 450;
      
      console.log('Mobile detection:', {
        availableWidth,
        actualWidth,
        shouldStackLegend
      });
      
      setIsMobile(shouldStackLegend);
    };

    checkMobile();
  }, [width, containerWidth]);

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

  // Update dataset states when data changes
  useEffect(() => {
    const newStates = new Map();
    data.forEach((dataset, index) => {
      const existingState = datasetStates.get(index);
      newStates.set(index, {
        status: dataset.status || existingState?.status || 'active',
        showNumbers: dataset.showNumbers || existingState?.showNumbers || false
      });
    });
    setDatasetStates(newStates);
  }, [data]);

  // Calculate chart dimensions and positioning
  const chartConfig = useMemo(() => {
    // Use the observed container width directly
    const availableWidth = containerWidth || window.innerWidth;
    
    // Determine actual width: use width prop if container is larger, otherwise use container width
    const actualWidth = availableWidth >= width ? width : availableWidth;
    
    // Determine if we should stack legend above chart (when component is narrow)
    const shouldStackLegend = actualWidth < 450;
    
    // Calculate legend dimensions
    const legendWidth = showLegend && !shouldStackLegend ? 120 : 0;
    const legendHeight = showLegend && shouldStackLegend ? 80 : 0;
    
    // Chart dimensions - subtract 32px for legend padding when legend is to the left
    const chartWidth = actualWidth - legendWidth - (showLegend && !shouldStackLegend ? 32 : 0);
    const chartHeight = chartWidth; // Make chart square
    
    // Center and radius
    const centerX = chartWidth / 2;
    const centerY = chartHeight / 2;
    const radius = Math.min(centerX, centerY) * 0.7;
    const maxValue = Math.max(...chart.map(d => d.maxValue || 100));

    // Dynamic height calculation
    const totalHeight = chartHeight + legendHeight;

    console.log('Chart config updated:', {
      availableWidth,
      actualWidth,
      shouldStackLegend,
      chartWidth,
      chartHeight,
      totalHeight
    });

    return {
      centerX,
      centerY,
      radius,
      maxValue,
      legendWidth,
      legendHeight,
      chartWidth,
      chartHeight,
      actualWidth,
      totalHeight,
      shouldStackLegend,
    };
  }, [width, chart, showLegend, containerWidth]);

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
        angle,
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

  // Toggle dataset status between active and inactive
  const toggleDataset = (index: number) => {
    const newStates = new Map(datasetStates);
    const currentState = newStates.get(index);
    if (!currentState) return;
    
    // Toggle between active and inactive (skip hidden for now)
    const newStatus = currentState.status === 'active' ? 'inactive' : 'active';
    newStates.set(index, {
      status: newStatus,
      showNumbers: currentState.showNumbers
    });
    setDatasetStates(newStates);
  };

  // Toggle showNumbers on mouse enter/leave
  const handleMouseEnter = (index: number) => {
    setHoveredDataset(index);
    const newStates = new Map(datasetStates);
    const currentState = newStates.get(index);
    if (currentState) {
      newStates.set(index, {
        status: currentState.status,
        showNumbers: true
      });
      setDatasetStates(newStates);
    }
  };

  const handleMouseLeave = (index: number) => {
    setHoveredDataset(null);
    const newStates = new Map(datasetStates);
    const currentState = newStates.get(index);
    if (currentState) {
      newStates.set(index, {
        status: currentState.status,
        showNumbers: false
      });
      setDatasetStates(newStates);
    }
  };

  // Get dataset color based on status and hover state
  const getDatasetColor = (index: number, baseColor: string) => {
    const datasetState = datasetStates.get(index);
    if (!datasetState) return baseColor;
    
    // If dataset is inactive, return grayscale version
    if (datasetState.status === 'inactive') {
      const opacity = theme === 'dark' ? 0.9 : 0.6; // Higher opacity for dark theme
      
      // Handle both hex and rgba colors
      if (baseColor.startsWith('#')) {
        // Hex color conversion
        const hex = baseColor.slice(1); // Remove #
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        return `rgba(${gray}, ${gray}, ${gray}, ${opacity})`;
      } else if (baseColor.startsWith('rgba')) {
        // Extract RGB values from rgba
        const match = baseColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
          const r = parseInt(match[1]);
          const g = parseInt(match[2]);
          const b = parseInt(match[3]);
          const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
          return `rgba(${gray}, ${gray}, ${gray}, ${opacity})`;
        }
      }
      // Fallback to a default gray
      return `rgba(128, 128, 128, ${opacity})`;
    }
    
    return baseColor;
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
        width: chartConfig.actualWidth,
        height: chartConfig.totalHeight,
        backgroundColor: currentTheme.backgroundColor,
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: showBorder ? `1px solid ${currentTheme.gridColor}` : 'none',
        display: 'flex',
        flexDirection: chartConfig.shouldStackLegend ? 'column' : 'row',
        transition: `all ${animationDuration}ms ease-in-out`,
        opacity: isAnimating ? 0.8 : 1,
        margin: '0',
        overflow: 'hidden',
        boxSizing: 'border-box',
        fontFamily: 'sans-serif',
        ...style,
      }}
      ref={containerRef}
    >
      {/* Legend */}
      {showLegend && (
        <div
          style={{
            width: chartConfig.shouldStackLegend ? 'auto' : chartConfig.legendWidth,
            height: chartConfig.shouldStackLegend ? chartConfig.legendHeight : 'auto',
            padding: chartConfig.shouldStackLegend ? '8px' : '16px',
            borderRight: chartConfig.shouldStackLegend ? 'none' : `1px solid ${currentTheme.legendBorderColor}`,
            borderBottom: chartConfig.shouldStackLegend ? `1px solid ${currentTheme.legendBorderColor}` : 'none',
            backgroundColor: currentTheme.legendBackgroundColor,
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            justifyContent: chartConfig.shouldStackLegend ? 'center' : 'center',
            alignItems: 'stretch',
            gap: '8px',
          }}
        >
          {legendTitle && (
            <h3 style={{ 
              margin: '0 0 8px 0', 
              fontSize: chartConfig.shouldStackLegend ? '14px' : '14px', 
              fontWeight: '600',
              color: currentTheme.textColor,
              flexShrink: 0,
              textAlign: chartConfig.shouldStackLegend ? 'center' : 'left',
            }}>
              {legendTitle}
            </h3>
          )}
          <div style={{
            display: 'flex',
            flexDirection: chartConfig.shouldStackLegend ? 'row' : 'column',
            flexWrap: chartConfig.shouldStackLegend ? 'wrap' : 'nowrap',
            justifyContent: chartConfig.shouldStackLegend ? 'center' : 'flex-start',
            alignItems: chartConfig.shouldStackLegend ? 'center' : 'stretch',
            gap: chartConfig.shouldStackLegend ? '6px' : '8px',
          }}>
            {allDatasetPoints.map(({ dataset, color, index }) => {
              const datasetState = datasetStates.get(index);
              if (!datasetState || datasetState.status === 'hidden') return null;
              
              const isActive = datasetState.status === 'active';
              const isHovered = hoveredDataset === index;
              const displayColor = getDatasetColor(index, color);
              const isVerySmallScreen = chartConfig.actualWidth <= 480;
              
              return (
                <div
                  key={index}
                  onClick={() => toggleDataset(index)}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={() => handleMouseLeave(index)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: isVerySmallScreen ? '4px' : '6px',
                    cursor: 'pointer',
                    fontSize: chartConfig.shouldStackLegend ? (isVerySmallScreen ? '12px' : '13px') : '12px',
                    color: currentTheme.textColor,
                    opacity: isActive ? 1 : 0.4,
                    padding: chartConfig.shouldStackLegend ? (isVerySmallScreen ? '3px 6px' : '4px 8px') : '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: isActive ? `${color}20` : 'transparent',
                    border: `1px solid ${isActive ? color : 'transparent'}`,
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <div style={{
                    width: isVerySmallScreen ? '10px' : (chartConfig.shouldStackLegend ? '12px' : '12px'),
                    height: isVerySmallScreen ? '10px' : (chartConfig.shouldStackLegend ? '12px' : '12px'),
                    backgroundColor: displayColor,
                    borderRadius: '2px',
                    opacity: isActive ? 1 : 0.5,
                    flexShrink: 0,
                  }} />
                  <div style={{ flexShrink: 0 }}>
                    {dataset.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Chart */}
      <svg
        width={chartConfig.chartWidth}
        height={chartConfig.chartHeight}
        style={{
          display: 'block',
          transition: `all ${animationDuration}ms ease-in-out`,
          opacity: isAnimating ? 0.8 : 1,
          marginTop: !chartConfig.shouldStackLegend ? '10px' : '0',
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
            />
            {showLabels && (
              <text
                x={line.x2 + Math.cos(line.angle) * 15}
                y={line.y2 + Math.sin(line.angle) * 15}
                dy={line.y2 > chartConfig.centerY ? 15 : -15}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fill={currentTheme.textColor}
                fontWeight="500"
              >
                {line.label}
              </text>
            )}
            <text
              x={line.x2 + Math.cos(line.angle) * 15}
              y={line.y2 + Math.sin(line.angle) * 15}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="14"
              fill={currentTheme.textColor}
              fontWeight="700"
            >
              {chart[index].maxValue || 100}
            </text>
          </g>
        ))}

        {/* Dataset polygons */}
        {allDatasetPoints
          .map(({ dataset, points, color, index }) => {
            const datasetState = datasetStates.get(index);
            if (!datasetState || datasetState.status === 'hidden') return null;
            
            const isActive = datasetState.status === 'active';
            const showNumbers = datasetState.showNumbers;
            const displayColor = getDatasetColor(index, color);
            
            // For inactive datasets, use grayscale for stroke and nearly transparent fill
            const strokeColor = isActive ? displayColor : (() => {
              const opacity = theme === 'dark' ? 0.9 : 0.6; // Higher opacity for dark theme
              
              // Handle both hex and rgba colors
              if (displayColor.startsWith('#')) {
                // Hex color conversion
                const hex = displayColor.slice(1); // Remove #
                const r = parseInt(hex.slice(0, 2), 16);
                const g = parseInt(hex.slice(2, 4), 16);
                const b = parseInt(hex.slice(4, 6), 16);
                const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
                return `rgba(${gray}, ${gray}, ${gray}, ${opacity})`;
              } else if (displayColor.startsWith('rgba')) {
                // Extract RGB values from rgba
                const match = displayColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
                if (match) {
                  const r = parseInt(match[1]);
                  const g = parseInt(match[2]);
                  const b = parseInt(match[3]);
                  const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
                  return `rgba(${gray}, ${gray}, ${gray}, ${opacity})`;
                }
              }
              // Fallback to a default gray
              return `rgba(128, 128, 128, ${opacity})`;
            })();
            
            const fillColor = isActive ? displayColor : strokeColor; // Use grayscale for inactive fill
            
            return {
              dataset,
              points,
              color,
              index,
              datasetState,
              isActive,
              showNumbers,
              displayColor,
              strokeColor,
              fillColor
            };
          })
          .filter((item): item is NonNullable<typeof item> => item !== null)
          .sort((a, b) => {
            // Sort by: inactive first, then active, then those with numbers on top
            if (a.isActive !== b.isActive) {
              return a.isActive ? 1 : -1; // Inactive first
            }
            if (a.showNumbers !== b.showNumbers) {
              return a.showNumbers ? 1 : -1; // Those without numbers first
            }
            return 0; // Keep original order for same type
          })
          .map(({ dataset, points, color, index, strokeColor, fillColor, isActive, showNumbers }) => (
            <g key={`dataset-${index}`}>
              <path
                d={createPolygonPath(points)}
                fill={fillColor}
                fillOpacity={isActive ? "0.2" : (theme === 'dark' ? "0.2" : "0.1")}
                stroke={strokeColor}
                strokeWidth="2"
                strokeOpacity={isActive ? "0.8" : "0.6"}
              />
              {/* Data points */}
              {points.map((point, pointIndex) => (
                <g key={`point-${index}-${pointIndex}`}>
                  {showNumbers && (
                    <>
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r={14}
                        fill={strokeColor}
                        opacity="0.9"
                      />
                      <text
                        x={point.x}
                        y={point.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={12}
                        fill="white"
                        fontWeight="700"
                      >
                        {point.value}
                      </text>
                    </>
                  )}
                </g>
              ))}
            </g>
          ))}
      </svg>
    </div>
  );
};

export default R8R; 