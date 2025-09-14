import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Position } from '../../types';
import { positionApi } from '../../services/positionApi';

interface PositionsState {
    positions: Position[];
    currentPosition: Position | null;
    loading: boolean;
    error: string | null;
    searchQuery: string;
}

const initialState: PositionsState = {
    positions: [],
    currentPosition: null,
    loading: false,
    error: null,
    searchQuery: '',
};

// Async thunks
export const fetchPositions = createAsyncThunk(
    'positions/fetchPositions',
    async () => {
        const response = await positionApi.getAllPositions();
        return response;
    }
);

export const fetchPositionById = createAsyncThunk(
    'positions/fetchPositionById',
    async (id: string) => {
        const response = await positionApi.getPositionById(id);
        if (!response) {
            throw new Error('Position not found');
        }
        return response;
    }
);

export const searchPositions = createAsyncThunk(
    'positions/searchPositions',
    async (query: string) => {
        const response = await positionApi.searchPositions(query);
        return response;
    }
);

export const createPosition = createAsyncThunk(
    'positions/createPosition',
    async (positionData: Omit<Position, 'id'>) => {
        const response = await positionApi.createPosition(positionData);
        return response;
    }
);

export const updatePosition = createAsyncThunk(
    'positions/updatePosition',
    async ({ id, updates }: { id: string; updates: Partial<Position> }) => {
        const response = await positionApi.updatePosition(id, updates);
        if (!response) {
            throw new Error('Position not found');
        }
        return response;
    }
);

export const deletePosition = createAsyncThunk(
    'positions/deletePosition',
    async (id: string) => {
        const success = await positionApi.deletePosition(id);
        if (!success) {
            throw new Error('Failed to delete position');
        }
        return id;
    }
);

const positionsSlice = createSlice({
    name: 'positions',
    initialState,
    reducers: {
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
        },
        clearCurrentPosition: (state) => {
            state.currentPosition = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch positions
            .addCase(fetchPositions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPositions.fulfilled, (state, action) => {
                state.loading = false;
                state.positions = action.payload;
            })
            .addCase(fetchPositions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch positions';
            })

            // Fetch position by ID
            .addCase(fetchPositionById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPositionById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentPosition = action.payload;
            })
            .addCase(fetchPositionById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch position';
            })

            // Search positions
            .addCase(searchPositions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchPositions.fulfilled, (state, action) => {
                state.loading = false;
                state.positions = action.payload;
            })
            .addCase(searchPositions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to search positions';
            })

            // Create position
            .addCase(createPosition.fulfilled, (state, action) => {
                state.positions.unshift(action.payload);
            })

            // Update position
            .addCase(updatePosition.fulfilled, (state, action) => {
                const index = state.positions.findIndex(pos => pos.id === action.payload.id);
                if (index !== -1) {
                    state.positions[index] = action.payload;
                }
                if (state.currentPosition?.id === action.payload.id) {
                    state.currentPosition = action.payload;
                }
            })

            // Delete position
            .addCase(deletePosition.fulfilled, (state, action) => {
                state.positions = state.positions.filter(pos => pos.id !== action.payload);
                if (state.currentPosition?.id === action.payload) {
                    state.currentPosition = null;
                }
            });
    },
});

export const { setSearchQuery, clearCurrentPosition, clearError } = positionsSlice.actions;
export default positionsSlice.reducer;
