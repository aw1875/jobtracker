import { Schema, model } from 'mongoose';
import { UserDoc } from '../@types/User';

const UserSchema: Schema = new Schema<UserDoc>({
    id: { type: String, required: true },
    username: { type: String, required: true },
    accessToken: { type: String, required: true },
    jobs: [{ type: Schema.Types.ObjectId, ref: "Job" }]
});

const UserModel = model("User", UserSchema);
export default UserModel;
