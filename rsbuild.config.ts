import { defineConfig, rspack } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  tools: {
    rspack: {
      plugins: [new rspack.EnvironmentPlugin(['NODE_ENV', 'RELAY_URL', 'MANAGER_API_BASE_URL'])]
    }
  }
});
