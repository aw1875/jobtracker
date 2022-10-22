import { GetServerSidePropsContext } from "next";
import { JobApplication } from "./types";

export const validateCookies = (context: GetServerSidePropsContext) => {
    const sessionId = context.req.cookies['connect.sid'];
    return sessionId ? { Cookie: `connect.sid=${sessionId}` } : false;
};

const dev = process.env.NODE_ENV === 'development';
export const API_URI = dev ? 'http://localhost:3000' : 'https://jobs.wolfyy.me';
export const GH_LOGIN_URI = dev ? 'http://localhost:3000/api/v1/auth/github' : 'https://jobs.wolfyy.me/api/v1/auth/github';
export const GH_LOGOUT_URI = dev ? 'http://localhost:3000/api/v1/auth/logout' : 'https://jobs.wolfyy.me/api/v1/auth/logout';

export const FilterFlow = {
    'Stale': (jobs: JobApplication[], query: string): JobApplication[] => {
        return jobs.filter((j) =>
            (j.company.toLowerCase().includes(query.toLowerCase())
                ||
                j.title.toLowerCase().includes(query.toLowerCase()))
            &&
            j.status === 'Stale'
        );
    },
    'Applied': (jobs: JobApplication[], query: string): JobApplication[] => {
        return jobs.filter((j) =>
            (j.company.toLowerCase().includes(query.toLowerCase())
                ||
                j.title.toLowerCase().includes(query.toLowerCase()))
            &&
            j.status === 'Applied'
        );
    },
    'Rejected': (jobs: JobApplication[], query: string): JobApplication[] => {
        return jobs.filter((j) =>
            (j.company.toLowerCase().includes(query.toLowerCase())
                ||
                j.title.toLowerCase().includes(query.toLowerCase()))
            &&
            j.status === 'Rejected'
        );
    },
    'Under Review': (jobs: JobApplication[], query: string): JobApplication[] => {
        return jobs.filter((j) =>
            (j.company.toLowerCase().includes(query.toLowerCase())
                ||
                j.title.toLowerCase().includes(query.toLowerCase()))
            &&
            j.status === 'Under Review'
        );
    },
    'Offered': (jobs: JobApplication[], query: string): JobApplication[] => {
        return jobs.filter((j) =>
            (j.company.toLowerCase().includes(query.toLowerCase())
                ||
                j.title.toLowerCase().includes(query.toLowerCase()))
            &&
            j.status === 'Offered'
        );
    },
    'Accepted': (jobs: JobApplication[], query: string): JobApplication[] => {
        return jobs.filter((j) =>
            (j.company.toLowerCase().includes(query.toLowerCase())
                ||
                j.title.toLowerCase().includes(query.toLowerCase()))
            &&
            j.status === 'Accepted'
        );
    },
    'All': (jobs: JobApplication[], query: string): JobApplication[] => {
        return jobs.filter((j) =>
            j.company.toLowerCase().includes(query.toLowerCase())
            ||
            j.title.toLowerCase().includes(query.toLowerCase())
        );
    }
}
