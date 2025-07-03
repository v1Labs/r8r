# R8R - React Radar Chart Component

A modern, zero-dependency radar (spider) chart for visual comparisons in React.

R8R (pronounced "radar") is an open source, minimalist component for comparing two data sets across up to 10 customizable dimensions, visualized as an intuitive radar (spider) chart. R8R helps users spot strengths, gaps, and trade-offs at a glance.

## Features

- 🎯 **Zero Dependencies** - Pure React with no external chart libraries
- 📊 **Dual Dataset Comparison** - Compare two datasets side by side
- 🎨 **Fully Customizable** - Colors, sizes, animations, and styling
- 📱 **Responsive** - Flexible width and height options
- ⚡ **Performance Optimized** - Uses React hooks efficiently
- 🔧 **TypeScript Ready** - Full TypeScript support with interfaces
- 🎭 **Smooth Animations** - Configurable animation duration
- 🏷️ **Flexible Labels** - Show/hide axis labels and data values

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

const data = [
  { label: 'Speed', value: 85 },
  { label: 'Reliability', value: 92 },
  { label: 'Comfort', value: 78 },
  { label: 'Safety', value: 95 },
  { label: 'Efficiency', value: 88 },
];

function App() {
  return (
    <R8R 
      primaryData={data}
      width={400}
      height={400}
    />
  );
}
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `primaryData` | `DataPoint[]` | **Required** | Primary dataset to display |
| `secondaryData` | `DataPoint[]` | `[]` | Secondary dataset for comparison |
| `width` | `number` | `400` | Width of the chart in pixels |
| `height` | `number` | `400` | Height of the chart in pixels |
| `primaryColor` | `string` | `'#3b82f6'` | Primary data color (hex or CSS color) |
| `secondaryColor` | `string` | `'#ef4444'` | Secondary data color (hex or CSS color) |
| `backgroundColor` | `string` | `'#ffffff'` | Background color of the chart |
| `gridColor` | `string` | `'#e5e7eb'` | Grid line color |
| `showGrid` | `boolean` | `true` | Whether to show grid lines |
| `showLabels` | `boolean` | `true` | Whether to show axis labels |
| `showValues` | `boolean` | `false` | Whether to show data point values |
| `animationDuration` | `number` | `1000` | Animation duration in milliseconds |
| `className` | `string` | `''` | Custom CSS class name |
| `style` | `React.CSSProperties` | `{}` | Custom CSS styles |

### DataPoint Interface

```typescript
interface DataPoint {
  label: string;      // Axis label
  value: number;      // Data value
  maxValue?: number;  // Optional maximum value (defaults to 100)
}
```

## Examples

### Basic Usage

```jsx
import R8R from 'r8r';

const performanceData = [
  { label: 'CPU', value: 85 },
  { label: 'Memory', value: 92 },
  { label: 'Storage', value: 78 },
  { label: 'Network', value: 95 },
  { label: 'Graphics', value: 88 },
];

<R8R primaryData={performanceData} />
```

### Comparing Two Datasets

```jsx
const currentData = [
  { label: 'Design', value: 75 },
  { label: 'Development', value: 85 },
  { label: 'Testing', value: 90 },
  { label: 'Documentation', value: 60 },
  { label: 'Deployment', value: 80 },
];

const targetData = [
  { label: 'Design', value: 90 },
  { label: 'Development', value: 95 },
  { label: 'Testing', value: 95 },
  { label: 'Documentation', value: 85 },
  { label: 'Deployment', value: 90 },
];

<R8R 
  primaryData={currentData}
  secondaryData={targetData}
  primaryColor="#3b82f6"
  secondaryColor="#ef4444"
  showValues={true}
/>
```

### Custom Styling

```jsx
<R8R 
  primaryData={data}
  width={500}
  height={500}
  primaryColor="#10b981"
  backgroundColor="#f8fafc"
  gridColor="#cbd5e1"
  showGrid={true}
  showLabels={true}
  showValues={true}
  animationDuration={1500}
  className="my-custom-chart"
  style={{ border: '2px solid #e2e8f0' }}
/>
```

### Custom Max Values

```jsx
const dataWithCustomMax = [
  { label: 'Accuracy', value: 95, maxValue: 100 },
  { label: 'Speed', value: 180, maxValue: 200 },
  { label: 'Cost', value: 75, maxValue: 100 },
  { label: 'Efficiency', value: 85, maxValue: 100 },
];

<R8R primaryData={dataWithCustomMax} />
```

## Browser Support

- React 16.8+ (for hooks support)
- Modern browsers with SVG support
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

### 1.0.0
- Initial release
- Zero-dependency radar chart component
- Dual dataset comparison support
- Full TypeScript support
- Customizable styling and animations
