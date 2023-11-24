const embyImage = new Image()
embyImage.src = '../img/embySprite.png'
const draggleImage = new Image()
draggleImage.src = './img/draggleSprite.png'

const monsters = {
     Foguinho: {
            position: {
                x: 280 ,
                y: 325
            },
            image: {
                src: '../img/embySprite.png'
            },
            frames: {
                max: 4,
                hold: 20
            },
            animate: true,
            name: 'Foguinho',
            attacks: [attacks.Porrada, attacks.Fogareu, attacks.Passinho]
        },
        Minhoco: {
            position: {
                x: 800 ,
                y: 80
            },
            image: {
                src: './img/draggleSprite.png'
            },
            frames: {
                max: 4,
                hold: 20
            },
            animate: true,
            isEnemy: true,
            name: 'Minhoco',
            attacks: [attacks.Porrada, attacks.Fogareu]
        }
     }
