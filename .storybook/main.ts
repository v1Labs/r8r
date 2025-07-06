import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-webpack5-compiler-swc",
    "@storybook/addon-docs"
  ],
  "framework": {
    "name": "@storybook/react-webpack5",
    "options": {}
  },
  managerHead: (head) => `
    ${head}
    <style>
      .css-32o4gv { max-height: 40px !important; }
    </style>
  `
};

export default config;