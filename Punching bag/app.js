new Vue({
    el: '#vue_app',
    data: {
        center: true,
        ended: false,
        health: 100
    },
    methods: {
        punched: function() {
        	let sound=new Audio('assets/audio/Punch.mp3');
            this.health -= 10;
            sound.play();
            if (this.health <= 0) {
            	let sound=new Audio('assets/audio/Smash.mp3');
            	sound.play();
                this.ended = true;
            }

        },
        reset: function() {
            this.health = 100;
            this.ended = false;
        }

    }
});