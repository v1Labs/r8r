# Changelog

All notable changes to R8R will be documented in this file.

## [1.0.3] - 2025-01-27

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