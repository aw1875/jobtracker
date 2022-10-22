import { useEffect, useRef, useState } from "react";
import { GetServerSidePropsContext, NextPage } from "next";
import Image from "next/future/image";
import { useRouter } from "next/router";
import moment from "moment";

// Utils
import {
  deleteJobApplication,
  getJobById,
  updateJobDetails,
} from "../../utils/api";
import { GH_LOGOUT_URI } from "../../utils/helper";

// Icons
import {
  MdDateRange,
  MdLocationPin,
  MdPermContactCalendar,
  MdCancel,
  MdLogout,
} from "react-icons/md";
import { FaTrash, FaEdit, FaSave } from "react-icons/fa";
import { GiConfirmed } from "react-icons/gi";
import { IoChevronBackCircleSharp } from "react-icons/io5";

// Types
import type { Header, JobApplication } from "../../utils/types";
import Link from "next/link";

interface Props {
  job: JobApplication;
  headers: Header;
}

const JobPage: NextPage<Props> = ({ job, headers }) => {
  const [image, setImage] = useState("");
  const [editNotes, setEditNotes] = useState(false);
  const [editStatus, setEditStatus] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const notesRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  const handleUpdateStatus = (status: string) => {
    updateJobDetails({ _id: job._id, status, notes: "", headers }, (status) => {
      if (status === 200) {
        router.replace(router.asPath);
        setEditStatus(false);
      }

      if (status === 500) alert("Server error");
    });
  };

  const handleUpdateNotes = () => {
    updateJobDetails(
      {
        _id: job._id,
        status: "",
        notes: notesRef.current?.value ?? "",
        headers,
      },
      (status) => {
        if (status === 200) {
          router.replace(router.asPath);
          setEditNotes(false);
        }

        if (status === 500) alert("Server error");
      }
    );
  };

  const handleDeleteApplication = () => {
    deleteJobApplication({ _id: job._id, headers }, (status) => {
      if (status === 200) {
        router.back();
      }

      if (status === 500) alert("Server error");
    });
  };

  useEffect(() => {
    const getImage = async () => {
      const data = await fetch(
        `https://autocomplete.clearbit.com/v1/companies/suggest?query=${job.company.replace(
          /\s/g,
          ""
        )}`
      ).then((r) => r.json());
      setImage(data[0].logo);
    };

    getImage().catch(console.error);
  }, [job]);
  return (
    <div className="w-full min-h-screen bg-gray-800 pt-20 pb-4 px-4 flex justify-center items-center">
      <Navbar />

      <div className="w-full lg:w-2/3 flex flex-col gap-y-8 bg-gray-700 text-white rounded p-4 md:p-12">
        <div className="w-full grid grid-cols-1 gap-4 text-center lg:text-left lg:gap-8 lg:grid-cols-test items-center">
          {/* Image */}
          {!image ? (
            <span className="w-14 h-14 rounded-full bg-white p-1 animate-pulse select-none" />
          ) : (
            <div className="w-full flex justify-center">
              <Image
                src={image}
                height="56"
                width="56"
                className="w-20 h-20 rounded-full bg-white p-1 object-contain select-none"
                alt={job.company}
              />
            </div>
          )}

          <div className="flex flex-col gap-y-4">
            <span className="font-bold text-lg">{job.company}</span>
            <span>{job.title}</span>
          </div>

          {/* Delete Button */}
          {confirmDelete ? (
            <span className="flex gap-x-4">
              <button
                className="button-full text-gray-900 bg-gray-400 lg:w-auto"
                onClick={() => setConfirmDelete(false)}
              >
                <MdCancel size={16} /> Cancel
              </button>

              <button
                className="button-full text-red-900 bg-red-400 lg:w-auto"
                onClick={() => handleDeleteApplication()}
              >
                <GiConfirmed size={16} /> Confirm
              </button>
            </span>
          ) : (
            <button
              className="button text-red-900 bg-red-400"
              onClick={() => setConfirmDelete(true)}
            >
              <FaTrash size={16} /> Delete Application
            </button>
          )}
        </div>

        {/* Location & Contact Info */}
        <div className="grid grid-cols-1 gap-4 2xl:grid-cols-2">
          <div className="flex gap-x-8 justify-center 2xl:justify-start">
            <span className="flex gap-x-2 items-center">
              <MdLocationPin size={24} className="text-white" />
              {job.location}
            </span>

            <span className="flex gap-x-2 items-center">
              <MdPermContactCalendar size={24} className="text-white" />
              {job.contact ? job.contact : "No Contact"}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-x-8 gap-y-4 justify-center items-center 2xl:justify-end">
            <span className="flex gap-x-2 items-center">
              <MdDateRange size={24} className="text-white" />
              <p>{moment(job.date).format("MM/D/YYYY")}</p>
            </span>

            <div className="flex gap-x-4 select-none">
              <Status status={job.status} />

              {editStatus ? (
                <button
                  className="button text-red-900 bg-red-500"
                  onClick={() => setEditStatus(false)}
                >
                  <MdCancel size={16} /> Cancel
                </button>
              ) : (
                <button
                  className="button text-orange-900 bg-orange-300"
                  onClick={() => setEditStatus(true)}
                >
                  <FaEdit size={16} /> Edit Status
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Update Status */}
        {editStatus && (
          <div className="grid grid-cols-1 lg:flex gap-x-4 gap-y-2 select-none">
            <button
              className="change-status bg-gray-400"
              onClick={() => handleUpdateStatus("Stale")}
            >
              Stale
            </button>
            <button
              className="change-status bg-blue-400"
              onClick={() => handleUpdateStatus("Applied")}
            >
              Applied
            </button>
            <button
              className="change-status bg-red-500"
              onClick={() => handleUpdateStatus("Rejected")}
            >
              Rejected
            </button>
            <button
              className="change-status bg-orange-300"
              onClick={() => handleUpdateStatus("Under Review")}
            >
              Under Review
            </button>
            <button
              className="change-status bg-green-300"
              onClick={() => handleUpdateStatus("Offered")}
            >
              Offered
            </button>
            <button
              className="change-status bg-green-500"
              onClick={() => handleUpdateStatus("Accepted")}
            >
              Accepted
            </button>
          </div>
        )}

        {/* Job Notes */}
        {editNotes ? (
          <>
            <textarea
              className="h-48 p-4 text-black resize-none outline-none rounded"
              placeholder="Add your notes"
              ref={notesRef}
            >
              {job.notes}
            </textarea>
            <span className="flex gap-x-2">
              <button
                className="button-full text-red-900 bg-red-500"
                onClick={() => setEditNotes(false)}
              >
                <MdCancel size={16} />
                Cancel
              </button>
              <button
                className="button-full text-green-900 bg-green-500"
                onClick={() => handleUpdateNotes()}
              >
                <FaSave size={16} />
                Save Notes
              </button>
            </span>
          </>
        ) : (
          <>
            <p>{job.notes ? job.notes : "No notes"}</p>
            <button
              className="button-full text-orange-900 bg-orange-300"
              onClick={() => setEditNotes(true)}
            >
              <FaEdit /> Edit Notes
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const Status = ({ status }: { status: string }) => {
  switch (status) {
    case "Applied": {
      return <span className="status bg-blue-400">{status}</span>;
    }

    case "Under Review": {
      return <span className="status bg-orange-300">{status}</span>;
    }

    case "Offered": {
      return <span className="status bg-green-300">{status}</span>;
    }

    case "Accepted": {
      return <span className="status bg-green-500">{status}</span>;
    }

    case "Rejected": {
      return <span className="status bg-red-500">{status}</span>;
    }

    default: {
      return <span className="status bg-gray-400">{status}</span>;
    }
  }
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

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const id = context.query.id as string;
  return id ? getJobById(id, context) : { props: {} };
};

export default JobPage;
