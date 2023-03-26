<script setup>
import { reactive } from "vue";
import Stopwatch from "./Stopwatch.vue";

const store = reactive({
  stopwatches: [],
});

const addNewStopWatch = () => {
  store.stopwatches.push({ id: store.stopwatches.length });
};
</script>

<template>
  <div class="container">
    <Stopwatch v-for="item in store.stopwatches" :key="item.id" />

    <div class="add" @click="addNewStopWatch">
      <div class="rectangle1" />
      <div class="rectangle2" />
    </div>
  </div>
</template>

<style scoped>
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 45px 50px;
}

@media (min-width: 320px) {
  .container {
    grid-template-columns: repeat(1, 1fr);
  }
}

@media (min-width: 768px) {
  .container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .container {
    grid-template-columns: repeat(3, 1fr);
  }
}

.add {
  position: relative;
  width: 225px;
  height: 120px;
  background: #696969;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.rectangle1 {
  width: 3px;
  height: 20px;
  background: #9e9e9e;
}

.rectangle2 {
  position: absolute;
  width: 20px;
  height: 3px;
  background: #9e9e9e;
}
</style>
