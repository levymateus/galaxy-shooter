import { createStore } from "utils/createStore"

const initialStoreState = {
  playerScore: 0,
  appIsPaused: false,
  appIsGameOver: false,
}

const stores = createStore(initialStoreState, {
  playerScore: (prevScore) => prevScore,
})

export default stores
