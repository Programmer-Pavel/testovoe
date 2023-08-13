import { createRouter, createWebHistory } from "vue-router";
import BoardView from "./views/BoardView.vue";
import SettingView from "./views/SettingView.vue";
import ResultsView from "./views/ResultsView.vue";

export const router = createRouter({
    routes: [
        {
            path: "/",
            component: SettingView,
        },
        {
            path: "/board",
            component: BoardView,
        },
        {
            path: "/results",
            component: ResultsView,
        },
    ],
    history: createWebHistory(),
});
