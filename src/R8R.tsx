import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';

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
  /** Whether to show play button for animated data sequence */
  showPlayButton?: boolean;
  /** Whether to show timeline slider for manual data exploration */
  showTimeline?: boolean;
  /** Speed of play animation in milliseconds (default: 1000) */
  playSpeed?: number;
  /** Whether to show mini radar charts in a grid layout instead of overlaying them */
  showSparkLayout?: boolean;
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
  showPlayButton = false,
  showTimeline = false,
  playSpeed = 1000,
  showSparkLayout = false,
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [tooltipData, setTooltipData] = useState<{ content: string; x: number; y: number } | null>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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

  // Calculate spark layout dimensions
  const sparkConfig = useMemo(() => {
    if (!showSparkLayout) return null;
    
    const availableWidth = containerWidth || window.innerWidth;
    const actualWidth = availableWidth >= width ? width : availableWidth;
    
    // Calculate grid dimensions - use 2x2 for exactly 4 datasets, otherwise 3x3
    const chartsToShow = Math.min(data.length, 9);
    const gridSize = chartsToShow === 4 ? 2 : 3;
    const maxCharts = gridSize * gridSize;
    
    // Calculate individual spark chart size
    const padding = 8;
    const gap = 18;
    const availableChartWidth = actualWidth - (padding * 2) - (gap * (gridSize - 1));
    const sparkSize = (availableChartWidth / gridSize) * 0.95; // Slightly smaller SVG boxes
    
    // Calculate grid layout
    const rows = Math.ceil(chartsToShow / gridSize);
    const totalHeight = (sparkSize * rows) + (gap * (rows - 1)) + (padding * 2);
    
    return {
      gridSize,
      maxCharts,
      chartsToShow,
      sparkSize,
      padding,
      gap,
      rows,
      totalHeight,
      actualWidth,
    };
  }, [showSparkLayout, data.length, width, containerWidth]);

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

  // Calculate polygon points for a spark chart
  const calculateSparkPoints = (dataset: Dataset, color: string, sparkSize: number) => {
    const centerX = sparkSize / 2;
    const centerY = sparkSize / 2;
    const radius = Math.min(centerX, centerY) * 0.85; // Slightly reduced to prevent cutoff
    const maxValue = Math.max(...chart.map(d => d.maxValue || 100));
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

  // Generate spark chart elements
  const generateSparkChartElements = (sparkSize: number) => {
    const centerX = sparkSize / 2;
    const centerY = sparkSize / 2;
    const radius = Math.min(centerX, centerY) * 0.85; // Match the radius used in calculateSparkPoints
    const angleStep = (2 * Math.PI) / chart.length;
    
    // Generate grid circles for spark chart
    const gridCircles = [];
    const levels = 3; // Fewer levels for spark charts
    
    for (let i = 1; i <= levels; i++) {
      const circleRadius = (radius * i) / levels;
      gridCircles.push({
        cx: centerX,
        cy: centerY,
        r: circleRadius,
      });
    }
    
    // Generate axis lines for spark chart
    const axisLines = [];
    for (let i = 0; i < chart.length; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const endX = centerX + radius * Math.cos(angle);
      const endY = centerY + radius * Math.sin(angle);
      
      axisLines.push({
        x1: centerX,
        y1: centerY,
        x2: endX,
        y2: endY,
        label: chart[i].label,
        angle,
      });
    }
    
    return { gridCircles, axisLines };
  };

  // Create polygon path
  const createPolygonPath = (points: Array<{ x: number; y: number }>) => {
    if (points.length === 0) return '';
    return `M ${points.map(p => `${p.x} ${p.y}`).join(' L ')} Z`;
  };

  // Render individual spark chart
  const renderSparkChart = (dataset: Dataset, index: number, sparkSize: number) => {
    const color = dataset.color || colors[index % colors.length];
    const points = calculateSparkPoints(dataset, color, sparkSize);
    const { gridCircles, axisLines } = generateSparkChartElements(sparkSize);
    
    // Create tooltip content with formatted labels and values
    const tooltipContent = Object.entries(dataset.values)
      .map(([label, value]) => `**${label}**: ${value}`)
      .join('\n');
    
    const handleMouseEnter = (e: React.MouseEvent) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Calculate optimal position - anchor below the chart
      let x = rect.left + rect.width / 2;
      let y = rect.bottom - 5; // Position closer to the chart
      
      // Ensure tooltip doesn't go off-screen
      if (x < 100) x = 100;
      if (x > viewportWidth - 100) x = viewportWidth - 100;
      if (y > viewportHeight - 100) y = rect.top - 15; // Show above if not enough space below
      
      setTooltipData({
        content: tooltipContent,
        x,
        y
      });
    };
    
    const handleMouseLeave = () => {
      setTooltipData(null);
    };
    
    return (
      <div
        key={index}
        style={{
          width: sparkSize,
          height: sparkSize,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Dataset label */}
        <div style={{
          fontSize: '10px',
          fontWeight: '600',
          color: currentTheme.textColor,
          marginBottom: '-8px',
          textAlign: 'center',
          maxWidth: sparkSize - 8,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {dataset.label}
        </div>
        
        {/* Spark chart SVG */}
        <svg
          width={sparkSize}
          height={sparkSize}
          style={{
            display: 'block',
          }}
        >
          {/* Grid circles */}
          {gridCircles.map((circle, circleIndex) => (
            <circle
              key={`spark-grid-${index}-${circleIndex}`}
              cx={circle.cx}
              cy={circle.cy}
              r={circle.r}
              fill="none"
              stroke={currentTheme.gridColor}
              strokeWidth="1"
              opacity="0.6"
            />
          ))}

          {/* Axis lines */}
          {axisLines.map((line, lineIndex) => (
            <line
              key={`spark-axis-${index}-${lineIndex}`}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke={currentTheme.gridColor}
              strokeWidth="1"
              opacity="0.6"
            />
          ))}

          {/* Dataset polygon */}
          <path
            d={createPolygonPath(points)}
            fill={color}
            fillOpacity="0.3"
            stroke={color}
            strokeWidth="1.5"
            strokeOpacity="0.9"
          />
        </svg>
      </div>
    );
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

  // Play functionality
  const startPlaySequence = () => {
    if (isPlaying || data.length === 0) return;
    
    setIsPlaying(true);
    setCurrentStep(0);
    
    // Reset all datasets to hidden initially
    const newStates = new Map();
    data.forEach((_, index) => {
      newStates.set(index, {
        status: 'hidden' as const,
        showNumbers: false
      });
    });
    setDatasetStates(newStates);
  };

  const stopPlaySequence = () => {
    setIsPlaying(false);
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
  };

  const resetSequence = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
    
    // Reset to initial state: first dataset active, rest hidden
    const newStates = new Map();
    data.forEach((dataset, index) => {
      if (index === 0) {
        // First dataset is active with numbers
        newStates.set(index, {
          status: 'active' as const,
          showNumbers: true
        });
      } else {
        // All other datasets are hidden
        newStates.set(index, {
          status: 'hidden' as const,
          showNumbers: false
        });
      }
    });
    setDatasetStates(newStates);
  };

  const handleTimelineChange = (value: number) => {
    if (isPlaying) {
      stopPlaySequence();
    }
    
    const step = Math.floor((value / 100) * (data.length - 1));
    setCurrentStep(step);
    
    const newStates = new Map();
    data.forEach((_, index) => {
      if (index < step) {
        // Previous steps are inactive
        newStates.set(index, {
          status: 'inactive' as const,
          showNumbers: false
        });
      } else if (index === step) {
        // Current step is active with numbers
        newStates.set(index, {
          status: 'active' as const,
          showNumbers: true
        });
      } else {
        // Future steps are hidden
        newStates.set(index, {
          status: 'hidden' as const,
          showNumbers: false
        });
      }
    });
    setDatasetStates(newStates);
  };

  // Cleanup animation timeout on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  // Handle play sequence
  useEffect(() => {
    if (!isPlaying || currentStep >= data.length) {
      if (isPlaying && currentStep >= data.length) {
        setIsPlaying(false);
      }
      return;
    }

    // Update dataset states for current step
    const newStates = new Map();
    data.forEach((_, index) => {
      if (index < currentStep) {
        // Previous steps are inactive
        newStates.set(index, {
          status: 'inactive' as const,
          showNumbers: false
        });
      } else if (index === currentStep) {
        // Current step is active with numbers
        newStates.set(index, {
          status: 'active' as const,
          showNumbers: true
        });
      } else {
        // Future steps are hidden
        newStates.set(index, {
          status: 'hidden' as const,
          showNumbers: false
        });
      }
    });
    setDatasetStates(newStates);

    // Schedule next step
    animationTimeoutRef.current = setTimeout(() => {
      setCurrentStep(prev => prev + 1);
    }, playSpeed);
  }, [isPlaying, currentStep, data.length, playSpeed]);

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
        width: showSparkLayout ? sparkConfig?.actualWidth || chartConfig.actualWidth : chartConfig.actualWidth,
        height: showSparkLayout 
          ? (sparkConfig?.totalHeight || 0) + (showPlayButton || showTimeline ? 80 : 0)
          : chartConfig.totalHeight + (showPlayButton || showTimeline ? 80 : 0),
        backgroundColor: currentTheme.backgroundColor,
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: showBorder ? `1px solid ${currentTheme.gridColor}` : 'none',
        display: 'flex',
        flexDirection: 'column',
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
      {/* Custom styles for range input */}
      <style>
        {`
          .r8r-chart input[type="range"] {
            background: transparent;
          }
          .r8r-chart input[type="range"]::-webkit-slider-track {
            width: 100%;
            height: 6px;
            border-radius: 3px;
            background: #e5e7eb;
            border: none;
          }
          .r8r-chart input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #000000;
            cursor: pointer;
            border: none;
            margin-top: -2px;
          }
          .r8r-chart input[type="range"]::-moz-range-track {
            width: 100%;
            height: 6px;
            border-radius: 3px;
            background: #e5e7eb;
            border: none;
          }
          .r8r-chart input[type="range"]::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #000000;
            cursor: pointer;
            border: none;
          }
          .r8r-chart input[type="range"]::-ms-track {
            width: 100%;
            height: 6px;
            border-radius: 3px;
            background: #e5e7eb;
            border: none;
            color: transparent;
          }
          .r8r-chart input[type="range"]::-ms-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #000000;
            cursor: pointer;
            border: none;
          }
        `}
      </style>
      {/* Chart and Legend Container */}
      {showSparkLayout ? (
        // Spark Layout - Grid of mini radar charts
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          padding: `${sparkConfig?.padding}px`,
        }}>
          {/* Spark Grid */}
          <div style={{
            display: 'grid',
            padding: '10px',
            gridTemplateColumns: `repeat(${sparkConfig?.gridSize}, 1fr)`,
            gap: `${sparkConfig?.gap}px`,
            width: 'calc(100% - 20px)',
          }}>
            {data.slice(0, sparkConfig?.chartsToShow || 0).map((dataset, index) => 
              renderSparkChart(dataset, index, sparkConfig?.sparkSize || 100)
            )}
          </div>
        </div>
      ) : (
        // Regular Layout - Single chart with legend
        <div style={{
          display: 'flex',
          flexDirection: chartConfig.shouldStackLegend ? 'column' : 'row',
          flex: 1,
        }}>
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
      )}
      {(showPlayButton || showTimeline) && (
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          padding: '16px',
          borderTop: `1px solid ${currentTheme.legendBorderColor}`,
          backgroundColor: currentTheme.legendBackgroundColor,
        }}>
          {/* Play Button */}
          {showPlayButton && (
            <button
              onClick={isPlaying ? stopPlaySequence : (currentStep >= data.length ? resetSequence : startPlaySequence)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                backgroundColor: 'transparent',
                color: currentTheme.textColor,
                border: `2px solid ${currentTheme.textColor}`,
                borderRadius: '50%',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${currentTheme.textColor}20`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {isPlaying ? (
                <svg width={24} height={24} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" />
                </svg>
              ) : currentStep >= data.length ? (
                <svg width={24} height={24} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg width={24} height={24} style={{ transform: 'translateX(2px)' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          )}

          {/* Timeline Slider */}
          {showTimeline && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
              maxWidth: '300px',
              position: 'relative',
            }}>
              <div style={{
                position: 'relative',
                width: '100%',
              }}>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={data.length > 1 ? Math.round((currentStep / (data.length - 1)) * 100) : 0}
                  onChange={(e) => handleTimelineChange(parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: '3px',
                    background: `linear-gradient(to right, #000000 0%, #000000 ${Math.round((currentStep / (data.length - 1)) * 100)}%, #e5e7eb ${Math.round((currentStep / (data.length - 1)) * 100)}%, #e5e7eb 100%)`,
                    outline: 'none',
                    cursor: 'pointer',
                    WebkitAppearance: 'none',
                    appearance: 'none',
                  }}
                />
                {/* Tooltip */}
                <div style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: `${Math.max(2, Math.min(98, data.length > 1 ? Math.round((currentStep / (data.length - 1)) * 100) : 0))}%`,
                  transform: 'translateX(-50%)',
                  backgroundColor: currentTheme.textColor,
                  color: currentTheme.backgroundColor,
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  opacity: data.length > 0 ? 1 : 0,
                }}>
                  {data.length > 0 && currentStep < data.length ? data[currentStep].label : (data.length > 0 ? data[data.length - 1].label : 'No data')}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Custom Tooltip */}
      {tooltipData && (
        <div
          style={{
            position: 'fixed',
            left: tooltipData.x,
            top: tooltipData.y,
            transform: 'translateX(-50%)',
            backgroundColor: currentTheme.textColor,
            color: currentTheme.backgroundColor,
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: '500',
            whiteSpace: 'pre-line',
            pointerEvents: 'none',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            maxWidth: '200px',
            wordWrap: 'break-word',
          }}
        >
          {tooltipData.content.split('\n').map((line, index) => {
            const parts = line.split('**: ');
            if (parts.length === 2) {
              const label = parts[0].replace('**', '');
              const value = parts[1];
              return (
                <div key={index} style={{ marginBottom: index < tooltipData.content.split('\n').length - 1 ? '4px' : '0' }}>
                  <span style={{ fontWeight: '700' }}>{label}</span>
                  <span style={{ fontWeight: '400' }}>: {value}</span>
                </div>
              );
            }
            return <div key={index}>{line}</div>;
          })}
          {/* Tooltip arrow */}
          <div
            style={{
              position: 'absolute',
              top: '-6px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderBottom: `6px solid ${currentTheme.textColor}`,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default R8R; 