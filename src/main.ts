import 'windi.css';
import './styles/index.postcss';
import App from './App.vue';
import routes from 'pages-generated';
import { ViteSSG } from 'vite-ssg';
import { RouterScrollBehavior } from 'vue-router';

const scrollBehavior: RouterScrollBehavior = (to, from, savedPosition) => {
    if (savedPosition)
        return savedPosition;
    else
        return { top: 0 };
};

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
    App,
    { routes, scrollBehavior },
    (ctx) => {
        Object.values(import.meta.globEager('./plugins/*.ts')).map(i => i.install?.(ctx));
    },
);