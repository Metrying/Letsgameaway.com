const canvas= document.querySelector('canvas');
const c=  canvas.getContext('2d');

canvas.width = innerWidth
canvas.height = innerHeight

class Player{
    constructor(){
       
        this.velocity = {
            x:0,
            y:0
        }
          
        this.rotation = 0

        const image= new Image()
        image.src = 'hero.png'
        image.onload = () => {    
        this.image= image
        this.width= image.width*1.1
        this.height=image.height*1.1
        this.position = {
            x:canvas.width/2 - this.width/2,
            y:canvas.height - this.height -20
        }
        }
    }
   
    draw(){
        c.save()
        c.translate(player.position.x+player.width/2,player.position.y+player.height/2)
        c.rotate(this.rotation)
        c.translate(-player.position.x-player.width/2,-player.position.y-player.height/2)
    c.drawImage(this.image,this.position.x,this.position.y,this.width,this.height);
        c.restore()
     }

     update(){
        if(this.image){
        this.draw()
        this.position.x += this.velocity.x }
     }
}

class Projectile {
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity 
        this.radius = 3
    }

    draw(){
        c.beginPath()
        c.arc(this.position.x,this.position.y,this.radius,0,Math.PI*2)
        c.fillStyle = 'red'
        c.fill()
        c.closePath()
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class InvaderProjectile {
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity 
        this.width = 3
        this.height=10
    }

    draw(){
        c.fillStyle='white'
        c.fillRect(this.position.x,this.position.y,this.width,this.height)
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Invader{
    constructor({position}){
       
        this.velocity = {
            x:0,
            y:0
        }

        const image= new Image()
        image.src = 'enemy.png'
        image.onload = () => {    
        this.image= image
        this.width= image.width*0.9
        this.height=image.height*0.9
        this.position = {
            x:position.x ,
            y:position.y
        }
        }
    }
   
    draw(){
    c.drawImage(this.image,this.position.x,this.position.y,this.width,this.height);
        
     }

     update({velocity}){
        if(this.image){
        this.draw()
        this.position.x += velocity.x
        this.position.y+= velocity.y }
     }

     shoot(invaderProjectiles){
         invaderProjectiles.push(
            new InvaderProjectile({
                position: {
                    x: this.position.x + this.width/2 ,
                    y: this.position.y + this.height
                }, velocity :{
                    x:0,y:5
                }
            })
         )
     }

}

class Grid {
    constructor(){
        this.position={
            x:0,y:0
        }
        this.velocity = {
            x:3,y:0
        }
        this.invaders = []

        const rows = Math.floor(Math.random()*5+2)
        const colm = Math.floor(Math.random()*8+5)
        this.width = colm*30
        for(let x=0; x<colm; x++){
            for(let y=0; y<rows; y++)
            this.invaders.push(new Invader({
                position: {
                    x:x*30,
                    y:y*30
                }
            }))
        }

    }
    update(){
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.velocity.y = 0

        if(this.position.x + this.width >= canvas.width || 
            this.position.x<=0){
            this.velocity.x= - this.velocity.x
            this.velocity.y = 30
        }
    }
}



const player= new Player()
const grids = [new Grid()] 
const projectiles =[]
const invaderProjectiles =[]
const keys = {
    a:{
        pressed: false
    },
    d:{
        pressed: false
    },
    space:{
        pressed: false
    }
}

let frames=0
let randominterval= Math.floor(Math.random()*500+500)

function animate(){
    requestAnimationFrame(animate)
    c.fillStyle= 'black'
    c.fillRect(0,0,canvas.width,canvas.height)
    player.update()

    invaderProjectiles.forEach((invaderProjectile, index)=>{
        if(invaderProjectile.position.y+invaderProjectile.height>=canvas.height)
        {setTimeout(() => {
            invaderProjectiles.splice(index,1)},0
            )} else{
        invaderProjectile.update()}
        if(invaderProjectile.position.y+10>= player.position.y &&
            invaderProjectile.position.x+3>=player.position.x &&
            invaderProjectile.position.x<=player.position.x+player.width){console.log('you lose')}
    })

    projectiles.forEach((projectile,index) => {

        if(projectile.position.y+projectile.radius<=0){
            projectiles.splice(index,1)
        } else{
        projectile.update()}
    })

    grids.forEach((grid,gridIndex) => {
        grid.update()

        if(frames % 100=== 0 && grid.invaders.length>0){
            grid.invaders[Math.floor(Math.random()*grid.invaders.length)].shoot(
                invaderProjectiles
            )
        }

        grid.invaders.forEach((invader,i) => {
            invader.update({ velocity: grid.velocity})
            projectiles.forEach((projectile,j) => {
                if(projectile.position.y - 3< invader.position.y+invader.height
                    && projectile.position.x+3 >= invader.position.x&&
                    projectile.position.x-3<=invader.position.x + invader.width&&
                    projectile.position.y+3>= invader.position.y){
                    setTimeout( () => {
                        const invaderFound = projectiles.find((projectile2)=>{
                            return projectile2=== projectile})
                        const projectileFound = grid.invaders.find((invader2)=>{
                                return invader2=== invader})
                            if (invaderFound && projectileFound){
                        grid.invaders.splice(i,1)
                        projectiles.splice(j,1)}

                         if(grid.invaders.length>0){
                            const firstInvader = grid.invaders[0]
                            const lastInvader = grid.invaders[grid.invaders.length-1]
                            grid.width = lastInvader.position.x-firstInvader.position.x+lastInvader.width
                            grid.position.x = firstInvader.position.x
                         } else{
                            grids.splice(gridIndex,1)
                         }

                    },0)

                    }
                })
            })
        })
    

    if (keys.a.pressed && player.position.x>=0){
        player.velocity.x= -7
        player.rotation =- 0.15
    }   else if(keys.d.pressed && player.position.x + player.width<= canvas.width-10){
        player.velocity.x= 7
        player.rotation = 0.15
    } 
    else {
        player.velocity.x= 0
        player.rotation = 0
    }

    if(frames% randominterval === 0){
        grids.push(new Grid())
        randominterval= Math.floor(Math.random()*500+500)
        frames = 0
    }

    frames++
    }


animate()

addEventListener('keydown', ({ key }) => {
    switch (key) {
        case 'a' :
            keys.a.pressed= true
            break
        case 'd' :
            keys.d.pressed= true
        break
       case ' ':
            projectiles.push(new Projectile({
                position: {x:player.position.x+player.width/2,
                    y:player.position.y},
                velocity:{
                    x:0,y:-10
                }
            }))
       break
    }
})

addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'a' :
            keys.a.pressed= false
            break
        case 'd' :
            keys.d.pressed= false
        break
       case ' ':

       break
    }
})