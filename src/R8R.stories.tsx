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
  { label: 'Popularity', value: 0, maxValue: 100 },
  { label: 'Cost', value: 0, maxValue: 100 },
  { label: 'Flavor', value: 0, maxValue: 100 },
  { label: 'Health', value: 0, maxValue: 100 }
];

const comparisonData: Dataset[] = [
  {
    label: 'Blueberries',
    values: {
      'Size': 15,
      'Popularity': 75,
      'Cost': 35,
      'Flavor': 40,
      'Health': 75
    },
    status: 'highlighted'
  },
  {
    label: 'Apples',
    values: {
      'Size': 45,
      'Popularity': 80,
      'Cost': 30,
      'Flavor': 40,
      'Health': 55
    },
    status: 'active'
  },
  {
    label: 'Kiwi',
    values: {
      'Size': 35,
      'Popularity': 15,
      'Cost': 45,
      'Flavor': 75,
      'Health': 30
    },
    status: 'active'
  },
  {
    label: 'Oranges',
    values: {
      'Size': 45,
      'Popularity': 60,
      'Cost': 40,
      'Flavor': 60,
      'Health': 60
    },
    status: 'inactive'
  },
  {
    label: 'Grapes',
    values: {
      'Size': 20,
      'Popularity': 40,
      'Cost': 35,
      'Flavor': 45,
      'Health': 45
    },
    status: 'inactive'
  },
  {
    label: 'Figs',
    values: {
      'Size': 35,
      'Popularity': 30,
      'Cost': 80,
      'Flavor': 70,
      'Health': 60
    },
    status: 'inactive'
  },
  {
    label: 'Watermelon',
    values: {
      'Size': 90,
      'Popularity': 80,
      'Cost': 20,
      'Flavor': 30,
      'Health': 30
    },
    status: 'active'
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
    values: { 'Fangs': 80, 'Claws': 25, 'Weapons': 30, 'Armor': 20, 'Treasure': 40, 'Speed': 80, 'Strength': 70 },
    status: 'highlighted'
  },
  {
    label: 'Zombie',
    values: { 'Fangs': 40, 'Claws': 20, 'Weapons': 5, 'Armor': 5, 'Treasure': 5, 'Speed': 40, 'Strength': 55 },
    status: 'inactive'
  },
  {
    label: 'Werewolf',
    values: { 'Fangs': 90, 'Claws': 80, 'Weapons': 10, 'Armor': 20, 'Treasure': 10, 'Speed': 85, 'Strength': 80 },
    status: 'inactive'
  },
  {
    label: 'Dragon',
    values: { 'Fangs': 90, 'Claws': 90, 'Weapons': 10, 'Armor': 80, 'Treasure': 90, 'Speed': 75, 'Strength': 90 },
    status: 'active'
  },
  {
    label: 'Goblin',
    values: { 'Fangs': 15, 'Claws': 15, 'Weapons': 30, 'Armor': 30, 'Treasure': 20, 'Speed': 50, 'Strength': 40 },
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
  { label: 'Strength', value: 0, maxValue: 100 }
];

const qbData = [
  {
    label: 'Tom Brady',
    values: { 'Passing Yds': 266.3, 'Passing TDs': 1.82, 'Rushing Yds': 3.35, 'Rushing TDs': .08, 'Sacks': 1.68, 'Wins': .75 }
  },
  {
    label: 'Aaron Rodgers',
    values: { 'Passing Yds': 253.84, 'Passing TDs': 2.03, 'Rushing Yds': 14.41, 'Rushing TDs': .14, 'Sacks': 2.30, 'Wins': .62 }
  },
  {
    label: 'Patrick Mahomes',
    values: { 'Passing Yds': 288.86, 'Passing TDs': 2.19, 'Rushing Yds': 20.01, 'Rushing TDs': .13, 'Sacks': 1.64, 'Wins': .79 }
  },
  {
    label: 'Lamar Jackson',
    values: { 'Passing Yds': 194.75, 'Passing TDs': 1.61, 'Rushing Yds': 59.93, 'Rushing TDs': .32, 'Sacks': 1.86, 'Wins': .68 }
  },
  {
    label: 'Drew Brees',
    values: { 'Passing Yds': 280, 'Passing TDs': 1.99, 'Rushing Yds': 2.62, 'Rushing TDs': .09, 'Sacks': 1.46, 'Wins': .6 }
  },
  {
    label: 'Peyton Manning',
    values: { 'Passing Yds': 270.45, 'Passing TDs': 2.03, 'Rushing Yds': 2.51, 'Rushing TDs': .07, 'Sacks': 1.14, 'Wins': .7 }
  }
];

const qbChart = [
  { label: 'Passing Yds', value: 0, maxValue: 290 },
  { label: 'Passing TDs', value: 0, maxValue: 2.2 },
  { label: 'Rushing Yds', value: 0, maxValue: 60 },
  { label: 'Rushing TDs', value: 0, maxValue: .35 },
  { label: 'Sacks', value: 0, maxValue: 2.3 },
  { label: 'Wins', value: 0, maxValue: .8 }
];

export const LightTheme: Story = {
  args: {
    data: comparisonData,
    chart: comparisonChart,
    width: 500,
    theme: 'light',
    showGrid: true,
    showLabels: true,
    showLegend: true,
    legendTitle: 'Fruit',
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

export const WithFootnotes: Story = {
  args: {
    data: qbData,
    chart: qbChart,
    width: 500,
    theme: 'light',
    showGrid: true,
    showLabels: true,
    showLegend: true,
    legendTitle: 'QB Stats Per Game',
    animationDuration: 200,
    dataBorderRadius: 5,
    placeholder: 'Footnotes: Click to explore',
    activeFootnote: 0, // Start with first footnote active
    footnotes: [
      {
        label: 'a.',
        note: 'Jackson has 3x more rushing yards per game than Mahomes.',
        highlight: ['Lamar Jackson', 'Patrick Mahomes', 'Rushing Yds']
      },
      {
        label: 'b.',
        note: 'Brees and Manning had statistically very similar per game stats.',
        highlight: ['Drew Brees', 'Peyton Manning']
      },
      {
        label: 'c.',
        note: 'Patrick Mahomes has the best per game passing yards and touchdowns.',
        highlight: ['Patrick Mahomes', 'Passing Yds', 'Passing TDs']
      },
      {
        label: 'd.',
        note: 'Rodgers was sacked 2x more per game than Manning.',
        highlight: ['Aaron Rodgers', 'Peyton Manning', 'Sacks']
      }
    ],
  },
};