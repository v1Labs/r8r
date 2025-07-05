import type { Meta, StoryObj } from '@storybook/react';
import R8R from './R8R';

const meta: Meta<typeof R8R> = {
  title: 'Components/R8R',
  component: R8R,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A modern, zero-dependency radar (spider) chart for visual comparisons in React.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ 
        padding: '0', 
        margin: '0',
        width: '100%',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: 'Theme preset for the chart',
    },
    showGrid: {
      control: { type: 'boolean' },
      description: 'Whether to show grid lines',
    },
    gridColor: {
      control: { type: 'color' },
      description: 'Grid line color',
    },
    showLabels: {
      control: { type: 'boolean' },
      description: 'Whether to show axis labels',
    },
    showValues: {
      control: { type: 'boolean' },
      description: 'Whether to show data point values on hover',
    },
    showLegend: {
      control: { type: 'boolean' },
      description: 'Whether to show legend',
    },
    width: {
      control: { type: 'range', min: 300, max: 800, step: 50 },
      description: 'Width of the chart in pixels',
    },
    animationDuration: {
      control: { type: 'range', min: 0, max: 1000, step: 50 },
      description: 'Animation duration in milliseconds',
    },
    showPlayButton: {
      control: { type: 'boolean' },
      description: 'Whether to show play button for animated data sequence',
    },
    showTimeline: {
      control: { type: 'boolean' },
      description: 'Whether to show timeline slider for manual data exploration',
    },
    playSpeed: {
      control: { type: 'range', min: 500, max: 3000, step: 100 },
      description: 'Speed of play animation in milliseconds',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data for stories
const basicChart = [
  { label: 'Speed', value: 0, maxValue: 100 },
  { label: 'Reliability', value: 0, maxValue: 100 },
  { label: 'Comfort', value: 0, maxValue: 100 },
  { label: 'Safety', value: 0, maxValue: 100 },
  { label: 'Efficiency', value: 0, maxValue: 100 }
];

const basicData = [
  {
    label: 'Car Performance',
    values: {
      'Speed': 85,
      'Reliability': 92,
      'Comfort': 65,
      'Safety': 78,
      'Efficiency': 88
    }
  }
];

const comparisonData = [
  {
    label: 'Current',
    values: {
      'Speed': 45,
      'Reliability': 75,
      'Comfort': 85,
      'Safety': 60,
      'Efficiency': 70
    }
  },
  {
    label: 'Target',
    values: {
      'Speed': 80,
      'Reliability': 90,
      'Comfort': 95,
      'Safety': 85,
      'Efficiency': 88
    }
  }
];

const performanceData = [
  {
    label: 'Server A',
    values: { 'CPU': 85, 'Memory': 92, 'Storage': 45, 'Network': 95, 'Graphics': 30 }
  },
  {
    label: 'Server B',
    values: { 'CPU': 65, 'Memory': 75, 'Storage': 90, 'Network': 60, 'Graphics': 85 }
  },
  {
    label: 'Server C',
    values: { 'CPU': 95, 'Memory': 55, 'Storage': 70, 'Network': 80, 'Graphics': 40 }
  }
];

const performanceChart = [
  { label: 'CPU', value: 0, maxValue: 100 },
  { label: 'Memory', value: 0, maxValue: 100 },
  { label: 'Storage', value: 0, maxValue: 100 },
  { label: 'Network', value: 0, maxValue: 100 },
  { label: 'Graphics', value: 0, maxValue: 100 }
];

const threeDimChart = [
  { label: 'Quality', value: 0, maxValue: 100 },
  { label: 'Speed', value: 0, maxValue: 100 },
  { label: 'Cost', value: 0, maxValue: 100 }
];

const threeDimData = [
  {
    label: 'Option A',
    values: { 'Quality': 90, 'Speed': 40, 'Cost': 85 }
  },
  {
    label: 'Option B',
    values: { 'Quality': 65, 'Speed': 95, 'Cost': 45 }
  },
  {
    label: 'Option C',
    values: { 'Quality': 75, 'Speed': 70, 'Cost': 60 }
  }
];

const statusData = [
  {
    label: 'Active Dataset',
    values: { 'Speed': 85, 'Reliability': 92, 'Comfort': 65, 'Safety': 78, 'Efficiency': 88 },
    status: 'active' as const,
    showNumbers: false
  },
  {
    label: 'Inactive Dataset',
    values: { 'Speed': 45, 'Reliability': 75, 'Comfort': 85, 'Safety': 60, 'Efficiency': 70 },
    status: 'inactive' as const,
    showNumbers: false
  },
  {
    label: 'Hidden Dataset',
    values: { 'Speed': 95, 'Reliability': 55, 'Comfort': 70, 'Safety': 90, 'Efficiency': 40 },
    status: 'hidden' as const,
    showNumbers: false
  }
];

export const Basic: Story = {
  args: {
    data: basicData,
    chart: basicChart,
    width: 400,
    theme: 'light',
    showGrid: true,
    showLabels: true,
    showValues: false,
    showLegend: true,
    legendTitle: 'Performance',
    animationDuration: 200,
    className: "",
    style: {
      fontFamily: "'san serif' !important"
    }
  },
};

export const Comparison: Story = {
  args: {
    data: comparisonData,
    chart: basicChart,
    width: 500,
    theme: 'light',
    showGrid: true,
    showLabels: true,
    showValues: true,
    showLegend: true,
    legendTitle: 'Current vs Target',
    colors: ['#3b82f6', '#ef4444'],
    animationDuration: 200,
  },
};

export const Performance: Story = {
  args: {
    data: performanceData,
    chart: performanceChart,
    width: 600,
    theme: 'light',
    showGrid: true,
    showLabels: true,
    showValues: true,
    showLegend: true,
    legendTitle: 'Server Performance',
    colors: ['#8b5cf6', '#06b6d4', '#84cc16'],
    animationDuration: 300,
  },
};

export const ThreeDimensions: Story = {
  args: {
    data: threeDimData,
    chart: threeDimChart,
    width: 400,
    theme: 'light',
    showGrid: true,
    showLabels: true,
    showValues: true,
    showLegend: true,
    legendTitle: 'Options Comparison',
    colors: ['#3b82f6', '#ef4444', '#10b981'],
    animationDuration: 200,
  },
};

export const DarkTheme: Story = {
  args: {
    data: comparisonData,
    chart: basicChart,
    width: 500,
    theme: 'dark',
    showGrid: true,
    showLabels: true,
    showValues: true,
    showLegend: true,
    legendTitle: 'Dark Theme Demo',
    colors: ['#10b981', '#f59e0b'],
    animationDuration: 250,
  },
};

export const CustomColors: Story = {
  args: {
    data: performanceData,
    chart: performanceChart,
    width: 550,
    theme: 'light',
    showGrid: true,
    showLabels: true,
    showValues: true,
    showLegend: true,
    legendTitle: 'Custom Colors',
    colors: ['#ec4899', '#8b5cf6', '#06b6d4'],
    backgroundColor: '#f8fafc',
    gridColor: '#cbd5e1',
    textColor: '#1e293b',
    animationDuration: 200,
  },
};

export const Minimal: Story = {
  args: {
    data: basicData,
    chart: basicChart,
    width: 400,
    theme: 'light',
    showGrid: false,
    showLabels: false,
    showValues: false,
    showLegend: false,
    animationDuration: 0,
  },
};

export const StatusSystem: Story = {
  args: {
    data: statusData,
    chart: basicChart,
    width: 400,
    theme: 'light',
    showGrid: true,
    showLabels: true,
    showValues: false,
    showLegend: true,
    legendTitle: 'Dataset Status Demo',
    colors: ['#3b82f6', '#ef4444', '#10b981'],
    animationDuration: 200,
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the new status system with hidden, inactive, and active datasets. Click legend items to toggle between active and inactive. Hover to show/hide number bubbles.',
      },
    },
  },
};

// Time-series data for play functionality
const timeSeriesData = [
  {
    label: 'January',
    values: { 'Revenue': 65, 'Users': 45, 'Engagement': 70, 'Retention': 55, 'Growth': 60 },
    status: 'active' as const,
    showNumbers: true
  },
  {
    label: 'February',
    values: { 'Revenue': 69, 'Users': 52, 'Engagement': 75, 'Retention': 58, 'Growth': 64 },
    status: 'hidden' as const,
    showNumbers: false
  },
  {
    label: 'March',
    values: { 'Revenue': 78, 'Users': 61, 'Engagement': 79, 'Retention': 65, 'Growth': 71 },
    status: 'hidden' as const,
    showNumbers: false
  },
  {
    label: 'April',
    values: { 'Revenue': 85, 'Users': 69, 'Engagement': 86, 'Retention': 72, 'Growth': 78 },
    status: 'hidden' as const,
    showNumbers: false
  },
  {
    label: 'May',
    values: { 'Revenue': 91, 'Users': 77, 'Engagement': 89, 'Retention': 79, 'Growth': 85 },
    status: 'hidden' as const,
    showNumbers: false
  },
  {
    label: 'June',
    values: { 'Revenue': 88, 'Users': 83, 'Engagement': 92, 'Retention': 81, 'Growth': 89 },
    status: 'hidden' as const,
    showNumbers: false
  },
  {
    label: 'July',
    values: { 'Revenue': 93, 'Users': 86, 'Engagement': 95, 'Retention': 87, 'Growth': 91 },
    status: 'hidden' as const,
    showNumbers: false
  },
  {
    label: 'August',
    values: { 'Revenue': 96, 'Users': 89, 'Engagement': 98, 'Retention': 92, 'Growth': 94 },
    status: 'hidden' as const,
    showNumbers: false
  }
];

const kpiChart = [
  { label: 'Revenue', value: 0, maxValue: 100 },
  { label: 'Users', value: 0, maxValue: 100 },
  { label: 'Engagement', value: 0, maxValue: 100 },
  { label: 'Retention', value: 0, maxValue: 100 },
  { label: 'Growth', value: 0, maxValue: 100 }
];

export const PlayFunctionality: Story = {
  args: {
    data: timeSeriesData,
    chart: kpiChart,
    width: 500,
    theme: 'light',
    showGrid: true,
    showLabels: true,
    showValues: false,
    showLegend: true,
    legendTitle: 'Monthly KPIs',
    showPlayButton: true,
    showTimeline: true,
    playSpeed: 1000,
    colors: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'],
    animationDuration: 200,
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the new play functionality for time-series data visualization. Click the play button to animate through monthly KPI data, or use the timeline slider to manually explore different time periods.',
      },
    },
  },
}; 