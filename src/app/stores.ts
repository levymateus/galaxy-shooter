import { createStore } from "utils/createStore"

const initialStoreState = {
  score: 0,
  paused: false,
}

const stores = createStore(initialStoreState, {
  score: (prevScore) => prevScore,
})

export default stores
