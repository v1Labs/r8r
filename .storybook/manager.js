import { addons } from 'storybook/manager-api';
import v1labsTheme from './v1labsTheme';

// export const parameters = {
//   theme: v1labsTheme,
// }; 

addons.setConfig({
  theme: v1labsTheme,
});