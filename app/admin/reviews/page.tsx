'use client';

import React, { useState, useEffect } from 'react';
import { Check, X, Trash2, Star, MessageSquare } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import RatingStars from '@/components/ui/RatingStars';
import Badge from '@/components/ui/Badge';
import { Review } from '@/types';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = () => {
    fetch('/api/v1/reviews')
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setReviews(res.reviews);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleModerate = async (reviewId: string, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`/api/v1/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchReviews();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to permanently delete this review?')) return;
    try {
      const res = await fetch(`/api/v1/reviews/${reviewId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchReviews();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <h1 className="hero-serif text-2xl sm:text-3xl text-text font-normal">
              Customer Reviews Moderation
            </h1>
            <p className="text-xs text-secondary mt-1">
              Verify client testimonials, audit ratings, and moderate public showcase feedback.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface border-b border-border text-secondary uppercase font-semibold text-[11px]">
                <tr>
                  <th className="py-3 px-4">Author</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Title & Feedback</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {reviews.map((rev) => (
                  <tr key={rev._id} className="hover:bg-surface/50">
                    <td className="py-3 px-4">
                      <p className="font-semibold text-text">{rev.userName}</p>
                      <p className="text-[11px] text-secondary">{rev.userEmail}</p>
                    </td>
                    <td className="py-3 px-4">
                      <RatingStars rating={rev.rating} size={12} />
                    </td>
                    <td className="py-3 px-4 max-w-md">
                      <p className="font-bold text-text">{rev.title}</p>
                      <p className="text-secondary line-clamp-2 mt-0.5">{rev.comment}</p>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          rev.status === 'approved'
                            ? 'success'
                            : rev.status === 'rejected'
                            ? 'error'
                            : 'gold'
                        }
                      >
                        {rev.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      {rev.status !== 'approved' && (
                        <button
                          onClick={() => handleModerate(rev._id, 'approved')}
                          className="px-2.5 py-1 text-xs bg-green-50 text-success border border-green-200 rounded font-semibold hover:bg-green-100"
                        >
                          Approve
                        </button>
                      )}
                      {rev.status !== 'rejected' && (
                        <button
                          onClick={() => handleModerate(rev._id, 'rejected')}
                          className="px-2.5 py-1 text-xs bg-red-50 text-error border border-red-200 rounded font-semibold hover:bg-red-100"
                        >
                          Reject
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(rev._id)}
                        className="p-1 text-secondary hover:text-error"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
