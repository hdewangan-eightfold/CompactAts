import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Candidate } from '../../types';
import { candidateApi } from '../../services/candidateApi';

interface CandidatesState {
    candidates: Candidate[];
    candidatesByPosition: { [positionId: string]: Candidate[] };
    loading: boolean;
    error: string | null;
}

const initialState: CandidatesState = {
    candidates: [],
    candidatesByPosition: {},
    loading: false,
    error: null,
};

// Async thunks
export const fetchAllCandidates = createAsyncThunk(
    'candidates/fetchAllCandidates',
    async () => {
        const response = await candidateApi.getAllCandidates();
        return response;
    }
);

export const fetchCandidateById = createAsyncThunk(
    'candidates/fetchCandidateById',
    async (id: string) => {
        const response = await candidateApi.getCandidateById(id);
        if (!response) {
            throw new Error('Candidate not found');
        }
        return response;
    }
);

export const fetchCandidatesByPosition = createAsyncThunk(
    'candidates/fetchCandidatesByPosition',
    async (positionId: string) => {
        const response = await candidateApi.getCandidatesByPosition(positionId);
        return { positionId, candidates: response };
    }
);

export const updateCandidate = createAsyncThunk(
    'candidates/updateCandidate',
    async ({ id, updates }: { id: string; updates: Partial<Omit<Candidate, 'id'>> }) => {
        const response = await candidateApi.updateCandidate(id, updates);
        if (!response) {
            throw new Error('Candidate not found');
        }
        return response;
    }
);

export const deleteCandidate = createAsyncThunk(
    'candidates/deleteCandidate',
    async (id: string) => {
        const success = await candidateApi.deleteCandidate(id);
        if (!success) {
            throw new Error('Failed to delete candidate');
        }
        return id;
    }
);

export const searchCandidates = createAsyncThunk(
    'candidates/searchCandidates',
    async (query: string) => {
        const response = await candidateApi.searchCandidates(query);
        return response;
    }
);

const candidatesSlice = createSlice({
    name: 'candidates',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all candidates
            .addCase(fetchAllCandidates.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllCandidates.fulfilled, (state, action) => {
                state.loading = false;
                state.candidates = action.payload;
            })
            .addCase(fetchAllCandidates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch candidates';
            })

            // Fetch candidates by position
            .addCase(fetchCandidatesByPosition.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCandidatesByPosition.fulfilled, (state, action) => {
                state.loading = false;
                state.candidatesByPosition[action.payload.positionId] = action.payload.candidates;
            })
            .addCase(fetchCandidatesByPosition.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch candidates';
            })

            // Update candidate
            .addCase(updateCandidate.fulfilled, (state, action) => {
                const index = state.candidates.findIndex(candidate => candidate.id === action.payload.id);
                if (index !== -1) {
                    state.candidates[index] = action.payload;
                }
                // Update in position-specific candidates
                Object.keys(state.candidatesByPosition).forEach(positionId => {
                    const posIndex = state.candidatesByPosition[positionId].findIndex(
                        candidate => candidate.id === action.payload.id
                    );
                    if (posIndex !== -1) {
                        state.candidatesByPosition[positionId][posIndex] = action.payload;
                    }
                });
            })

            // Delete candidate
            .addCase(deleteCandidate.fulfilled, (state, action) => {
                state.candidates = state.candidates.filter(candidate => candidate.id !== action.payload);
                // Remove from position-specific candidates
                Object.keys(state.candidatesByPosition).forEach(positionId => {
                    state.candidatesByPosition[positionId] = state.candidatesByPosition[positionId].filter(
                        candidate => candidate.id !== action.payload
                    );
                });
            });
    },
});

export const { clearError } = candidatesSlice.actions;
export default candidatesSlice.reducer;
