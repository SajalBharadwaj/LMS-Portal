'use client';

import React, { useState } from 'react';
import {
  X,
  Play,
  Heart,
  Star,
  Users,
  Film,
  Award,
  Calendar,
  Clock,
  MessageSquare,
  Share2,
  CheckCircle2,
} from 'lucide-react';

export default function FilmPlayerModal({ film, onClose }) {
  if (!film) return null;

  const [likes, setLikes] = useState(film.likes || 450);
  const [hasLiked, setHasLiked] = useState(false);
  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'Ishita Gupta (3rd Year)',
      text: 'The scene at the central library was so relatable! Hats off to the dramatics society for this masterpiece.',
      time: '2 hours ago',
    },
    {
      id: 2,
      author: 'Devansh Kulkarni (4th Year)',
      text: 'Best collegiate romantic drama of the year. The original background score by Tarang Band gives literal goosebumps!',
      time: 'Yesterday',
    },
  ]);
  const [newComment, setNewComment] = useState('');

  const handleToggleLike = () => {
    if (hasLiked) {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments((prev) => [
      {
        id: Date.now(),
        author: 'Aarav Sharma (Current Student)',
        text: newComment.trim(),
        time: 'Just now',
      },
      ...prev,
    ]);
    setNewComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-950 text-white rounded-3xl shadow-2xl border border-slate-800 overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-pink-500" />
            <span className="text-xs font-bold text-slate-300">
              {film.club} • Campus Cinema Showcase
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video w-full bg-black">
          {film.videoUrl ? (
            <iframe
              src={film.videoUrl}
              title={film.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <Play className="w-12 h-12 mb-2 opacity-50" />
              <p className="text-sm">Video Stream Ready</p>
            </div>
          )}
        </div>

        {/* Details & Discussion Section */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Title & Actions Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/20 text-pink-400 border border-pink-500/30">
                  {film.genre}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {film.duration}
                </span>
                <span className="text-xs text-amber-400 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current" /> {film.rating} ({film.reviewsCount} reviews)
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">{film.title}</h2>
              <p className="text-xs text-slate-400">
                Directed by <strong className="text-slate-200">{film.director}</strong> • {film.year}
              </p>
            </div>

            {/* Like & Share Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleLike}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  hasLiked
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
                <span>{likes}</span>
              </button>

              <button
                onClick={() => alert('Link copied to clipboard for campus sharing!')}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="Share with Campus Friends"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Awards Banner */}
          {film.awards && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 flex items-center gap-2 text-xs font-bold text-amber-300">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{film.awards}</span>
            </div>
          )}

          {/* Synopsis */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Storyline & Synopsis
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/50 p-4 rounded-2xl border border-slate-800/80">
              {film.synopsis}
            </p>
          </div>

          {/* Cast & Crew Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-2">
              <h4 className="font-bold text-slate-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-400" /> Lead Characters & Cast
              </h4>
              <div className="space-y-1 text-slate-400">
                {film.cast?.map((c, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="text-white font-medium">{c.actor}</span>
                    <span className="italic text-slate-500">{c.role}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-2">
              <h4 className="font-bold text-slate-300 flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-purple-400" /> Production & Music
              </h4>
              <p className="text-slate-400 leading-relaxed">{film.crew}</p>
            </div>
          </div>

          {/* Student Reviews & Comments Section */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-pink-400" />
              Campus Scholar Reviews ({comments.length})
            </h3>

            {/* Post comment form */}
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                placeholder="Share your thoughts on the acting, storyline or music..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 disabled:opacity-40 text-xs font-bold text-white transition-all shadow-md shadow-pink-600/20"
              >
                Post Review
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-2.5 pt-2">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60 space-y-1 text-xs"
                >
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-slate-200">{c.author}</span>
                    <span className="text-slate-500">{c.time}</span>
                  </div>
                  <p className="text-slate-300">{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
