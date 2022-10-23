import { Router } from 'express';

// Models
import UserModel from '../../Models/UserModel';
import JobModel from '../../Models/JobModel';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const user = await UserModel.findOne({ id: req.user.id }, { __v: 0 })
      .populate({ path: 'jobs', model: JobModel.modelName })
      .exec();

    return user
      ? res.status(200).send(user.jobs.reverse())
      : res.status(200).send([]);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) return res.status(400).send('Missing required fields');

    const job = await JobModel.findOne({ _id: id }).exec();
    return res.status(200).send(job);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.post('/', async (req, res) => {
  const application = req.body;
  if (!application) return res.status(400).send('Missing required fields');

  try {
    const job = new JobModel(application);
    const savedJob = await job.save();
    await UserModel.findOneAndUpdate(
      { id: req.user.id },
      { $push: { jobs: savedJob._id } },
    ).exec();

    return res.status(201).send({ id: savedJob._id });
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  try {
    await JobModel.findOneAndUpdate(
      { _id: id },
      { $set: { status, notes: notes ?? undefined } },
    ).exec();

    return res.status(200).send('Application updated successfully');
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await JobModel.findOneAndDelete({ _id: id }).exec();
    await UserModel.findOneAndUpdate(
      { id: req.user.id },
      { $pull: { jobs: id } },
    ).exec();
    return res.status(200).send('Application delete successfully');
  } catch (err) {
    return res.status(500).send(err);
  }
});

export default router;
