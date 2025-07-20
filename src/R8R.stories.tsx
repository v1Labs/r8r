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

const comparisonChart = [
  { label: 'Size', value: 0, maxValue: 100 },
  { label: 'Color', value: 0, maxValue: 100 },
  { label: 'Cost', value: 0, maxValue: 100 },
  { label: 'Taste', value: 0, maxValue: 100 },
  { label: 'Health', value: 0, maxValue: 100 }
];

const comparisonData = [
  {
    label: 'Apples',
    values: {
      'Size': 55,
      'Color': 80,
      'Cost': 24,
      'Taste': 29,
      'Health': 41
    }
  },
  {
    label: 'Bananas',
    values: {
      'Size': 40,
      'Color': 20,
      'Cost': 70,
      'Taste': 68,
      'Health': 60
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

export const Comparison: Story = {
  args: {
    data: comparisonData,
    chart: comparisonChart,
    width: 500,
    theme: 'light',
    showGrid: true,
    showLabels: true,
    showLegend: true,
    legendTitle: 'Apples vs Bananas',
    colors: ['#d62828', '#fcbf49'],
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
    showLegend: true,
    legendTitle: 'Server Performance',
    colors: ['#8b5cf6', '#06b6d4', '#84cc16'],
    animationDuration: 300,
  },
};

export const DarkTheme: Story = {
  args: {
    data: comparisonData,
    chart: comparisonChart,
    width: 500,
    theme: 'dark',
    showGrid: true,
    showLabels: true,
    showLegend: true,
    legendTitle: 'Dark Theme Demo',
    colors: ['#10b981', '#f59e0b'],
    animationDuration: 250,
  },
};

 