class Timer {
    constructor() {
        this.ticker;
        this.value;
        this.endTime;
        this.htmlElement;
        this.updateCallback; // additional function to call inside update();
        this.stopCallback; // additional function to call inside stop();
    }

    start() {
        // console.log("Called start method")
        // clearInterval(this.ticker); // Clears interval just in case the last timer wasn't properly stopped
        this.value = Math.max(Math.ceil((this.endTime - Date.now()) / 1000), 0);
        this.render();
        this.ticker = setInterval(() => this.update(), 1000);
    }

    stop() {
        this.running = false;
        console.log("Called stop method");
        clearInterval(this.ticker);
        if (this.stopCallback !== null) {
            this.stopCallback();
        }
    }

    update() {
        console.log("Called update method");
        this.value = Math.max(Math.ceil((this.endTime - Date.now()) / 1000), 0) // Prevents timer from going lower than 0
        if (this.htmlElement !== null) {
            this.render();
        }
        console.log(this.value);
        if (this.updateCallback !== null) {
            this.updateCallback();
        }
        if (this.value === 0) {
            this.stop();
        }
    }

    render() {
        if (this.htmlElement !== null) {
            this.htmlElement.text(this.value);
        }
    }
}