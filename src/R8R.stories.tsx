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
      'Comfort': 78,
      'Safety': 95,
      'Efficiency': 88
    }
  }
];

const comparisonData = [
  {
    label: 'Current',
    values: {
      'Speed': 75,
      'Reliability': 85,
      'Comfort': 90,
      'Safety': 60,
      'Efficiency': 80
    }
  },
  {
    label: 'Target',
    values: {
      'Speed': 90,
      'Reliability': 95,
      'Comfort': 95,
      'Safety': 85,
      'Efficiency': 90
    }
  }
];

const performanceData = [
  {
    label: 'Server A',
    values: { 'CPU': 85, 'Memory': 92, 'Storage': 78, 'Network': 95, 'Graphics': 88 }
  },
  {
    label: 'Server B',
    values: { 'CPU': 75, 'Memory': 85, 'Storage': 90, 'Network': 80, 'Graphics': 95 }
  },
  {
    label: 'Server C',
    values: { 'CPU': 95, 'Memory': 70, 'Storage': 85, 'Network': 88, 'Graphics': 75 }
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
    values: { 'Quality': 90, 'Speed': 70, 'Cost': 85 }
  },
  {
    label: 'Option B',
    values: { 'Quality': 75, 'Speed': 95, 'Cost': 60 }
  },
  {
    label: 'Option C',
    values: { 'Quality': 85, 'Speed': 80, 'Cost': 90 }
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