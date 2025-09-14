import { db } from './database';
import { samplePositions, sampleApplications, sampleCandidates } from './seedData';

export async function initializeDatabase(): Promise<void> {
    try {
        // Check if data already exists
        const positionsCount = await db.positions.count();

        if (positionsCount === 0) {
            console.log('Seeding database with initial data...');

            // Add sample data
            await db.positions.bulkAdd(samplePositions);
            await db.applications.bulkAdd(sampleApplications);
            await db.candidates.bulkAdd(sampleCandidates);

            console.log('Database seeded successfully!');
        } else {
            console.log('Database already has data, skipping seeding.');
        }
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

export async function clearDatabase(): Promise<void> {
    try {
        await db.positions.clear();
        await db.applications.clear();
        await db.candidates.clear();
        console.log('Database cleared successfully!');
    } catch (error) {
        console.error('Error clearing database:', error);
    }
}

export async function resetDatabase(): Promise<void> {
    try {
        await clearDatabase();
        await initializeDatabase();
        console.log('Database reset successfully!');
    } catch (error) {
        console.error('Error resetting database:', error);
    }
}
