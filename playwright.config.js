// @ts-check

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
    retries: 1,
    use: {
        headless: false,
        viewport: { width: 1280, height: 720 },
        video: 'on-first-retry',
        trace: 'retain-on-failure'
    },
};

module.exports = config;