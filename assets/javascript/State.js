class State {
    constructor(enter, exit) {
        this.enter = enter;
        this.exit = exit;
    }

    // Called upon entering state
    enter() {
        this.enter();
    }

    // Called upon exiting state
    exit() {
        this.exit();
    }
}