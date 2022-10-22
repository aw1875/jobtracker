import { Schema, model } from 'mongoose';
import { Job } from '../@types/Job';

const JobSchema: Schema = new Schema<Job>({
    company: { type: String, required: true },
    title: { type: String, required: true },
    date: { type: Date, required: true },
    contact: { type: String, required: false },
    status: { type: String, required: true },
    location: { type: String, required: true },
    notes: { type: String, required: false }
});

const JobModel = model("Job", JobSchema);
export default JobModel;
