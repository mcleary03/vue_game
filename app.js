new Vue({
  el: "#app",
  data: {
    startGame: false,
    won: undefined,
    logs: [],
    human: {
      health: 100
    },
    monster: {
      health: 100
    },
  },
  computed: {
    healthBarStyle() {
      return {
        human: {
          width: this.human.health > 0 ? this.human.health+'%' : 0
        },
        monster: {
          width: this.monster.health > 0 ? this.monster.health+'%' : 0
        }
      }
    }
  },
  methods: {
    start() {
      this.startGame = true
    },
    random(n) {
      return Math.floor(Math.random()*n)+1
    },
    attack(player) {
      let amount = this.random(20)
      this[player].health -= amount
      this.logIt(player, 'attack', amount)
      if (this.checkWin()) {
        this.won = 'Player'
        return
      }
      if (player=='monster') {
        this.attack('human')
        if (this.checkWin()) {
          this.won = 'Monster'
          return
        }
      }
    },
    specialAttack(player) {
      let amount = this.random(30)
      this[player].health -= amount
      this.logIt(player, 'attack', amount)
      if (player=='monster') {
        this.attack('human')
        if (this.checkWin()) {
          this.won = player
        }
      }
    },
    heal(player='human') {
      let amount = this.random(10)+10 // between 10 and 20
      if (this[player].health < 100) this[player].health += amount
      this.logIt(player, 'heal', amount)
      this.attack('human')
    },
    giveUp() {
      this.human.health=100
      this.monster.health=100
      this.logs=[]
      this.startGame=false
      this.won = undefined
    },
    logIt(player, action, n) {
      let otherPlayer = player=='human' ? 'Monster' : 'Player'
      switch (action) {
        case 'attack'||'specialAttack':
          this.logs.unshift(`<p class='${player}-turn'>${otherPlayer} ${action}ed ${player} for ${n}</p>`)
          break
        case 'heal':
          this.logs.unshift(`<p class='heal'>You ${action}ed for ${n}</p>`)
          break
        default:
          this.logs.unshift('Error') 
      }
    },
    checkWin() {
      return (this.human.health<=0 || this.monster.health<=0)
    }
  }
})