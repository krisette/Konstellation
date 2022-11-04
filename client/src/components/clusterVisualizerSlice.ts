import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../lib/store";
import coseBilkent from 'cytoscape-cose-bilkent';
import cytoscape from 'cytoscape';
import { config } from '../../constants/config'
import {env} from '../../../lib/env'

export type ClusterData = ClusterElement[];

export interface ClusterElement {
  id: string,
  label: string,
  type: string,
}

export interface Cluster {
  data: ClusterData | undefined
  status: 'idle' | 'loading' | 'failed';
}

const initialState: Cluster = {
  data: undefined,
  status: 'idle'
}

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(getClusterData())`. This
// will call the thunk with the `getClusterData` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
cytoscape.use(coseBilkent);

console.log(config.url + '/api/cluster')

// console.log(config.url);
export const getClusterAsync = createAsyncThunk(
  'clusterVisualizer/getData',
  async () => {
    const response = await fetch(config.url + '/api/cluster')
    const data = await response.json();
    console.log("RAW DATA from Fetch")
    console.log(data);
    return data;
  }
)

export const clusterVisualizerSlice = createSlice({
  name: 'clusterVisualizer',
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
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectElements = (state: RootState) => 
{
  return state.cluster.data;
}

export default clusterVisualizerSlice.reducer;