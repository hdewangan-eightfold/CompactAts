import { db } from './database';
import { Application, Candidate } from '../types';
import { delay, logApiCall } from './mockApi';

export const applicationApi = {
    // Get all applications
    async getAllApplications(): Promise<Application[]> {
        await delay();

        const result = await db.applications.orderBy('applicationDate').reverse().toArray();
        logApiCall('applicationApi', 'getAllApplications', undefined, result);

        return result;
    },

    // Get applications by position ID
    async getApplicationsByPosition(positionId: string): Promise<Application[]> {
        await delay();

        const result = await db.applications.where('positionId').equals(positionId).toArray();
        logApiCall('applicationApi', 'getApplicationsByPosition', { positionId }, result);

        return result;
    },

    // Get application by ID
    async getApplicationById(id: string): Promise<Application | undefined> {
        await delay();

        const result = await db.applications.get(id);
        logApiCall('applicationApi', 'getApplicationById', { id }, result);

        return result;
    },

    // Create new application
    async createApplication(applicationData: Omit<Application, 'id' | 'applicationDate' | 'status'>): Promise<Application> {
        await delay();

        const newApplication: Application = {
            ...applicationData,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            applicationDate: new Date().toISOString(),
            status: 'pending'
        };

        // Add to applications table
        await db.applications.add(newApplication);

        // Check if candidate exists, if not create one
        let candidate = await db.candidates.where('email').equals(applicationData.email).first();

        if (!candidate) {
            const newCandidate: Candidate = {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                name: applicationData.candidateName,
                email: applicationData.email,
                phone: applicationData.phone,
                applications: [newApplication]
            };
            await db.candidates.add(newCandidate);
        } else {
            // Update existing candidate's applications
            const updatedApplications = [...candidate.applications, newApplication];
            await db.candidates.update(candidate.id, { applications: updatedApplications });
        }

        logApiCall('applicationApi', 'createApplication', applicationData, newApplication);

        return newApplication;
    },

    // Update application status
    async updateApplicationStatus(id: string, status: Application['status']): Promise<Application | null> {
        await delay();

        const existing = await db.applications.get(id);
        if (!existing) {
            logApiCall('applicationApi', 'updateApplicationStatus', { id, status }, null);
            return null;
        }

        const updated = { ...existing, status };
        await db.applications.update(id, updated);

        // Also update in candidate's applications
        const candidate = await db.candidates.where('email').equals(existing.email).first();
        if (candidate) {
            const updatedApplications = candidate.applications.map(app =>
                app.id === id ? updated : app
            );
            await db.candidates.update(candidate.id, { applications: updatedApplications });
        }

        logApiCall('applicationApi', 'updateApplicationStatus', { id, status }, updated);

        return updated;
    },

    // Delete application
    async deleteApplication(id: string): Promise<boolean> {
        await delay();

        const application = await db.applications.get(id);
        if (!application) {
            logApiCall('applicationApi', 'deleteApplication', { id }, { success: false, reason: 'Application not found' });
            return false;
        }

        // Remove from applications table
        const count = await db.applications.where('id').equals(id).delete();

        // Remove from candidate's applications
        const candidate = await db.candidates.where('email').equals(application.email).first();
        if (candidate) {
            const updatedApplications = candidate.applications.filter(app => app.id !== id);
            if (updatedApplications.length === 0) {
                // If no applications left, remove candidate
                await db.candidates.delete(candidate.id);
            } else {
                await db.candidates.update(candidate.id, { applications: updatedApplications });
            }
        }

        const result = count > 0;
        logApiCall('applicationApi', 'deleteApplication', { id }, { success: result, deletedCount: count });

        return result;
    },

    // Get applications by status
    async getApplicationsByStatus(status: Application['status']): Promise<Application[]> {
        await delay();

        const result = await db.applications.where('status').equals(status).toArray();
        logApiCall('applicationApi', 'getApplicationsByStatus', { status }, result);

        return result;
    }
};
