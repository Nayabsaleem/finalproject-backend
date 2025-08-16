const express = require('express');
const router = express.Router();
const verify = require('../middleware/verifyToken');
const UserProfile = require('../models/UserProfile');

// ✅ Create profile (protected)
router.post('/', verify, async (req, res) => {
  try {
    const { name, email, username, skills, projects, github } = req.body;

    // check if profile already exists
    const exists = await UserProfile.findOne({ userId: req.user.id });
    if (exists) {
      return res.status(400).json({ message: 'Profile already exists. Use PUT to update.' });
    }

    const profile = new UserProfile({
      userId: req.user.id,
      name,
      email,
      username,
      skills: skills || [],
      projects: projects || [],
      github
    });

    await profile.save();
    res.status(201).json(profile);
  } catch (err) {
    console.error('❌ Profile creation error:', err.message);
    res.status(500).json({ message: 'Server error while creating profile' });
  }
});

// ✅ Get profile by userId (protected)
router.get('/:userId', verify, async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.params.userId });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    console.error('❌ Get profile error:', err.message);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
});

// ✅ Update profile (protected)
router.put('/:id', verify, async (req, res) => {
  try {
    const profile = await UserProfile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    if (profile.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not allowed to update this profile' });
    }

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
    console.error('❌ Update profile error:', err.message);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
});

// ✅ Public profile by username (no auth required)
router.get('/public/:username', async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ username: req.params.username });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    console.error('❌ Public profile fetch error:', err.message);
    res.status(500).json({ message: 'Server error while fetching public profile' });
  }
});

module.exports = router;
