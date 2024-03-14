//Declarando a constante Canvas pro elemento canvas do HTML
const canvas = document.querySelector('canvas')

//Declarando Canvas à uma constante para o "contexto 2D"
const c = canvas.getContext('2d')

//Definindo o tamanho da tela do jogo (tamanho do canvas)
canvas.width = 1024
canvas.height = 576

//definindo o que serão as colisões dentro do jogo e suas zonas
const collisionsMap = []
for (let i = 0; i < collisions.length; i+=70){
    collisionsMap.push(collisions.slice(i, 70 + i)
    )}
//definindo as zonas de batalha do mapa (onde encontraram batalha)
    const battleZonesMap = []
for (let i = 0; i < battleZonesData.length; i+=70){
    battleZonesMap.push(battleZonesData.slice(i, 70 + i)
    )}


const boundaries = []
const offset = {
    x: -302,
    y: -720
}


collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if(symbol === 1025)
            boundaries.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )
            
    })
})

const battleZones = []

battleZonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if(symbol === 1025)
            battleZones.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                })
            )
            
    })
})


const image = new Image()
image.src = './img/Mapinho.png'

const playerDownImage = new Image()
playerDownImage.src = './img/playerDown.png'

const playerUpImage = new Image()
playerUpImage.src = './img/playerUp.png'

const playerLeftImage = new Image()
playerLeftImage.src = './img/playerLeft.png'

const playerRightImage = new Image()
playerRightImage.src = './img/playerRight.png'

const foregroundImage = new Image()
foregroundImage.src = './img/ForegroundObjects.png'

const player = new Sprite({
    position: {
        x: canvas.width /2 - 192 / 4 /2,
        y: canvas.height /2 - 68 /2
    },
    image: playerDownImage,
    frames: {
        max: 4,
        hold: 10
    },
    sprites: {
        up: playerUpImage,
        left: playerLeftImage,
        right: playerRightImage,
        down: playerDownImage
    }
})

const background = new Sprite ({
    position:{
        x: offset.x,
        y: offset.y
    },
    image: image
})

const foreground = new Sprite ({
    position:{
        x: offset.x,
        y: offset.y
    },
    image: foregroundImage
})

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}
const testBoundary = new Boundary({
    position: {
        x:400,
        y:400
    }
})

const movables = [background, ...boundaries, foreground, ...battleZones]

function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y
    )
}
const battle = {
    initiated: false
}

function animate() {
    const animationId = window.requestAnimationFrame(animate)

    background.draw()
    boundaries.forEach((boundary) => {
        boundary.draw()
    })
    battleZones.forEach((battleZone) => {
        battleZone.draw()
    })
    player.draw()
    foreground.draw()
    
    let moving = true
    player.animate = false

    if (battle.initiated) return
    //Ativar a batalha de forma aleatoria e apenas se dentro da zona de batalha
    if (keys.w.pressed || keys.a.pressed || keys.d.pressed || keys.s.pressed) {
        for (let i = 0; i < battleZones.length; i++) {
            const battleZone = battleZones[i]
            const overllapingArea = 
                (Math.min(
                    player.position.x + player.width,
                    battleZone.position.x + battleZone.width
                    ) -
                Math.max( player.position.x, battleZone.position.x)) *
                (Math.min(
                    player.position.y + player.height, 
                    battleZone.position.y + battleZone.height) - 
                Math.max( player.position.y, battleZone.position.y))
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: battleZone
                }) &&
                overllapingArea > (player.width * player.height) / 2
                && Math.random() < 0.05
            ) {
                //desativar loop de animação
                window.cancelAnimationFrame(animationId)

                audio.Map.stop()
                audio.InitBattle.play()
                audio.Battle.play()
                battle.initiated = true
                gsap.to('#overlappingDiv', {
                    opacity: 1,
                    repeat: 6,
                    yoyo: true,
                    duration: 0.4,
                    onComplete() {
                        gsap.to('#overlappingDiv', {
                            opacity: 1,
                            duration: 0.4,
                            onComplete() {
                                //ativar loop de animação
                                initBattle()
                                animateBattle()
                                gsap.to('#overlappingDiv', {
                                    opacity: 0,
                                    duration: 0.4
                                })
                                
                            }
                        })

                        


                    }
                })
                break
            }
        }
    }


    if (keys.w.pressed) {
        player.animate = true
        player.image = player.sprites.up
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                        x: boundary.position.x,
                        y: boundary.position.y + 3
                    }}
                })
            ) {
            moving = false
                break
            }
        }

        if (moving)
        movables.forEach((movable) => {
            movable.position.y +=3
        })
    } else if (keys.a.pressed) {
        player.animate = true
        player.image = player.sprites.left
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                        x: boundary.position.x + 3,
                        y: boundary.position.y 
                    }}
                })
            ) {
            moving = false
                break
            }
        }

        if (moving)
        movables.forEach((movable) => {
            movable.position.x +=3
        })
    } else if (keys.s.pressed) {
        player.animate = true
        player.image = player.sprites.down

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                        x: boundary.position.x,
                        y: boundary.position.y - 3
                    }}
                })
            ) {
            moving = false
                break
            }
        }

        

        if (moving)
        movables.forEach((movable) => {
            movable.position.y -=3
        })
    } else if (keys.d.pressed) {
        player.animate = true
        player.image = player.sprites.right
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {
                        ...boundary,
                        position: {
                        x: boundary.position.x - 3,
                        y: boundary.position.y 
                    }}
                })
            ) {
            moving = false
                break
            }
        }

        if (moving)
        movables.forEach((movable) => {
            movable.position.x -=3
        })
    }
}
animate() 



window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = true
            break

        case 'a':
            keys.a.pressed = true
            break

        case 's':
            keys.s.pressed = true
            break

        case 'd':
            keys.d.pressed = true
            break
    }
})
window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = false
            break

        case 'a':
            keys.a.pressed = false
            break

        case 's':
            keys.s.pressed = false
            break

        case 'd':
            keys.d.pressed = false
            break
    }
})

let clicked = false
addEventListener('click', () => {
    if (!clicked) {
        audio.Map.play()
        clicked = true
    }
})


