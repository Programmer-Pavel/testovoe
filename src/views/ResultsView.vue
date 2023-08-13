<template>
    <div class="wrapper">
        <h1>Таблица результатов</h1>
        <div
            v-if="resultsList.length"
            class="itemWrapper"
            v-for="(result, index) in resultsList"
            :key="result.id"
        >
            <div class="nameWrapper">
                <span class="number">{{ index + 1 }}.</span>
                <span>{{ result.name }}</span>
            </div>
            <span>{{ getTime(result.time) }}</span>
        </div>

        <div v-else>Список результатов пуст!</div>

        <button class="settingsBtn" @click="goToSettingsPage">Настройки</button>
    </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { computed, onMounted } from "vue";
import { getTime } from "../utils/time";

const router = useRouter();
const store = useStore();

const resultsList = computed(() => store.state.resultsList);

const goToSettingsPage = () => {
    router.push("/");
};

onMounted(() => {
    store.dispatch("getResults");
});
</script>

<style scoped>
.wrapper {
    display: flex;
    flex-direction: column;
    background-color: white;
    border-radius: 8px;
    padding: 30px;
}

h1 {
    font-size: 30px;
    margin-bottom: 50px;
}

.itemWrapper {
    display: flex;
    justify-content: space-between;
    padding-left: 20px;
    padding-right: 20px;
    margin-bottom: 5px;
}

.number {
    width: 20px;
    font-weight: 600;
    text-align: start;
}

.nameWrapper {
    display: flex;
    gap: 10px;
}

.settingsBtn {
    margin-top: 30px;
}

@media screen and (max-width: 720px) {
    .wrapper {
        padding: 17px;
    }

    h1 {
        font-size: 25px;
    }
}
</style>
