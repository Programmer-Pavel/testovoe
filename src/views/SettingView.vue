<template>
    <div class="wrapper">
        <h1>Игра "Сапер"</h1>

        <div class="body">
            <div class="nameWrapper">
                <label for="name" class="label">Имя игрока</label>
                <input
                    class="input"
                    :class="{ error: !isNameInputValid }"
                    id="name"
                    type="text"
                    v-model="nameInputValue"
                    @focus="onNameIputFocus"
                />
                <span v-if="!isNameInputValid" class="errorText"
                    >имя обязательно</span
                >
            </div>

            <label for="complexity" class="label">Выберите сложность</label>
            <select class="select" id="complexity" v-model="selectedOption">
                <option
                    v-for="option in complexityOptions"
                    :key="option.value"
                    :value="option.value"
                >
                    {{ option.label }}
                </option>
            </select>

            <button class="gameStartBtn" @click="onGameStartBtn">
                Начать игру
            </button>
            <button @click="goToResultsPage">Таблица результатов</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { complexityOptions } from "../utils/complexityOptions";

const router = useRouter();
const store = useStore();

const selectedOption = ref(store.state.gameComplexity);
const nameInputValue = ref(store.state.gamerName);
const isNameInputValid = ref(true);

const onGameStartBtn = () => {
    if (nameInputValue.value) {
        store.commit("setGamerName", nameInputValue.value);
        store.commit("setGameComplexity", selectedOption.value);
        router.push("/board");
    } else {
        isNameInputValid.value = false;
    }
};

const goToResultsPage = () => {
    router.push("/results");
};

const onNameIputFocus = () => {
    isNameInputValid.value = true;
};
</script>

<style scoped>
.wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    border-radius: 8px;
    padding: 50px;
}

h1 {
    font-size: 40px;
    margin-bottom: 50px;
}

.body {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.nameWrapper {
    display: flex;
    flex-direction: column;
    margin-bottom: 30px;
}

.label {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 10px;
}

.input {
    outline: none;
    padding: 5px;
    border-radius: 4px;
    border: 2px solid rgb(202, 200, 200);
}

.input:hover {
    border: 2px solid rgb(85, 84, 84);
    transition: border 0.2s ease;
}

.select {
    border-radius: 4px;
    border: 2px solid rgb(202, 200, 200);
    margin-bottom: 30px;
    background-color: transparent;
    padding: 5px;
}

.select:hover {
    border: 2px solid rgb(85, 84, 84);
    transition: border 0.2s ease;
}

.error {
    border: 2px solid red;
}

.errorText {
    color: red;
    text-align: start;
}

.gameStartBtn {
    margin-bottom: 20px;
}

@media screen and (max-width: 720px) {
    .wrapper {
        width: 50%;
        min-width: 275px;
        padding: 17px;
    }

    h1 {
        font-size: 30px;
    }
    .label {
        font-size: 17px;
    }

    .select {
        font-size: 15px;
    }

    .errorText {
        font-size: 15px;
    }
}
</style>
