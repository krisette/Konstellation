import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../store";
import coseBilkent from 'cytoscape-cose-bilkent';
import cytoscape from 'cytoscape';
import { config } from '../constants/config'
import { Cluster } from './clusterView'

export type ClusterData = ClusterElement[];

export interface ClusterElement {
  id: string,
  label: string,
  type: string,
}

const initialState: Cluster = {
  data: [],
  status: 'idle'
}

// Included as a critical first step for troubleshooting:
console.log("Fetching Data From: ")
console.log(config.url + '/api/cluster')

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(getClusterData())`. This
// will call the thunk with the `getClusterData` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const getClusterAsync = createAsyncThunk(
  'clusterView/getCluster',
  async () => {
    const response = await fetch(config.url + '/api/cluster')
    const data = await response.json();
    return data;
  }
)

/**
   * Handles reducer logic related to the Cluster View
   */
export const clusterViewSlice = createSlice({
  name: 'clusterView',
  initialState: initialState,
  reducers: { 
    updateData:  (state, action: PayloadAction<ClusterData>) => {
      state.data = action.payload;
    }
  },

  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(getClusterAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getClusterAsync.fulfilled, (state, action: PayloadAction<ClusterData>) => {
        state.status = 'idle';
        state.data = action.payload;
      })
      .addCase(getClusterAsync.rejected, (state) => {
        state.status = 'failed';
      });
  }
})

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.getClusterAsnyc.data)`
export const selectCluster = (state: RootState) => state.cluster;

export default clusterViewSlice.reducer;