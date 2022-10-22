import { GetServerSidePropsContext, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

// Components
import JobCard from "../../components/JobCard";

// Utils
import { getUserJobs } from "../../utils/api";
import { GH_LOGOUT_URI, FilterFlow } from "../../utils/helper";

// Icons
import { RiFileAddFill } from "react-icons/ri";
import { FaFilter } from "react-icons/fa";
import { MdLogout } from "react-icons/md";

// Types
import { JobApplication } from "../../utils/types";

type Props = {
  jobs: JobApplication[];
};

const HomePage: NextPage<Props> = ({ jobs }) => {
  const [showFilters, setShowFilters] = useState(false);

  // Filter States
  const [query, setQuery] = useState("");
  const [jobCategoryFilter, setJobCategoryFilter] = useState("All");

  const filterJobs = (): JobApplication[] => {
    return FilterFlow[jobCategoryFilter as keyof typeof FilterFlow](
      jobs,
      query
    );
  };

  const filteredJobs =
    query || jobCategoryFilter !== "All" ? filterJobs() : jobs;

  return (
    <div className="w-full min-h-screen bg-gray-800 pt-36 pb-8 px-4 md:px-20 select-none">
      <Navbar />
      <div className="w-auto flex flex-col gap-y-2 fixed top-20 inset-x-4 md:inset-x-20 justify-between items-center bg-gray-700 text-white shadow-black shadow-md rounded py-2 px-4">
        <div className="w-full flex gap-x-2 justify-between items-center">
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-gray-600 px-4 py-[6px] rounded text-white outline-none"
            value={query}
            onChange={({ target }) => setQuery(target.value)}
          />
          <button
            className="button text-yellow-900 bg-yellow-400"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter size={16} /> Filters
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 w-full">
            <button
              className="filter-status bg-gray-400"
              onClick={() => setJobCategoryFilter("Stale")}
            >
              Stale
            </button>
            <button
              className="filter-status bg-blue-400"
              onClick={() => setJobCategoryFilter("Applied")}
            >
              Applied
            </button>
            <button
              className="filter-status bg-red-500"
              onClick={() => setJobCategoryFilter("Rejected")}
            >
              Rejected
            </button>
            <button
              className="filter-status bg-orange-300"
              onClick={() => setJobCategoryFilter("Under Review")}
            >
              Under Review
            </button>
            <button
              className="filter-status bg-green-300"
              onClick={() => setJobCategoryFilter("Offered")}
            >
              Offered
            </button>
            <button
              className="filter-status bg-green-500"
              onClick={() => setJobCategoryFilter("Accepted")}
            >
              Accepted
            </button>
            <button
              className="filter-status bg-gray-500 col-span-2 md:col-span-3"
              onClick={() => setJobCategoryFilter("All")}
            >
              All
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col justify-center items-center gap-y-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((j: JobApplication) => (
            <Link key={j._id} href={`/job/${j._id}`}>
              <a className="w-full">
                <JobCard {...j} />
              </a>
            </Link>
          ))
        ) : (
          <p className="p-4 text-center text-gray-300">No Applications</p>
        )}
      </div>
    </div>
  );
};

const Navbar = () => {
  const router = useRouter();

  return (
    <div className="navbar">
      <button
        className="button text-green-900 bg-green-400"
        onClick={() => router.push("/add")}
      >
        <RiFileAddFill size={16} /> Add Application
      </button>

      <Link href={GH_LOGOUT_URI}>
        <button className="button text-red-900 bg-red-400">
          <MdLogout size={16} /> Logout
        </button>
      </Link>
    </div>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  return getUserJobs(context);
};

export default HomePage;
