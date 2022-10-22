import { useEffect, useState } from 'react';
import Image from 'next/future/image';
import moment from 'moment';

// Icons
import { MdDateRange, MdPermContactCalendar } from 'react-icons/md';

// Types
import type { Dispatch, SetStateAction } from 'react';
import type { JobApplication } from '../utils/types';

interface JobCardProps extends JobApplication {
  setShowAdd?: Dispatch<SetStateAction<boolean>>;
  showStatusMenu?: boolean;
  setShowStatusMenu?: Dispatch<SetStateAction<boolean>>;
}

const JobCard = (Props: JobCardProps) => {
  return (
    <div>
      {/* Small Layout */}
      <div className="flex flex-col gap-y-4 lg:hidden w-full bg-gray-700 text-white rounded justify-center items-center py-4 px-8">
        {/* Job Info */}
        <div className="w-full flex gap-x-10 justify-start items-center">
          <JobInfo {...Props} />
        </div>

        <div className="w-full grid grid-cols-2 sm:grid-cols-3 items-center gap-4">
          {/* Application Date */}
          <ApplicationDate {...Props} />

          {/* Company Contact */}
          <Contact {...Props} />

          {/* Application Status */}
          <Status {...Props} />
        </div>
      </div>

      {/* Large Layout */}
      <div className="hidden lg:grid w-full bg-gray-700 text-white rounded grid-cols-5 gap-x-4 items-center py-4 px-8">
        {/* Job Info */}
        <div className="w-full flex gap-x-10 justify-start items-center col-span-2">
          <JobInfo {...Props} />
        </div>

        {/* Application Date */}
        <ApplicationDate {...Props} />

        {/* Company Contact */}
        <Contact {...Props} />

        {/* Application Status */}
        <Status {...Props} />
      </div>
    </div>
  );
};

const JobInfo = ({ company, title }: JobCardProps) => {
  const [image, setImage] = useState('');

  useEffect(() => {
    const getImage = async () => {
      const data = await fetch(
        `https://autocomplete.clearbit.com/v1/companies/suggest?query=${company.replace(
          /\s/g,
          '',
        )}`,
      ).then((r) => r.json());
      setImage(data[0].logo);
    };

    getImage().catch(console.error);
  }, [company]);

  return (
    <div className="flex justify-center items-center gap-x-4">
      {!image ? (
        <div className="w-14 h-14 rounded-full bg-white p-1 animate-pulse" />
      ) : (
        <Image
          src={image}
          height="56"
          width="56"
          className="w-14 h-14 rounded-full bg-white p-1 object-contain"
          alt={company}
        />
      )}

      <div className="flex flex-col">
        <span className="font-bold text-sm">{company}</span>
        <span className="">{title}</span>
      </div>
    </div>
  );
};

const ApplicationDate = ({ date }: JobCardProps) => {
  return (
    <div className="w-full flex justify-center items-center">
      <span className="flex gap-x-2 items-center text-sm">
        <MdDateRange size={16} />
        {moment(date).format('MM/D/YYYY')}
      </span>
    </div>
  );
};

const Contact = ({ contact }: JobCardProps) => {
  return (
    <div className="w-full flex justify-center items-center">
      <span className="flex gap-x-2 items-center text-sm">
        <MdPermContactCalendar size={16} />
        {contact || 'None'}
      </span>
    </div>
  );
};

const Status = ({ status }: { status: string }) => {
  switch (status) {
    case 'Applied': {
      return <span className="status bg-blue-400">{status}</span>;
    }

    case 'Under Review': {
      return <span className="status bg-orange-300">{status}</span>;
    }

    case 'Offered': {
      return <span className="status bg-green-300">{status}</span>;
    }

    case 'Accepted': {
      return <span className="status bg-green-500">{status}</span>;
    }

    case 'Rejected': {
      return <span className="status bg-red-500">{status}</span>;
    }

    default: {
      return <span className="status bg-gray-400">{status}</span>;
    }
  }
};

export default JobCard;
