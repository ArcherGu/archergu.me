<template>
    <div class="my-self text-center">
        <div ref="wordCloudRef"></div>
        <span ref="inputRef" class="text-lg"></span>
        <button v-if="showReplay" @click="replay" class="icon-btn">
            <mdi-replay style="display: inline; vertical-align: text-top" />
        </button>
    </div>
</template>

<script lang="ts" setup>
import Typed from "typed.js";
import { computed, ref, watch } from "vue";
import { WordCloud } from "@antv/g2plot";
import { unrefElement, useWindowSize } from "@vueuse/core";
import type { Introduce } from "@/utils";
import { myIntroduce } from "@/utils";

const { width } = useWindowSize();
const inputRef = ref();
const wordCloudRef = ref();
const showReplay = ref(false);

let wordCloud: WordCloud | undefined;
let typed: Typed | undefined;
let wordCloudData = computed<Introduce[]>({
    get() {
        return wordCloud ? (wordCloud.options.data as Introduce[]) : [];
    },
    set(v) {
        wordCloud?.changeData(v);
    },
});

watch(wordCloudRef, () => {
    const el = unrefElement(wordCloudRef);
    if (!el) return;

    wordCloud = new WordCloud(el, {
        data: [],
        autoFit: true,
        height: width.value < 640 ? 500 : 600,
        wordField: "keyword",
        weightField: "weight",
        colorField: "color",
        color: ({ color }) => color,
        wordStyle: {
            fontFamily: "Dosis",
            fontSize: [20, width.value < 640 ? 40 : 50],
            rotation: 0,
            padding: 10,
        },
        spiral: "rectangular",
        random: () => 0.5,
        tooltip: false,
    });

    wordCloud.render();
});

const formatWords = (item: Introduce) => {
    let words = [];
    for (let i = 0; i < item.keyword.length; i++) {
        words.push({
            words: item.words,
            keyword: item.keyword[i],
            color: item.color[i],
            weight: item.weight,
        });
    }

    return words;
};

const replay = () => {
    wordCloudData.value = [];
    showReplay.value = false;
    typed?.reset();
};

watch(
    inputRef,
    () => {
        const el = unrefElement(inputRef);

        if (!el) return;

        typed = new Typed(el, {
            strings: myIntroduce
                .map((e) => e.words)
                .concat("I'm Archer Gu, This is me."),
            typeSpeed: 20,
            onStringTyped: (index) => {
                if (!wordCloud) return;

                if (index == myIntroduce.length) {
                    let data: any[] = [];
                    myIntroduce.forEach((e) => {
                        data.push(...formatWords(e));
                    });

                    wordCloudData.value = data;
                    showReplay.value = true;
                } else {
                    wordCloudData.value = [
                        ...formatWords(myIntroduce[index]),
                    ] as any[];
                }
            },
        });
    },
    {
        flush: "post",
    }
);
</script>

<style></style>
