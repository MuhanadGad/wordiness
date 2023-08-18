import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { gameSettingsState } from '../../types/main'


const initialState: gameSettingsState = {
  selectedWordLength: 4,
  dark:false
}

export const gameSettingsSlice = createSlice({
  name: 'gameSettings',
  initialState,
  reducers: {
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.selectedWordLength += 1
    },
    decrement: (state) => {
      state.selectedWordLength -= 1
    },
    setAmount: (state, action: PayloadAction<number>) => {
      state.selectedWordLength = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { increment, decrement, setAmount } = gameSettingsSlice.actions

export default gameSettingsSlice.reducer