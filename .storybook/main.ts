import type { StorybookConfig } from '@storybook/react-webpack5';
import v1labsTheme from './v1labsTheme';

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
    <script>
      // Configure v1Labs theme
      window.STORYBOOK_THEME = ${JSON.stringify(v1labsTheme)};
      
      // Update header link to v1Labs website
      function updateHeaderLink() {
        const selectors = [
          '[data-testid="sidebar-header"] a',
          '.sidebar-header a'
        ];
        
        selectors.forEach(selector => {
          const links = document.querySelectorAll(selector);
          links.forEach(link => {
            if (link instanceof HTMLAnchorElement) {
              link.href = '${v1labsTheme.brandUrl}';
              link.target = '${v1labsTheme.brandTarget}';
              link.title = '${v1labsTheme.brandTitle}';
            }
          });
        });
      }
      
      // Try to update immediately and on DOM changes
      updateHeaderLink();
      const observer = new MutationObserver(updateHeaderLink);
      observer.observe(document.body, { childList: true, subtree: true });
    </script>
    <style>
      .css-32o4gv { max-height: 40px !important; }
      
      /* v1Labs branding styles */
      [data-testid="sidebar-header"] a,
      .sidebar-header a {
        display: flex !important;
        align-items: center !important;
        text-decoration: none !important;
      }
      
      /* Inject v1Labs branding */
      [data-testid="sidebar-header"] a::before,
      .sidebar-header a::before {
        content: '';
        background-image: url('${v1labsTheme.brandImage}');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: left;
        height: 40px;
        width: 200px;
        display: inline-block;
        flex-shrink: 0;
      }
      
      [data-testid="sidebar-header"] a > *,
      .sidebar-header a > * {
        display: none !important;
      }
    </style>
  `
};

export default config;