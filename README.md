# R8R - React Radar Chart Component

A modern, zero-dependency radar (spider) chart for visual comparisons in React.

R8R (pronounced "radar") is an open source, minimalist component for comparing multiple data sets across up to 10 customizable dimensions, visualized as an intuitive radar (spider) chart. R8R helps users spot strengths, gaps, and trade-offs at a glance.

## Live Demo

For interactive examples and demos, visit the [R8R Storybook demo](https://r8r.v1labs.com/).

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

## Features

- 🎯 **Zero Dependencies** - Pure React with no external chart libraries
- 📊 **Multiple Dataset Support** - Compare unlimited datasets with automatic color cycling
- 🎨 **Fully Customizable** - Colors, themes, sizes, animations, and styling
- 📱 **Responsive Design** - Automatically adapts to container size and mobile devices
- ⚡ **Performance Optimized** - Uses React hooks efficiently with ResizeObserver
- 🔧 **TypeScript Ready** - Full TypeScript support with interfaces
- 🎭 **Smooth Animations** - Configurable animation duration
- 🏷️ **Flexible Labels** - Show/hide axis labels and legend titles
- 🌙 **Theme System** - Built-in light, dark, unicorn, and retro themes with custom overrides
- 📋 **Interactive Legend** - Toggle datasets on/off with clean visual states and highlighting
- 🔄 **Smart Layout** - Legend automatically stacks above chart on mobile devices
- 🎯 **Touch Optimized** - Larger touch targets and improved readability on mobile
- 🎨 **Enhanced Highlighting** - Hover and long press interactions for dataset highlighting
- 🎯 **Progressive Disclosure** - Hover/long press axis labels to reveal detailed range information
- 🎯 **Bring to Front** - Click legend labels to bring polygons to the top of the chart
- 🎨 **Retro Theme** - 70s Colorado-inspired theme with vibrant colors and dark brown legend
- 🎯 **3-Way Toggle** - Click to cycle through inactive → active → highlighted states

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

### Theme Examples

#### Dark Theme with Custom Colors

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

#### Unicorn Theme

```jsx
<R8R 
  data={data}
  chart={chart}
  theme="unicorn"
  legendTitle="Unicorn Magic ✨"
/>
```

The unicorn theme features:
- Soft pink background with purple accents
- Bright, vibrant colors optimized for the theme
- Magical gradient-inspired color palette
- Perfect for fun, creative, or whimsical data visualizations

#### Retro Theme

```jsx
<R8R 
  data={data}
  chart={chart}
  theme="retro"
  legendTitle="Retro Vibes 🎸"
/>
```

The retro theme features:
- Light cream background with brown accents
- Dark brown legend with light cream text for excellent contrast
- Vibrant oranges, reds, yellows, teals, and blues
- 70s Colorado-inspired color palette
- Perfect for vintage, nostalgic, or retro-themed visualizations

### Advanced Styling

#### Gradient Backgrounds

R8R supports any valid CSS background value, including gradients and images:

```jsx
// Gradient backgrounds
<R8R 
  data={data}
  chart={chart}
  backgroundColor="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  legendBackgroundColor="linear-gradient(142deg, rgba(50, 16, 64, 1) 0%, rgba(84, 14, 135, 1) 100%)"
/>

// Radial gradients
<R8R 
  data={data}
  chart={chart}
  backgroundColor="radial-gradient(circle, #ff6b6b, #4ecdc4)"
/>

// Multiple backgrounds
<R8R 
  data={data}
  chart={chart}
  backgroundColor="linear-gradient(45deg, #ff6b6b, #4ecdc4), url('pattern.png')"
/>

// Different text colors for legend vs chart
<R8R 
  data={data}
  chart={chart}
  textColor="#374151"
  legendTextColor="#ffffff"
  legendBackgroundColor="linear-gradient(142deg, rgba(50, 16, 64, 1) 0%, rgba(84, 14, 135, 1) 100%)"
/>
```

#### Gradient Dataset Colors

R8R supports SVG gradients for dataset colors using a simple object API:

```jsx
// Gradient dataset colors
<R8R 
  data={data}
  chart={chart}
  colors={[
    {
      type: 'gradient',
      from: '#667eea',
      to: '#764ba2',
      angle: 135
    },
    '#ec4899', // Solid color
    {
      type: 'gradient',
      from: '#10b981',
      to: '#06b6d4',
      angle: 45
    }
  ]}
/>

// Simple solid colors (strings)
<R8R 
  data={data}
  chart={chart}
  colors={['#3b82f6', '#ef4444', '#10b981']}
/>
```

**Gradient Object Properties:**
- `type: 'gradient'` - Required to identify gradient objects
- `from: string` - Starting color (hex, rgb, rgba, etc.)
- `to: string` - Ending color (hex, rgb, rgba, etc.)
- `angle?: number` - Gradient angle in degrees (defaults to 0)

**Note**: Linear gradients are oriented from the chart center to each polygon, making data magnitude more visually intuitive. Legend indicators use the `from` color of gradients since they're rendered with HTML.

#### Data Border Radius

Add rounded corners to dataset polygons for a softer design:

```jsx
// Convex (outward bulging) polygons
<R8R 
  data={data}
  chart={chart}
  dataBorderRadius={8}
/>

// Concave (inward curving) polygons
<R8R 
  data={data}
  chart={chart}
  dataBorderRadius={-8}
/>

// Sharp corners (default)
<R8R 
  data={data}
  chart={chart}
  dataBorderRadius={0}
/>
```

**Advanced Logic**: For charts with 4+ data points and positive radius, R8R uses geometric center line analysis to prevent awkward bulging. The maximum bulge is constrained to half the minimum distance between adjacent points and their geometric center lines, ensuring smooth, visually pleasing curves.

### Interactive Features

#### Custom Legend Title

```jsx
<R8R 
  data={data}
  chart={chart}
  legendTitle="Performance Metrics"
  showLegend={true}
/>
```

#### Progressive Disclosure

R8R supports progressive disclosure for detailed information:

- **Axis interaction**: Hover or long press on axis labels to reveal range details
- **Intersection lines**: Tiny perpendicular lines show grid intersections (0%, 20%, 40%, 60%, 80%, 100%)
- **Number labels**: Each intersection displays the actual value based on maxValue
- **Axis overlay**: Highlighted axis gets a matching overlay line
- **Smooth animations**: 200ms transitions for all disclosure elements
- **Cross-platform**: Works on desktop (hover) and mobile (long press)

```jsx
// Progressive disclosure is automatic - just hover/long press axis labels
<R8R 
  data={data}
  chart={chart}
  showLabels={true}
/>
```

#### Mobile Responsive

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

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `Dataset[]` | **Required** | Array of datasets to display |
| `chart` | `DataPoint[]` | **Required** | Chart structure defining the axes |
| `width` | `number` | `400` | Width of the chart in pixels |
| `theme` | `'light' \| 'dark' \| 'unicorn' \| 'retro'` | `'light'` | Theme preset |
| `backgroundColor` | `string` | Theme default | Background of the chart (supports any valid CSS background value) |
| `gridColor` | `string` | Theme default | Grid line color |
| `textColor` | `string` | Theme default | Text color for labels and legend |
| `legendBackgroundColor` | `string` | Theme default | Legend background (supports any valid CSS background value) |
| `legendTextColor` | `string` | `textColor` | Legend text color (falls back to textColor if not provided) |
| `legendBorderColor` | `string` | Theme default | Legend border color |
| `colors` | `(string \| Gradient)[]` | Default palette | Array of colors for datasets (supports SVG gradients) |
| `showGrid` | `boolean` | `true` | Whether to show grid lines |
| `showLabels` | `boolean` | `true` | Whether to show axis labels |
| `showLegend` | `boolean` | `true` | Whether to show legend |
| `legendTitle` | `string` | `''` | Title for the legend (empty hides title) |
| `showBorder` | `boolean` | `true` | Whether to show border around the chart |
| `animationDuration` | `number` | `200` | Animation duration in milliseconds |
| `dataBorderRadius` | `number` | `0` | Border radius for dataset polygons (negative = concave, positive = convex) |
| `className` | `string` | `''` | Custom CSS class name |
| `style` | `React.CSSProperties` | `{}` | Custom CSS styles |

### Interfaces

```typescript
interface DataPoint {
  label: string;                    // Axis label
  value: number;                    // Data value (used for maxValue calculation)
  maxValue?: number;                // Optional maximum value (defaults to 100)
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

## Browser Support

- React 16.8+ (for hooks support)
- Modern browsers with SVG and ResizeObserver support
- IE11+ (with polyfills if needed)

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

- **Progressive Disclosure**: Hover/long press axis labels to reveal detailed range information
- **Smart Label Rotation**: Axis labels automatically rotate for optimal readability
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
