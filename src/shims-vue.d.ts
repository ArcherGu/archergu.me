declare module '*.vue' {
    import { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

declare module '*.md' {
    import { ComponentOptions } from 'vue';
    const component: ComponentOptions;
    export default component;
}

declare interface Window {
    // extend the window
}
