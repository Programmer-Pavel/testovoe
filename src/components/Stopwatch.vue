<script setup>
import { reactive, watchEffect } from "vue";

const props = defineProps({
  stopwatch: Object,
});

const store = reactive({
  second: 0,
  minute: 0,
  hour: 0,
  isPause: false,
});

let secondInterval;

const getCounts = (unit) =>
  store[unit] < 10 ? `0${store[unit]}` : store[unit];

watchEffect(() => {
  if (store.second > 59) {
    store.minute++;
    store.second = 0;
  }

  if (store.minute > 59) {
    store.hour++;
    store.minute = 0;
    store.second = 0;
  }
});

const stopwatchStart = () => {
  store.isPause = true;
  secondInterval = setInterval(() => store.second++, 1000);
};

const stopwatchStop = () => {
  store.isPause = false;
  clearInterval(secondInterval);
};

const stopwatchReset = () => {
  store.hour = 0;
  store.minute = 0;
  store.second = 0;
};
</script>

<template>
  <div class="counter">
    <div class="first-half">
      {{ getCounts("hour") }}:{{ getCounts("minute") }}:{{
        getCounts("second")
      }}
    </div>
    <div class="divider" />
    <div class="second-half">
      <div class="start">
        <img
          v-if="store.isPause"
          @click="stopwatchStop"
          src="../assets/pause.svg"
        />
        <img v-else @click="stopwatchStart" src="../assets/triangle.svg" />
      </div>
      <img class="reset" @click="stopwatchReset" src="../assets/square.svg" />
    </div>
  </div>
</template>

<style scoped>
.counter {
  width: 225px;
  height: 120px;
  background: #696969;
}

.first-half {
  height: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9e9e9e;
  font-family: "Gotham Pro";
  font-style: normal;
  font-weight: 400;
  font-size: 22px;
  line-height: 21px;
}

.second-half {
  height: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9e9e9e;
}

.divider {
  border: 1px solid #9e9e9e;
}

.start {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  margin-right: 48px;
  cursor: pointer;
}

.reset {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>
