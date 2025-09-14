export interface Position {
    id: string;
    title: string;
    company: string;
    location: string;
    description: string;
    requirements: string[];
    type: 'full-time' | 'part-time' | 'contract' | 'internship';
    department: string;
    postedDate: string;
    status: 'active' | 'closed' | 'draft';
}

export interface Application {
    id: string;
    positionId: string;
    candidateName: string;
    email: string;
    phone: string;
    resume: string; // URL or base64 string
    coverLetter: string;
    experience: number; // years
    skills: string[];
    applicationDate: string;
    status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
}

export interface Candidate {
    id: string;
    name: string;
    email: string;
    phone: string;
    applications: Application[];
}
