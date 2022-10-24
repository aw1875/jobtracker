import { GetServerSidePropsContext } from 'next';
import { validateCookies, API_URI } from './helper';
import {
  DeleteJobProps,
  AddJobProps,
  UpdateJobProps,
  Header,
  JobApplication,
} from './types';

// export const getUserJobs = async (context: GetServerSidePropsContext) => {
//   const headers = validateCookies(context);
//   if (!headers) return { redirect: { destination: '/' } };

//   try {
//     const { jobs, pages } = await fetch(`${API_URI}/api/v1/job`, { headers }).then((r) =>
//       r.json(),
//     );
//     return { props: { jobs, pages, headers } };
//   } catch (err) {
//     return { redirect: { destination: '/' } };
//   }
// };

export const getUserJobs = async (
  page: number,
  context?: GetServerSidePropsContext | null,
  headers?: Header,
  cb?: (jobs: JobApplication[]) => void,
) => {
  if (context) {
    const headers = validateCookies(context);
    if (!headers) return { redirect: { destination: '/' } };

    try {
      const { jobs, pages } = await fetch(`${API_URI}/api/v1/job`, {
        headers,
      }).then((r) => r.json());
      return { props: { jobs, pages, headers } };
    } catch (err) {
      return { redirect: { destination: '/' } };
    }
  } else {
    try {
      const { jobs } = await fetch(`${API_URI}/api/v1/job?page=${page}`, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: { ...headers },
      }).then((r) => r.json());

      cb?.(jobs);
    } catch (err) {
      return cb?.([]);
    }
  }
};

export const getJobById = async (
  id: string,
  context: GetServerSidePropsContext,
) => {
  const headers = validateCookies(context);
  if (!headers || !id) return { redirect: { destination: '/' } };

  try {
    const job = await fetch(`${API_URI}/api/v1/job/${id}`, { headers }).then(
      (r) => r.json(),
    );
    return { props: { job, headers } };
  } catch (err) {
    return { redirect: { destination: '/home' } };
  }
};

export const updateJobDetails = async (
  { _id, status, notes, headers }: UpdateJobProps,
  cb: (status: number) => void,
) => {
  await fetch(`${API_URI}/api/v1/job/${_id}`, {
    method: 'PATCH',
    mode: 'cors',
    credentials: 'include',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body:
      status !== '' ? JSON.stringify({ status }) : JSON.stringify({ notes }),
  })
    .then((r) => cb(r.status))
    .catch((e) => cb(e.status));
};

export const addJobApplication = async (
  {
    company,
    title,
    date,
    contact,
    status,
    location,
    notes,
    headers,
  }: AddJobProps,
  cb: (status: number, id?: string) => void,
) => {
  await fetch(`${API_URI}/api/v1/job`, {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      company,
      title,
      date,
      contact,
      status,
      location,
      notes,
    }),
  })
    .then(async (r) => {
      return r.json().then((data) => {
        cb(r.status, data.id);
      });
    })
    .catch(({ status }) => cb(status));
};

export const deleteJobApplication = async (
  { _id, headers }: DeleteJobProps,
  cb: (status: number) => void,
) => {
  await fetch(`${API_URI}/api/v1/job/${_id}`, {
    method: 'DELETE',
    mode: 'cors',
    credentials: 'include',
    headers: { ...headers, 'Content-Type': 'application/json' },
  })
    .then(({ status }) => cb(status))
    .catch(({ status }) => cb(status));
};
