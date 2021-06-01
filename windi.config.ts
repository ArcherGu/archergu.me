import { defineConfig } from 'windicss/helpers';
import typography from 'windicss/plugin/typography';

export default defineConfig({
    extract: {
        include: [
            'index.html',
            'pages/**/*.md',
            'src/**/*.{vue,ts}',
        ],
    },
    darkMode: 'class',
    plugins: [
        typography(),
    ],
    theme: {
        extend: {
            typography: {
                DEFAULT: {
                    css: [{
                        color: 'var(--fg)',
                        a: {
                            color: 'var(--fg-deeper)',
                            textDecoration: 'none',
                        },
                        b: { color: 'var(--fg-deep)' },
                        code: { color: 'var(--fg-deep)' },
                        strong: { color: 'var(--fg-deep)' },
                        em: { color: 'inherit' },
                        h1: { color: 'var(--fg-deeper)', 'font-weight': 600 },
                        h2: { color: 'var(--fg-deep)' },
                        h3: { color: 'inherit' },
                        h4: { color: 'inherit' },
                        blockquote: { color: 'inherit' },
                    }],
                },
            },
        },
    },
});
