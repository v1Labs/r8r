import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';

export interface DataPoint {
  label: string;
  value: number;
  maxValue?: number;
  highlighted?: boolean;
}

export interface Dataset {
  label: string;
  values: Record<string, number>;
  color?: string;
  status?: 'hidden' | 'inactive' | 'active' | 'highlighted';
}

export type DatasetState = 'hidden' | 'inactive' | 'active' | 'highlighted';

export interface Footnote {
  label: string;
  note: string;
  highlight: string[];
}

export interface Gradient {
  type: 'gradient';
  from: string;
  to: string;
  angle?: number; // Defaults to 0 (horizontal)
}

export type ColorOrGradient = string | Gradient;

export interface R8RProps {
  /** Array of datasets to display */
  data: Dataset[];
  /** Chart structure defining the axes */
  chart: DataPoint[];
  /** Width of the chart in pixels */
  width?: number;
  /** Theme preset ('light' | 'dark' | 'unicorn' | 'retro') */
  theme?: 'light' | 'dark' | 'unicorn' | 'retro';
  /** Background of the chart (supports any valid CSS background value) */
  backgroundColor?: string;
  /** Grid line color */
  gridColor?: string;
  /** Text color for labels and legend */
  textColor?: string;
  /** Legend background (supports any valid CSS background value) */
  legendBackgroundColor?: string;
  /** Legend text color (falls back to textColor if not provided) */
  legendTextColor?: string;
  /** Legend border color */
  legendBorderColor?: string;
  /** Array of colors for datasets (will be used if dataset doesn't specify a color) */
  colors?: (string | Gradient)[];
  /** Whether to show grid lines */
  showGrid?: boolean;
  /** Whether to show axis labels */
  showLabels?: boolean;

  /** Whether to show legend */
  showLegend?: boolean;
  /** Title for the legend (empty string hides the title) */
  legendTitle?: string;
  /** Whether to show border around the chart */
  showBorder?: boolean;
  /** Animation duration in milliseconds */
  animationDuration?: number;
  /** Border radius for dataset polygons (in pixels) */
  dataBorderRadius?: number;

  /** Custom CSS class name */
  className?: string;
  /** Custom CSS styles */
  style?: React.CSSProperties;
  /** Callback when chart configuration changes (e.g., axis highlighting) */
  onChartChange?: (updatedChart: DataPoint[]) => void;
  /** Array of footnotes to display below the chart */
  footnotes?: Footnote[];
  /** Placeholder text shown when no footnote is selected */
  placeholder?: string;
  /** Index of initially active footnote (0-based) */
  activeFootnote?: number;

}

// Predefined themes
const themes: Record<string, {
  backgroundColor: string;
  gridColor: string;
  textColor: string;
  legendBackgroundColor: string;
  legendTextColor?: string;
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
  unicorn: {
    backgroundColor: 'linear-gradient(142deg, rgba(255, 240, 217, 1) 0%, rgba(255, 196, 233, 1) 100%)',
    gridColor: '#F598D3',
    textColor: '#581c87',
    legendBackgroundColor: 'linear-gradient(142deg, rgba(50, 16, 64, 1) 0%, rgba(84, 14, 135, 1) 100%)',
    legendBorderColor: '#F598D3',
    legendTextColor: '#ffffffdd',
  },
  retro: {
    backgroundColor: '#f5f1e8',
    gridColor: '#8b7355',
    textColor: '#4a3c2a',
    legendBackgroundColor: '#5d4e37',
    legendBorderColor: '#8b7355',
    legendTextColor: '#f5f1e8',
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

// Unicorn theme colors
const unicornColors = [
  '#8531EB',
  '#EC4899',
  '#f59e0b', // amber
  '#10b981', // emerald
  '#3b82f6', // blue
  '#f97316', // orange
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#ef4444', // red
  '#8b5cf6', // violet
];

// Retro theme colors (70s Colorado inspired - vibrant)
const retroColors = [
  '#ff6b35', // vibrant orange
  '#f7931e', // bright amber
  '#e6b800', // darker golden yellow
  '#d62828', // bright red
  '#f77f00', // deep orange
  '#d4a017', // darker warm yellow
  '#e76f51', // coral red
  '#2a9d8f', // teal green
  '#264653', // deep blue-green
  '#b8860b', // darker warm gold
];

// Helper function to process colors and gradients
const processColorOrGradient = (colorOrGradient: ColorOrGradient | undefined, fallback: string, chartCenter?: { x: number; y: number }, polygonBounds?: { minX: number; minY: number; maxX: number; maxY: number }): { 
  fill: string; 
  gradientId?: string; 
  gradientDef?: React.ReactElement;
} => {
  if (!colorOrGradient) {
    return { fill: fallback };
  }
  
  if (typeof colorOrGradient === 'string') {
    return { fill: colorOrGradient };
  }
  
  if (colorOrGradient.type === 'gradient') {
    const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;
    
    let gradientDef;
    if (chartCenter && polygonBounds) {
      // Calculate relative position of chart center within polygon bounds
      const polygonWidth = polygonBounds.maxX - polygonBounds.minX;
      const polygonHeight = polygonBounds.maxY - polygonBounds.minY;
      const relativeX = ((chartCenter.x - polygonBounds.minX) / polygonWidth) * 100;
      const relativeY = ((chartCenter.y - polygonBounds.minY) / polygonHeight) * 100;
      
      // Calculate gradient direction from chart center to polygon center
      const polygonCenterX = (polygonBounds.minX + polygonBounds.maxX) / 2;
      const polygonCenterY = (polygonBounds.minY + polygonBounds.maxY) / 2;
      const angle = Math.atan2(polygonCenterY - chartCenter.y, polygonCenterX - chartCenter.x) * 180 / Math.PI;
      
      // Convert angle to SVG gradient coordinates
      const userAngle = colorOrGradient.angle || 0;
      const totalAngle = angle + userAngle;
      const radians = (totalAngle * Math.PI) / 180;
      const x1 = 0.5 - Math.cos(radians) * 0.5;
      const y1 = 0.5 - Math.sin(radians) * 0.5;
      const x2 = 0.5 + Math.cos(radians) * 0.5;
      const y2 = 0.5 + Math.sin(radians) * 0.5;
      
      gradientDef = (
        <defs>
          <linearGradient id={gradientId} x1={x1} y1={y1} x2={x2} y2={y2}>
            <stop offset="0%" stopColor={colorOrGradient.from} />
            <stop offset="100%" stopColor={colorOrGradient.to} />
          </linearGradient>
        </defs>
      );
    } else {
      // Fallback to center of polygon with default angle
      const angle = colorOrGradient.angle || 0;
      const radians = (angle * Math.PI) / 180;
      const x1 = 0.5 - Math.cos(radians) * 0.5;
      const y1 = 0.5 - Math.sin(radians) * 0.5;
      const x2 = 0.5 + Math.cos(radians) * 0.5;
      const y2 = 0.5 + Math.sin(radians) * 0.5;
      
      gradientDef = (
        <defs>
          <linearGradient id={gradientId} x1={x1} y1={y1} x2={x2} y2={y2}>
            <stop offset="0%" stopColor={colorOrGradient.from} />
            <stop offset="100%" stopColor={colorOrGradient.to} />
          </linearGradient>
        </defs>
      );
    }
    
    return { fill: `url(#${gradientId})`, gradientId, gradientDef };
  }
  
  return { fill: fallback };
};

const R8R: React.FC<R8RProps> = ({
  data,
  chart,
  width = 400,
  theme = 'light',
  backgroundColor,
  gridColor,
  textColor,
  legendBackgroundColor,
  legendTextColor,
  legendBorderColor,
  colors = theme === 'unicorn' ? unicornColors : theme === 'retro' ? retroColors : defaultColors,
  showGrid = true,
  showLabels = true,
  showLegend = true,
  legendTitle = '',
  showBorder = true,
  animationDuration = 200,
  dataBorderRadius = 0,
  footnotes = [],
  placeholder = 'Footnotes: Click to explore',
  activeFootnote: initialActiveFootnote,

  className = '',
  style = {},
  onChartChange,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [datasetStates, setDatasetStates] = useState<Map<number, { status: DatasetState }>>(() => {
    // Initialize dataset states based on data
    const states = new Map();
    data.forEach((dataset, index) => {
      states.set(index, {
        status: dataset.status || 'active'
      });
    });
    return states;
  });
  const [hoveredDataset, setHoveredDataset] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [localData, setLocalData] = useState<Dataset[]>(data);
  const [localColors, setLocalColors] = useState<(string | Gradient)[]>(colors);

  const [highlightedAxis, setHighlightedAxis] = useState<number | null>(null);
  const [axisLongPressTimer, setAxisLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [isAxisAnimating, setIsAxisAnimating] = useState(false);
  const [internalChartState, setInternalChartState] = useState<DataPoint[]>(chart);
  const [activeFootnote, setActiveFootnote] = useState<number | null>(initialActiveFootnote ?? null);
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
      legendTextColor: legendTextColor || baseTheme.legendTextColor || baseTheme.textColor,
      legendBorderColor: legendBorderColor || baseTheme.legendBorderColor,
    };
  }, [theme, backgroundColor, gridColor, textColor, legendBackgroundColor, legendTextColor, legendBorderColor]);



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
      const currentData = localData;
      currentData.forEach((dataset, index) => {
        const existingState = datasetStates.get(index);
        newStates.set(index, {
          status: dataset.status || existingState?.status || 'active'
        });
      });
      setDatasetStates(newStates);
    }, [data, localData]);

  // Sync localData with data prop when it changes
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  // Sync localColors with colors prop when it changes
  useEffect(() => {
    setLocalColors(colors);
  }, [colors]);

  // Sync internal chart state with chart prop when it changes
  useEffect(() => {
    setInternalChartState(chart);
  }, [chart]);

  // Calculate chart dimensions and positioning
  const chartConfig = useMemo(() => {
    // Use the observed container width directly
    const availableWidth = containerWidth || window.innerWidth;
    
    // Determine actual width: use width prop if container is larger, otherwise use container width
    const actualWidth = availableWidth >= width ? width : availableWidth;
    
    // Determine if we should stack legend above chart (when component is narrow)
    const shouldStackLegend = actualWidth < 450;
    
    // Calculate legend dimensions
    const legendWidth = showLegend && !shouldStackLegend ? 160 : 0;
    const legendHeight = showLegend && shouldStackLegend ? 80 : 0;
    
    // Chart dimensions - subtract 40px for legend padding when legend is to the left
    const chartWidth = actualWidth - legendWidth - (showLegend && !shouldStackLegend ? 40 : 0);
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



      // Process dataset colors and gradients
    const processedDatasetColors = useMemo(() => {
      const { centerX, centerY } = chartConfig;
      const chartCenter = { x: centerX, y: centerY };
      const currentData = localData;
      const currentColors = localColors;

      return currentData.map((dataset, index) => {
        const colorOrGradient = dataset.color || currentColors[index % currentColors.length];
        return processColorOrGradient(colorOrGradient, '#3b82f6', chartCenter);
      });
    }, [localData, localColors, chartConfig]);

      // Generate all dataset points
    const allDatasetPoints = useMemo(() => {
      const currentData = localData;
      return currentData.map((dataset, index) => ({
        dataset,
        points: calculatePoints(dataset, processedDatasetColors[index].fill),
        color: processedDatasetColors[index],
        index,
      }));
    }, [localData, chart, processedDatasetColors, chartConfig]);



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
        index: i,
      });
    }
    
    return lines;
  }, [chart, chartConfig]);

  // Generate intersection lines and labels for highlighted axes
  const intersectionElements = useMemo(() => {
    // Show intersection elements when hovering OR when any chart element is highlighted
    const shouldShowElements = highlightedAxis !== null || 
      internalChartState.some(dataPoint => dataPoint.highlighted ?? false);
    
    if (!shouldShowElements) return { lines: [], labels: [], axisOverlays: [] };
    
    const { centerX, centerY, radius } = chartConfig;
    const allLines: Array<{x1: number; y1: number; x2: number; y2: number}> = [];
    const allLabels: Array<{
      isBelowCenter: any;x: number; y: number; text: string; angle: number
}> = [];
    const allAxisOverlays: Array<{x1: number; y1: number; x2: number; y2: number}> = [];
    
    // Get all axes that should show elements (hovered, highlighted, or footnote-highlighted)
    const axesToShow = new Set<number>();
    
    // Add hovered axis if any (but only if it's not already highlighted)
    if (highlightedAxis !== null && !(internalChartState[highlightedAxis]?.highlighted ?? false)) {
      axesToShow.add(highlightedAxis);
    }
    
    // Add all highlighted axes from chart configuration
    internalChartState.forEach((dataPoint, index) => {
      if (dataPoint.highlighted ?? false) {
        axesToShow.add(index);
      }
    });
    

    
    // Generate elements for each axis
    axesToShow.forEach(axisIndex => {
      const highlightedLine = axisLines[axisIndex];
      if (!highlightedLine) return;
      
      const lines = [];
      const labels = [];
      const levels = 6; // 0%, 20%, 40%, 60%, 80%, 100%
      
      for (let i = 0; i < levels; i++) {
        const percentage = i / (levels - 1); // 0, 0.2, 0.4, 0.6, 0.8, 1
        const pointRadius = radius * percentage;
        
        // Calculate intersection point on the highlighted axis
        const intersectionX = centerX + pointRadius * Math.cos(highlightedLine.angle);
        const intersectionY = centerY + pointRadius * Math.sin(highlightedLine.angle);
        
        // Calculate perpendicular line (intersecting line) - only to the right side
        const perpAngle = highlightedLine.angle + Math.PI / 2;
        const lineLength = 10; // Half the original length
        
        // Only draw line to the right side of the axis
        const lineStartX = intersectionX;
        const lineStartY = intersectionY;
        const lineEndX = intersectionX + lineLength * Math.cos(perpAngle);
        const lineEndY = intersectionY + lineLength * Math.sin(perpAngle);
        
        lines.push({
          x1: lineStartX,
          y1: lineStartY,
          x2: lineEndX,
          y2: lineEndY,
        });
        
        // Calculate label position (aligned with the dash, away from center)
        const labelDistance = 15; // More space between dash and label
        const labelAngle = perpAngle; // Same angle as the dash
        const labelX = intersectionX + labelDistance * Math.cos(labelAngle);
        const labelY = intersectionY + labelDistance * Math.sin(labelAngle);
        
        // Calculate the actual value based on the chart's maxValue
        const maxValue = internalChartState[axisIndex]?.maxValue || chartConfig.maxValue;
        const actualValue = Math.round(percentage * maxValue);
        
        // Determine if label is below center and needs 180-degree rotation
        const isBelowCenter = highlightedLine.y2 > chartConfig.centerY;
        const finalAngle = isBelowCenter ? labelAngle + Math.PI : labelAngle;
        
        labels.push({
          x: labelX,
          y: labelY,
          text: actualValue.toString(),
          angle: finalAngle,
          isBelowCenter,
        });
      }
      
      // Create axis overlay line
      const axisOverlay = {
        x1: highlightedLine.x1,
        y1: highlightedLine.y1,
        x2: highlightedLine.x2,
        y2: highlightedLine.y2,
      };
      
      allLines.push(...lines);
      allLabels.push(...labels);
      allAxisOverlays.push(axisOverlay);
    });
    
    return { lines: allLines, labels: allLabels, axisOverlays: allAxisOverlays };
  }, [highlightedAxis, axisLines, chartConfig, internalChartState]);



  // Create polygon path with optional border radius
  const createPolygonPath = (points: Array<{ x: number; y: number }>, radius: number = 0) => {
    if (points.length === 0) return '';
    
    if (radius === 0) {
      // No border radius - return simple polygon
      return `M ${points.map(p => `${p.x} ${p.y}`).join(' L ')} Z`;
    }
    
    // Only apply complex logic for 4+ points and positive radius
    const shouldUseComplexLogic = points.length >= 4 && radius > 0;
    
    // Create rounded polygon path using quadratic Bézier curves
    const path = [];
    const numPoints = points.length;
    
    for (let i = 0; i < numPoints; i++) {
      const current = points[i];
      const next = points[(i + 1) % numPoints];
      
      // Calculate midpoint of the current line segment
      const midX = (current.x + next.x) / 2;
      const midY = (current.y + next.y) / 2;
      
      // Calculate vector from current to next point
      const vx = next.x - current.x;
      const vy = next.y - current.y;
      const len = Math.sqrt(vx * vx + vy * vy);
      
      if (len === 0) {
        // Degenerate case - just move to point
        if (i === 0) {
          path.push(`M ${current.x} ${current.y}`);
        } else {
          path.push(`L ${current.x} ${current.y}`);
        }
        continue;
      }
      
      // Normalize vector
      const nx = vx / len;
      const ny = vy / len;
      
      // Calculate perpendicular vector (outward from polygon center)
      const perpX = -ny;
      const perpY = nx;
      
      let pushDistance = Math.min(Math.abs(radius), len * 0.3) * -Math.sign(radius);
      
      if (shouldUseComplexLogic) {
        // Get adjacent points A and D
        const prev = points[(i - 1 + numPoints) % numPoints];
        const nextNext = points[(i + 2) % numPoints];
        
        // Calculate center line of AC (prev to next)
        const acMidX = (prev.x + next.x) / 2;
        const acMidY = (prev.y + next.y) / 2;
        const acDirX = next.x - prev.x;
        const acDirY = next.y - prev.y;
        const acLength = Math.sqrt(acDirX ** 2 + acDirY ** 2);
        
        // Calculate center line of BD (current to nextNext)
        const bdMidX = (current.x + nextNext.x) / 2;
        const bdMidY = (current.y + nextNext.y) / 2;
        const bdDirX = nextNext.x - current.x;
        const bdDirY = nextNext.y - current.y;
        const bdLength = Math.sqrt(bdDirX ** 2 + bdDirY ** 2);
        
        if (acLength > 0 && bdLength > 0) {
          const acNormalizedDirX = acDirX / acLength;
          const acNormalizedDirY = acDirY / acLength;
          const bdNormalizedDirX = bdDirX / bdLength;
          const bdNormalizedDirY = bdDirY / bdLength;
          
          // Calculate distance from B to center line of AC
          const bToAC = Math.abs(
            (current.x - acMidX) * acNormalizedDirY - 
            (current.y - acMidY) * acNormalizedDirX
          );
          
          // Calculate distance from C to center line of BD
          const cToBD = Math.abs(
            (next.x - bdMidX) * bdNormalizedDirY - 
            (next.y - bdMidY) * bdNormalizedDirX
          );
          
          // Set max bulge to half of the smallest distance
          const maxBulge = Math.min(bToAC, cToBD) / 2;
          pushDistance = Math.min(Math.abs(pushDistance), maxBulge) * Math.sign(pushDistance);
        }
      } else {
        // Use the previous adaptive scaling logic for negative radius or < 4 points
        const { centerX, centerY } = chartConfig;
        const currentDistance = Math.sqrt((current.x - centerX) ** 2 + (current.y - centerY) ** 2);
        const nextDistance = Math.sqrt((next.x - centerX) ** 2 + (next.y - centerY) ** 2);
        const maxDistanceFromCenter = Math.max(currentDistance, nextDistance);
        const maxRadius = chartConfig.radius;
        
        const centerProximity = 1 - (maxDistanceFromCenter / maxRadius);
        const adaptiveScale = Math.max(0.3, 0.3 + centerProximity * 0.7);
        pushDistance *= adaptiveScale;
      }
      
      const controlX = midX + perpX * pushDistance;
      const controlY = midY + perpY * pushDistance;
      
      if (i === 0) {
        path.push(`M ${current.x} ${current.y}`);
      }
      
      // Use quadratic Bézier curve to the next point
      path.push(`Q ${controlX} ${controlY} ${next.x} ${next.y}`);
    }
    
    path.push('Z');
    return path.join(' ');
  };





  // Toggle dataset status through 3-way cycle: inactive -> active -> highlighted
  const toggleDataset = (index: number) => {
    // Handle legend click when footnote is active
    if (activeFootnote !== null) {
      // Clear the active footnote but preserve current state
      setActiveFootnote(null);
      // Keep current chart state (don't reset it)
      
      // Keep current dataset states, just toggle the clicked dataset
      const newStates = new Map(datasetStates);
      const currentState = newStates.get(index);
      
      if (currentState) {
        // Toggle the clicked dataset: inactive -> active -> highlighted -> inactive
        let newStatus: 'inactive' | 'active' | 'highlighted';
        switch (currentState.status) {
          case 'inactive':
            newStatus = 'active';
            break;
          case 'active':
            newStatus = 'highlighted';
            break;
          case 'highlighted':
            newStatus = 'inactive';
            break;
          default:
            newStatus = 'active';
        }
        
        newStates.set(index, { status: newStatus });
        setDatasetStates(newStates);
      }
      return;
    }

    const newStates = new Map(datasetStates);
    const currentState = newStates.get(index);
    if (!currentState) return;
    
    // Cycle through: inactive -> active -> highlighted -> inactive
    let newStatus: 'inactive' | 'active' | 'highlighted';
    switch (currentState.status) {
      case 'inactive':
        newStatus = 'active';
        break;
      case 'active':
        newStatus = 'highlighted';
        break;
      case 'highlighted':
        newStatus = 'inactive';
        break;
      default:
        newStatus = 'active';
    }
    
    newStates.set(index, {
      status: newStatus
    });
    setDatasetStates(newStates);
  };

  // Long press state management
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [longPressedDataset, setLongPressedDataset] = useState<number | null>(null);

  // Polygon stacking order management
  const [polygonOrder, setPolygonOrder] = useState<number[]>([]);

  const handleMouseDown = (index: number) => {
    // Start long press timer for potential future features
    const timer = setTimeout(() => {
      setLongPressedDataset(index);
    }, 500); // 500ms long press delay

    setLongPressTimer(timer);
  };

  const handleMouseUp = (index: number) => {
    // Clear long press timer
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    
    // If this was a long press, don't remove highlight immediately
    if (longPressedDataset === index) {
      return;
    }
  };

  const handleMouseEnter = (index: number) => {
    setHoveredDataset(index);
  };

  const handleMouseLeave = (index: number) => {
    // Clear long press timer
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    
    setHoveredDataset(null);
  };

  const handleClick = (index: number) => {
    // Clear long press state if it was set
    if (longPressedDataset === index) {
      setLongPressedDataset(null);
    }
    
    // Toggle dataset through 3-way cycle
    toggleDataset(index);
    handleMoveToTop(index);
  };

  // Move to top handlers
  const handleMoveToTop = (index: number) => {
    // Use local data for polygon ordering
    const currentData = localData;
    
    // Bring polygon to front (labels stay in place)
    const currentOrder = polygonOrder.length > 0 ? polygonOrder : Array.from({ length: currentData.length }, (_, i) => i);
    const newOrder = [...currentOrder];
    
    // Remove the clicked index from its current position
    const currentIndex = newOrder.indexOf(index);
    if (currentIndex > -1) {
      newOrder.splice(currentIndex, 1);
    }
    
    // Add it to the front (top of stack)
    newOrder.unshift(index);
    
    setPolygonOrder(newOrder);
  };

  // Axis interaction handlers
  const handleAxisMouseDown = (axisIndex: number) => {
    // Start long press timer for axis
    const timer = setTimeout(() => {
      setIsAxisAnimating(true);
      setHighlightedAxis(axisIndex);
      setTimeout(() => setIsAxisAnimating(false), 200);
    }, 500); // 500ms long press delay

    setAxisLongPressTimer(timer);
  };

  const handleAxisMouseUp = (axisIndex: number) => {
    // Clear long press timer
    if (axisLongPressTimer) {
      clearTimeout(axisLongPressTimer);
      setAxisLongPressTimer(null);
    }
  };

  const handleAxisMouseEnter = (axisIndex: number) => {
    // Don't highlight if this axis is already highlighted (prevents flickering)
    if (internalChartState[axisIndex]?.highlighted) {
      return;
    }
    
    // Highlight axis on hover (desktop)
    setIsAxisAnimating(true);
    setHighlightedAxis(axisIndex);
    setTimeout(() => setIsAxisAnimating(false), 200);
  };

  const handleAxisMouseLeave = (axisIndex: number) => {
    // Clear long press timer
    if (axisLongPressTimer) {
      clearTimeout(axisLongPressTimer);
      setAxisLongPressTimer(null);
    }
    
    // Don't remove highlight if this axis is highlighted (prevents flickering)
    if (internalChartState[axisIndex]?.highlighted) {
      return;
    }
    
    // Remove highlight on mouse leave
    setIsAxisAnimating(true);
    setHighlightedAxis(null);
    setTimeout(() => setIsAxisAnimating(false), 200);
  };

  const handleAxisTouchStart = (axisIndex: number) => {
    handleAxisMouseDown(axisIndex);
  };

  const handleAxisTouchEnd = (axisIndex: number) => {
    handleAxisMouseUp(axisIndex);
  };

  const handleAxisTouchCancel = (axisIndex: number) => {
    // Clear long press timer
    if (axisLongPressTimer) {
      clearTimeout(axisLongPressTimer);
      setAxisLongPressTimer(null);
    }
    
    // Remove highlight
    setHighlightedAxis(null);
  };

  const handleAxisClick = (axisIndex: number) => {
    console.log('Axis clicked:', axisIndex, 'Current internal chart state:', internalChartState);
    
    // Clear active footnote when axis is clicked
    if (activeFootnote !== null) {
      setActiveFootnote(null);
    }
    
    // Toggle the highlighted state of the chart element
    const updatedChart = internalChartState.map((dataPoint, index) => 
      index === axisIndex 
        ? { ...dataPoint, highlighted: !(dataPoint.highlighted ?? false) }
        : dataPoint
    );
    
    console.log('Updated chart:', updatedChart, 'onChartChange provided:', !!onChartChange);
    
    // Update internal state
    setInternalChartState(updatedChart);
    
    // Call the callback to update the chart in the parent component
    if (onChartChange) {
      onChartChange(updatedChart);
    } else {
      console.log('onChartChange callback not provided - using internal state management');
    }
  };

  // Touch event handlers for mobile
  const handleTouchStart = (index: number) => {
    handleMouseDown(index);
  };

  const handleTouchEnd = (index: number) => {
    handleMouseUp(index);
  };

  const handleTouchCancel = (index: number) => {
    // Clear long press timer
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    
    setHoveredDataset(null);
    
    // Remove highlight if it wasn't a long press
    if (longPressedDataset !== index) {
      const currentState = datasetStates.get(index);
      if (currentState && currentState.status === 'highlighted') {
        const newStates = new Map(datasetStates);
        newStates.set(index, { status: 'active' });
        setDatasetStates(newStates);
      }
    }
  };

  // Handle footnote click
  const handleFootnoteClick = (footnoteIndex: number) => {
    const footnote = footnotes[footnoteIndex];
    if (!footnote) return;

    // Toggle footnote activation
    if (activeFootnote === footnoteIndex) {
      setActiveFootnote(null);
      // Don't change any dataset or chart state - just deactivate the footnote
    } else {
      setActiveFootnote(footnoteIndex);
      
      // Separate dataset labels from data point labels
      const datasetLabels = new Set<string>();
      const dataPointLabels = new Set<string>();
      
      footnote.highlight.forEach(label => {
        // Check if this label is a dataset label
        const isDatasetLabel = data.some(dataset => dataset.label === label);
        if (isDatasetLabel) {
          datasetLabels.add(label);
        } else {
          // Check if this label is a data point label (axis label)
          const isDataPointLabel = chart.some(dataPoint => dataPoint.label === label);
          if (isDataPointLabel) {
            dataPointLabels.add(label);
          }
        }
      });
      
      // Apply dataset highlighting
      const newStates = new Map();
      data.forEach((dataset, index) => {
        const isDatasetHighlighted = datasetLabels.has(dataset.label);
        
        if (isDatasetHighlighted) {
          newStates.set(index, { status: 'highlighted' });
        } else if (dataset.status === 'hidden') {
          newStates.set(index, { status: 'hidden' });
        } else {
          newStates.set(index, { status: 'inactive' });
        }
      });
      setDatasetStates(newStates);
      
      // Clear any hovered axis state
      setHighlightedAxis(null);
      
      // Set highlighted data points in chart state
      const updatedChartState = chart.map((dataPoint, index) => {
        if (dataPointLabels.has(dataPoint.label)) {
          return { ...dataPoint, highlighted: true };
        } else {
          // Clear any existing highlighting from footnotes
          return { ...dataPoint, highlighted: false };
        }
      });
      setInternalChartState(updatedChartState);
      
      // Reorder datasets to bring highlighted ones to the top
      const highlightedIndices = Array.from(newStates.entries())
        .filter(([_, state]) => state.status === 'highlighted')
        .map(([index, _]) => index);
      
      if (highlightedIndices.length > 0) {
        const currentOrder = polygonOrder.length > 0 ? polygonOrder : Array.from({ length: data.length }, (_, i) => i);
        const newOrder = [...currentOrder];
        
        // Remove highlighted indices from their current positions
        highlightedIndices.forEach(index => {
          const currentIndex = newOrder.indexOf(index);
          if (currentIndex > -1) {
            newOrder.splice(currentIndex, 1);
          }
        });
        
        // Add highlighted indices to the front (top of stack)
        highlightedIndices.forEach(index => {
          newOrder.unshift(index);
        });
        
        setPolygonOrder(newOrder);
      }
    }
  };

  // Check if any dataset is currently highlighted
  const hasHighlightedDataset = () => {
    return Array.from(datasetStates.values()).some(state => state.status === 'highlighted');
  };

  // Calculate opacity based on dataset position in order
  const getDatasetOpacity = (index: number) => {
    const currentOrder = polygonOrder.length > 0 ? polygonOrder : Array.from({ length: allDatasetPoints.length }, (_, i) => i);
    const position = currentOrder.indexOf(index);
    
    // Top dataset (position 0) gets highest opacity, all others get medium opacity
    const strokeOpacity = position === 0 ? 0.85 : 0.45;
    const fillOpacity = position === 0 ? 0.75 : 0.35;
    
    return { strokeOpacity, fillOpacity };
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
    
    // For active and highlighted datasets, return the original color
    return baseColor;
  };

  // Animation effect
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), animationDuration);
    return () => clearTimeout(timer);
  }, [data, chart, animationDuration]);

  // Apply initial active footnote if provided
  useEffect(() => {
    if (initialActiveFootnote !== null && initialActiveFootnote !== undefined && footnotes.length > 0) {
      const footnote = footnotes[initialActiveFootnote];
      if (footnote) {
        // Apply the footnote highlighting logic
        const datasetLabels = new Set<string>();
        const dataPointLabels = new Set<string>();
        
        footnote.highlight.forEach(label => {
          // Check if this label is a dataset label
          const isDatasetLabel = data.some(dataset => dataset.label === label);
          if (isDatasetLabel) {
            datasetLabels.add(label);
          } else {
            // Check if this label is a data point label (axis label)
            const isDataPointLabel = chart.some(dataPoint => dataPoint.label === label);
            if (isDataPointLabel) {
              dataPointLabels.add(label);
            }
          }
        });
        
        // Apply dataset highlighting
        const newStates = new Map();
        data.forEach((dataset, index) => {
          const isDatasetHighlighted = datasetLabels.has(dataset.label);
          
          if (isDatasetHighlighted) {
            newStates.set(index, { status: 'highlighted' });
          } else if (dataset.status === 'hidden') {
            newStates.set(index, { status: 'hidden' });
          } else {
            newStates.set(index, { status: 'inactive' });
          }
        });
        setDatasetStates(newStates);
        
        // Clear any hovered axis state
        setHighlightedAxis(null);
        
        // Set highlighted data points in chart state
        const updatedChartState = chart.map((dataPoint, index) => {
          if (dataPointLabels.has(dataPoint.label)) {
            return { ...dataPoint, highlighted: true };
          } else {
            // Clear any existing highlighting from footnotes
            return { ...dataPoint, highlighted: false };
          }
        });
        setInternalChartState(updatedChartState);
        
        // Reorder datasets to bring highlighted ones to the top
        const highlightedIndices = Array.from(newStates.entries())
          .filter(([_, state]) => state.status === 'highlighted')
          .map(([index, _]) => index);
        
        if (highlightedIndices.length > 0) {
          const currentOrder = polygonOrder.length > 0 ? polygonOrder : Array.from({ length: data.length }, (_, i) => i);
          const newOrder = [...currentOrder];
          
          // Remove highlighted indices from their current positions
          highlightedIndices.forEach(index => {
            const currentIndex = newOrder.indexOf(index);
            if (currentIndex > -1) {
              newOrder.splice(currentIndex, 1);
            }
          });
          
          // Add highlighted indices to the front (top of stack)
          highlightedIndices.forEach(index => {
            newOrder.unshift(index);
          });
          
          setPolygonOrder(newOrder);
        }
      }
    }
  }, [initialActiveFootnote, footnotes, data, chart]);

  return (
    <div
      className={`r8r-chart ${className}`}
      style={{
        width: chartConfig.actualWidth,
        background: currentTheme.backgroundColor,
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
      {/* Chart and Legend Container */}
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
                background: currentTheme.legendBackgroundColor,
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
                  margin: 0, 
                  fontSize: chartConfig.shouldStackLegend ? '14px' : '14px', 
                  fontWeight: '600',
                  color: currentTheme.legendTextColor,
                  flexShrink: 0,
                  textAlign: chartConfig.shouldStackLegend ? 'center' : 'left',
                }}>
                  {legendTitle}
                </h3>
              )}
              <div 
                data-legend-container
                style={{
                  display: 'flex',
                  flexDirection: chartConfig.shouldStackLegend ? 'row' : 'column',
                  flexWrap: chartConfig.shouldStackLegend ? 'wrap' : 'nowrap',
                  justifyContent: chartConfig.shouldStackLegend ? 'center' : 'flex-start',
                  alignItems: chartConfig.shouldStackLegend ? 'center' : 'stretch',
                  gap: chartConfig.shouldStackLegend ? '6px' : '8px',
                  position: 'relative',
                }}
              >

                {allDatasetPoints.map(({ dataset, color, index }) => {
                  const datasetState = datasetStates.get(index);
                  if (!datasetState || datasetState.status === 'hidden') return null;
                  
                  const isActive = datasetState.status === 'active' || datasetState.status === 'highlighted';
                  const isHighlighted = datasetState.status === 'highlighted';
                  const isInactive = datasetState.status === 'inactive';
                  const isHovered = hoveredDataset === index;
                  
                  // Determine if this dataset is the top one
                  const currentOrder = polygonOrder.length > 0 ? polygonOrder : Array.from({ length: allDatasetPoints.length }, (_, i) => i);
                  const isTopDataset = currentOrder[0] === index;
                  
                  // For legend indicators, use the 'from' color if it's a gradient, otherwise use the fill
                  const currentColors = localColors;
                  const originalColor = dataset.color || currentColors[index % currentColors.length];
                  const legendColor = typeof originalColor === 'object' && originalColor.type === 'gradient' ? originalColor.from : color.fill;
                  const displayColor = getDatasetColor(index, legendColor);
                  const isVerySmallScreen = chartConfig.actualWidth <= 480;
                  
                  return (
                    <div
                      key={index}
                      data-legend-item
                      data-index={index}
                      onClick={() => handleClick(index)}
                      onMouseDown={(e) => {
                        handleMouseDown(index);
                      }}
                      onMouseUp={() => handleMouseUp(index)}
                      onMouseEnter={() => handleMouseEnter(index)}
                      onMouseLeave={() => handleMouseLeave(index)}
                      onTouchStart={(e) => {
                        handleTouchStart(index);
                      }}
                      onTouchEnd={() => handleTouchEnd(index)}
                      onTouchCancel={() => handleTouchCancel(index)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: isVerySmallScreen ? '4px' : '6px',
                        cursor: 'pointer',
                        fontSize: chartConfig.shouldStackLegend ? (isVerySmallScreen ? '12px' : '13px') : '12px',
                        color: currentTheme.legendTextColor,
                        opacity: isActive ? 1 : 0.4,
                        padding: chartConfig.shouldStackLegend ? (isVerySmallScreen ? '3px 6px' : '4px 8px') : '4px 0px 4px 8px',
                        borderRadius: '4px',
                        backgroundColor: isActive ? (isHighlighted ? `${displayColor}99` : `${displayColor}33`) : 'transparent',
                        border: `1px solid ${isActive ? displayColor : 'transparent'}`,
                        transition: 'all 0.2s ease',
                        position: 'relative',
                        flexShrink: 0,
                        whiteSpace: 'nowrap',
                        userSelect: 'none', // Prevent text selection during long press
                        WebkitUserSelect: 'none', // For Safari
                        MozUserSelect: 'none', // For Firefox
                        transform: 'none',
                        zIndex: 'auto',
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
                      <div 
                        style={{ 
                          flexShrink: 0,
                          cursor: 'pointer',
                        }}
                      >
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
                <g>
                  {/* Label */}
                  <text
                      x={line.x2 + Math.cos(line.angle) * 14}
                      y={line.y2 + Math.sin(line.angle) * 14}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={internalChartState[index]?.highlighted ? "17" : "11"}
                      fill={currentTheme.textColor}
                      fontWeight="600"
                      style={{ 
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        transform: `rotate(${(line.angle + Math.PI / 2 + (Math.sin(line.angle) > 0 ? Math.PI : 0)) * 180 / Math.PI}deg)`,
                        transformOrigin: `${line.x2 + Math.cos(line.angle) * 10}px ${line.y2 + Math.sin(line.angle) * 10}px`,
                      }}
                    onMouseEnter={() => handleAxisMouseEnter(index)}
                    onMouseLeave={() => handleAxisMouseLeave(index)}
                    onMouseDown={() => handleAxisMouseDown(index)}
                    onMouseUp={() => handleAxisMouseUp(index)}
                    onClick={() => handleAxisClick(index)}
                    onTouchStart={() => handleAxisTouchStart(index)}
                    onTouchEnd={() => handleAxisTouchEnd(index)}
                    onTouchCancel={() => handleAxisTouchCancel(index)}
                  >
                    {line.label}
                  </text>
                </g>
              )}
            </g>
          ))}

          {/* Dataset polygons */}
          {allDatasetPoints
            .map(({ dataset, points, color, index }) => {
              const datasetState = datasetStates.get(index);
              if (!datasetState || datasetState.status === 'hidden') return null;
              
              const isActive = datasetState.status === 'active';
              const isHighlighted = datasetState.status === 'highlighted';
              
              // Skip rendering inactive datasets completely
              if (datasetState.status === 'inactive') return null;
              
              // Calculate polygon bounds for gradient positioning
              const minX = Math.min(...points.map(p => p.x));
              const maxX = Math.max(...points.map(p => p.x));
              const minY = Math.min(...points.map(p => p.y));
              const maxY = Math.max(...points.map(p => p.y));
              const polygonBounds = { minX, minY, maxX, maxY };
              
              // Process color with polygon bounds for chart-centered gradients
              const { centerX, centerY } = chartConfig;
              const chartCenter = { x: centerX, y: centerY };
              const currentColors = localColors;
              const originalColor = dataset.color || currentColors[index % currentColors.length];
              const processedColor = processColorOrGradient(originalColor, '#3b82f6', chartCenter, polygonBounds);
              
              const displayColor = getDatasetColor(index, processedColor.fill);
              
              // Only active and highlighted datasets are rendered
              const strokeColor = displayColor;
              const fillColor = displayColor;
              
              // Get opacity based on dataset position
              const { strokeOpacity, fillOpacity } = getDatasetOpacity(index);
              
              return {
                dataset,
                points,
                color: processedColor,
                index,
                datasetState,
                isActive,
                isHighlighted,
                displayColor,
                strokeColor,
                fillColor,
                strokeOpacity,
                fillOpacity
              };
            })
            .filter((item): item is NonNullable<typeof item> => item !== null)
            .sort((a, b) => {
              // Sort by polygon order (first in order = top layer, last in order = bottom layer)
              const currentOrder = polygonOrder.length > 0 ? polygonOrder : Array.from({ length: allDatasetPoints.length }, (_, i) => i);
              const aOrder = currentOrder.indexOf(a.index);
              const bOrder = currentOrder.indexOf(b.index);
              return bOrder - aOrder; // Higher order index = higher in stack (reversed for SVG rendering)
            })
            .map(({ dataset, points, color, index, strokeColor, fillColor, isActive, isHighlighted, strokeOpacity, fillOpacity }) => (
              <g key={`dataset-${index}`}>
                {color.gradientDef}
                <path
                  d={createPolygonPath(points, dataBorderRadius)}
                  fill={fillColor}
                  fillOpacity={
                    isHighlighted ? fillOpacity.toString() : // Use calculated fill opacity for highlighted datasets
                    "0.0" // 0% opacity for active datasets (outline only)
                  }
                  stroke={strokeColor}
                  strokeWidth="2"
                  strokeOpacity={strokeOpacity.toString()}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={() => handleMouseLeave(index)}
                  onClick={() => handleClick(index)}
                  onMouseDown={() => handleMouseDown(index)}
                  onMouseUp={() => handleMouseUp(index)}
                  onTouchStart={() => handleTouchStart(index)}
                  onTouchEnd={() => handleTouchEnd(index)}
                  onTouchCancel={() => handleTouchCancel(index)}
                />

              </g>
            ))}

          {/* Intersection lines for highlighted axis - rendered on top */}
          {intersectionElements.lines.map((line, index) => (
            <line
              key={`intersection-${index}`}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke={currentTheme.textColor}
              strokeWidth="1"
              strokeOpacity={isAxisAnimating ? "0.4" : "0.8"}
              style={{
                transition: 'all 0.2s ease',
              }}
            />
          ))}

          {/* Intersection labels for highlighted axis - rendered on top */}
          {intersectionElements.labels.map((label, index) => (
            <text
              key={`intersection-label-${index}`}
              x={label.x}
              y={label.y}
              textAnchor={label.isBelowCenter ? "end" : "start"}
              dominantBaseline="middle"
              fontSize="10"
              fill={currentTheme.textColor}
              fontWeight="600"
              style={{
                transform: `rotate(${label.angle * 180 / Math.PI}deg)`,
                transformOrigin: `${label.x}px ${label.y}px`,
              }}
            >
              {label.text}
            </text>
          ))}

          {/* Axis overlays for highlighted axes - rendered on top */}
          {intersectionElements.axisOverlays.map((overlay, index) => (
            <line
              key={`axis-overlay-${index}`}
              x1={overlay.x1}
              y1={overlay.y1}
              x2={overlay.x2}
              y2={overlay.y2}
              stroke={currentTheme.textColor}
              strokeWidth="1.5"
              strokeOpacity="0.7"
            />
          ))}
        </svg>
      </div>

      {footnotes.length > 0 && (
        <div style={{
          padding: '16px',
          borderTop: `1px solid ${currentTheme.legendBorderColor}`,
          background: currentTheme.legendBackgroundColor,
        }}>
          {/* Labels Row - Center Aligned */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '6px',
            marginBottom: '10px',
          }}>
            {footnotes.map((footnote, index) => (
              <div
                key={index}
                onClick={() => handleFootnoteClick(index)}
                style={{
                  cursor: 'pointer',
                  padding: '4px 6px',
                  borderRadius: '4px',
                  background: activeFootnote === index ? currentTheme.textColor : 'transparent',
                  color: activeFootnote === index ? currentTheme.backgroundColor : currentTheme.textColor,
                  transition: 'all 0.2s ease',
                  fontSize: '10px',
                  fontWeight: '600',
                  border: `1px solid ${activeFootnote === index ? currentTheme.backgroundColor : currentTheme.textColor}`,
                  opacity: activeFootnote === index ? 1 : 0.5,
                }}
              >
                {footnote.label}
              </div>
            ))}
          </div>
          
          {/* Note Row - Always shown with placeholder or note */}
          <div style={{
            textAlign: 'center',
            fontSize: '11px',
            lineHeight: '1.4',
            color: currentTheme.textColor,
            opacity: activeFootnote !== null ? 1 : 0.6,
            fontStyle: activeFootnote !== null ? 'normal' : 'italic',
          }}>
            {activeFootnote !== null ? footnotes[activeFootnote]?.note : placeholder}
          </div>
        </div>
      )}
    </div>
  );
};

export default R8R; 