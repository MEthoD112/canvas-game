// This class is for tracking tabed keys
class Keys {
    constructor(){
        this.pressedKeys = {};

        document.addEventListener('keydown', (event) => {
            event = event || window.event;
            this.setKey(event, true);
        });

        document.addEventListener('keyup', (event) => {
            event = event || window.event;
            this.setKey(event, false);
        });
    }

    setKey(event, status) {
        const code = event.keyCode;
        let key;

        if (code === 37) {
            key = 'LEFT';
        } else if (code === 38) {
            key = 'UP';
        } else if (code === 39) {
            key = 'RIGHT';
        } else if (code === 40) {
            key = 'DOWN';
        } else if (code === 88) {
            key = 'X';
        } else if (code === 90) {
            key = 'Z';
        } else {
          key = String.fromCharCode(code);
        }
        this.pressedKeys[key] = status;
    }

    isDown(key) {
        return this.pressedKeys[key.toUpperCase()];
    }
}
