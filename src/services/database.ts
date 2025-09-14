import Dexie, { Table } from 'dexie';
import { Position, Application, Candidate } from '../types';

export class RecruitmentDatabase extends Dexie {
    positions!: Table<Position>;
    applications!: Table<Application>;
    candidates!: Table<Candidate>;

    constructor() {
        super('RecruitmentDatabase');
        this.version(1).stores({
            positions: 'id, title, company, location, type, department, status, postedDate',
            applications: 'id, positionId, candidateName, email, status, applicationDate',
            candidates: 'id, name, email'
        });
    }
}

export const db = new RecruitmentDatabase();
