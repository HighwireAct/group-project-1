class Timer {
    constructor() {
        this.ticker;
        this.value;
        this.endTime;
    }

    start() {
        this.update();
        this.ticker = setInterval(() => this.update(), 1000);
    }

    stop() {
        clearInterval(this.ticker);
    }

    update() {
        this.value = Math.max(Math.ceil((this.endTime - Date.now()) / 1000), 0) // Prevents timer from going lower than 0
        console.log(this.value);
        if (this.value == 0) {
            this.stop();
        }
    }
}