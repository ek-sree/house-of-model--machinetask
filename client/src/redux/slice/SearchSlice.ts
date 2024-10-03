import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  searchQuery: string;
  isSearching: boolean;
}

const initialState: SearchState = {
  searchQuery: '',
  isSearching: false,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearSearchQuery: (state) => {
      state.searchQuery = '';
      state.isSearching = false;
    },
    initiateSearch: (state) => {
      state.isSearching = true;
    },
  },
});

export const { setSearchQuery, clearSearchQuery, initiateSearch } = searchSlice.actions;
export default searchSlice;