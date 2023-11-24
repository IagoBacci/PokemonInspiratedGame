
const battleBackgroundImage = new Image()
battleBackgroundImage.src = './img/battleBackground.png'
const battleBackground = new Sprite({position: {
        x: 0,
        y: 0
    },
    image: battleBackgroundImage
})

let draggle
let emby
let renderedSprites
let battleAnimationId
let queue

function initBattle() {
    document.querySelector('#userInterface').style.display = 'block'
    document.querySelector('#text').style.display = 'none'
    document.querySelector('#enemyGreenHealth').style.display = '100%'
    document.querySelector('#allyGreenHealth').style.display = '100%'
    document.querySelector('#attackBox').replaceChildren()
    
    draggle = new Monster(monsters.Minhoco)
    draggle.position.y += 20
    emby = new Monster(monsters.Foguinho)
    renderedSprites = [draggle, emby]
    queue = []
    
    emby.attacks.forEach((attack) => {
        const button = document.createElement('button')
        button.innerHTML = attack.name
        document.querySelector('#attackBox').append(button)
    })
    //Eventos para botões clicaveis (ataques)
    document.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', (e) => {
        const selectedAttack = attacks[e.currentTarget.innerHTML]
        emby.attack({
            attack: selectedAttack,
            recipient: draggle,
            renderedSprites
        })

        if (draggle.health <= 0) {
            queue.push(() => {
                draggle.faint()
            })
            queue.push(() => {
                //Animação de volta para o mapa
                gsap.to('#overlappingDiv', {
                    opacity: 1,
                    onComplete: () => {
                        cancelAnimationFrame(battleAnimationId)
                        animate()
                        document.querySelector('#userInterface').style.display = 'none'
                        gsap.to('#overlappingDiv', {
                            opacity: 0
                        })
                        battle.initiated = false
                        audio.Map.play()
                    }
                })
            })
        }

        const randomAttack = 
            draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)]

        queue.push(() => {
            draggle.attack({
                attack: randomAttack,
                recipient: emby,
                renderedSprites
            })
            if (emby.health <= 0) {
                queue.push(() => {
                    emby.faint()
                })
                queue.push(() => {
                    //Animação de volta para o mapa
                    gsap.to('#overlappingDiv', {
                        opacity: 1,
                        onComplete: () => {
                            cancelAnimationFrame(battleAnimationId)
                            animate()
                            document.querySelector('#userInterface').style.display = 'none'
                            gsap.to('#overlappingDiv', {
                                opacity: 0
                            })
                            battle.initiated = false
                            audio.Map.play()
                        }
                    })
                })
            }
        })
    })
    button.addEventListener('mouseenter', (e) => {
        const selectedAttack = attacks[e.currentTarget.innerHTML]
        document.querySelector('#attackType').innerHTML = selectedAttack.type
        document.querySelector('#attackType').style.color = selectedAttack.color
         
    })
})
}

function animateBattle() {
    battleAnimationId = window.requestAnimationFrame(animateBattle)
    battleBackground.draw()

    renderedSprites.forEach((sprite) => {
        sprite.draw()
    })
}

document.querySelector('#text').addEventListener('click', (e) => {
    if (queue.length > 0) {
        queue[0]()
        queue.shift()
    } else e.currentTarget.style.display = 'none'
})