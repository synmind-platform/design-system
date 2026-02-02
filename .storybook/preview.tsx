import type { Preview } from '@storybook/react';
import '../src/index.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#FAFAF9' },
        { name: 'dark', value: '#1C1917' },
      ],
    },
  },
  decorators: [
    (Story, context) => {
      const isDark = context.globals.backgrounds?.value === '#1C1917';
      return (
        <div className={isDark ? 'dark' : ''}>
          <div className="p-4 bg-background text-foreground min-h-screen">
            <Story />
          </div>
        </div>
      );
    },
  ],
};

export default preview;
