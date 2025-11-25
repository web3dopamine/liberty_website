import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Liberty Bitcoin Documentation',
  tagline: 'The Next Chapter of Bitcoin - Gas-Free EVM Chain on SKALE',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://libertybitcoin.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/docs/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'liberty-bitcoin', // Usually your GitHub org/user name.
  projectName: 'liberty-docs', // Usually your repo name.

  onBrokenLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          editUrl: 'https://github.com/liberty-bitcoin/docs/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/liberty-social-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Liberty Bitcoin',
      logo: {
        alt: 'Liberty Bitcoin Logo',
        src: 'img/liberty-logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://libertybitcoin.com',
          label: 'Main Site',
          position: 'right',
        },
        {
          href: 'https://github.com/liberty-bitcoin',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/intro',
            },
            {
              label: 'For Users',
              to: '/category/for-users',
            },
            {
              label: 'For Developers',
              to: '/category/for-developers',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Telegram',
              href: 'https://t.me/libertybitcoin',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/libertybitcoin',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/libertybitcoin',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Website',
              href: 'https://libertybitcoin.com',
            },
            {
              label: 'Token Auction',
              href: 'https://libertybitcoin.com/auction',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/liberty-bitcoin',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Liberty Bitcoin. The Next Chapter of Bitcoin.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['solidity', 'bash', 'json', 'typescript'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
