import { Router } from 'express';

// Models
import UserModel from '../../Models/UserModel';
import JobModel from '../../Models/JobModel';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const user = await UserModel.findOne({ id: req.user.id }, { __v: 0 })
            .populate({ path: "jobs", model: JobModel.modelName })
            .exec();

        return user ? res.status(200).send(user.jobs.reverse()) : res.status(200).send([]);
    } catch (err) {
        return res.status(500).send(err);
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        if (!id) return res.status(400).send("Missing required fields");

        const job = await JobModel.findOne({ _id: id }).exec();
        return res.status(200).send(job);
    } catch (err) {
        return res.status(500).send(err);
    }
});

router.post('/', async (req, res) => {
    const application = req.body;
    if (!application) return res.status(400).send("Missing required fields");

    try {
        const job = new JobModel(application);
        const savedJob = await job.save();
        await UserModel.findOneAndUpdate({ id: req.user.id }, { $push: { jobs: savedJob._id } }).exec();

        return res.status(201).send({ id: savedJob._id });
    } catch (err) {
        return res.status(500).send(err);
    }
});

router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { status, notes } = req.body;

    try {
        await JobModel.findOneAndUpdate({ _id: id }, { $set: { status, notes: notes ?? undefined } }).exec();

        return res.status(200).send("Application updated successfully");
    } catch (err) {
        return res.status(500).send(err);
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await JobModel.findOneAndDelete({ _id: id }).exec();
        await UserModel.findOneAndUpdate({ id: req.user.id }, { $pull: { jobs: id } }).exec();
        return res.status(200).send("Application delete successfully");
    } catch (err) {
        return res.status(500).send(err);
    }
});

export default router;
// import { Router, Request, Response } from 'express';
// import { CallbackError } from "mongoose";

// // Middlware
// import ensureAuthenticated from "../Middleware/Authentication";

// // Models
// import JobModel from "../Models/JobModel";
// import UserModel from '../Models/UserModel';

// const jobRoutes = Router();

// // Setup Middlware
// jobRoutes.use(ensureAuthenticated);

// jobRoutes.get('/', async (req: Request, res: Response): Promise<any> => {
//     console.log(req.user ?? "none")
//     try {
//         const jobs = await UserModel.find({ id: req.user.id }, { __v: 0 })
//             .populate({ path: "jobs", select: "company" })
//             .exec();
//         console.log(jobs)
//         // const jobs = await JobModel.find({ }).sort({ _id: -1 }).exec();
//         if (!jobs) return res.status(200).send("No jobs found");
//         return res.status(200).send(jobs);
//     } catch (err) {
//         return res.status(500).send(err);
//     }
// });

// // jobRoutes.patch('/job/:id', (req: Request, res: Response): any => {
// //     const { id } = req.params;
// //     const { status } = req.body;

// //     if (!status) return res.status(400).send("Missing required fields");

// //     return JobModel.updateOne({ _id: id }, { $set: { status } }, (err: CallbackError) => {
// //         if (err) return res.status(500).send(err);

// //         return res.status(200).send("Application updated successfully");
// //     });
// // });

// // jobRoutes.delete('/job/:id', (req: Request, res: Response): any => {
// //     const { id } = req.params;

// //     return JobModel.findOneAndDelete({ _id: id },
// //         (err: CallbackError): any => {
// //             if (err) return res.status(500).send(err);

// //             return res.status(200).send("Application delete successfully");
// //         });
// // });

// export default jobRoutes;
