---
title: ð ä¸ä¸è¶å± å¼åè¿ç¨ä¸­çæè·¯è½¬æ¢
date: 2022-03-4T08:00:00.000+00:00
tags: ['CSS', 'Canvas', 'ç»éªåäº«']
tagsColor: ['#1198cf', '#d85235', '#268785']
duration: 15min
---

<blockquote>
å°ä¸ä¸ªå°ç©å·åä¸¤éï¼ä¼æä¸äºä¸åçæ¶è·ã
</blockquote>

## èæ¯
<code>[ð ä¸ä¸è¶å±](https://teahouse.archergu.me/)</code> æ¯æå¨2022å¹´æäººè / åå®µèåå¤ç»æèå©å¶ä½çä¸ä¸ªå°ç©å·ãè¿ä¸ªç©æçä¸»è¦åè½å°±æ¯æ¨¡ä»¿å¸é¢ä¸çè¶é¥®ç¹ååºç¨ï¼ç¨æ·éè¿èªå·±éæ©è¶åºï¼éæçæ¹å¼æ¥ç»åèªå·±çè¶é¥®ï¼å½ç¶ï¼å®ä¸ä¼çæ­£çä¸ºä½ ä¸åè´­ä¹°è¶é¥®ï¼ä»ä»æ¯æåç»æä¸ä¸ªè¶é¥®çæ¨¡åå¹¶äº§çä¸å¼ å¾çç¨äºåäº«ã

å¶ä½è¿ä¸ªç©å·çå¨æºæ¯å ä¸ºæä»¬çäºå®å³å°åºçï¼èæèå©å¹³æ¶æåå¥¶è¶/æè¶çä¹ æ¯ï¼æ¾ç¶ï¼æå­æé´æ¯ä¸å»ºè®®å­å¦é¥®ç¨è¿äºè¶é¥®çï¼æä»¥ææ³éè¿è¿ä¸ªå°ç©å·æ¥æ»¡è¶³ä¸ä¸èå©é¿ä¹ç©ºèçå³è¾ (ðå¤§èç®å±)ï¼é¡ºä¾¿ä¹æ³å¸®å©ç°å¨çé½å¸ç½é¢ä»¬åå°è¿äºè¶é¥® (å¥¶è¶/æè¶/åå¡/èææ°´...) çæå¥ï¼æ¯ç«è¿äºåä¸è¶é¥®é½ä¸æ¯å¤ªå¥åº·ï¼é¿æé¥®ç¨è¯å®å¯¹èº«ä½ä¸å¥½åã

å®éä¸ï¼è¿ä¸ªç©å·æå¶ä½äºä¸¤æ¬¡ï¼ç¬¬ä¸æ¬¡æ¯éè¿ CSS æ¥è®¾è®¡è¶é¥®æ¨¡åçï¼ç¬¬äºæ¬¡åæ¯éè¿ Canvas æ¥ç»å¶è¶é¥®æ¨¡åãè¿å å¤©èå©ä¸´è¿çäº§ï¼æä»¬æåä½é¢å¾äº§ï¼è¶çå®å®è¿æ²¡åºçï¼å»é¢éåæ²¡æä»ä¹äºæï¼ææ³éè¿è¿ç¯ blog æ¥åäº«ä¸è¿ä¸ªç©å·è®¾è®¡å¶ä½ä¸¤æ¬¡çåå ã

## å¦ç±»è¶é¥®åºç¨
<code>ð ä¸ä¸è¶å±</code> è½ç¶æ¯ä¸ä¸ªæ¨¡ä»¿è¶é¥®ç¹åçåºç¨ï¼ä½æ¯å®åæäºä¸åï¼æ¨¡ä»¿ä»ä»æ¯ UI çå¸å±é¨åï¼åºç¨çå¤´é¨æ¯è¶é¥®åºéºçä¸äºåºæ¬ä¿¡æ¯ï¼ä¸»è¦æ¯åºéºçåç§°å logoï¼èæåæ·»äºä¸ä¸ª<code>å¤é/èªå</code>ç Switch æ¥åæ¢ä¸å¥ä¿ç®çè¯è¯­ï¼ä¹ç¨æ¥è¯´æè¿ä¸ªè¶é¥®åºç¨å¹¶ä¸ä¼çæ­£çè®©ä½ åå°è¿æ¯è¶ãä¸»ä½é¨åçå·¦ä¾§æ¯ä¸ä¸ªè¶åºéæ©ç Tabï¼ç¨äºåæ¢ä¸åçè¶åºãå³ä¾§åä¸å¸¸è§è¶é¥®åºç¨çäº§ååè¡¨ä¸åï¼ç±äºè¿æ¯ä¸ä¸ªæ¸¸ææ§è´¨çç©å·ï¼æä»¥æå¨è¿éæ¾ç½®çæ¯æ¬æçéç¹ââè¶é¥®æ¨¡åã

å·ä½çæä½æµç¨æ¯è¿æ ·çï¼ç¨æ·è¿å¥åï¼å¯ä»¥éè¿è¶åº Tab éæ©ä¸åçè¶åºï¼è¶é¥®æ¨¡åçæ¶²ä½ä¼éä¹åæ¢ï¼ä¸ºäºææçå¨ä¸äºï¼è¶æ¯ä¸­çæ¶²ä½æ¯ææµå¨ææç (æ¶²ä½é¡¶é¨ææ³¢æµªæµå¨å¨ç»)ï¼ä¸åçè¶åºé¤äºé¢è²éæåº¦çåºå«ï¼ä¹ä¼æä¸äºç¬¦åè¶åºçç»èä¸çåºå«ï¼æ¯å¦çº¢è¶/ç»¿è¶ä¼æä¸åçè¶å¶æ¼æµ®å¨æ¶²ä½ä¸­ï¼èææ°´åä¼ææ°æ³¡ä¸æµ®çå¨ç»ãç¨æ·éæ©å®è¶åºåå°±å¯ä»¥è¿å¥ DIY ç¯èã

DIY ç¯èä¸­ï¼å·¦ä¾§çè¶åº Tab ä¼æ¶ç¼©éèèµ·æ¥ï¼åèä»£ä¹çæ¯å æ ·æä»¬å¸¸è§çè¶é¥®éæï¼æ¯å¦çç æ¤°æä¹ç±»çãç¨æ·å¯ä»¥éæ©æèå»é¤è¿äºéæï¼æ¥æé èªå·±åæ¬¢çè¶é¥®ãå½ç¶ï¼è¿äºéæä¹ä¼å¨è¶åºæ¶²ä½ä¸­ä½ç°åºæ¥ï¼è¿æ¯ä¸ºäºçå¨çææï¼è¿äºéææå¤æå°é½æä¸äºå°å¨ç»ã

å®æéæéæ©åï¼æ¥å°æåçäº«ç¨ç¯èï¼å½ç¶ï¼è¿æ¯ä¸ä¸ªå°ç©å·ï¼ä¸ä¼ä¸ºä½ çæ­£çä¸åè¶é¥®å¦ï¼æä»¥å°±èªå·±èè¡¥ä¸å§ (ä¸ä¸è¶å±ï¼å³ä¸å»è¶é¥®åºéºï¼æå¥¶è¶ä¸ç¨ï½)ï¼è¿ä¸ªç¯èå¶å®ä¸»è¦æ¯çæä¸å¼ è¶é¥®æ¨¡åçå¾çç¨äºä¸è½½åäº«ï¼æ¯ç«è¶åææååä¹æ¯å§å¨ä»¬å¸¸åçäºæåãç¨æ·å¯ä»¥å¨æ­¤ç¯èéæ©ä¸ä¸ªéåçèæ¯é¢è²ï¼è®©å¾çæ´å æ¼äº®ã

![share](/images/teahouse.jpeg "teahouse-share")

æ´ä¸ªå°ç©å·çå¤§è´æµç¨å·®ä¸å¤å°±æ¯è¿æ ·ï¼ä½ å¯ä»¥æå®å½ä½ä¸ä¸ªè¶é¥®å¶ä½æ¨¡æå¨æ¥ç©ï¼å®çæ ¸å¿é¨åå°±æ¯è¶é¥®æ¨¡åï¼æ¯ç«ä½ çå¤§é¨åæä½é½æ¯ä½ç°å¨å®ä¸é¢ã

æ¥ä¸æ¥ææ³åä¸ä¸è¿ä¸ªå°ç©å·æå¶ä½ä¸¤æ¬¡çåå ï¼ä¸è¿å¨æ­¤ä¹åæéè¦åä»ç»ä¸ç¨å°çä¸äºææ¯æ ãé¦åæ¯å¼åæå»ºå·¥å·ï¼ä¾ç¶å¿«å°å¿å¨ç <vscode-icons-file-type-vite /> [Vite.js](https://vitejs.dev/) ãç¶åæ¯åç«¯æ¡æ¶ï¼ä¾ç¶æ¯æä»¬çæç <vscode-icons-file-type-vue /> [Vue.js](https://v3.vuejs.org/)ãä¸äºå¶ä»çæä»¶å·¥å·åå¯ä»¥çä¸ä¸é¡¹ç®ç <code>[æºç ](https://github.com/ArcherGu/archers-teahouse)</code>ï¼è¿éå°±ä¸è¿å¤ä»ç»äºã

## ç¬¬ä¸ççé®é¢

ç¬¬ä¸æ¬¡è®¾è®¡çæ¶åï¼æéç¨äº CSS æ¥å¶ä½è¿ä¸ªè¶é¥®æ¨¡åï¼æ¯ç«éè¿ä¸é¢çæµç¨æè¿°ï¼ä½ ä¹åºè¯¥è½å¤§æ¦ get å°è¿æ¯ä¸ä¸ªæ¯è¾ç®åçä¸è¥¿ï¼æ éæ¯ç»åºä¸æ¯è¶ï¼å ä¸äºéæï¼ç¶åå ä¸å°è®¸çå¨ç»ï¼ä»¥ç®å CSS çè½åæ¥è¯´è¿äºé½æ¯è¾å®¹æå®ç°çã

é¦åæ¯æå¤é¢çå®¹å¨ï¼æ¯å­ãä¸ä¸ªç©å½¢ï¼é«ä¸ç¹ï¼çªä¸ç¹ï¼å·ä½çå®½é«å¯ä»¥éè¿ vue3 ææ°ç <code>[v-bind() in css](https://vuejs.org/api/sfc-css-features.html#v-bind-in-css)</code> ç»å®å°æ ·å¼ä¸­ï¼è¿æ ·å°±å¯ä»¥æä¾ä¸ä¸ªæ¯å­å°ºå¯¸éæ©çåè½äºãåå ä¸ªç¥å¸¦ç°è²çéæè¾¹æ¡ï¼é¡¶é¨èä¸ç¹ï¼åºé¨åä¸ç¹ãæåç»è¿ä¸ªæ¯å­å ä¸ª transform ç perspective éè§ææï¼ç»çxè½´ç¨å¾®æè½¬ä¸ç¹ï¼å°±å¯ä»¥ååºæ¯å­ä¸å¤§ä¸å°çææäºãå½ç¶ï¼ç»æ¯å­çå¤é¢å ä¸ä¸ª relative çç¶åç´ ï¼ä½ä¸ºåé¨åç´ ç»å¯¹å®ä½çåºåºã
```css
.cup {
    width: v-bind(cupWidth);
    height: v-bind(cupHeight);
    border: 5px solid rgba(254, 254, 254, 0.6);
    border-top: 0.2px solid rgba(255, 255, 255, 0.4);
    border-bottom: 10px solid rgba(255, 255, 255, 0.4);
    transform: perspective(15px) rotateX(-1deg);
}
```

æ¥ä¸æ¥ï¼å°±æ¯è¶åºäºãè¶åºéè¦æä¸ä¸ªæ³¢æµªå¨ç»ï¼æçæè·¯æ¯ç¨ svg ç»ä¸ä¸ªæ¯è¶æ¯å¤§ä¸äºçç©å½¢ï¼ç¶åç©å½¢çé¡¶é¨ç»ææ³¢æµªçº¿ï¼è¿æ ·å°±æäºä¸ä¸ªé¡¶é¨æ¯æ³¢æµªå½¢çå°é­ç©å½¢äºãæ¥çéè¿ CSS ç animation ç»è¿ä¸ªæ³¢æµªç©å½¢å ä¸æ®µæ¨ªåçæ éå¾ªç¯å¹³ç§»å¨ç»ãå¨ svg çå¤é¨å¢å ä¸ä¸ª overflow: hidden çå®¹å¨ï¼è¿ä¸ªå®¹å¨çå°ºå¯¸éå¶å¨è¶æ¯åé¨ï¼å³å®½åº¦éè¦åå»è¶æ¯å·¦å³çè¾¹æ¡å®½åº¦ï¼é«åº¦æ¯è¶æ¯é«åº¦éå½å°ä¸ç¹ï¼è¿æ ·è¶å°±ä¸ä¼æå³å°æº¢åºçæ ·å­äºï¼éè¿ç»å¯¹å®ä½å°è¿ä¸ªè¶åºå®¹å¨æ¾å¨æ¯å­éï¼éå½è°æ´å®ä½ç¬¦åå®éæåµãè¿æ · svg å¨å®¹å¨éå¹³ç§»æ¶è¶åºçé¨åå°±ä¸ä¼æ¾ç¤ºåºæ¥ï¼çä¸å»å°±åè¶æ¯éçæ¶²ä½å¨åæ³¢æµªå½¢çæµä½å¨ç»ãè³äºè¶åºçé¢è²ï¼åå¯ä»¥éè¿ svg ç `<linearGradient>` æ ç­¾æ¥è®¾ç½®ï¼èä¸å¯ä»¥æ¯å¸¦éæåº¦çæ¸åè²ï¼è®©è¶åºçä¸å»æ´å çé¼çï¼ä¸ºå¶ç»å®ä¸¤ä¸ªåéï¼ç¨äºä¸åè¶åºæ¶åæ¢ä¸åçé¢è²ã

```html
<template>
    <div class="base-tea">
        <div class="wave-wrapper">
            <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                width="1000"
                height="1000"
                viewBox="0 0 1000 1000"
                xml:space="preserve"
            >
                <linearGradient id="linearTeaColor" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" :stop-color="color" />
                    <stop offset="100%" :stop-color="linearColor" />
                </linearGradient>

                <path
                    fill="url(#linearTeaColor)"
                    class="wave"
                    d="M300,300V2.5c0,0-0.6-0.1-1.1-0.1c0,0-25.5-2.3-40.5-2.4c-15,0-40.6,2.4-40.6,2.4
            c-12.3,1.1-30.3,1.8-31.9,1.9c-2-0.1-19.7-0.8-32-1.9c0,0-25.8-2.3-40.8-2.4c-15,0-40.8,2.4-40.8,2.4c-12.3,1.1-30.4,1.8-32,1.9
            c-2-0.1-20-0.8-32.2-1.9c0,0-3.1-0.3-8.1-0.7V300H300z"
                />
            </svg>
        </div>
    </div>
</template>
```

ç±äºè¶åºåç´ ä¹æ¯æ¾å¨æ¯å­åç´ éï¼æä»¥åæ ·ä¼å ä¸ºæ¯å­çéè§åæ¢èåæ¢ãè³æ­¤è¿æ¯è¶åºæ¬çè¦ç´ å°±å·²ç»å­å¨äºãåé¢çä¸äºéæè®¾è®¡ï¼éæå¨ç»ä»¥åæ­¥éª¤åæ¢æ¶çé»è¾é½ä¸æ¯æ¬æè®¨è®ºçé¨åï¼æå´è¶£çæåå¯ä»¥ç´æ¥æ¥çæºç ã

è¿ä¸ªå°±æ¯ç¬¬ä¸ççè®¾è®¡æè·¯ï¼éè¿å¸¸è§ç html åç´ å ä¸ CSS å svg çå æï¼å¶ä½ä¸æ¯çä¸å»ä¸éçè¶é¥®ï¼ç°å¨æä»¬æ¥è°è°è¿éæ´é²åºçé®é¢ãå¨ä¸é¢çåå®¹éæä»¬ç¥éè¿ä¸ªç©å·æåéè¦äº§çä¸å¼ å¾çç¨äºåäº«ï¼ç¬¬ä¸çéç¨çæ¯ html + css + svgï¼æä»¥èªç¶èç¶çæåå¤ä½¿ç¨ <code>[dom-to-image](https://www.npmjs.com/package/dom-to-image)</code> è¿ä¸ªåºæ¥å°è¶é¥®æ¨¡åè½¬æ¢ä¸ºå¾çï¼æ¥ä¸æ¥é®é¢å°±åºç°äºï¼å¨å¤§é¨åæµè§å¨ä¸è¿æ ·åæ²¡æå¤ªå¤§çé®é¢ï¼è½¬æ¢åºæ¥çå¾çå¯¹åæ¥çè¶é¥®æ¨¡åè¿ååº¦è¾é«ãä½æ¯å¨ safari å°±åºç°é®é¢äºï¼`transform: perspective` æ²¡æè¢«æ­£å¸¸çè§£æï¼å¯¼è´çæçå¾çåºç°äºæ­ªæ²çç°è±¡ã

![error](/images/teahouse_error.jpg "teahouse-share")

å¯¹äºè¿ä¸ªé®é¢ï¼ææ¥æ¾äº`dom-to-image` çä¸äº issues ä»¥åç½ä¸çä¸äºè®¨è®ºè¯é¢ï¼ä½æ¯æ²¡æä»»ä½æ¶è·ãèè¿ä¸ª `dom-to-image` åºæ¬èº«ä¹å·²ç»å¨å å¹´ååæ­¢äºç»´æ¤ï¼æä»¥å¯¹ç®åçæµè§å¨çæ¬åæ åè¯å®ä¹å­å¨ä¸å®çè±èãè±äºä¸äºæ¶é´åï¼æå³å®ä¸åæ­¤é®é¢ä¸ç»§ç»­é»çè§å°ï¼å¿é¡»æ¢ä¸ä¸ªæè·¯æ¥è§£å³é®é¢ã

## å¦ä¸ä¸ªæè·¯çç¬¬äºç

æäºç¬¬ä¸ççç»éªåï¼ç¬¬äºçè®¾è®¡æ¶ï¼æèèå°è¶é¥®æ¨¡åéè¦ä¸ç§æ´å éç¨åçè½¬åä¸ºå¾ççæ¹å¼ï¼å¦å¤ï¼è¶é¥®æ¨¡åä¾ç¶éè¦æ¯æåç§å¨ç»ææï¼èªç¶èç¶ææ³å°äº html5 ç `<canvas>`ãCanvas å¯ä»¥éå¸¸ç®åçå°ç»å¸éçåå®¹è½¬åä¸ºå¾çï¼èä¸ Canvas æ¯ææ´å èªç±çå¨ç»ææãå®éä¸å¨æå¹³æ¶çå·¥ä½ä¸­å¶ä¸­ä¸é¡¹åå®¹å°±æ¯ webGL/webGPU çå¼åå·¥ä½ï¼ä¸è¿å·¥ä½ä¸­åçæ´å¤çæ¯ 3D ææç½¢äºã

æä»¬çè¶é¥®æ¨¡åä¸éè¦ 3D åï¼åªè¦ä¸ä¸ª 2D ç»é¢å³å¯ï¼æä»¥æéæ©äºå¸¸ç¨ç <code>[PixiJS](https://pixijs.com/)</code> åºæ¥è¿è¡æ¨¡åç»å¶ï¼åå ä¸ <code>[gsap](https://greensock.com/gsap/)</code> åºæ¥ä¸º PixiJS å¯¹è±¡æ·»å å¨ç»ææã

å¨ç¬¬ä¸çæ¶ç±äºè¶æ¯ï¼è¶åºè¿æéæé½æ¯åºäº html çï¼æä»¥é½æ¯ `.vue` çç»ä»¶ï¼è¿ä¸æ¬¡å¨ Canvas ä¸ç»å¶åªæä¸ä¸ª `<canvas>` æ ç­¾ï¼é£ä¹æä»¬å°±å¯ä»¥å°è¿äºå¯¹è±¡é½æ½ç¦»å° `.ts` typescript æä»¶ä¸­ï¼åæä¸ä¸ªä¸ªç classï¼ç¶åç»è£èµ·æ¥ï¼è¿æ ·ä¸æ¥ï¼åç±»ç¶ææ´å ä¾¿äºç®¡çï¼è¶é¥®éçåç±»é¨ä»¶ä¾¿äºè¿è¡æ½è±¡ãæ¯å¦è¶é¥®éçåç§éæï¼é½å¯ä»¥ç»§æ¿ä¸ä¸ä¸ª `BaseItemsContainer` çåºç±»ï¼å®ç°éé¢çæ¹æ³ï¼èä»ä»¬çæ¾ç¤ºä¸å¦ï¼å¨ç»ä¸å¦è¿äºç¶æï¼ä¹å¯ä»¥ç»ä¸çè¿è¡æ§å¶ã

```ts
import type { Graphics } from 'pixi.js'
import type { CupSize } from '@/types'
import { CUP_HEIGHT } from '@/config'

export interface BaseItem {
  item: Graphics
  tween?: gsap.core.Tween
}

export interface Options {
  cupSize?: CupSize
  visible?: boolean
}

export abstract class BaseItemsContainer {
  protected group: BaseItem[] = []
  protected cupHeight: number
  private _visible: boolean

  constructor({ cupSize = 'M', visible = false }: Options) {
    this._visible = visible
    this.cupHeight = CUP_HEIGHT[cupSize]
  }

  get items() {
    return this.group.map(e => e.item)
  }

  get visible() {
    return this._visible
  }

  set visible(val: boolean) {
    this._visible = val
    this.group.forEach(e => e.item && (e.item.visible = val))
  }

  abstract draw(): any

  abstract animate(): any

  abstract changeVisible(visible: boolean): any

  abstract changeCupSize(cupSize: CupSize): any
}
```

å·ä½çè®¾è®¡ä¸å¨è¿éä¸ä¸å±å¼ï¼æå´è¶£çæåå¯ä»¥ç´æ¥æ¥çæºç ãæç»ï¼éè¿ Canvas ç»å¶çè¶é¥®æ¨¡ååç¬¬ä¸ççä¹éå¸¸æ¥è¿ï¼èä¸å¯ä»¥è½»æ¾çéè¿ Canvas ç API è¿è¡å¾çè½¬æ¢ï¼å¹¶ä¸ä¸ä¼åºç°æ­ªæ²å¤±ççæåµãå¦å¤ï¼è¿ä¸ççè®¾è®¡ä¹éå¸¸å®¹æè¿è¡æ©å±ï¼æªæ¥å¦æéè¦åç§å¥æªçéæï¼æèè±å¨çè¶é¥®ææé½å¯ä»¥éè¿å¼ºå¤§ç Canvas ç»å¸è¿è¡èªç±çç»å¶ã

## æåè¯´ä¸¤å¥

è¿ä¸ªå°ç©å·èå©è½ç¶æäºè®¸çåæ§½ï¼ä¸è¿æ»ä½ä¸è¿æ¯æ¯è¾æ»¡æçï¼èå¯¹äºæèªå·±ï¼ä¹å¢å äºæ´å¤çè®¾è®¡æè·¯ãå¾å¤æ¶åæä»¬åä¸è¥¿ä¼éå°ä¸äºå¥æªçé®é¢ï¼æäºé®é¢å®¹æè§£å³ï¼æäºé®é¢åè¶åºæä»¬èªå·±çè½åèå´ï¼è¿ä¸ªæ¶åä¸å¦¨ä¹å¯ä»¥æ¢ç§æè·¯æ¥è¿è¡ï¼ææ¯è·¯çº¿å¨ä¸å®çæåµä¸ä¹æ¯å¯ä»¥çµæ´»è°æ´çï¼åªè¦æä»¬çç®çä¸åå°±è¡äºã