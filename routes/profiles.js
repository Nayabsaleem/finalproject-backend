const express = require('express');
const router = express.Router();
const verify = require('../middleware/verifyToken');
const UserProfile = require('../models/UserProfile');

// Create profile (protected)
router.post('/', verify, async (req, res) => {
  try {
    const { name, email, username, skills, projects, github } = req.body;
    // upsert: if profile for this user exists, return error or update depending on use case
    const exists = await UserProfile.findOne({ userId: req.user.id });
    if (exists) return res.status(400).json({ message: 'Profile already exists. Use PUT to update.' });
    const profile = new UserProfile({
      name, email, username, skills: skills || [], projects: projects || [], github, userId: req.user.id
    });
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get profile by userId (protected)
router.get('/:userId', verify, async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.params.userId });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile by profile id (protected)
router.put('/:id', verify, async (req, res) => {
  try {
    const profile = await UserProfile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    if (profile.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    const { name, email, username, skills, projects, github } = req.body;
    profile.name = name || profile.name;
    profile.email = email || profile.email;
    profile.username = username || profile.username;
    profile.skills = skills || profile.skills;
    profile.projects = projects || profile.projects;
    profile.github = github || profile.github;
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Public profile by username (no auth)
router.get('/public/:username', async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ username: req.params.username });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
