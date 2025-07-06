import type { Preview } from '@storybook/react-webpack5'
import v1labsTheme from './v1labsTheme'
import React from 'react'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    docs: {
      theme: v1labsTheme,
    },
    backgrounds: {
      default: 'light',
    },
    toolbar: {
      'storybook/background': { hidden: true },
      'storybook/viewport': { hidden: true },
      'storybook/measure': { hidden: true },
      'storybook/outline': { hidden: true },
      'storybook/grid': { hidden: true },
      'storybook/zoom': { hidden: true },
      'storybook/controls': { 
        hidden: false,
        position: 'right'
      },
    },
  },
  decorators: [
    (Story) => {
      // Add CSS override to remove padding from Storybook root
      if (typeof document !== 'undefined') {
        const style = document.createElement('style');
        style.textContent = '.sb-show-main.sb-main-centered #storybook-root { padding: 0 !important; }';
        document.head.appendChild(style);
      }
      
      return React.createElement(Story);
    },
  ],
};

export default preview;