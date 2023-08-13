import { createStore } from "vuex";

export const store = createStore({
    state() {
        return {
            resultsList: [],
            gamerName: "",
            gameComplexity: 1,
        };
    },
    mutations: {
        setResults(state, value) {
            state.resultsList = value;
        },
        setGamerName(state, value) {
            state.gamerName = value;
        },
        setGameComplexity(state, value) {
            state.gameComplexity = value;
        },
    },
    actions: {
        getResults({ commit }) {
            const results = JSON.parse(localStorage.getItem("results"));

            if (results) {
                const sortedResults = results
                    .sort((a, b) => a.time - b.time)
                    .slice(0, 10);

                commit("setResults", sortedResults);
            }
        },
        addResult({ state }, time) {
            const results = JSON.parse(localStorage.getItem("results"));

            localStorage.setItem(
                "results",
                JSON.stringify(
                    results
                        ? [
                              ...results,
                              {
                                  id: results.length + 1,
                                  name: state.gamerName,
                                  time: time,
                              },
                          ]
                        : [
                              {
                                  id: 1,
                                  name: state.gamerName,
                                  time: time,
                              },
                          ]
                )
            );
        },
    },
    getters: {
        colSize(state) {
            switch (state.gameComplexity) {
                case 1:
                    return 8;
                case 2:
                    return 16;
                case 3:
                    return 32;
            }
        },
        rowSize(state) {
            switch (state.gameComplexity) {
                case 1:
                    return 8;
                case 2:
                    return 16;
                case 3:
                    return 16;
            }
        },
        minesNumber(state) {
            switch (state.gameComplexity) {
                case 1:
                    return 10;
                case 2:
                    return 40;
                case 3:
                    return 100;
            }
        },
    },
});
