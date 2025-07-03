# Changelog

All notable changes to R8R will be documented in this file.

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