import { db } from './database';
import { Position } from '../types';
import { delay, logApiCall } from './mockApi';

export const positionApi = {
    // Get all positions
    async getAllPositions(): Promise<Position[]> {
        await delay();

        const result = await db.positions.orderBy('postedDate').reverse().toArray();
        logApiCall('positionApi', 'getAllPositions', undefined, result);

        return result;
    },

    // Get position by ID
    async getPositionById(id: string): Promise<Position | undefined> {
        await delay();

        const result = await db.positions.get(id);
        logApiCall('positionApi', 'getPositionById', { id }, result);

        return result;
    },

    // Get positions by status
    async getPositionsByStatus(status: Position['status']): Promise<Position[]> {
        await delay();

        const result = await db.positions.where('status').equals(status).toArray();
        logApiCall('positionApi', 'getPositionsByStatus', { status }, result);

        return result;
    },

    // Create new position
    async createPosition(position: Omit<Position, 'id'>): Promise<Position> {
        await delay();

        const newPosition: Position = {
            ...position,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            postedDate: new Date().toISOString(),
            status: 'active'
        };

        await db.positions.add(newPosition);
        logApiCall('positionApi', 'createPosition', position, newPosition);

        return newPosition;
    },

    // Update position
    async updatePosition(id: string, updates: Partial<Position>): Promise<Position | null> {
        await delay();

        const existing = await db.positions.get(id);
        if (!existing) {
            logApiCall('positionApi', 'updatePosition', { id, updates }, null);
            return null;
        }

        const updated = { ...existing, ...updates };
        await db.positions.update(id, updated);
        logApiCall('positionApi', 'updatePosition', { id, updates }, updated);

        return updated;
    },

    // Delete position
    async deletePosition(id: string): Promise<boolean> {
        await delay();

        const count = await db.positions.where('id').equals(id).delete();
        const result = count > 0;
        logApiCall('positionApi', 'deletePosition', { id }, { success: result, deletedCount: count });

        return result;
    },

    // Search positions
    async searchPositions(query: string): Promise<Position[]> {
        await delay();

        const lowerQuery = query.toLowerCase();
        const result = await db.positions
            .filter(position =>
                position.title.toLowerCase().includes(lowerQuery) ||
                position.company.toLowerCase().includes(lowerQuery) ||
                position.location.toLowerCase().includes(lowerQuery) ||
                position.department.toLowerCase().includes(lowerQuery)
            )
            .toArray();

        logApiCall('positionApi', 'searchPositions', { query }, result);

        return result;
    }
};
