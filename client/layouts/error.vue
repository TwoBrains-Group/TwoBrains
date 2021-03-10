<template>
    <div v-if="error.statusCode === 404" id="page-error-404">
        <h1>ERROR 404</h1>
        <canvas class="error-404-cvs" ref="cvs"></canvas>
    </div>
    <div v-else>
        An error occurred:
        {{error.message}}
    </div>
</template>

<script>
/**
 * Thanks for me from 2019 for this shit
 */

let pause = true
const W = 750, H = 350
const GRAVITY = 0.1
const TRACTION = 0.8
const DAMPING = 0.1
const MAX_H = H - 5

class Desert404 {
    constructor(cvs) {
        const dpr = window.devicePixelRatio || 1
        const rect = cvs.getBoundingClientRect()
        cvs.width = rect.width * dpr
        cvs.height = rect.height * dpr
        this.ctx = cvs.getContext('2d')
        this.ctx.scale(dpr, dpr)

        this.cactus = new Cactus(this.ctx)
        this.ball = new Ball(this.ctx)
    }

    draw() {
        window.requestAnimationFrame(() => this.draw())

        if (pause) return

        this.ctx.clearRect(0, 0, W, H)

        // this.ctx.fillStyle = '#'
        // this.ctx.fillRect(0, 0, W, H)

        this.drawCactus()

        this.ctx.beginPath()
        this.ctx.strokeStyle = '#df9e6f'
        this.ctx.lineWidth = 25
        this.ctx.lineCap = 'round'
        this.ctx.moveTo(12.5, H - 1)
        this.ctx.lineTo(W - 12.5, H - 1)
        this.ctx.stroke()
        this.ctx.closePath()

        this.ball.cycle()
    }

    drawCactus() {
        this.cactus.draw()
    }
}

class Ball {
    constructor(ctx) {
        this.ctx = ctx

        this.x = 6
        this.y = 1
        this.r = 35
        this.hr = this.r / 2
        this.cx = this.r + 1
        this.cy = H - this.r - 10
        this.angle = 1
        this.pause = true

        this.windX = 0

        this.image = new Image(this.r, this.r)
        this.image.onload = () => pause = false
        this.image.src = '/img/Tumbleweed1.png'
    }

    cycle() {
        if (pause) {
            return
        }

        this.physics()
        this.collide()
        this.move()
        this.draw()
    }

    physics() {
        this.y += GRAVITY
        this.x += this.wind()
        this.angle += this.x * TRACTION * 0.1
    }

    collide() {
        if (this.cy + this.hr >= MAX_H || this.cy - this.hr <= 0) {
            this.y = -this.y * DAMPING
            this.cy = MAX_H - this.hr

            this.x *= TRACTION
        } else if (this.cx + this.hr >= W) {
            this.x = -this.x * DAMPING
            this.cx = W - this.hr
        } else if (this.cx - this.hr <= 0) {
            this.x = -this.x * DAMPING
            this.cx = this.hr
        }
    }

    wind() {
        let dir = (Math.random() > 0.5 ? 1 : -1)
        this.windX = (Math.random() * 6 + 3) * dir + this.windX * Math.random()
        return this.windX * 0.01
    }

    move() {
        this.cx += this.x
        this.cy += this.y
    }

    draw() {
        this.ctx.translate(this.cx, this.cy)
        this.ctx.rotate(this.angle)
        this.ctx.drawImage(this.image, -this.hr, -this.hr, this.r, this.r)
        this.ctx.rotate(-this.angle)
        this.ctx.translate(-this.cx, -this.cy)
    }
}

class Cactus {
    constructor(ctx) {
        this.ctx = ctx
        this.image = new Image()
        this.image.src = '/img/cactus.png'
        this.image.onload = () => {
            pause = false
        }
    }

    draw() {
        this.ctx.drawImage(this.image, W - W * 0.2, H - this.image.height - 16, this.image.width * 1.2, this.image.height * 1.2)
    }
}

export default {
    props: ['error'],

    mounted() {
        if (this.error.statusCode === 404) {
            const cvs = this.$refs.cvs

            const desert = new Desert404(cvs)

            desert.draw()
        }
    },
}
</script>

<style lang="scss">
@import '~assets/sass/pages/error/error.scss';
</style>
