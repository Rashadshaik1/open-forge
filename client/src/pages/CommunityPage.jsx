import { useState } from 'react';
import {
  MessageSquare,
  ArrowBigUp,
  ArrowBigDown,
  Plus,
  Search,
  Sparkles,
  Send,
  X,
  Share2,
  Tag,
  CheckCircle2,
  TrendingUp,
  Clock,
  User,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CommunityPage() {
  const { user } = useAuth();

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedComments, setExpandedComments] = useState({}); // { [postId]: boolean }
  const [newCommentText, setNewCommentText] = useState({}); // { [postId]: string }

  // New post form state
  const [postTitle, setPostTitle] = useState('');
  const [postCategory, setPostCategory] = useState('Idea Pitch');
  const [postContent, setPostContent] = useState('');
  const [postTags, setPostTags] = useState('');
  const [authorName, setAuthorName] = useState(user?.name || '');

  // Pre-populated realistic discussions
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'Ideas for Club Day Tech Booth: Live AI Photobooth or Terminal Cipher challenge?',
      author: 'Rashad Shaik',
      roll: '324103311037',
      branch: 'Information Technology',
      time: '2 hours ago',
      category: 'Idea Pitch',
      tags: ['#clubday', '#ideas', '#interactive'],
      content:
        'For the upcoming OpenForge Club Day stall, we want something hands-on rather than just flyers. Option A: A terminal cipher decryption station where students type commands to unlock stickers. Option B: A live AI webcam photobooth with instant thermal badge printing. What do you think would attract the biggest crowd?',
      votes: 42,
      userVote: 1, // 1 for upvoted, -1 for downvoted, 0 for none
      comments: [
        {
          id: 101,
          author: 'Pooja Reddy',
          branch: 'CSE',
          time: '1 hour ago',
          text: 'Definitely Option A! The terminal cipher during Sherlock was such a hit. People love solving quick 2-minute puzzles with friends.',
        },
        {
          id: 102,
          author: 'Karthik Varma',
          branch: 'CSE (AI & ML)',
          time: '45 mins ago',
          text: 'Why not both? Terminal cipher to unlock the AI photo generator! Best of both worlds.',
        },
      ],
    },
    {
      id: 2,
      title: 'Feedback on Sherlock Mystery Decryption Clues: Clue #4 was legendary',
      author: 'Ananya Sharma',
      roll: '324103310042',
      branch: 'Computer Science',
      time: '4 hours ago',
      category: 'Event Feedback',
      tags: ['#sherlock', '#cryptography', '#campus'],
      content:
        'Huge shoutout to everyone who participated in Sherlock: The Digital Case yesterday! Clue #4 which was hidden in the terminal source code comment had teams running back and forth from Tech Block to the library. Here is a thread to drop your favorite moments or puzzle suggestions for Season 2.',
      votes: 89,
      userVote: 0,
      comments: [
        {
          id: 201,
          author: 'Tarun Kumar',
          branch: 'IT',
          time: '3 hours ago',
          text: 'The QR scan station at the canteen was wild. It verified our team hash in less than a second.',
        },
        {
          id: 202,
          author: 'Harish Varma',
          branch: 'EEE',
          time: '2 hours ago',
          text: 'Please make Sherlock Season 2 a 48-hour campus mystery! Best technical event this year.',
        },
      ],
    },
    {
      id: 3,
      title: 'Web Dev Roadmap 2026: Suggestions for next semester workshop topics',
      author: 'Vikram Adithya',
      roll: '324103311090',
      branch: 'Information Technology',
      time: '1 day ago',
      category: 'Discussion',
      tags: ['#webdev', '#roadmap', '#workshops'],
      content:
        'The core team is planning the curriculum for our Spring 2026 technical bootcamps. We are deciding between: (1) Production Next.js 15 & Tailwind, (2) Building AI Agents with the Gemini API, or (3) Microservices & Docker for beginners. Vote or comment your preference below!',
      votes: 64,
      userVote: 0,
      comments: [
        {
          id: 301,
          author: 'Sneha Patel',
          branch: 'CSE',
          time: '20 hours ago',
          text: 'Building AI Agents with Gemini API would be super relevant with modern hackathon trends.',
        },
      ],
    },
    {
      id: 4,
      title: 'Looking for teammates for the upcoming State-wide Hackathon 2026',
      author: 'Meera Nambiar',
      roll: '324103310055',
      branch: 'CSE',
      time: '2 days ago',
      category: 'Tech Query',
      tags: ['#hackathon', '#teamup', '#backend'],
      content:
        'Hey everyone! Our team of 2 (UI designer + Frontend React) is looking for a strong backend / database developer for the OpenForge Hackathon next month. If you love Express, PostgreSQL or Supabase, reply here or DM me!',
      votes: 27,
      userVote: 0,
      comments: [
        {
          id: 401,
          author: 'Tanmay Roy',
          branch: 'CSE Cyber',
          time: '1 day ago',
          text: 'Hey Meera! I work with Node and PostgreSQL, would love to team up. Sending you a message.',
        },
      ],
    },
  ]);

  const categories = ['All', 'Idea Pitch', 'Event Feedback', 'Tech Query', 'Discussion'];

  // Handle Upvote / Downvote logic
  const handleVote = (postId, direction) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id !== postId) return post;

        let voteChange = 0;
        let newUserVote = 0;

        if (post.userVote === direction) {
          // Unvote
          voteChange = -direction;
          newUserVote = 0;
        } else if (post.userVote === 0) {
          // First vote
          voteChange = direction;
          newUserVote = direction;
        } else {
          // Switch vote (e.g. from -1 to 1)
          voteChange = direction * 2;
          newUserVote = direction;
        }

        return {
          ...post,
          votes: post.votes + voteChange,
          userVote: newUserVote,
        };
      })
    );
  };

  const toggleComments = (postId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleAddComment = (postId) => {
    const text = newCommentText[postId]?.trim();
    if (!text) return;

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id !== postId) return post;

        const newComment = {
          id: Date.now(),
          author: user?.name || authorName || 'GVPCE Innovator',
          branch: user?.department || 'Information Technology',
          time: 'Just now',
          text: text,
        };

        return {
          ...post,
          comments: [...post.comments, newComment],
        };
      })
    );

    setNewCommentText((prev) => ({
      ...prev,
      [postId]: '',
    }));
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;

    const parsedTags = postTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => (t.startsWith('#') ? t : `#${t}`));

    const newPost = {
      id: Date.now(),
      title: postTitle.trim(),
      author: authorName.trim() || user?.name || 'GVPCE Student',
      roll: user?.rollNumber || '324103311037',
      branch: user?.department || 'Information Technology',
      time: 'Just now',
      category: postCategory,
      tags: parsedTags.length > 0 ? parsedTags : ['#openforge'],
      content: postContent.trim(),
      votes: 1,
      userVote: 1,
      comments: [],
    };

    setPosts([newPost, ...posts]);
    setShowCreateModal(false);
    setPostTitle('');
    setPostContent('');
    setPostTags('');
  };

  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FFF7ED]/30 dark:bg-[#0B0F17] text-[#111827] dark:text-[#F9FAFB] pb-24 transition-colors duration-200">
      {/* Top Banner Header */}
      <section className="relative overflow-hidden py-12 sm:py-16 border-b border-soft-peach dark:border-gray-800 bg-white dark:bg-[#111827]/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#E53E24]/10 text-[#E53E24] dark:bg-[#E53E24]/20 border border-[#E53E24]/30 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>OpenForge Community Board</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#111827] dark:text-white">
                Campus Ideas & Discussions
              </h1>
              <p className="text-xs sm:text-sm text-[#4B5563] dark:text-gray-300 max-w-xl">
                Pitch event concepts, drop puzzle feedback, ask technical queries, and collaborate with student innovators across GVPCE.
              </p>
            </div>

            {/* Create Post Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-[#E53E24] to-[#F97316] hover:opacity-95 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span>Create New Thread</span>
            </button>
          </div>

          {/* Search bar & Category filter pills */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-soft-peach dark:border-gray-800">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-[#E53E24] text-white shadow-xs'
                      : 'bg-white dark:bg-gray-800 text-[#4B5563] dark:text-gray-300 border border-soft-peach dark:border-gray-700 hover:border-[#E53E24] hover:text-[#E53E24]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#4B5563] dark:text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search threads, #tags, authors..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-soft-peach dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-[#111827] dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#E53E24]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Discussion Feed */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => {
            const isCommentsOpen = !!expandedComments[post.id];

            return (
              <div
                key={post.id}
                className="bg-white dark:bg-[#111827] rounded-3xl border border-soft-peach dark:border-gray-800 shadow-sm hover:shadow-md transition-all overflow-hidden flex"
              >
                {/* Left: Reddit-style Vote Gutter */}
                <div className="w-14 sm:w-16 bg-[#FFF7ED]/50 dark:bg-gray-800/40 border-r border-soft-peach dark:border-gray-800/80 p-2 sm:p-3 flex flex-col items-center justify-start space-y-1 select-none shrink-0">
                  <button
                    onClick={() => handleVote(post.id, 1)}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      post.userVote === 1
                        ? 'bg-[#E53E24]/15 text-[#E53E24]'
                        : 'text-[#4B5563] dark:text-gray-400 hover:text-[#E53E24] hover:bg-white dark:hover:bg-gray-700'
                    }`}
                    title="Upvote"
                  >
                    <ArrowBigUp className="w-6 h-6 fill-current" />
                  </button>

                  <span
                    className={`font-mono text-xs sm:text-sm font-extrabold ${
                      post.userVote === 1
                        ? 'text-[#E53E24]'
                        : post.userVote === -1
                        ? 'text-purple-600 dark:text-purple-400'
                        : 'text-[#111827] dark:text-white'
                    }`}
                  >
                    {post.votes}
                  </span>

                  <button
                    onClick={() => handleVote(post.id, -1)}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      post.userVote === -1
                        ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400'
                        : 'text-[#4B5563] dark:text-gray-400 hover:text-purple-600 hover:bg-white dark:hover:bg-gray-700'
                    }`}
                    title="Downvote"
                  >
                    <ArrowBigDown className="w-6 h-6 fill-current" />
                  </button>
                </div>

                {/* Right: Thread Content & Comments Drawer */}
                <div className="flex-1 p-5 sm:p-6 space-y-4 text-left">
                  {/* Metadata Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-[#E53E24] bg-[#FFF7ED] dark:bg-gray-800 px-2.5 py-0.5 rounded-full border border-[#E53E24]/20">
                        {post.category}
                      </span>
                      <span className="text-[#4B5563] dark:text-gray-400">
                        Posted by <strong className="text-[#111827] dark:text-white">{post.author}</strong> ({post.branch})
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-[#4B5563] dark:text-gray-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{post.time}</span>
                    </div>
                  </div>

                  {/* Thread Title */}
                  <h2 className="text-lg sm:text-xl font-extrabold text-[#111827] dark:text-white tracking-tight">
                    {post.title}
                  </h2>

                  {/* Thread Body */}
                  <p className="text-xs sm:text-sm text-[#4B5563] dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {post.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-mono text-[#F97316] bg-orange-50 dark:bg-gray-800/80 px-2 py-0.5 rounded-md border border-[#F97316]/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Bottom Action Bar */}
                  <div className="pt-3 border-t border-soft-peach dark:border-gray-800 flex items-center justify-between text-xs text-[#4B5563] dark:text-gray-400">
                    <button
                      onClick={() => toggleComments(post.id)}
                      className="px-3 py-1.5 rounded-xl hover:bg-soft-peach dark:hover:bg-gray-800 hover:text-[#E53E24] transition-colors flex items-center gap-2 font-semibold cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-[#E53E24]" />
                      <span>
                        {post.comments.length} {post.comments.length === 1 ? 'Comment' : 'Comments'}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(window.location.href);
                          alert('Thread link copied to clipboard!');
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl hover:bg-soft-peach dark:hover:bg-gray-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </button>
                  </div>

                  {/* ======================================================== */}
                  {/* EXPANDED INTERACTIVE COMMENT DRAWER */}
                  {/* ======================================================== */}
                  {isCommentsOpen && (
                    <div className="pt-4 border-t border-soft-peach dark:border-gray-800 space-y-4 animate-in fade-in duration-200">
                      {/* Add Comment Input */}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newCommentText[post.id] || ''}
                          onChange={(e) =>
                            setNewCommentText({
                              ...newCommentText,
                              [post.id]: e.target.value,
                            })
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddComment(post.id);
                          }}
                          placeholder="Write a constructive student response..."
                          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FFF7ED]/30 dark:bg-gray-800 text-xs text-[#111827] dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#E53E24]"
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          className="p-2.5 rounded-xl bg-[#E53E24] text-white hover:bg-[#CB321A] transition-colors cursor-pointer shadow-xs"
                          title="Post comment"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Comment List */}
                      <div className="space-y-3">
                        {post.comments.length > 0 ? (
                          post.comments.map((comment) => (
                            <div
                              key={comment.id}
                              className="p-3.5 rounded-2xl bg-[#FFF7ED]/40 dark:bg-gray-800/50 border border-soft-peach dark:border-gray-700/60 space-y-1.5"
                            >
                              <div className="flex items-center justify-between text-[11px]">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-[#111827] dark:text-white">
                                    {comment.author}
                                  </span>
                                  <span className="text-[10px] text-[#E53E24] bg-white dark:bg-gray-800 px-2 py-0.5 rounded-full border border-[#E53E24]/20">
                                    {comment.branch}
                                  </span>
                                </div>
                                <span className="text-gray-400">{comment.time}</span>
                              </div>
                              <p className="text-xs text-[#4B5563] dark:text-gray-300 leading-relaxed">
                                {comment.text}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4 text-xs text-gray-400">
                            No comments yet. Start the conversation!
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center bg-white dark:bg-[#111827] rounded-3xl border border-soft-peach dark:border-gray-800 space-y-4">
            <MessageSquare className="w-12 h-12 text-[#E53E24] mx-auto opacity-70" />
            <h3 className="text-lg font-bold text-[#111827] dark:text-white">
              No threads found
            </h3>
            <p className="text-xs text-[#4B5563] dark:text-gray-400 max-w-sm mx-auto">
              No discussions match your filter or search query. Be the first to start a thread!
            </p>
            <button
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 text-xs font-semibold text-[#E53E24] border border-[#E53E24] rounded-xl hover:bg-[#FFF7ED] dark:hover:bg-gray-800"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* CREATE POST MODAL */}
      {/* ======================================================== */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-soft-peach dark:border-gray-800 p-6 space-y-5 text-left text-[#111827] dark:text-[#F9FAFB]">
            <div className="flex items-center justify-between pb-3 border-b border-soft-peach dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#E53E24] to-[#F97316] flex items-center justify-center text-white shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-[#111827] dark:text-white">
                    Create Community Post
                  </h3>
                  <p className="text-[11px] text-[#4B5563] dark:text-gray-400">
                    Share your idea, inquiry or event review
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 text-gray-400 hover:text-[#111827] dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              {/* Category Pill Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#111827] dark:text-gray-200">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Idea Pitch', 'Event Feedback', 'Tech Query', 'Discussion'].map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setPostCategory(c)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        postCategory === c
                          ? 'bg-[#E53E24] text-white shadow-xs'
                          : 'bg-[#FFF7ED] dark:bg-gray-800 text-[#4B5563] dark:text-gray-300 border border-soft-peach dark:border-gray-700'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#111827] dark:text-gray-200">
                  Thread Title
                </label>
                <input
                  type="text"
                  required
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="e.g. Ideas for next month's hackathon theme"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-[#111827] dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#E53E24]"
                />
              </div>

              {/* Author name */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#111827] dark:text-gray-200">
                  Your Name
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Alex Rivera (or leave blank for profile name)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-[#111827] dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#E53E24]"
                />
              </div>

              {/* Content text */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#111827] dark:text-gray-200">
                  Post Content
                </label>
                <textarea
                  required
                  rows={4}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Provide context, details, code snippets, or discussion questions..."
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-[#111827] dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#E53E24]"
                />
              </div>

              {/* Optional tags */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#111827] dark:text-gray-200">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={postTags}
                  onChange={(e) => setPostTags(e.target.value)}
                  placeholder="e.g. #hackathon, #sherlock, #react"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-[#111827] dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#E53E24]"
                />
              </div>

              {/* Submit button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#E53E24] to-[#F97316] hover:opacity-95 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Publish to Community</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
