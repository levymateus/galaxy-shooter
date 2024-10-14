
export class PlayerScore {
  private static MIN_SCORE_VALUE = 0
  
  score = 0

  inc(amount: number) {
    this.score += amount
    return this.score
  }

  dec(amount: number) {
    if (this.score - amount < PlayerScore.MIN_SCORE_VALUE)
      this.score = PlayerScore.MIN_SCORE_VALUE
    else
      this.score -= amount
    return this.score
  }

  save() {
    console.warn('[PlayerScore] Can`t save.')
  }

  reset() {
    this.score = PlayerScore.MIN_SCORE_VALUE
  }
}
