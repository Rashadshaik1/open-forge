import Post from '../models/Post.js';

export const getPosts = async (req, res) => {
  try {
    const { tag, sort } = req.query;
    const filter = tag ? { tag } : {};
    let query = Post.find(filter)
      .populate('author', 'name rollNumber department role')
      .populate('comments.user', 'name department');

    if (sort === 'top') {
      // Sort by upvote count
      const posts = await query.exec();
      posts.sort((a, b) => b.upvotes.length - a.upvotes.length);
      return res.status(200).json({ success: true, count: posts.length, data: posts });
    }

    const posts = await query.sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: posts.length, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, content, tag } = req.body;
    const post = await Post.create({
      title,
      content,
      tag: tag || 'General',
      author: req.user._id,
    });
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleUpvote = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const index = post.upvotes.indexOf(req.user._id);
    if (index === -1) {
      post.upvotes.push(req.user._id);
    } else {
      post.upvotes.splice(index, 1);
    }

    await post.save();
    res.status(200).json({ success: true, upvotesCount: post.upvotes.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ success: false, message: 'Comment cannot be blank' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    post.comments.push({ user: req.user._id, content });
    await post.save();

    const populated = await Post.findById(req.params.id).populate('comments.user', 'name department');
    res.status(201).json({ success: true, data: populated.comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};