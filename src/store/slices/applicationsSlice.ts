import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Application } from '../../types';
import { applicationApi } from '../../services/applicationApi';

interface ApplicationsState {
    applications: Application[];
    applicationsByPosition: { [positionId: string]: Application[] };
    loading: boolean;
    error: string | null;
    submitting: boolean;
}

const initialState: ApplicationsState = {
    applications: [],
    applicationsByPosition: {},
    loading: false,
    error: null,
    submitting: false,
};

// Async thunks
export const fetchAllApplications = createAsyncThunk(
    'applications/fetchAllApplications',
    async () => {
        const response = await applicationApi.getAllApplications();
        return response;
    }
);

export const fetchApplicationsByPosition = createAsyncThunk(
    'applications/fetchApplicationsByPosition',
    async (positionId: string) => {
        const response = await applicationApi.getApplicationsByPosition(positionId);
        return { positionId, applications: response };
    }
);

export const fetchApplicationById = createAsyncThunk(
    'applications/fetchApplicationById',
    async (id: string) => {
        const response = await applicationApi.getApplicationById(id);
        if (!response) {
            throw new Error('Application not found');
        }
        return response;
    }
);

export const createApplication = createAsyncThunk(
    'applications/createApplication',
    async (applicationData: Omit<Application, 'id' | 'applicationDate' | 'status'>) => {
        const response = await applicationApi.createApplication(applicationData);
        return response;
    }
);

export const updateApplicationStatus = createAsyncThunk(
    'applications/updateApplicationStatus',
    async ({ id, status }: { id: string; status: Application['status'] }) => {
        const response = await applicationApi.updateApplicationStatus(id, status);
        if (!response) {
            throw new Error('Application not found');
        }
        return response;
    }
);

export const deleteApplication = createAsyncThunk(
    'applications/deleteApplication',
    async (id: string) => {
        const success = await applicationApi.deleteApplication(id);
        if (!success) {
            throw new Error('Failed to delete application');
        }
        return id;
    }
);

export const fetchApplicationsByStatus = createAsyncThunk(
    'applications/fetchApplicationsByStatus',
    async (status: Application['status']) => {
        const response = await applicationApi.getApplicationsByStatus(status);
        return response;
    }
);

const applicationsSlice = createSlice({
    name: 'applications',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setSubmitting: (state, action: PayloadAction<boolean>) => {
            state.submitting = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all applications
            .addCase(fetchAllApplications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllApplications.fulfilled, (state, action) => {
                state.loading = false;
                state.applications = action.payload;
            })
            .addCase(fetchAllApplications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch applications';
            })

            // Fetch applications by position
            .addCase(fetchApplicationsByPosition.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchApplicationsByPosition.fulfilled, (state, action) => {
                state.loading = false;
                state.applicationsByPosition[action.payload.positionId] = action.payload.applications;
            })
            .addCase(fetchApplicationsByPosition.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch applications';
            })

            // Create application
            .addCase(createApplication.pending, (state) => {
                state.submitting = true;
                state.error = null;
            })
            .addCase(createApplication.fulfilled, (state, action) => {
                state.submitting = false;
                state.applications.unshift(action.payload);
                // Update position-specific applications if they exist
                const positionId = action.payload.positionId;
                if (state.applicationsByPosition[positionId]) {
                    state.applicationsByPosition[positionId].unshift(action.payload);
                }
            })
            .addCase(createApplication.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.error.message || 'Failed to submit application';
            })

            // Update application status
            .addCase(updateApplicationStatus.fulfilled, (state, action) => {
                // Update in main applications array
                const index = state.applications.findIndex(app => app.id === action.payload.id);
                if (index !== -1) {
                    state.applications[index] = action.payload;
                }

                // Update in position-specific applications
                const positionId = action.payload.positionId;
                if (state.applicationsByPosition[positionId]) {
                    const posIndex = state.applicationsByPosition[positionId].findIndex(app => app.id === action.payload.id);
                    if (posIndex !== -1) {
                        state.applicationsByPosition[positionId][posIndex] = action.payload;
                    }
                }
            })
            .addCase(updateApplicationStatus.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to update application status';
            })

            // Delete application
            .addCase(deleteApplication.fulfilled, (state, action) => {
                state.applications = state.applications.filter(app => app.id !== action.payload);
                // Remove from position-specific applications
                Object.keys(state.applicationsByPosition).forEach(positionId => {
                    state.applicationsByPosition[positionId] = state.applicationsByPosition[positionId].filter(
                        app => app.id !== action.payload
                    );
                });
            });
    },
});

export const { clearError, setSubmitting } = applicationsSlice.actions;
export default applicationsSlice.reducer;
