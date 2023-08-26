import { createSlice } from '@reduxjs/toolkit'
import { gameState } from '../../types/main'


const initialState: gameState = {
  gamePlaying:false,
  gameEnded:false,
}

export const gameStateSlice = createSlice({
  name: 'gameSettings',
  initialState,
  reducers: {
    startState: (state) => {
      state.gamePlaying = true,
      state.gameEnded = false
    },
    endState: (state) => {
      state.gamePlaying = false,
      state.gameEnded = true
    },
    
  },
})

// Action creators are generated for each case reducer function
export const { startState, endState } = gameStateSlice.actions

export default gameStateSlice.reducer