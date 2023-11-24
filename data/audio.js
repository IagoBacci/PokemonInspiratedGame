const audio = {
    Map: new Howl({
        src: './audio/map.wav',
        html5: true,
        volume: 0.1,
        loop: true
    }),
    InitBattle: new Howl({
        src: './audio/initBattle.wav',
        html5: true,
        volume: 0.05
    }),
    Battle: new Howl({
        src: './audio/battle.mp3',
        html5: true,
        volume: 0.1
    }),
    Fireball1: new Howl({
        src: './audio/initFireball.wav',
        html5: true,
        volume: 0.1
    }),
    Tackle: new Howl({
        src: './audio/tackleHit.wav',
        html5: true,
        volume: 0.1
    }),
    Fireball2: new Howl({
        src: './audio/fireballHit.wav',
        html5: true,
        volume: 0.1
    }),
    Victory: new Howl({
        src: './audio/victory.wav',
        html5: true,
        volume: 0.1
    }),
}