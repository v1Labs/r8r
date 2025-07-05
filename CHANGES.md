# Changelog

All notable changes to R8R will be documented in this file.

## [1.0.6] - 2025-07-05

### 🎯 Enhanced Dataset Status System
- **New status field**: Added `status` field to Dataset interface with "hidden" | "inactive" | "active" options
- **Status-based visibility**: Hidden datasets are completely removed from legend and chart
- **Inactive dataset display**: Inactive datasets show in legend (deselected) and chart (grayscale with lower opacity)
- **Active dataset display**: Active datasets show in legend (selected) and chart (full color and opacity)
- **Click to toggle**: Clicking legend items toggles between active and inactive status

### 🔢 Dynamic Number Display
- **New showNumbers field**: Added `showNumbers` boolean field to Dataset interface (defaults to false)
- **Hover-based number display**: Hovering over legend items shows/hides value bubbles on the chart
- **Individual dataset control**: Each dataset can independently control its number visibility
- **Smooth transitions**: Number bubbles appear/disappear with smooth animations

### 🎨 Visual Improvements
- **Grayscale inactive datasets**: Inactive datasets display in grayscale with reduced opacity for better visual hierarchy
- **Enhanced legend styling**: Legend items reflect active/inactive states with appropriate visual feedback
- **Improved color management**: Better color handling for different dataset states
- **Consistent visual states**: All visual elements properly reflect the new status system
- **Refined inactive styling**: Inactive datasets show grayscale stroke with nearly transparent fill
- **Grayscale value bubbles**: Value bubbles on inactive datasets match the grayscale stroke color
- **Theme-aware opacity**: Stroke opacity 0.6 (light) / 0.9 (dark), fill opacity 0.1 (light) / 0.2 (dark)
- **Smart z-index layering**: Inactive datasets render first, active datasets second, datasets with numbers on top

### 🔧 Technical Enhancements
- **State management refactor**: Replaced visibleDatasets Set with comprehensive datasetStates Map
- **Status persistence**: Dataset states persist across data updates while respecting new status values
- **Enhanced interaction handlers**: New mouse enter/leave handlers for showNumbers functionality
- **Improved type safety**: Better TypeScript support with new interface fields
- **SVG DOM ordering**: Clean z-index implementation using natural SVG element stacking

### 📝 Typography Improvements
- **Sans-serif font family**: Consistent sans-serif typography throughout the chart
- **Standardized font sizes**: 12px for labels, 14px for max values across all screen sizes
- **Consistent positioning**: 15px offsets prevent text clustering on mobile devices
- **Enhanced value bubbles**: 14px radius circles with 12px font for better readability
- **Cross-device consistency**: Same typography experience on mobile and desktop

### 📊 Enhanced Test Data
- **Realistic data ranges**: Values now span 30-95 instead of clustering in 75-95 range
- **More interesting shapes**: Radar charts have distinctive, asymmetrical profiles
- **Better storytelling**: Data reflects realistic trade-offs and use cases
- **Clearer comparisons**: Differences between datasets are more apparent

### 🎯 API Changes
```typescript
interface Dataset {
  label: string;
  values: Record<string, number>;
  color?: string;
  status?: 'hidden' | 'inactive' | 'active';  // New field
  showNumbers?: boolean;                      // New field
}

// Example usage with new fields
const data = [
  {
    label: 'Active Dataset',
    values: { 'Speed': 85, 'Reliability': 92 },
    status: 'active',
    showNumbers: false
  },
  {
    label: 'Inactive Dataset', 
    values: { 'Speed': 75, 'Reliability': 85 },
    status: 'inactive',
    showNumbers: false
  },
  {
    label: 'Hidden Dataset',
    values: { 'Speed': 95, 'Reliability': 88 },
    status: 'hidden',
    showNumbers: false
  }
];
```

### ✨ New Features
- **Three-state dataset system**: Hidden, inactive, and active states for fine-grained control
- **Hover-based number display**: Interactive value bubble display on legend hover
- **Enhanced visual hierarchy**: Clear distinction between active and inactive datasets
- **Improved user interaction**: Click to toggle status, hover to show numbers
- **Better data organization**: More flexible dataset management and display options

## [1.0.5] - 2025-07-04

### 📱 Responsive Design & Mobile Optimization
- **Smart responsive layout**: Component automatically adapts to container size with ResizeObserver integration
- **Mobile-first design**: Legend automatically stacks above chart when width ≤450px
- **Touch-optimized interface**: Larger touch targets, improved readability, and better spacing on mobile
- **Real-time container detection**: ResizeObserver monitors parent and body elements for size changes
- **Storybook compatibility**: Special handling for `body.sb-show-main` element in Storybook environment
- **Smart width calculation**: Uses container width when constrained, with 20px padding subtraction
- **Dynamic height**: Removed height prop in favor of automatic height calculation based on content
- **Automatic mobile detection**: Component detects when browser width is narrower than component width
- **Responsive width adjustment**: Automatically sets width to `95vw` on mobile devices for optimal viewing
- **Minimum width protection**: Ensures minimum width of 320px to prevent overflow on very small screens
- **Enhanced small screen support**: Special optimizations for screens 480px and below
- **Legend repositioning**: Moves legend above chart on mobile instead of side-by-side layout
- **Horizontal legend layout**: Legend items display horizontally with wrap on mobile for better space utilization
- **Mobile-optimized sizing**: Smaller fonts, padding, and interactive elements for touch-friendly experience
- **Responsive label positioning**: Adjusted label and value positioning for mobile screens
- **Mobile layout fixes**: Added margin auto for centering and fixed legend width to match chart width

### 🎨 Visual & Theme Improvements
- **Enhanced grid colors**: Updated light theme to `#dbe4ef` and dark theme to `#6b6d6f` for better visibility
- **Removed grid opacity**: Grid elements now display at full opacity for better reference
- **Border control**: Added `showBorder` prop (defaults to true) using grid color for visual separation
- **Improved dark theme**: Better contrast and visibility with new grid color
- **Enhanced data point visibility**: Larger bubbles (16px radius) and improved font sizes on mobile
- **Updated default grid color**: Changed from theme-specific colors to consistent `#a3b0bf` for both light and dark themes
- **Improved visual consistency**: Grid lines now have the same color across all themes for better user experience
- **Enhanced Storybook controls**: Added `gridColor` control to Storybook for interactive testing
- **Better accessibility**: More consistent grid visibility across different theme contexts

### 🔧 Interactive & Layout Enhancements
- **Legend auto-width**: Legend uses `auto` width when stacked above chart to prevent overflow
- **Improved spacing**: 32px padding subtraction when legend is to the left, 10px margin-top for SVG
- **Enhanced text sizing**: 50% larger font sizes for values and max values when legend is on top
- **Better label positioning**: Increased label offset from max values for improved readability
- **Optimized legend layout**: Vertical centering and improved spacing for mobile legend display

### ⚡ Performance & Technical Improvements
- **ResizeObserver integration**: Real-time container size detection without polling
- **Optimized rendering**: Reduced unnecessary re-renders and improved performance
- **Simplified width logic**: Single observer approach with fallback to parent element
- **Better mobile detection**: Uses actual container width instead of viewport width
- **Enhanced Storybook support**: CSS override to remove padding from Storybook root element

### 📚 Documentation & Development
- **Updated README**: Comprehensive documentation of responsive design and new features
- **Removed Mobile story**: Cleaned up Storybook by removing outdated Mobile story
- **Enhanced examples**: Updated all examples to reflect current API and responsive behavior
- **Development workflow**: Improved Storybook setup with CSS overrides for better testing

### 🎯 API Changes
```typescript
// New responsive behavior - automatically adapts to container
<R8R 
  data={data}
  chart={chart}
  width={400} // Uses container width when smaller, with smart padding
  showBorder={true} // New prop for visual separation
/>

// Mobile layout automatically activates when container ≤450px
// Legend moves above chart with optimized touch targets
```

### ✨ New Features
- **Responsive design**: Automatic mobile layout with legend stacking
- **Smart sizing**: ResizeObserver integration for real-time container detection
- **Border control**: `showBorder` prop for better visual separation
- **Touch optimization**: Larger touch targets and improved mobile readability
- **Enhanced themes**: Updated grid colors for better visibility across themes
- **Performance optimization**: Reduced re-renders and improved efficiency

## [1.0.4] - 2025-07-04

### 🎯 Zero Dependencies Achievement
- **Removed `tslib` dependency**: Now truly zero-dependency with no runtime dependencies
- **Updated TypeScript configuration**: Added `importHelpers: false` and `noEmitHelpers: true` to prevent helper function imports
- **Enhanced Rollup configuration**: Added `importHelpers: false` to TypeScript plugin for clean builds
- **Smaller bundle size**: Eliminated runtime helper functions for better performance

### 🛠️ Development Environment Upgrade
- **Upgraded to Node.js 20**: Now compatible with latest development tools and Storybook 9
- **Installed Storybook**: Professional component development environment with interactive stories
- **Comprehensive story collection**: 7 different stories showcasing all R8R features:
  - Basic single dataset visualization
  - Multiple dataset comparison
  - Performance metrics with 3 datasets
  - Three-dimensional analysis
  - Dark theme demonstration
  - Custom color schemes
  - Minimal configuration
- **Interactive controls**: Real-time prop adjustment with Storybook controls
- **Professional documentation**: Living documentation with interactive examples

### 🧹 Repository Cleanup
- **Removed example directory**: Eliminated 60KB duplicate implementation
- **Single source of truth**: Only one implementation to maintain
- **Reduced maintenance burden**: No more sync issues between example and actual component
- **Updated README**: Points users to v1Labs website for demos
- **Better project structure**: Cleaner, more professional repository

### 📚 Documentation Improvements
- **Updated README**: Added development section with Storybook instructions
- **Live demo reference**: Directs users to v1Labs website for interactive examples
- **Development workflow**: Clear instructions for component development and testing
- **Professional presentation**: Better organization and clearer usage examples

### 🔧 Technical Improvements
- **Enhanced build process**: Cleaner TypeScript compilation without helper functions
- **Better development experience**: Hot reloading and interactive testing with Storybook
- **Improved type safety**: Better TypeScript configuration for development
- **Modern tooling**: Latest Node.js and development dependencies

### 🎯 Development Workflow
```bash
# Start Storybook for interactive development
npm run storybook

# Build the component for production
npm run build

# Clean build artifacts
npm run clean
```

### ✨ New Features
- **Interactive development**: Real-time component testing with Storybook
- **Multiple story variations**: 7 different use cases for comprehensive testing
- **Professional controls**: Interactive prop adjustment during development
- **Living documentation**: Stories serve as both tests and documentation

### 🎨 Storybook Stories
- **Basic**: Simple single dataset visualization
- **Comparison**: Multiple dataset comparison with custom colors
- **Performance**: Server performance metrics with 3 datasets
- **ThreeDimensions**: Simple 3-axis chart demonstration
- **DarkTheme**: Dark theme with custom color scheme
- **CustomColors**: Custom color palette and styling
- **Minimal**: Minimal configuration without grid, labels, or legend

## [1.0.3] - 2025-07-03

### 🎯 Enhanced Value Display & Interaction
- **Fixed `showValues` functionality**: Now properly displays `maxValue` at the end of each spoke
- **Smart value positioning**: Max values are positioned under axis labels with intelligent vertical alignment
- **Interactive hover values**: Values appear as colored badges on the chart when hovering over legend items
- **Clean default state**: Removed default data point circles for cleaner visual appearance
- **Professional value badges**: Highlighted values appear as colored circles with white text for excellent readability

### 🎨 Legend & Label Improvements
- **Vertically centered legend**: Legend labels are now properly centered within the chart container
- **Enhanced hover effects**: Hover over legend items to see detailed value breakdowns on the chart
- **Improved visual feedback**: Better hover states and transitions for legend items
- **Smart label positioning**: Labels and max values use precise positioning with `dy` offsets for optimal spacing

### 🌟 Dataset Highlighting & Visual Hierarchy
- **Smart highlighting system**: When hovering over a dataset in the legend, other datasets become grayscale
- **Enhanced visual hierarchy**: Highlighted datasets maintain full color while others fade to grayscale with opacity
- **Smooth transitions**: All highlighting changes are animated for better user experience
- **Better color management**: Improved grayscale conversion algorithm for highlighting

### 📊 New Examples & Enhanced Documentation
- **3-Dimension Analysis**: Simple three-dimensional comparison showcasing basic radar chart usage
- **8-Dimension Assessment**: Comprehensive evaluation with eight different criteria
- **Enhanced existing examples**: Updated all examples to showcase new features like hover effects and maxValue display
- **Improved control labels**: Updated UI controls to better reflect new functionality

### 🔧 Technical Improvements
- **Better positioning calculations**: Implemented precise `dy` offset positioning for labels and values
- **Enhanced state management**: Added hover state tracking for better interactivity
- **Improved grid visibility**: Darkened grid lines for better reference and readability
- **Optimized rendering**: More efficient updates when hovering over legend items
- **Consistent positioning logic**: Labels and max values use consistent base positioning with smart offsets

### 🎯 API Enhancements
```typescript
// New hover functionality automatically works when showValues is true
<R8R 
  data={data}
  chart={chart}
  showValues={true}  // Enables interactive value display on hover
  showLegend={true}
/>
```

### ✨ New Features
- **MaxValue display**: Shows the maximum possible value at the end of each spoke with smart positioning
- **Interactive value badges**: Colored circles with white text appear on chart when hovering legend items
- **Dataset highlighting**: Visual emphasis on selected datasets with grayscale effect for others
- **Vertical legend centering**: Better visual balance in the chart layout
- **Precise label positioning**: Intelligent positioning system using `dy` offsets for optimal readability
- **Enhanced grid visibility**: Darker grid lines for better chart reference
- **Clean default appearance**: Removed visual clutter while maintaining full functionality

### 🎨 Visual Design Improvements
- **Professional value badges**: 12px radius colored circles with white, bold text
- **Better typography**: Larger, bolder max values (14px, weight 700) with consistent label sizing
- **Improved spacing**: 15px `dy` offsets provide optimal separation between labels and values
- **Enhanced contrast**: White text on colored backgrounds ensures excellent readability
- **Smooth animations**: All interactive elements have smooth transitions for better UX

## [1.0.2] - 2025-07-03

### 🚀 Major API Improvements
- **Refactored API for better usability**: Removed `customTheme` object in favor of direct theme properties
- **Replaced `primaryColor`/`secondaryColor` with `colors` array**: Now supports arbitrary number of datasets with flexible color assignment
- **Added `legendTitle` prop**: Optional legend header that can be customized or hidden (defaults to empty string)

### 🎨 Enhanced User Experience
- **Improved legend design**: Removed checkboxes in favor of clean visual active/inactive states
- **Interactive demo controls**: Added comprehensive configuration panels for real-time experimentation
- **Number inputs instead of sliders**: Better precision for width, height, and animation duration controls
- **Simplified form layout**: Single control panel per chart example for cleaner interface

### 🔧 Technical Improvements
- **Better TypeScript support**: Direct prop types instead of nested objects
- **Default color palette**: 10 carefully chosen colors that cycle automatically for multiple datasets
- **Enhanced theme system**: Direct property overrides with fallback to theme defaults
- **Improved animation system**: Better transition handling and visual feedback

### 📚 Documentation & Examples
- **Updated all examples**: Reflect new API structure with `colors` array and direct theme properties
- **Interactive demo**: Real-time configuration testing with immediate visual feedback
- **Comprehensive code examples**: Show various use cases from basic to advanced configurations

### 🎯 API Changes
```typescript
// Before (1.0.1)
<R8R 
  theme="dark" 
  customTheme={{ backgroundColor: "#222" }}
  primaryColor="#3b82f6"
  secondaryColor="#ef4444"
/>

// After (1.0.2)
<R8R 
  theme="dark"
  backgroundColor="#222"
  colors={['#3b82f6', '#ef4444', '#10b981']}
  legendTitle="Datasets"
/>
```

### ✨ New Features
- **Multiple dataset support**: Unlimited datasets with automatic color cycling
- **Flexible legend titles**: Customize or hide legend headers
- **Direct theme overrides**: Override any theme property directly as props
- **Enhanced color system**: Individual dataset colors or global color array

## [1.0.1] - 2025-07-03

### 🎉 Initial Release
- **Core radar chart functionality**: Basic single and dual dataset visualization
- **Theme system**: Light and dark themes with custom overrides
- **Interactive legend**: Toggle datasets on/off with checkboxes
- **Customizable styling**: Colors, dimensions, and display options
- **TypeScript support**: Full type definitions and interfaces
- **Zero dependencies**: Pure React implementation with no external chart libraries

### 📦 Features
- Multiple dataset comparison
- Custom themes and colors
- Interactive legend with dataset toggling
- Grid lines and axis labels
- Data point values display
- Animation support
- Responsive design
- Comprehensive TypeScript types

---

## Versioning

This project follows [Semantic Versioning](https://semver.org/). For the versions available, see the [tags on this repository](https://github.com/v1labs/r8r/tags). 