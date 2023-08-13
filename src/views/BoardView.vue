<template>
    <div class="wrapper">
        <div class="boardWrapper">
            <div
                class="board"
                :class="{
                    'board-32-16': colSize === 32,
                    'board-16-16': colSize === 16,
                }"
            >
                <div
                    v-for="(row, rowIndex) in board"
                    :key="rowIndex"
                    class="row"
                >
                    <div
                        v-for="(cell, colIndex) in row"
                        :key="colIndex"
                        class="cell"
                        :class="{
                            'cell--revealed': cell.revealed,
                            'cell--mine': cell.revealed && cell.mine,
                            'cell--flagged': !cell.revealed && cell.flagged,
                            'cell--questioned':
                                !cell.revealed && cell.questioned,
                            cellHover: !cell.revealed,
                        }"
                        @click="handleCellClick(rowIndex, colIndex)"
                        @contextmenu.prevent="
                            handleCellRightClick(rowIndex, colIndex)
                        "
                    >
                        <span
                            v-if="cell.revealed && !cell.mine"
                            :class="{
                                'number--blue': cell.adjacentMines == 1,
                                'number--green': cell.adjacentMines == 2,
                                'number--red': cell.adjacentMines == 3,
                                'number--darkblue': cell.adjacentMines == 4,
                                'number--brown': cell.adjacentMines == 5,
                                'number--turquoise': cell.adjacentMines == 6,
                                'number--black': cell.adjacentMines == 7,
                                'number--white': cell.adjacentMines == 8,
                            }"
                        >
                            {{ cell.adjacentMines || "" }}
                        </span>
                        <span v-if="cell.revealed && cell.mine">💣</span>
                        <span v-if="!cell.revealed && cell.flagged">🚩</span>
                        <span v-if="!cell.revealed && cell.questioned">❔</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="btnGroup">
            <button @click="onSettingsBtn">Настройки</button>
            <button class="resetBtn" @click="resetGame">Начать заново</button>

            <div class="timer"><span>Таймер: </span>{{ timerValue }}с.</div>
            <div class="counter">
                <span>Счетчик мин: </span>{{ minesCounter }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const router = useRouter();

const colSize = computed(() => store.getters.colSize);
const rowSize = computed(() => store.getters.rowSize);
const minesNumber = computed(() => store.getters.minesNumber);

const board = reactive([]);
const numUnrevealed = ref(colSize.value * rowSize.value);
const timerValue = ref(0);
const minesCounter = ref(minesNumber.value);

let timer;

const onSettingsBtn = () => {
    router.push("/");
};

const initializeBoard = () => {
    for (let i = 0; i < rowSize.value; i++) {
        const row = [];
        for (let j = 0; j < colSize.value; j++) {
            row.push({
                revealed: false,
                mine: false,
                flagged: false,
                questioned: false,
                adjacentMines: 0,
            });
        }
        board.push(row);
    }
};

const plantMines = () => {
    let minesPlanted = 0;
    while (minesPlanted < minesNumber.value) {
        const randomRow = Math.floor(Math.random() * rowSize.value);
        const randomCol = Math.floor(Math.random() * colSize.value);
        if (!board[randomRow][randomCol].mine) {
            board[randomRow][randomCol].mine = true;
            minesPlanted++;
        }
    }
};

const calculateAdjacentMines = () => {
    for (let i = 0; i < rowSize.value; i++) {
        for (let j = 0; j < colSize.value; j++) {
            const cell = board[i][j];
            if (!cell.mine) {
                let count = 0;
                for (let x = -1; x <= 1; x++) {
                    for (let y = -1; y <= 1; y++) {
                        const row = i + x;
                        const col = j + y;
                        if (
                            row >= 0 &&
                            row < rowSize.value &&
                            col >= 0 &&
                            col < colSize.value &&
                            board[row][col].mine
                        ) {
                            count++;
                        }
                    }
                }
                cell.adjacentMines = count;
            }
        }
    }
};

const revealAdjacentCells = (row, col) => {
    if (
        row < 0 ||
        row >= rowSize.value ||
        col < 0 ||
        col >= colSize.value ||
        board[row][col].revealed
    ) {
        return;
    }

    board[row][col].revealed = true;
    numUnrevealed.value--;

    if (board[row][col].adjacentMines === 0) {
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                const newRow = row + x;
                const newCol = col + y;
                revealAdjacentCells(newRow, newCol);
            }
        }
    }
};

const handleCellClick = (row, col) => {
    const cell = board[row][col];
    if (cell.flagged || cell.revealed) {
        return;
    }

    if (cell.mine) {
        revealAllCells();
        clearTimeout(timer);
        alert("Игра окончена - Вы проиграли!");
    } else {
        revealAdjacentCells(row, col);
        if (numUnrevealed.value === minesNumber.value) {
            alert("Игра окончена - Вы выиграли!");
            store.dispatch("addResult", timerValue.value);
        }
    }
};

const handleCellRightClick = (row, col) => {
    const cell = board[row][col];
    if (cell.revealed) {
        return;
    }

    if (cell.flagged) {
        cell.flagged = false;
        cell.questioned = true;
        minesCounter.value++;
    } else if (cell.questioned) {
        cell.questioned = false;
    } else {
        cell.flagged = true;
        minesCounter.value--;
    }
};

const revealAllCells = () => {
    for (let i = 0; i < rowSize.value; i++) {
        for (let j = 0; j < colSize.value; j++) {
            board[i][j].revealed = true;
        }
    }
};

const resetGame = () => {
    board.splice(0, board.length);
    initializeBoard();
    plantMines();
    calculateAdjacentMines();
    numUnrevealed.value = colSize.value * rowSize.value;
    minesCounter.value = minesNumber.value;
    timerValue.value = 0;
    clearTimeout(timer);

    timer = setTimeout(function run() {
        timerValue.value++;
        timer = setTimeout(run, 1000);
    }, 1000);
};

onMounted(() => {
    resetGame();
});

onUnmounted(() => {
    clearTimeout(timer);
});

watch(numUnrevealed, (newVal) => {
    if (newVal === minesNumber.value) {
        alert("Игра окончена - Вы выиграли!");
        store.dispatch("addResult", timerValue.value);
    }
});
</script>

<style scoped>
.wrapper {
    display: flex;
    gap: 30px;
}

.boardWrapper {
    overflow-x: auto;
}

.board {
    display: flex;
    flex-direction: column;
}

.row {
    display: flex;
}

.cell {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(129, 126, 126);
    border: 1px solid #353638;
    font-size: 20px;
    font-weight: 700;
}

.cellHover:hover {
    background-color: rgb(180, 175, 175);
}

.cell--revealed {
    background-color: lightgray;
}

.cell--mine {
    background-color: red;
}

.cell--flagged {
    background-color: yellow;
}

.cell--questioned {
    background-color: skyblue;
}

.number--blue {
    color: blue;
}

.number--green {
    color: green;
}

.number--red {
    color: red;
}

.number--darkblue {
    color: darkblue;
}

.number--brown {
    color: brown;
}

.number--turquoise {
    color: turquoise;
}

.number--black {
    color: black;
}

.number--white {
    color: white;
}

.resetBtn {
    margin-top: 20px;
}

.btnGroup {
    display: flex;
    flex-direction: column;
}

button {
    width: 200px;
}

.timer {
    color: white;
    margin-top: 20px;
    text-align: start;
}

.counter {
    color: white;
    text-align: start;
}

@media screen and (max-width: 1280px) {
    .wrapper {
        flex-direction: column-reverse;
    }

    .cell {
        width: 25px;
        height: 25px;
    }
}

@media screen and (max-width: 992px) {
    .cell {
        width: 21px;
        height: 21px;
        font-size: 17px;
    }
}

@media screen and (max-width: 768px) {
    .wrapper {
        padding: 20px;
        overflow: auto;
    }
    .board-32-16 {
        width: 736px;
    }

    .board-16-16 {
        width: 368px;
    }

    .cell {
        font-size: 15px;
    }
}
</style>
