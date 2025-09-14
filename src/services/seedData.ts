import { Position, Application, Candidate } from '../types';

// Helper function to generate random date within last 2 months
const getRandomPostingDate = (): string => {
    const now = new Date();
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(now.getMonth() - 2);

    const randomTime = twoMonthsAgo.getTime() + Math.random() * (now.getTime() - twoMonthsAgo.getTime());
    return new Date(randomTime).toISOString();
};

// Helper function to generate random application date within last month
const getRandomApplicationDate = (): string => {
    const now = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);

    const randomTime = oneMonthAgo.getTime() + Math.random() * (now.getTime() - oneMonthAgo.getTime());
    return new Date(randomTime).toISOString();
};

// Helper function to pick random item from array
const getRandomItem = <T>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)];
};

// Helper function to pick multiple random items from array
const getRandomItems = <T>(array: T[], count: number): T[] => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

// Data pools for generating realistic candidates
const firstNames = [
    'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'David', 'Elizabeth',
    'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Christopher', 'Karen',
    'Charles', 'Helen', 'Daniel', 'Nancy', 'Matthew', 'Lisa', 'Anthony', 'Betty', 'Mark', 'Dorothy',
    'Donald', 'Sandra', 'Steven', 'Donna', 'Paul', 'Carol', 'Andrew', 'Ruth', 'Joshua', 'Sharon',
    'Kenneth', 'Michelle', 'Kevin', 'Laura', 'Brian', 'Emily', 'George', 'Kimberly', 'Timothy', 'Deborah',
    'Ronald', 'Dorothy', 'Jason', 'Lisa', 'Edward', 'Nancy', 'Jeffrey', 'Karen', 'Ryan', 'Betty',
    'Jacob', 'Helen', 'Gary', 'Sandra', 'Nicholas', 'Donna', 'Eric', 'Carol', 'Jonathan', 'Ruth'
];

const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
    'Hernandez', 'Lopez', 'Gonzales', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
    'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
    'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
    'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'
];

const companies = [
    'TechCorp Inc.', 'InnovateLabs', 'DesignStudio', 'StartupX', 'CloudTech Solutions',
    'DataDriven Analytics', 'NextGen Software', 'Global Dynamics', 'FutureTech Systems', 'Digital Horizons',
    'Quantum Computing Co.', 'AI Ventures', 'CyberSec Solutions', 'Mobile First Labs', 'WebScale Technologies',
    'Enterprise Solutions Inc.', 'DevOps Masters', 'Cloud Nine Technologies', 'Blockchain Innovations', 'IoT Solutions Ltd.'
];

const locations = [
    'San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX', 'Boston, MA',
    'Los Angeles, CA', 'Chicago, IL', 'Denver, CO', 'Portland, OR', 'Atlanta, GA',
    'Miami, FL', 'Dallas, TX', 'Phoenix, AZ', 'Philadelphia, PA', 'San Diego, CA',
    'Remote', 'Hybrid - Bay Area', 'Hybrid - NYC', 'Remote (US)'
];

const jobTitles = [
    'Senior Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer',
    'Data Scientist', 'Machine Learning Engineer', 'Product Manager', 'UX Designer', 'UI Designer',
    'QA Engineer', 'Security Engineer', 'Cloud Architect', 'Mobile Developer', 'Data Analyst',
    'Technical Lead', 'Engineering Manager', 'Product Designer', 'Research Scientist', 'Solutions Architect'
];

const departments = [
    'Engineering', 'Product', 'Design', 'Data Science', 'DevOps', 'Security', 'Research',
    'Platform', 'Infrastructure', 'Mobile', 'AI/ML', 'Analytics'
];

const skillsPool = [
    'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Java', 'C++', 'C#',
    'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Flutter', 'React Native', 'Docker', 'Kubernetes',
    'AWS', 'Azure', 'GCP', 'Jenkins', 'GitLab CI', 'Terraform', 'Ansible', 'MongoDB', 'PostgreSQL', 'MySQL',
    'Redis', 'Elasticsearch', 'GraphQL', 'REST APIs', 'Microservices', 'Machine Learning', 'Deep Learning',
    'TensorFlow', 'PyTorch', 'Git', 'Agile', 'Scrum', 'Figma', 'Sketch', 'Jest', 'Cypress'
];

// Generate comprehensive positions data
const generatePositions = (): Position[] => {
    const positions: Position[] = [];

    // Create 30 positions across different companies and roles
    for (let i = 1; i <= 30; i++) {
        const company = getRandomItem(companies);
        const title = getRandomItem(jobTitles);
        const location = getRandomItem(locations);
        const department = getRandomItem(departments);
        const positionTypes = ['full-time', 'part-time', 'contract', 'internship'] as const;
        const positionStatuses = ['active', 'closed', 'draft'] as const;
        const type = positionTypes[Math.floor(Math.random() * positionTypes.length)];
        const status = i <= 25 ? 'active' as const : positionStatuses[Math.floor(Math.random() * positionStatuses.length)];

        const requirements = getRandomItems(skillsPool, Math.floor(Math.random() * 5) + 3);

        const descriptions = [
            `Join our ${department} team at ${company} as a ${title}. We're looking for someone passionate about technology and innovation who can contribute to our growing platform.`,
            `${company} is seeking a talented ${title} to join our dynamic team. You'll work on cutting-edge projects and collaborate with industry experts.`,
            `We are looking for an experienced ${title} to help drive our mission at ${company}. This role offers excellent growth opportunities and challenging projects.`
        ];

        positions.push({
            id: i.toString(),
            title,
            company,
            location,
            description: getRandomItem(descriptions),
            requirements: requirements.map(req => `${req} proficiency`),
            type,
            department,
            postedDate: getRandomPostingDate(),
            status
        });
    }

    return positions;
};

// Generate comprehensive candidates and applications
const generateCandidatesAndApplications = (positions: Position[]): { candidates: Candidate[], applications: Application[] } => {
    const candidates: Candidate[] = [];
    const applications: Application[] = [];

    // Generate 1000 candidates
    for (let i = 1; i <= 1000; i++) {
        const firstName = getRandomItem(firstNames);
        const lastName = getRandomItem(lastNames);
        const fullName = `${firstName} ${lastName}`;
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${getRandomItem(['gmail', 'yahoo', 'outlook', 'company'])}tech.com`;
        const phone = `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;

        // Each candidate applies to 1-3 positions (randomly)
        const numApplications = Math.floor(Math.random() * 3) + 1;
        const activePositions = positions.filter(p => p.status === 'active');
        const appliedPositions = getRandomItems(activePositions, Math.min(numApplications, activePositions.length));

        const candidateApplications: Application[] = [];

        appliedPositions.forEach((position, index) => {
            const appId = `app_${i}_${index + 1}`;
            const experience = Math.floor(Math.random() * 15) + 1;
            const candidateSkills = getRandomItems(skillsPool, Math.floor(Math.random() * 6) + 3);

            const coverLetters = [
                `I am excited to apply for the ${position.title} position at ${position.company}. With ${experience} years of experience in ${candidateSkills.slice(0, 2).join(' and ')}, I believe I would be a valuable addition to your team.`,
                `Having followed ${position.company}, I am impressed by your innovative approach. My background in ${candidateSkills.slice(0, 2).join(' and ')} aligns perfectly with the ${position.title} role requirements.`,
                `I am writing to express my interest in the ${position.title} position. My ${experience} years of experience in software development make me an ideal candidate for this role.`
            ];

            const resumeTemplates = [
                `Experienced ${position.title} with ${experience} years in software development. Proficient in ${candidateSkills.slice(0, 4).join(', ')}. Led successful projects and mentored developers.`,
                `${experience}+ years of experience in technology. Specializes in ${candidateSkills.slice(0, 3).join(', ')}. Track record of delivering scalable solutions.`,
                `Results-driven professional with ${experience} years of experience. Expert in ${candidateSkills.slice(0, 4).join(', ')}. Passionate about emerging technologies.`
            ];

            // Weight status distribution realistically
            let status: Application['status'];
            const rand = Math.random();
            if (rand < 0.4) status = 'pending';
            else if (rand < 0.65) status = 'reviewed';
            else if (rand < 0.8) status = 'shortlisted';
            else if (rand < 0.95) status = 'rejected';
            else status = 'hired';

            const application: Application = {
                id: appId,
                positionId: position.id,
                candidateName: fullName,
                email: email,
                phone: phone,
                resume: getRandomItem(resumeTemplates),
                coverLetter: getRandomItem(coverLetters),
                experience: experience,
                skills: candidateSkills,
                applicationDate: getRandomApplicationDate(),
                status: status
            };

            applications.push(application);
            candidateApplications.push(application);
        });

        const candidate: Candidate = {
            id: `cand_${i}`,
            name: fullName,
            email: email,
            phone: phone,
            applications: candidateApplications
        };

        candidates.push(candidate);
    }

    return { candidates, applications };
};

// Generate all data
const positions = generatePositions();
const { candidates, applications } = generateCandidatesAndApplications(positions);

export const samplePositions: Position[] = positions;
export const sampleApplications: Application[] = applications;
export const sampleCandidates: Candidate[] = candidates;

// Log statistics for development
console.log(`🎯 Generated comprehensive seed data:
📊 Positions: ${positions.length} (${positions.filter(p => p.status === 'active').length} active)
👥 Candidates: ${candidates.length}
📝 Applications: ${applications.length}
📈 Application Status Distribution:
   • Pending: ${applications.filter(a => a.status === 'pending').length}
   • Reviewed: ${applications.filter(a => a.status === 'reviewed').length}
   • Shortlisted: ${applications.filter(a => a.status === 'shortlisted').length}
   • Rejected: ${applications.filter(a => a.status === 'rejected').length}
   • Hired: ${applications.filter(a => a.status === 'hired').length}`);
