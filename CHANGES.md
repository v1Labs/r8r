# Changelog

All notable changes to R8R will be documented in this file.

## [1.0.16] - 2025-08-03

### 🐛 Bug Fixes
- **Fixed footnotes text contrast**: Footnotes now use `legendTextColor` instead of `textColor` for better readability when using dark legend backgrounds with light text
- **Improved footnote button styling**: Active footnote buttons now use proper contrast colors that work well with the legend background
- **Enhanced highlighted footnote readability**: Active footnote buttons now use 15% transparent background with solid text and border for better contrast in all themes
- **Improved footnote visual hierarchy**: Inactive footnote labels now use 25% opacity (down from 50%) to make active footnotes stand out more prominently

### 🎨 Visual Improvements
- **Refined dataset opacity levels**: Reduced top dataset stroke opacity from 85% to 75% and fill opacity from 75% to 65% for more balanced visual hierarchy
- **Optimized axis label sizing**: Reduced highlighted axis label font size from 17px to 15px for better proportion and readability

## [1.0.15] - 2025-08-02

### 📝 Footnotes Feature
- **Interactive footnotes**: New `footnotes` prop allows adding clickable footnote labels below the chart
- **Footnote object structure**: Each footnote contains `label`, `note`, and `highlight` array properties
- **Dual highlighting system**: Footnotes can highlight both datasets and individual data points (axes)
- **Smart label detection**: Automatically distinguishes between dataset labels and data point labels
- **Data point highlighting**: Individual axes (like "Health", "Taste") can be highlighted across all datasets
- **Toggle functionality**: Clicking an active footnote deactivates it and restores original dataset states
- **Interaction clearing**: Clicking legend items or chart polygons clears active footnotes
- **Intuitive state management**: When footnotes are cleared, all datasets reset to active state (not previous state)
- **Consistent behavior**: Chart polygon clicks and legend clicks both clear footnotes for unified UX
- **Initial state control**: New `activeFootnote` prop sets which footnote is active on component load
- **Progressive disclosure**: Labels shown by default, notes revealed on click for cleaner interface
- **Persistent height**: Component maintains consistent height with customizable placeholder text
- **Visual hierarchy**: Labels use smaller font size (10px) to match legend styling
- **Opacity states**: Inactive labels show at 50% opacity for better visual hierarchy
- **Simplified note design**: Clean note display without background or borders, reduced padding
- **Customizable placeholder**: New `placeholder` prop for custom default text when no footnote is selected
- **Theme integration**: Footnotes use the same theme colors as the legend for consistent styling
- **State preservation**: Hidden datasets remain hidden when footnotes are applied
- **Smooth transitions**: All footnote interactions use smooth 200ms transitions
- **Flexible labeling**: Support for various label formats (e.g., "1.", "a.", "a vs b")
- **Complete implementation**: Full UI rendering with interactive styling and click handlers
- **Smart dataset reordering**: Highlighted datasets automatically move to the top of the polygon stack for better visibility
- **Visual hierarchy enhancement**: Reordering ensures highlighted datasets are always prominently displayed
- **Consistent reordering behavior**: Works for both manual footnote clicks and initial `activeFootnote` prop

### 🎯 Enhanced Dataset State Management
- **Footnote-driven highlighting**: Footnotes can highlight specific datasets while setting others to inactive
- **State restoration**: Clicking an active footnote restores all datasets to their original states
- **Hidden state preservation**: Datasets marked as hidden remain hidden regardless of footnote interactions
- **Improved user control**: Users can quickly focus on specific data insights through footnote interactions
- **Automatic dataset prioritization**: Highlighted datasets are automatically brought to the front for optimal visibility

## [1.0.14] - 2025-08-01

### 🎯 Enhanced Dataset Visual Hierarchy
- **Two-tier opacity system**: Top dataset stands out with 95% stroke opacity and 85% fill opacity, all others use 45% stroke and 35% fill opacity
- **Simplified visual hierarchy**: Clear distinction between the most important dataset and supporting datasets without excessive transparency
- **Position-based calculation**: Opacity is calculated based on dataset position in the polygon order (top = highest opacity)
- **Balanced visibility**: All datasets remain clearly visible while maintaining focus on the primary dataset
- **State-based opacity behavior**: Active datasets use calculated stroke opacity with 0% fill (outline only), highlighted datasets use calculated stroke and fill opacity
- **Dynamic reordering**: Opacity automatically updates when datasets are reordered via legend clicks
- **Improved data focus**: Makes it easier to identify and focus on the most important dataset without losing visibility of others

### 🎯 Enhanced Axis Label Interaction
- **Hover to reveal details**: Hovering over axis labels reveals intersection lines, numbers, and axis overlay
- **Click to pin details**: Clicking an axis label toggles its `highlighted` state in the chart configuration
- **Multiple persistent axes**: Multiple axes can be highlighted simultaneously for comprehensive analysis
- **Multiple axis overlays**: All highlighted axes show their intersection lines, numbers, and axis overlays simultaneously
- **Flicker-free interaction**: Hover effects are disabled for already highlighted axes to prevent visual flickering
- **Visual highlighting indicator**: Highlighted axis labels increase font size from 11px to 17px for clear visual feedback
- **Configuration-based state**: Axis highlighting is stored in the chart configuration with optional `highlighted` field (defaults to `false` when not specified)
- **Parent component control**: New `onChartChange` callback allows parent components to handle chart state updates
- **Internal state management**: When `onChartChange` is not provided, the component manages highlighting state internally
- **Smooth transitions**: All detail visibility changes use smooth 200ms transitions
- **Improved UX**: Users can pin multiple important axes for reference while exploring the chart

### 🎯 Enhanced Intersection Label Readability
- **Rotated number alignment**: Intersection numbers rotate to align with their corresponding dash lines for better visual association
- **Smart text orientation**: Numbers below the chart center automatically rotate 180 degrees to remain readable
- **Optimized spacing**: Increased distance from 15px to 18px between dash lines and numbers for better visual separation
- **Dynamic text anchoring**: Text anchor adjusts based on position (start/end) to ensure proper alignment with dash direction
- **Clean visual hierarchy**: Numbers flow naturally with dash lines instead of being perpendicular, eliminating clash with axis labels
- **Professional appearance**: Rotated numbers create a more organized and intuitive reading experience
- **Position-aware rendering**: Each intersection number is positioned and oriented based on its specific location on the chart

## [1.0.13] - 2025-07-27

### 🎯 Enhanced Dataset State Management
- **Improved inactive state behavior**: Inactive datasets are now completely hidden from the chart instead of showing as gray lines
- **Cleaner visual focus**: Only active and highlighted datasets are rendered on the chart for better data focus
- **Simplified state logic**: Removed complex grayscale conversion and opacity calculations for inactive datasets
- **Better user experience**: Clicking legend items now toggles between completely hidden (inactive) and visible (active) states
- **Consistent legend behavior**: Legend still shows all datasets with appropriate styling, but inactive datasets don't appear on the chart
- **Streamlined rendering**: Active datasets show as outlines only, highlighted datasets show as outlines with fill
- **Reduced visual clutter**: Eliminates distracting gray lines that made it harder to focus on active datasets

### 🎨 Enhanced Retro Theme
- **Vibrant color palette**: Updated with bright oranges, reds, yellows, teals, and blues for maximum visual impact
- **Dark brown legend**: Rich dark brown legend background (`#5d4e37`) with light cream text (`#f5f1e8`) for excellent contrast
- **Earthy background**: Light cream background (`#f5f1e8`) for a warm, vintage feel
- **Brown accents**: Brown grid lines (`#8b7355`) and borders for authentic retro styling
- **Improved visibility**: Darker yellow colors for better readability on the light background
- **Theme-aware colors**: Automatically uses vibrant retro colors when theme is set to 'retro'
- **Storybook integration**: Updated RetroTheme story with enhanced color scheme
- **Perfect for vintage use cases**: Ideal for retro-themed dashboards, vintage presentations, or nostalgic data visualizations

### 🎯 Enhanced Dataset Interaction
- **3-way toggle system**: Clicking legend items or chart polygons now cycles through inactive → active → highlighted → inactive
- **Removed hover highlighting**: Eliminated hover-based highlighting in favor of explicit click-based control
- **Better user control**: Users can now precisely control dataset states through simple clicks
- **Simplified interaction model**: No more confusion between hover and click behaviors
- **Consistent behavior**: Both legend items and chart polygons use the same 3-way toggle logic
- **Improved accessibility**: Clear, predictable interaction pattern that works well on both desktop and mobile
- **Enhanced user experience**: Users can easily cycle through states to find the perfect visualization combination

### 🎯 Bring to Front Legend Reordering
- **Click to bring to front**: Click any legend label to bring its polygon to the top of the chart
- **Labels stay in place**: No visual confusion from moving labels around
- **Polygon stacking control**: Separate polygon order state controls SVG rendering order
- **Immediate feedback**: Polygon moves to front instantly when label is clicked
- **State preservation**: Dataset states (inactive/active/highlighted) are preserved during reordering
- **Color preservation**: Dataset colors are preserved with their associated polygons
- **Simple interaction**: No complex drag and drop, just direct click-to-front behavior
- **Zero dependencies**: Pure React implementation using state management
- **Cross-platform support**: Works seamlessly on desktop (mouse) and mobile (touch) devices
- **Clean codebase**: Removed all drag and drop related code for simpler maintenance

## [1.0.12] - 2025-07-26

### 🧹 Icon Functionality Removal
- **Removed icon system**: Eliminated the icon functionality from chart dimensions to simplify the component
- **Removed Icons.tsx**: Deleted the dedicated Icons component file containing SVG icon definitions
- **Simplified DataPoint interface**: Removed `icon` field from DataPoint interface for cleaner API
- **Removed iconSize prop**: Eliminated the `iconSize` prop from R8RProps interface
- **Cleaned up rendering logic**: Removed icon rendering code and `renderIcon` helper function
- **Updated stories**: Removed WithIcons story and icon-related chart examples from Storybook
- **Updated documentation**: Removed all icon-related references from README.md
- **Streamlined codebase**: Reduced complexity by removing icon positioning and styling logic
- **Better focus**: Component now focuses on core radar chart functionality without visual distractions

### 🦄 Unicorn Theme Addition
- **New unicorn theme**: Added magical purple/pink gradient theme with bright, vibrant colors
- **Soft pink background**: Light pink background (`#fdf2f8`) for a gentle, whimsical feel
- **Purple accents**: Purple grid lines (`#e9d5ff`) and borders (`#c084fc`) for magical touch
- **Vibrant text**: Deep purple text (`#581c87`) for excellent readability and contrast
- **Optimized color palette**: Special unicorn colors array with purple, pink, amber, and emerald tones
- **Theme-aware colors**: Automatically uses unicorn colors when theme is set to 'unicorn'
- **Storybook integration**: Added UnicornTheme story with magical legend title
- **Documentation updates**: Updated README with unicorn theme examples and features
- **Perfect for creative use cases**: Ideal for fun, whimsical, or creative data visualizations

### 🎨 Enhanced Background Support
- **Full CSS background support**: `backgroundColor` and `legendBackgroundColor` now support any valid CSS background value
- **Gradient support**: Linear gradients, radial gradients, and complex gradient patterns
- **Image backgrounds**: Support for background images with `url()` syntax
- **Multiple backgrounds**: Complex background combinations with multiple layers
- **Updated property names**: Changed from `backgroundColor` CSS property to `background` for full compatibility
- **Enhanced documentation**: Updated prop descriptions and README with gradient examples
- **Flexible styling**: Users can now create sophisticated visual designs with gradients and patterns

### 🎨 Legend Text Color Support
- **New legendTextColor prop**: Added `legendTextColor` property for independent legend text styling
- **Smart fallback**: Falls back to `textColor` when `legendTextColor` is not provided
- **Theme integration**: Supports both theme defaults and custom overrides
- **Enhanced flexibility**: Perfect for themes with dark legends and light backgrounds
- **Updated documentation**: Added prop documentation and usage examples
- **Backward compatibility**: Existing themes continue to work without changes

### 🎨 SVG Linear Gradient API for Dataset Colors
- **New Gradient interface**: Added `Gradient` type with `type`, `from`, `to`, and `angle` properties
- **ColorOrGradient type**: Union type supporting both strings (solid colors) and gradient objects
- **SVG linear gradient support**: Proper SVG `<linearGradient>` definitions with unique IDs for dataset polygons
- **Chart-centered gradients**: Linear gradients are oriented from the chart center to each polygon for intuitive magnitude visualization
- **Dynamic gradient positioning**: Calculates gradient direction from chart center to polygon center, with optional user angle offset
- **Dataset color processing**: Updated color processing to handle gradients for dataset polygons
- **Legend color handling**: Legend indicators use the `from` color of gradients (since they're rendered with HTML/CSS)
- **Theme integration**: Updated unicorn theme colors array to include gradient examples
- **Backward compatibility**: String values still work for solid colors
- **Enhanced documentation**: Added comprehensive gradient API documentation and examples

### 🎨 Data Border Radius
- **New dataBorderRadius prop**: Added support for rounded corners on dataset polygons
- **SVG path generation**: Dynamic path creation with smooth rounded corners using quadratic Bézier curves
- **Bidirectional radius**: Positive values create convex (outward bulging) shapes, negative values create concave (inward curving) shapes
- **Geometric center line analysis**: For 4+ data points with positive radius, uses adjacent point relationships to prevent awkward bulging
- **Conservative bulge constraint**: Maximum bulge limited to half the minimum distance between points and their geometric center lines
- **Adaptive scaling**: For negative radius or < 4 points, uses center-based adaptive scaling for consistent behavior
- **Softened design**: Creates a more modern, softer visual appearance with geometrically sound curves
- **Backward compatibility**: Defaults to 0 (sharp corners) for existing implementations

## [1.0.11] - 2025-07-21

### 🎯 Progressive Disclosure Feature
- **Axis label interaction**: Hover or long press on axis labels to reveal detailed range information
- **Intersection lines**: Tiny perpendicular lines appear at grid intersections (0%, 20%, 40%, 60%, 80%, 100%) when an axis is highlighted
- **Number labels**: Each intersection shows the actual value based on the dimension's maxValue
- **Axis overlay**: Highlighted axis gets a matching overlay line for better visual emphasis
- **Smooth animations**: Non-jarring 200ms transitions for all progressive disclosure elements
- **Cross-platform support**: Works on desktop (hover) and mobile (long press) devices
- **Clean design**: Short intersection lines (10px) only on the right side of the axis for minimal visual clutter
- **Proper layering**: All intersection elements render on top of the radar chart for clear visibility

### 🎨 Icon Support for Chart Dimensions
- **Flexible icon system**: Support for both React components and SVG strings as dimension icons
- **Responsive sizing**: Icons automatically scale based on the `iconSize` prop (16-36px range)
- **Dynamic positioning**: Icons positioned proportionally to their size (20px + iconSize/2 from axis)
- **Theme integration**: Icons respect the current theme colors and styling
- **Smart color handling**: Automatically replaces `currentColor` with theme text color
- **Rotated label support**: Icons work seamlessly with rotated axis labels
- **Storybook controls**: Interactive icon size testing with safety limits
- **SVG optimization**: Proper regex handling to avoid conflicts with stroke-width attributes
## [1.0.10] - 2025-07-20

### 🎨 Design Cleanup
- **Removed max value labels**: Eliminated the repetitive max value labels (typically "100") from the chart axes to create a cleaner, more focused design
- **Improved visual hierarchy**: Chart now emphasizes the data shapes and axis labels without visual clutter from redundant max values
- **Enhanced readability**: Cleaner design allows users to focus on the actual data patterns and comparisons
- **Future-ready**: Design now prepared for progressive disclosure of max value information through alternative UI patterns
- **Simplified label positioning**: Removed unnecessary vertical offsets from axis labels since max value labels are no longer present
- **Removed deprecated showValues prop**: Eliminated the unused `showValues` prop from the component interface and all story configurations

### 🚀 Core Functionality Focus
- **Removed play functionality**: Eliminated the experimental play button and timeline slider features to focus on core radar chart functionality
- **Simplified component API**: Removed `showPlayButton`, `showTimeline`, and `playSpeed` props from the component interface
- **Cleaner codebase**: Eliminated complex play sequence logic, state management, and UI controls
- **Reduced bundle size**: Removed unused play-related code and dependencies
- **Streamlined stories**: Updated Storybook stories to remove play functionality demonstrations

### 🎯 Simplified Value Display
- **Removed value bubbles**: Eliminated the distracting value bubbles that appeared when datasets were highlighted
- **Cleaner visual design**: Chart now focuses on data shapes and patterns without visual clutter from value overlays
- **Simplified state management**: Removed `showNumbers` field from Dataset interface and related state logic
- **Streamlined interactions**: Simplified mouse enter/leave handlers to focus on core functionality
- **Future-ready**: Design now prepared for implementing alternative value display methods

### 🎯 Core Functionality Focus
- **Removed spark layout**: Eliminated the `showSparkLayout` prop and grid layout functionality to focus on main radar chart use case
- **Simplified component API**: Removed spark chart rendering, grid calculations, and mini chart logic
- **Cleaner codebase**: Eliminated complex spark layout calculations and dedicated spark chart functions
- **Reduced bundle size**: Removed unused spark layout code and dependencies
- **Streamlined stories**: Updated Storybook stories to remove spark layout demonstrations

### 🎨 Enhanced Data Highlighting
- **Three-state system**: Implemented active, inactive, and highlighted states for datasets
- **Dual highlighting methods**: Hover (desktop) and long press (mobile) both highlight datasets
- **Cross-platform compatibility**: Works seamlessly on both desktop (mouse) and mobile (touch) devices
- **Chart polygon interaction**: Hover over chart polygons to highlight associated datasets
- **Smart highlighting**: Only active datasets can be highlighted, with 100% fill opacity
- **Exclusive highlighting**: Only one dataset can be highlighted at a time
- **Dynamic fill opacity**: Non-highlighted datasets have 0% fill opacity when any dataset is highlighted
- **Improved visual hierarchy**: Clear distinction between active, inactive, and highlighted states
- **Color consistency**: Highlighted datasets maintain their original colors (not grayscale)
- **Enhanced legend styling**: Highlighted datasets have stronger background color (40% vs 20%) with consistent 1px borders to prevent layout shifts
- **Layered rendering**: Highlighted datasets appear above other datasets for better visibility
- **Optimal opacity**: Highlighted datasets use 75% opacity for balanced visibility without being too dark
- **Touch-friendly interaction**: Prevents text selection during long press with proper touch event handling
- **Visual feedback**: Active polygons show pointer cursor to indicate interactivity

### 📏 Improved Legend Layout
- **Wider side legend**: Increased legend width from 120px to 160px when displayed on the side
- **Better label accommodation**: More space for longer dataset labels and legend titles
- **Enhanced padding**: Increased legend padding from 32px to 40px for better visual separation
- **Improved readability**: Longer labels no longer get cut off or require text truncation

## [1.0.9] - 2025-07-11

### 🎯 Spark Layout Feature
- **New layout option**: Added `showSparkLayout` prop (defaults to false) for displaying mini radar charts in a grid
- **Smart grid sizing**: Uses 2x2 grid for exactly 4 datasets, 3x3 grid for other cases (up to 9 charts)
- **Individual chart display**: Each dataset gets its own mini radar chart with simplified styling
- **Compact visualization**: Perfect for comparing multiple datasets at a glance
- **Responsive design**: Grid automatically adapts to container width with proper spacing
- **Clean labeling**: Each spark chart displays its dataset label above the chart for clear identification
- **Enhanced grid lines**: More prominent grid lines and axis lines for better visibility
- **Interactive tooltips**: Hover over spark charts to see dataset labels and values
- **Theme integration**: Spark charts use the same theme colors as the main chart
- **Optimized spacing**: 4px gaps between charts with 8px padding for maximum chart size
- **Tight labeling**: Labels positioned very close to charts for immediate association

### 🎨 Visual Design
- **Mini chart styling**: Spark charts use smaller radius (60% of available space) for better proportions
- **Enhanced visibility**: More prominent grid lines (strokeWidth: 1, opacity: 0.6) and axis lines for better readability
- **Direct labeling**: Dataset labels positioned above each spark chart for immediate identification
- **Enhanced tooltips**: Custom tooltips with bold labels and regular values for better readability
- **Consistent theming**: Spark charts inherit all theme colors and styling from the main component
- **Responsive sizing**: Chart size automatically calculated based on container width and grid constraints
- **2x2 grid optimization**: Special handling for exactly 4 datasets with optimal 2x2 layout

### 🔧 Technical Implementation
- **Conditional rendering**: Component switches between spark layout and regular layout based on prop
- **Smart grid sizing**: Dynamic grid size calculation (2x2 for 4 datasets, 3x3 for others)
- **Simplified layout**: Clean grid layout without legend for better data association
- **Spark chart generation**: Dedicated functions for calculating spark chart points and elements
- **Custom tooltip system**: Dependency-free tooltip implementation with smart positioning and edge detection
- **Performance optimization**: Spark layout uses simplified calculations and rendering for better performance
- **Backward compatibility**: Existing functionality preserved when `showSparkLayout` is false

### 🎯 API Changes
```typescript
interface R8RProps {
  // ... existing props ...
  showSparkLayout?: boolean;  // New: Show mini radar charts in grid layout
}

// Example usage with spark layout
<R8R 
  data={multipleDatasets}
  chart={chartStructure}
  showSparkLayout={true}
  width={600}
  legendTitle="Dataset Comparison"
/>
```

### ✨ New Features
- **Grid visualization**: Display multiple datasets as individual mini charts
- **Quick comparison**: Easily compare multiple datasets at a glance
- **Space efficient**: Compact layout for showing many datasets simultaneously
- **Simplified charts**: Clean, minimal radar charts for quick data scanning
- **Responsive grid**: Automatically adapts to different screen sizes
- **Theme consistency**: Maintains visual consistency with existing themes

## [1.0.8] - 2025-07-06

### 🚀 Vercel Deployment Setup
- **Vercel configuration**: Added `vercel.json` for seamless Storybook deployment to Vercel
- **Build optimization**: Configured build commands and output directory for Vercel compatibility
- **Demo site**: Storybook now deployed at [https://r8r.v1labs.com/](https://r8r.v1labs.com/)
- **Local testing**: Added `serve-storybook` script for testing built Storybook locally
- **Zero-config deployment**: Automatic deployment on git push with Vercel integration
- **Static site generation**: Storybook builds as static site for optimal performance

### 🔧 Technical Improvements
- **Vercel framework detection**: Set framework to null for standalone Storybook deployment
- **Build command specification**: Explicit build and dev commands for Vercel
- **Output directory configuration**: Points to `./storybook-static` for Vercel serving
- **Development workflow**: Maintained existing Storybook development experience

## [1.0.7] - 2025-07-05

### 🎬 Interactive Play Functionality
- **New play button**: Added `showPlayButton` prop (defaults to false) for animated data sequence playback
- **Timeline slider**: Added `showTimeline` prop (defaults to false) for manual data exploration
- **Configurable play speed**: Added `playSpeed` prop (defaults to 1000ms) to control animation timing
- **Time-series visualization**: Perfect for showing data progression over time (e.g., monthly KPIs)
- **Sequential data reveal**: Play button animates through datasets in order with smooth transitions
- **Manual timeline control**: Slider allows users to jump to any point in the data sequence
- **Smart state management**: Datasets automatically transition between hidden, inactive, and active states
- **Centered controls**: Play button and timeline are positioned directly below the radar chart

### 🎯 Play Sequence Behavior
- **Initial state**: All datasets start hidden when play begins
- **Step-by-step reveal**: Each dataset becomes active with numbers visible for the configured duration
- **Previous step handling**: Previous datasets become inactive (grayscale) when next step begins
- **Final state**: Last dataset remains active with numbers visible after sequence completes
- **Pause/resume**: Play button toggles between play and pause states
- **Timeline sync**: Manual timeline changes automatically stop any running play sequence

### 🎨 Visual Design
- **Professional controls**: Styled play button with play/pause icons and hover effects
- **Responsive timeline**: Slider with gradient fill showing progress through the sequence
- **Step indicators**: Timeline shows current step label and step count
- **Theme integration**: Controls use the same theme colors as the chart
- **Smooth animations**: All state transitions are animated for better user experience

### 🔧 Technical Implementation
- **State management**: New state variables for play status, current step, and animation timing
- **Timeout handling**: Proper cleanup of animation timeouts to prevent memory leaks
- **Event handling**: Click handlers for play button and change handlers for timeline slider
- **Layout updates**: Container height automatically adjusts when controls are enabled
- **Mobile compatibility**: Controls work seamlessly with existing responsive design

### 🎯 API Changes
```typescript
interface R8RProps {
  // ... existing props ...
  showPlayButton?: boolean;  // New: Show play button for animated sequence
  showTimeline?: boolean;    // New: Show timeline slider for manual control
  playSpeed?: number;        // New: Animation speed in milliseconds (default: 1000)
}

// Example usage with play functionality
<R8R 
  data={monthlyKpiData}
  chart={kpiChart}
  showPlayButton={true}
  showTimeline={true}
  playSpeed={1500}
  legendTitle="Monthly KPIs"
/>
```

### ✨ New Features
- **Time-series visualization**: Perfect for showing data progression over time
- **Interactive playback**: Click play to animate through datasets sequentially
- **Manual exploration**: Use timeline slider to jump to any point in the sequence
- **Configurable timing**: Adjust play speed to match presentation needs
- **Professional controls**: Clean, intuitive interface for data exploration
- **Seamless integration**: Works with all existing chart features and themes

### 📊 Use Cases
- **Monthly KPI tracking**: Show how metrics improve over time
- **Product development**: Visualize feature progress across different phases
- **Performance monitoring**: Track system performance changes
- **A/B testing results**: Compare different test phases
- **Project milestones**: Show progress through different project stages

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