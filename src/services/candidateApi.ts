import { db } from './database';
import { Candidate } from '../types';
import { delay, logApiCall } from './mockApi';

export const candidateApi = {
    // Get all candidates
    async getAllCandidates(): Promise<Candidate[]> {
        await delay();

        const result = await db.candidates.toArray();
        logApiCall('candidateApi', 'getAllCandidates', undefined, result);

        return result;
    },

    // Get candidate by ID
    async getCandidateById(id: string): Promise<Candidate | undefined> {
        await delay();

        const result = await db.candidates.get(id);
        logApiCall('candidateApi', 'getCandidateById', { id }, result);

        return result;
    },

    // Get candidate by email
    async getCandidateByEmail(email: string): Promise<Candidate | undefined> {
        await delay();

        const result = await db.candidates.where('email').equals(email).first();
        logApiCall('candidateApi', 'getCandidateByEmail', { email }, result);

        return result;
    },

    // Get candidates who applied to a specific position
    async getCandidatesByPosition(positionId: string): Promise<Candidate[]> {
        await delay();

        const candidates = await db.candidates.toArray();
        const result = candidates.filter(candidate =>
            candidate.applications.some(app => app.positionId === positionId)
        );

        logApiCall('candidateApi', 'getCandidatesByPosition', { positionId }, result);

        return result;
    },

    // Update candidate information
    async updateCandidate(id: string, updates: Partial<Omit<Candidate, 'id'>>): Promise<Candidate | null> {
        await delay();

        const existing = await db.candidates.get(id);
        if (!existing) {
            logApiCall('candidateApi', 'updateCandidate', { id, updates }, null);
            return null;
        }

        const updated = { ...existing, ...updates };
        await db.candidates.update(id, updated);
        logApiCall('candidateApi', 'updateCandidate', { id, updates }, updated);

        return updated;
    },

    // Delete candidate
    async deleteCandidate(id: string): Promise<boolean> {
        await delay();

        const candidate = await db.candidates.get(id);
        if (!candidate) {
            logApiCall('candidateApi', 'deleteCandidate', { id }, { success: false, reason: 'Candidate not found' });
            return false;
        }

        // Delete all associated applications first
        for (const application of candidate.applications) {
            await db.applications.delete(application.id);
        }

        // Delete the candidate
        const count = await db.candidates.where('id').equals(id).delete();
        const result = count > 0;
        logApiCall('candidateApi', 'deleteCandidate', { id }, { success: result, deletedCount: count, applicationsDeleted: candidate.applications.length });

        return result;
    },

    // Search candidates
    async searchCandidates(query: string): Promise<Candidate[]> {
        await delay();

        const lowerQuery = query.toLowerCase();
        const result = await db.candidates
            .filter(candidate =>
                candidate.name.toLowerCase().includes(lowerQuery) ||
                candidate.email.toLowerCase().includes(lowerQuery)
            )
            .toArray();

        logApiCall('candidateApi', 'searchCandidates', { query }, result);

        return result;
    }
};
