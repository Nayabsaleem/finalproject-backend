const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProjectSchema = new Schema({
  title: String,
  description: String,
  link: String
}, { _id: false });

const UserProfileSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  skills: [String],
  projects: [ProjectSchema],
  github: String,
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('UserProfile', UserProfileSchema);
