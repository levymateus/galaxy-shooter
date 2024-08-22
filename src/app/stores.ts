import { createStore } from "utils/createStore"

const initialStoreState = {
  score: 0,
}

export default createStore(initialStoreState, {
  score: (prevScore) => prevScore,
})
