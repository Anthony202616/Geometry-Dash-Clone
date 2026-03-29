// js/Level.js
class Level {
    constructor(levelIndex) {
        // Assume levelsData (venant de levels.js) est accessible globalement
        this.data = window.levelsData[levelIndex];
        this.index = levelIndex;
        this.mapColumns = this.data.mapColumns;
        this.totalLength = this.mapColumns.length * Constants.BLOCK_SIZE;
    }

    getBlockType(col, row) {
        if(col < 0 || col >= this.mapColumns.length) return 0;
        if(row < 0 || row > 9) return 0;
        return this.mapColumns[col][row];
    }
}
