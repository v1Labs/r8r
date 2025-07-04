import type { Preview } from '@storybook/react-webpack5'
import React from 'react'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
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