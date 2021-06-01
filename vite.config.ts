import { resolve } from 'path';
import fs from 'fs-extra';
import { defineConfig } from 'vite';
import ViteVue from '@vitejs/plugin-vue';
import VitePages from 'vite-plugin-pages';
import ViteMarkdown from 'vite-plugin-md';
import ViteComponents from 'vite-plugin-components';
import ViteIcons, { ViteIconsResolver } from 'vite-plugin-icons';
import ViteWindiCSS from 'vite-plugin-windicss';
import matter from 'gray-matter';
import Prism from 'markdown-it-prism';
import anchor from 'markdown-it-anchor';
import markdownAttr from 'markdown-it-link-attributes';
import { slugify } from './scripts/slugify';

export default defineConfig({
    server: {
        host: '0.0.0.0'
    },
    resolve: {
        alias: {
            '@/': `${resolve(__dirname, 'src')}/`,
        },
    },
    plugins: [
        ViteVue({
            include: [/\.vue$/, /\.md$/],
        }),

        VitePages({
            extensions: ['vue', 'md'],
            pagesDir: 'pages',
            extendRoute(route) {
                const path = resolve(__dirname, route.component.slice(1));

                if (!path.includes('projects.md')) {
                    const md = fs.readFileSync(path, 'utf-8');
                    const { data } = matter(md);
                    route.meta = Object.assign(route.meta || {}, { frontmatter: data });
                }

                return route;
            },
        }),

        ViteMarkdown({
            wrapperComponent: 'post',
            wrapperClasses: 'prose m-auto',
            headEnabled: true,
            markdownItOptions: {
                quotes: '""\'\'',
            },
            markdownItSetup(md) {
                md.use(Prism);
                md.use(anchor, {
                    slugify,
                    permalink: true,
                    permalinkBefore: true,
                    permalinkSymbol: '#',
                    permalinkAttrs: () => ({ 'aria-hidden': true }),
                });

                md.use(markdownAttr, {
                    pattern: /^https?:/,
                    attrs: {
                        target: '_blank',
                        rel: 'noopener',
                    },
                });
            },
        }),

        ViteComponents({
            extensions: ['vue', 'md'],
            customLoaderMatcher: path => path.endsWith('.md'),
            customComponentResolvers: ViteIconsResolver({
                componentPrefix: '',
            }),
        }),

        ViteIcons(),

        ViteWindiCSS({
            safelist: 'prose prose-sm m-auto'.split(' '),
            preflight: {
                enableAll: true,
            },
        }),
    ]
});
