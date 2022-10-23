import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import moment from 'moment';

// Utils
import { addJobApplication } from '../../utils/api';
import { GH_LOGOUT_URI } from '../../utils/helper';

// Types
import { SearchResult, Header, ContextUser } from '../../utils/types';

// Icons
import { RiFileAddFill } from 'react-icons/ri';
import { MdLogout } from 'react-icons/md';
import { IoChevronBackCircleSharp } from 'react-icons/io5';
import Image from 'next/future/image';
import Link from 'next/link';

interface Props {
  headers: Header;
}

const AddPage: NextPage<Props> = ({ headers }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [currentCompany, setCurrentCompany] = useState<SearchResult | null>();

  // Refs
  const titleRef = useRef<HTMLInputElement>(null);
  const contactRef = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);

  const router = useRouter();

  const handleAddApplication = () => {
    addJobApplication(
      {
        company: currentCompany?.name ?? '',
        title: titleRef.current?.value ?? '',
        date: new Date(moment(Date.now()).toISOString()) ?? '',
        contact: contactRef.current?.value ?? '',
        status: 'Applied',
        location: locationRef.current?.value ?? '',
        notes: notesRef.current?.value ?? '',
        headers,
      },
      (status, id?) => {
        if (status === 201) {
          router.replace(`/job/${id}`);
        }

        if (status === 500) alert('Server error');
      },
    );
  };

  useEffect(() => {
    const searchAPI = async () => {
      const data = await fetch(
        `https://autocomplete.clearbit.com/v1/companies/suggest?query=${query}`,
      ).then((r) => r.json());
      setResults(data);
    };

    query ? searchAPI() : setResults([]);
  }, [query]);

  return (
    <div className="w-full min-h-screen bg-gray-800 pt-24 pb-8 px-4 md:px-20 select-none">
      <Navbar />

      <div className="w-full flex flex-col gap-y-8 bg-gray-700 rounded p-4 md:p-12">
        <div className="relative">
          {currentCompany ? (
            <div
              className="w-full flex items-center bg-white rounded gap-x-4 px-4 py-2 cursor-pointer"
              onClick={() => setCurrentCompany(null)}
            >
              <Image
                src={currentCompany.logo}
                height={32}
                width={32}
                className="w-8 h-8 rounded-full object-contain"
                alt={currentCompany.name}
              />
              <span className="flex flex-col gap-y-2">
                <p>{currentCompany.name}</p>
                <p>{currentCompany.domain}</p>
              </span>
            </div>
          ) : (
            <input
              type="text"
              placeholder="Company Name"
              className="input"
              value={query}
              onChange={({ target }) => setQuery(target.value)}
            />
          )}

          {query && (
            <div className="w-full p-4 absolute top-12 bg-white rounded flex flex-col gap-y-2 shadow-black shadow">
              {results.length === 0 ? (
                <p className="p-4 text-center text-gray-300">
                  No results for <span className="italic">{query}</span>
                </p>
              ) : (
                results.map((r: SearchResult, i: number) => (
                  <div
                    key={i}
                    className="w-full flex items-center gap-x-4 px-4 py-2 cursor-pointer rounded hover:bg-gray-700 hover:text-white"
                    onClick={() => {
                      setCurrentCompany(r);
                      setQuery('');
                      setResults([]);
                    }}
                  >
                    <Image
                      src={r.logo}
                      height={32}
                      width={32}
                      className="w-8 h-8 rounded-full object-contain"
                      alt={r.name}
                    />
                    <span className="flex flex-col gap-y-2">
                      <p>{r.name}</p>
                      <p>{r.domain}</p>
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <input
          type="text"
          placeholder="Job Title"
          className="input"
          ref={titleRef}
        />
        <input
          type="text"
          placeholder="Contact Name"
          className="input"
          ref={contactRef}
        />
        <input
          type="text"
          placeholder="Location"
          className="input"
          ref={locationRef}
        />
        <textarea
          className="h-48 p-4 text-black resize-none outline-none rounded"
          placeholder="Add your notes"
          ref={notesRef}
        />

        <button
          className="button-full text-green-900 bg-green-500"
          onClick={() => handleAddApplication()}
        >
          <RiFileAddFill size={16} />
          Add Job Application
        </button>
      </div>
    </div>
  );
};

const Navbar = () => {
  const router = useRouter();

  return (
    <div className="navbar">
      <button
        className="button text-gray-900 bg-gray-400"
        onClick={() => router.back()}
      >
        <IoChevronBackCircleSharp size={16} /> Back
      </button>

      <Link href={GH_LOGOUT_URI}>
        <button className="button text-red-900 bg-red-400">
          <MdLogout size={16} /> Logout
        </button>
      </Link>
    </div>
  );
};

export const getServerSideProps = async ({ req }: ContextUser) => {
  return req.user
    ? { props: { Cookie: `connect.sid=${req.cookies['connect.sid']}` } }
    : { redirect: { destination: '/' } };
};

export default AddPage;
