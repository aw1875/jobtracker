import type { GetServerSidePropsContext, NextPage } from 'next';
import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';

import { GH_LOGIN_URI } from '../utils/helper';

const Home: NextPage = () => {
  return (
    <div className="w-full min-h-screen bg-gray-800 p-4 flex justify-center items-center">
      <Link href={GH_LOGIN_URI}>
        <button className="w-full sm:w-auto bg-github-dark px-8 py-4 rounded text-github-white flex justify-center items-center gap-x-4">
          <FaGithub size={24} />
          <p className="font-medium">Log In with GitHub</p>
        </button>
      </Link>
    </div>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const sessionId = context.req.cookies['connect.sid'];
  return !sessionId ? { props: {} } : { redirect: { destination: '/home' } };
};

export default Home;
