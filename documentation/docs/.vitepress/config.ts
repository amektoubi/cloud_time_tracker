import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Cloud Time Tracker",
  description: "The Time Tracker system project aims to develop a centralized, cross-platform productivity application. The system functionality is derived from the 'Simple Time Tracker' Android application (acting as the functional baseline) but is re-architected to support a Local-First, Cloud-Sync environment",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config

    search: {
      provider: 'local'
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Specifications', link: '/specs/FRD' },
      { text: 'Docs', link: '/docs/api-examples.md' }
    ],

    sidebar: {
      '/specifications/': [
        {
          text: 'Specifications',
          items: [
            { text: 'Functional Requirements Document', link: 'specs/FRD' },
            { text: 'Design and Architecture Document', link: 'specs/DAD' },
          ]
        }],
      '/docs/': [
        {
          text: 'Docs',
          items: [
            {
              text: 'Runtime API Examples', link: 'docs/api-examples.md'
            },
          ]
        }]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/amektoubi/cloud_time_tracker' }
    ]
  }
})
