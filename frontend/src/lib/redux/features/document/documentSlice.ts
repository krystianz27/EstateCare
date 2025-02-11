import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DocumentState {
  page: number;
  filterType: "owned" | "shared" | string;
}

const initialState: DocumentState = {
  page: 1,
  filterType: "owned",
};

const documentSlice = createSlice({
  name: "document",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setFilterType: (
      state,
      action: PayloadAction<"owned" | "shared" | string>,
    ) => {
      state.filterType = action.payload;
    },
  },
});

export const { setCurrentPage, setFilterType } = documentSlice.actions;
export default documentSlice.reducer;
