// todo: fix typing in this file (affects [id].tsx)
import { createSlice } from "@reduxjs/toolkit";
import type { AnyAction } from "@reduxjs/toolkit";
import type { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";

// Type for our state
export interface ArtPromptErrorState {
	error: boolean;
  }
  
  // Initial state
  const initialState: ArtPromptErrorState = {
	error: false,
  };
  
  // Actual Slice
export const artPromptErrorSlice = createSlice({
	name: "artPromptError",
	initialState,
	reducers: {
		// Action to set the authentication status
		setArtPromptErrorState(state, action: AnyAction) {
			state.error = action.payload;
		},

		// Special reducer for hydrating the state. Special case for next-redux-wrapper
		extraReducers: {
			[HYDRATE]: (state, action) => {
			return {
				...state,
				...action.payload.artPromptError,
			};
		},
	},

	},
});
  
  export const { setArtPromptErrorState } = artPromptErrorSlice.actions;
  
  export const selectArtPromptErrorState = (state: AppState) => state.artPromptError.error;
  
  export default artPromptErrorSlice.reducer;