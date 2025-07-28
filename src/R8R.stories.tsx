import type { Meta, StoryObj } from '@storybook/react';
import R8R, { Dataset } from './R8R';

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
      options: ['light', 'dark', 'unicorn'],
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
    dataBorderRadius: {
      control: { type: 'range', min: -30, max: 30, step: 1 },
      description: 'Border radius for dataset polygons (negative = concave, positive = convex)',
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

const comparisonData: Dataset[] = [
  {
    label: 'Apples',
    values: {
      'Size': 55,
      'Color': 85,
      'Cost': 30,
      'Taste': 38,
      'Health': 55
    },
    status: 'active'
  },
  {
    label: 'Bananas',
    values: {
      'Size': 35,
      'Color': 20,
      'Cost': 70,
      'Taste': 78,
      'Health': 75
    },
    status: 'active'
  },
  {
    label: 'Mangos',
    values: {
      'Size': 49,
      'Color': 60,
      'Cost': 88,
      'Taste': 95,
      'Health': 50
    },
    status: 'inactive'
  },
  {
    label: 'Watermelons',
    values: {
      'Size': 90,
      'Color': 50,
      'Cost': 20,
      'Taste': 40,
      'Health': 30
    },
    status: 'inactive'
  }
];

const unicornData = [
  {
    label: 'Narwhal',
    values: { 'Size': 20, 'Shape': 24, 'Has Horn': 95, 'Magical': 40, 'Color': 26 }
  },
  {
    label: 'Pegasus',
    values: { 'Size': 86, 'Shape': 84, 'Has Horn': 10, 'Magical': 90, 'Color': 95 }
  },
  {
    label: 'Pony',
    values: { 'Size': 55, 'Shape': 85, 'Has Horn': 10, 'Magical': 15, 'Color': 79 }
  },
  {
    label: 'Dragon',
    values: { 'Size': 5, 'Shape': 3, 'Has Horn': 60, 'Magical': 85, 'Color': 15 }
  },
];

const unicornChart = [
  { label: 'Size', value: 0, maxValue: 100 },
  { label: 'Shape', value: 0, maxValue: 100 },
  { label: 'Has Horn', value: 0, maxValue: 100 },
  { label: 'Magical', value: 0, maxValue: 100 },
  { label: 'Color', value: 0, maxValue: 100 }
];

const darkThemeData: Dataset[] = [
  {
    label: 'Vampire',
    values: { 'Fangs': 80, 'Claws': 25, 'Weapons': 30, 'Armor': 20, 'Treasure': 40, 'Speed': 80, 'Strength': 70, 'Intelligence': 75 },
    status: 'active'
  },
  {
    label: 'Zombie',
    values: { 'Fangs': 40, 'Claws': 20, 'Weapons': 5, 'Armor': 5, 'Treasure': 5, 'Speed': 40, 'Strength': 55, 'Intelligence': 5 },
    status: 'inactive'
  },
  {
    label: 'Werewolf',
    values: { 'Fangs': 90, 'Claws': 80, 'Weapons': 10, 'Armor': 20, 'Treasure': 10, 'Speed': 85, 'Strength': 80, 'Intelligence': 25 },
    status: 'inactive'
  },
  {
    label: 'Dragon',
    values: { 'Fangs': 90, 'Claws': 90, 'Weapons': 10, 'Armor': 80, 'Treasure': 90, 'Speed': 75, 'Strength': 90, 'Intelligence': 80 },
    status: 'active'
  },
  {
    label: 'Goblin',
    values: { 'Fangs': 15, 'Claws': 15, 'Weapons': 30, 'Armor': 30, 'Treasure': 20, 'Speed': 50, 'Strength': 40, 'Intelligence': 25 },
    status: 'inactive'
  },
];

const darkThemeChart = [
  { label: 'Fangs', value: 0, maxValue: 100 },
  { label: 'Claws', value: 0, maxValue: 100 },
  { label: 'Weapons', value: 0, maxValue: 100 },
  { label: 'Armor', value: 0, maxValue: 100 },
  { label: 'Treasure', value: 0, maxValue: 100 },
  { label: 'Speed', value: 0, maxValue: 100 },
  { label: 'Strength', value: 0, maxValue: 100 },
  { label: 'Intelligence', value: 0, maxValue: 100 }
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
    legendTitle: 'Fruit Comparison',
    colors: ['#d62828', '#fcbf49', '#f77f00', '#6a994e'],
    animationDuration: 200,
    dataBorderRadius: 5,
  },
};

export const DarkTheme: Story = {
  args: {
    data: darkThemeData,
    chart: darkThemeChart,
    width: 600,
    theme: 'dark',
    showGrid: true,
    showLabels: true,
    showLegend: true,
    legendTitle: 'Monsters',
    animationDuration: 250,
    dataBorderRadius: 15,
  },
};

export const UnicornTheme: Story = {
  args: {
    data: unicornData,
    chart: unicornChart,
    width: 500,
    theme: 'unicorn',
    showGrid: true,
    showLabels: true,
    showLegend: true,
    legendTitle: 'Unicorn Similarity 🦄',
    animationDuration: 300,
    dataBorderRadius: 15,
  },
};

export const RetroTheme: Story = {
  args: {
    data: comparisonData,
    chart: comparisonChart,
    width: 500,
    theme: 'retro',
    showGrid: true,
    showLabels: true,
    showLegend: true,
    legendTitle: 'Retro Theme',
    animationDuration: 300,
    dataBorderRadius: 8,
  },
};




 