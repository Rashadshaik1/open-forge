import { useState, useEffect, useCallback } from 'react';
import {
  MessageSquare,
  ArrowBigUp,
  Plus,
  Search,
  Sparkles,
  Send,
  X,
  Share2,
  Clock,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getPosts, createPost, toggleUpvote, addComment } from '../api';

export default function CommunityPage() {
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});
  const [newCommentText, setNewCommentText] = useState({});

  // New post form state
  const [postTitle, setPostTitle] = useState('');
  const [postCategory, setPostCategory] = useState('Idea');
  const [postContent, setPostContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Category mapping between UI and backend enum
  const categoryMap = {
    'All': '',
    'Idea Pitch': 'Idea',
    'Event Feedback': 'General',
    'Tech Query': 'Doubt',
    'Discussion': 'General',
    'Hackathon': 'Hackathon',
  };

  const fetchCommunityPosts = useCallback(async () => {
    try {
      setLoading(true);
      const backendTag = categoryMap[activeCategory] || '';
      const params = backendTag ? { tag: backendTag } : {};
      const res = await getPosts(params);
      setPosts(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load posts:', err);
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => {
    fetchCommunityPosts();
  }, [fetchCommunityPosts]);

  const handleVote = async (postId) => {
    try {
      const res = await toggleUpvote(postId);
      const newUpvoteCount = res.data?.upvotesCount;

      setPosts((prev) =>
        prev.map((p) => {
          if (p._id !== postId) return p;
          const userVoted = p.upvotes.includes(user?._id);
          const updatedUpvotes = userVoted
            ? p.upvotes.filter((id) => id !== user?._id)
            : [...p.upvotes, user?._id];

          return {
            ...p,
            upvotes: updatedUpvotes,
          };
        })
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Please log in to upvote threads.');
    }
  };

  const toggleComments = (postId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleAddComment = async (postId) => {
    const text = newCommentText[postId]?.trim();
    if (!text) return;

    try {
      const res = await addComment(postId, text);
      const updatedComments = res.data?.data || [];

      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? { ...p, comments: updatedComments } : p))
      );

      setNewCommentText((prev) => ({
        ...prev,
        [postId]: '',
      }));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post comment.');
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;

    try {
      setIsSubmitting(true);
      await createPost({
        title: postTitle.trim(),
        content: postContent.trim(),
        tag: postCategory,
      });

      setShowCreateModal(false);
      setPostTitle('');
      setPostContent('');
      await fetchCommunityPosts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to publish post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = ['All', 'Idea Pitch', 'Event Feedback', 'Tech Query', 'Discussion'];

  const filteredPosts = posts.filter((post) => {
    const titleMatch = (post.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    const contentMatch = (post.content || '').toLowerCase().includes(searchQuery.toLowerCase());
    const authorMatch = (post.author?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    return titleMatch || contentMatch || authorMatch;
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

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#4B5563] dark:text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search threads or authors..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-soft-peach dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-[#111827] dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#E53E24]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Discussion Feed */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center text-[#4B5563]">
            <Loader2 className="w-8 h-8 animate-spin text-[#E53E24] mb-3" />
            <p className="text-sm font-semibold">Loading live community threads...</p>
          </div>
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map((post) => {
            const isCommentsOpen = !!expandedComments[post._id];
            const upvoteList = post.upvotes || [];
            const userHasUpvoted = user && upvoteList.includes(user._id);

            return (
              <div
                key={post._id}
                className="bg-white dark:bg-[#111827] rounded-3xl border border-soft-peach dark:border-gray-800 shadow-sm hover:shadow-md transition-all overflow-hidden flex"
              >
                {/* Left: Reddit-style Vote Gutter */}
                <div className="w-14 sm:w-16 bg-[#FFF7ED]/50 dark:bg-gray-800/40 border-r border-soft-peach dark:border-gray-800/80 p-2 sm:p-3 flex flex-col items-center justify-start space-y-1 select-none shrink-0">
                  <button
                    onClick={() => handleVote(post._id)}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      userHasUpvoted
                        ? 'bg-[#E53E24]/15 text-[#E53E24]'
                        : 'text-[#4B5563] dark:text-gray-400 hover:text-[#E53E24] hover:bg-white dark:hover:bg-gray-700'
                    }`}
                    title="Upvote"
                  >
                    <ArrowBigUp className="w-6 h-6 fill-current" />
                  </button>

                  <span
                    className={`font-mono text-xs sm:text-sm font-extrabold ${
                      userHasUpvoted ? 'text-[#E53E24]' : 'text-[#111827] dark:text-white'
                    }`}
                  >
                    {upvoteList.length}
                  </span>
                </div>

                {/* Right: Thread Content & Comments Drawer */}
                <div className="flex-1 p-5 sm:p-6 space-y-4 text-left">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-[#E53E24] bg-[#FFF7ED] dark:bg-gray-800 px-2.5 py-0.5 rounded-full border border-[#E53E24]/20">
                        {post.tag || 'General'}
                      </span>
                      <span className="text-[#4B5563] dark:text-gray-400">
                        Posted by{' '}
                        <strong className="text-[#111827] dark:text-white">
                          {post.author?.name || 'GVPCE Innovator'}
                        </strong>{' '}
                        ({post.author?.department || 'IT'})
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-[#4B5563] dark:text-gray-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <h2 className="text-lg sm:text-xl font-extrabold text-[#111827] dark:text-white tracking-tight">
                    {post.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-[#4B5563] dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>

                  <div className="pt-3 border-t border-soft-peach dark:border-gray-800 flex items-center justify-between text-xs text-[#4B5563] dark:text-gray-400">
                    <button
                      onClick={() => toggleComments(post._id)}
                      className="px-3 py-1.5 rounded-xl hover:bg-soft-peach dark:hover:bg-gray-800 hover:text-[#E53E24] transition-colors flex items-center gap-2 font-semibold cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-[#E53E24]" />
                      <span>
                        {(post.comments || []).length}{' '}
                        {(post.comments || []).length === 1 ? 'Comment' : 'Comments'}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Thread link copied to clipboard!');
                      }}
                      className="px-3 py-1.5 rounded-xl hover:bg-soft-peach dark:hover:bg-gray-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </button>
                  </div>

                  {/* Comment Drawer */}
                  {isCommentsOpen && (
                    <div className="pt-4 border-t border-soft-peach dark:border-gray-800 space-y-4 animate-in fade-in duration-200">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newCommentText[post._id] || ''}
                          onChange={(e) =>
                            setNewCommentText({
                              ...newCommentText,
                              [post._id]: e.target.value,
                            })
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddComment(post._id);
                          }}
                          placeholder="Write a constructive student response..."
                          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#FFF7ED]/30 dark:bg-gray-800 text-xs text-[#111827] dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#E53E24]"
                        />
                        <button
                          onClick={() => handleAddComment(post._id)}
                          className="p-2.5 rounded-xl bg-[#E53E24] text-white hover:bg-[#CB321A] transition-colors cursor-pointer shadow-xs"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-3">
                        {(post.comments || []).length > 0 ? (
                          post.comments.map((comment, idx) => (
                            <div
                              key={comment._id || idx}
                              className="p-3.5 rounded-2xl bg-[#FFF7ED]/40 dark:bg-gray-800/50 border border-soft-peach dark:border-gray-700/60 space-y-1.5"
                            >
                              <div className="flex items-center justify-between text-[11px]">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-[#111827] dark:text-white">
                                    {comment.user?.name || 'GVPCE Member'}
                                  </span>
                                  <span className="text-[10px] text-[#E53E24] bg-white dark:bg-gray-800 px-2 py-0.5 rounded-full border border-[#E53E24]/20">
                                    {comment.user?.department || 'IT'}
                                  </span>
                                </div>
                                <span className="text-gray-400">
                                  {new Date(comment.createdAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              </div>
                              <p className="text-xs text-[#4B5563] dark:text-gray-300 leading-relaxed">
                                {comment.content}
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
            <h3 className="text-lg font-bold text-[#111827] dark:text-white">No threads found</h3>
            <p className="text-xs text-[#4B5563] dark:text-gray-400 max-w-sm mx-auto">
              No discussions match your filter. Be the first to start a thread!
            </p>
          </div>
        )}
      </div>

      {/* CREATE POST MODAL */}
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
                    Share your idea, inquiry or project review
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
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#111827] dark:text-gray-200">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Idea', 'Doubt', 'Project', 'General', 'Hackathon'].map((c) => (
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

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#111827] dark:text-gray-200">
                  Thread Title
                </label>
                <input
                  type="text"
                  required
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="e.g. Ideas for next month's hackathon challenge"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-[#111827] dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#E53E24]"
                />
              </div>

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

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#E53E24] to-[#F97316] hover:opacity-95 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
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