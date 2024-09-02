import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

import { defineConfig } from 'cypress';

const cypressJsonConfig = {
  // chromeWebSecurity: false,
  experimentalStudio: true,
  screenshotsFolder: '../../dist/cypress/apps/fever-app-e2e/screenshots',
  video: true,
  videosFolder: '../../dist/cypress/apps/fever-app-e2e/videos',
  viewportHeight: 1200,
  viewportWidth: 1600,
};
export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      webServerCommands: {
        default: 'npx nx run fever-app:serve',
        production: 'npx nx run fever-app:serve-static',
      },
      ciWebServerCommand: 'npx nx run fever-app:serve-static',
      ciBaseUrl: 'http://localhost:4200',
    }),
    ...cypressJsonConfig,
    baseUrl: 'http://localhost:4200',
  },
});
