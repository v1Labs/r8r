# R8R - React Radar Chart Component

A modern, zero-dependency radar (spider) chart for visual comparisons in React.

R8R (pronounced "radar") is an open source, minimalist component for comparing multiple data sets across up to 10 customizable dimensions, visualized as an intuitive radar (spider) chart. R8R helps users spot strengths, gaps, and trade-offs at a glance.

## Features

- 🎯 **Zero Dependencies** - Pure React with no external chart libraries
- 📊 **Multiple Dataset Support** - Compare unlimited datasets with automatic color cycling
- 🎨 **Fully Customizable** - Colors, themes, sizes, animations, and styling
- 📱 **Responsive Design** - Automatically adapts to container size and mobile devices
- ⚡ **Performance Optimized** - Uses React hooks efficiently with ResizeObserver
- 🔧 **TypeScript Ready** - Full TypeScript support with interfaces
- 🎭 **Smooth Animations** - Configurable animation duration
- 🏷️ **Flexible Labels** - Show/hide axis labels and legend titles
- 🌙 **Theme System** - Built-in light and dark themes with custom overrides
- 📋 **Interactive Legend** - Toggle datasets on/off with clean visual states and highlighting
- 🔄 **Smart Layout** - Legend automatically stacks above chart on mobile devices
- 🎯 **Touch Optimized** - Larger touch targets and improved readability on mobile
- 🎨 **Enhanced Highlighting** - Hover and long press interactions for dataset highlighting

## Installation

```bash
npm install r8r
```

or

```bash
yarn add r8r
```

## Quick Start

```jsx
import R8R from 'r8r';

const chart = [
  { label: 'Speed', value: 0, maxValue: 100 },
  { label: 'Reliability', value: 0, maxValue: 100 },
  { label: 'Comfort', value: 0, maxValue: 100 },
  { label: 'Safety', value: 0, maxValue: 100 },
  { label: 'Efficiency', value: 0, maxValue: 100 },
];

const data = [
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

function App() {
  return (
    <R8R 
      data={data}
      chart={chart}
      width={400}
    />
  );
}
```

## Live Demo

For interactive examples and demos, visit the [R8R Storybook demo](https://r8r.v1labs.com/).

## Development

This project uses Storybook for component development and testing. To run the development environment:

```bash
# Install dependencies
npm install

# Start Storybook
npm run storybook

# Build the component
npm run build
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `Dataset[]` | **Required** | Array of datasets to display |
| `chart` | `DataPoint[]` | **Required** | Chart structure defining the axes |
| `width` | `number` | `400` | Width of the chart in pixels |
| `theme` | `'light' \| 'dark'` | `'light'` | Theme preset |
| `backgroundColor` | `string` | Theme default | Background color of the chart |
| `gridColor` | `string` | Theme default | Grid line color |
| `textColor` | `string` | Theme default | Text color for labels and legend |
| `legendBackgroundColor` | `string` | Theme default | Legend background color |
| `legendBorderColor` | `string` | Theme default | Legend border color |
| `colors` | `string[]` | Default palette | Array of colors for datasets |
| `showGrid` | `boolean` | `true` | Whether to show grid lines |
| `showLabels` | `boolean` | `true` | Whether to show axis labels |

| `showLegend` | `boolean` | `true` | Whether to show legend |
| `legendTitle` | `string` | `''` | Title for the legend (empty hides title) |
| `showBorder` | `boolean` | `true` | Whether to show border around the chart |
| `animationDuration` | `number` | `200` | Animation duration in milliseconds |
| `className` | `string` | `''` | Custom CSS class name |
| `style` | `React.CSSProperties` | `{}` | Custom CSS styles |

### Interfaces

```typescript
interface DataPoint {
  label: string;      // Axis label
  value: number;      // Data value (used for maxValue calculation)
  maxValue?: number;  // Optional maximum value (defaults to 100)
}

interface Dataset {
  label: string;                    // Dataset name
  values: Record<string, number>;   // Values mapped to chart labels
  color?: string;                   // Optional custom color for this dataset
}
```

## Responsive Design

R8R automatically adapts to different screen sizes and container constraints:

### Desktop Layout
- Chart and legend display side-by-side
- Legend positioned to the right of the chart
- Optimized for larger screens and mouse interaction

### Mobile Layout (≤450px width)
- Legend automatically moves above the chart
- Larger touch targets and improved readability
- Optimized font sizes and spacing for mobile devices
- Horizontal legend layout with wrapping

### Smart Sizing
- Automatically uses container width when smaller than specified width
- Maintains aspect ratio and readability across all screen sizes
- ResizeObserver integration for real-time container size detection

## Examples

### Basic Usage

```jsx
import R8R from 'r8r';

const chart = [
  { label: 'CPU', value: 0, maxValue: 100 },
  { label: 'Memory', value: 0, maxValue: 100 },
  { label: 'Storage', value: 0, maxValue: 100 },
  { label: 'Network', value: 0, maxValue: 100 },
  { label: 'Graphics', value: 0, maxValue: 100 },
];

const data = [
  {
    label: 'Server Performance',
    values: {
      'CPU': 85,
      'Memory': 92,
      'Storage': 78,
      'Network': 95,
      'Graphics': 88
    }
  }
];

<R8R data={data} chart={chart} />
```

### Multiple Dataset Comparison

```jsx
const chart = [
  { label: 'Design', value: 0, maxValue: 100 },
  { label: 'Development', value: 0, maxValue: 100 },
  { label: 'Testing', value: 0, maxValue: 100 },
  { label: 'Documentation', value: 0, maxValue: 100 },
  { label: 'Deployment', value: 0, maxValue: 100 },
];

const data = [
  {
    label: 'Current',
    values: {
      'Design': 75,
      'Development': 85,
      'Testing': 90,
      'Documentation': 60,
      'Deployment': 80
    }
  },
  {
    label: 'Target',
    values: {
      'Design': 90,
      'Development': 95,
      'Testing': 95,
      'Documentation': 85,
      'Deployment': 90
    }
  }
];

<R8R 
  data={data}
  chart={chart}
  colors={['#3b82f6', '#ef4444']}
  showLegend={true}
/>
```

### Dark Theme with Custom Colors

```jsx
<R8R 
  data={data}
  chart={chart}
  theme="dark"
  colors={['#10b981', '#f59e0b']}
  backgroundColor="#222"
  animationDuration={1500}
/>
```

### Custom Legend Title

```jsx
<R8R 
  data={data}
  chart={chart}
  legendTitle="Performance Metrics"
  showLegend={true}
/>
```

### Mobile Responsive

R8R automatically adapts to mobile devices:

- **Automatic detection**: When container width is ≤450px, mobile mode activates
- **Responsive layout**: Legend moves above chart with optimized spacing
- **Touch-friendly**: Larger touch targets and improved readability
- **Smart sizing**: Automatically adjusts to container constraints
- **Real-time updates**: ResizeObserver detects container size changes

```jsx
// Component automatically handles mobile layout
<R8R 
  data={data}
  chart={chart}
  width={800} // Will trigger mobile mode on screens ≤450px
  showLegend={true}
/>
```

## Browser Support

- React 16.8+ (for hooks support)
- Modern browsers with SVG and ResizeObserver support
- IE11+ (with polyfills if needed)

## Development

```bash
# Install dependencies
npm install

# Start development mode
npm run dev

# Build for production
npm run build

# Clean build directory
npm run clean
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

### Recent Updates

- **Enhanced Data Highlighting**: Hover and long press interactions for dataset highlighting
- **Mobile-Friendly Interactions**: Long press (500ms) for mobile highlighting
- **Chart Polygon Interaction**: Hover over chart polygons to highlight datasets
- **Improved Legend Layout**: Wider legend (160px) for better label accommodation
- **Responsive Design**: Automatic mobile layout with legend stacking above chart
- **Smart Sizing**: ResizeObserver integration for real-time container size detection
- **Mobile Optimization**: Larger touch targets, improved readability, and better spacing
- **Enhanced Themes**: Updated grid colors and improved dark theme visibility
- **Border Control**: Added `showBorder` prop for better visual separation
- **Performance**: Optimized rendering and reduced unnecessary re-renders
