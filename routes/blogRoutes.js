const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');

// Get all published blog posts
router.get('/', async (req, res) => {
  try {
    const posts = await BlogPost.find({ status: 'published' })
      .select('title excerpt image date author readTime')
      .sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single blog post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    // Increment views
    post.views += 1;
    await post.save();
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new blog post
router.post('/', async (req, res) => {
  try {
    // Generate slug from title
    const slug = req.body.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const post = new BlogPost({
      title: req.body.title,
      slug: slug,
      content: req.body.content,
      excerpt: req.body.excerpt,
      image: req.body.image,
      author: req.body.author,
      readTime: req.body.readTime,
      status: req.body.status || 'published'
    });

    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a blog post
router.put('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // If title is being updated, generate new slug
    if (req.body.title && req.body.title !== post.title) {
      req.body.slug = req.body.title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }

    Object.keys(req.body).forEach(key => {
      post[key] = req.body[key];
    });

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a blog post
router.delete('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    await post.deleteOne();
    res.json({ message: 'Blog post deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 