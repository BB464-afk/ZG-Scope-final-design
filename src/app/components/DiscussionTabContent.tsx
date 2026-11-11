import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import {
  Send,
  Reply,
  Image as ImageIcon,
  X,
  ZoomIn,
  ZoomOut,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Paperclip,
  FileText,
  Archive,
  Trash2
} from 'lucide-react';

interface Comment {
  id: number;
  author: string;
  authorInitials: string;
  authorRole: string;
  authorColor: string;
  timestamp: string;
  content: string;
  images?: string[];
  replies?: Reply[];
}

interface Reply {
  id: number;
  author: string;
  authorInitials: string;
  authorRole: string;
  authorColor: string;
  timestamp: string;
  content: string;
  images?: string[];
}

interface GalleryImage {
  url: string;
  commentId: number;
  isReply: boolean;
  replyId?: number;
  author: string;
  authorInitials: string;
  authorColor: string;
  timestamp: string;
  content: string;
}

interface DiscussionTabContentProps {
  isProjectReadOnly?: boolean;
}

export const DiscussionTabContent: React.FC<DiscussionTabContentProps> = ({ isProjectReadOnly = false }) => {
  const [activeSubTab, setActiveSubTab] = useState<'comments' | 'gallery'>('comments');
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: 'John Smith',
      authorInitials: 'JS',
      authorRole: 'Project Admin',
      authorColor: '#FD4314',
      timestamp: '05/03/2026',
      content: 'The foundation work is progressing well. I noticed section B-3 needs attention - there are some minor surface cracks that should be inspected before we proceed to the next phase.',
      images: [
        'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800',
        'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800'
      ],
      replies: [
        {
          id: 11,
          author: 'Mike Johnson',
          authorInitials: 'MJ',
          authorRole: 'Standard User',
          authorColor: '#3B82F6',
          timestamp: '06/03/2026',
          content: 'I\'ve completed the inspection and documented the findings. The structural engineer has been notified and we\'re scheduling repairs for next week.',
          images: ['https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800']
        },
        {
          id: 12,
          author: 'John Smith',
          authorInitials: 'JS',
          authorRole: 'Project Admin',
          authorColor: '#3B82F6',
          timestamp: '06/03/2026',
          content: 'Good work. Let\'s ensure the repair schedule doesn\'t impact the next phase timeline.'
        }
      ]
    },
    {
      id: 2,
      author: 'Emily Davis',
      authorInitials: 'ED',
      authorRole: 'Contributor',
      authorColor: '#FD4314',
      timestamp: '05/03/2026',
      content: 'Updated the steel reinforcement specifications based on the latest structural report. All teams should review the changes before tomorrow\'s coordination meeting.',
      replies: [
        {
          id: 21,
          author: 'David Park',
          authorInitials: 'DP',
          authorRole: 'Standard User',
          authorColor: '#3B82F6',
          timestamp: '05/03/2026',
          content: 'Reviewed and approved. The changes align with our design intent.'
        }
      ]
    },
    {
      id: 3,
      author: 'Mike Johnson',
      authorInitials: 'MJ',
      authorRole: 'Standard User',
      authorColor: '#FD4314',
      timestamp: '04/03/2026',
      content: 'Excellent progress on the excavation work! The site is ready and prepared for the next construction phase.',
      images: ['https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800'],
      replies: [
        {
          id: 31,
          author: 'Lisa Martinez',
          authorInitials: 'LM',
          authorRole: 'Contributor',
          authorColor: '#3B82F6',
          timestamp: '04/03/2026',
          content: 'Great work team! Safety protocols were followed perfectly throughout.'
        }
      ]
    }
  ]);

  const [newComment, setNewComment] = useState('');
  const [newCommentImages, setNewCommentImages] = useState<string[]>([]);
  const [replyToId, setReplyToId] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [replyImages, setReplyImages] = useState<string[]>([]);
  const [expandedReplies, setExpandedReplies] = useState<{ [key: number]: boolean }>({});

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const replyTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Photo viewer state
  const [photoViewerOpen, setPhotoViewerOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [currentPhotoSet, setCurrentPhotoSet] = useState<GalleryImage[]>([]);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Collect all images for gallery
  const getAllImages = (): GalleryImage[] => {
    const images: GalleryImage[] = [];
    
    comments.forEach(comment => {
      if (comment.images) {
        comment.images.forEach(img => {
          images.push({
            url: img,
            commentId: comment.id,
            isReply: false,
            author: comment.author,
            authorInitials: comment.authorInitials,
            authorColor: comment.authorColor,
            timestamp: comment.timestamp,
            content: comment.content
          });
        });
      }
      
      if (comment.replies) {
        comment.replies.forEach(reply => {
          if (reply.images) {
            reply.images.forEach(img => {
              images.push({
                url: img,
                commentId: comment.id,
                isReply: true,
                replyId: reply.id,
                author: reply.author,
                authorInitials: reply.authorInitials,
                authorColor: reply.authorColor,
                timestamp: reply.timestamp,
                content: reply.content
              });
            });
          }
        });
      }
    });
    
    return images;
  };

  const handleAddComment = () => {
    if (!newComment.trim() && newCommentImages.length === 0) {
      toast.error('Please enter a comment or attach an image');
      return;
    }

    const comment: Comment = {
      id: Date.now(),
      author: 'You',
      authorInitials: 'YO',
      authorRole: 'Team Member',
      authorColor: '#FD4314',
      timestamp: 'Just now',
      content: newComment,
      images: newCommentImages.length > 0 ? newCommentImages : undefined,
      replies: []
    };

    setComments([comment, ...comments]);
    setNewComment('');
    setNewCommentImages([]);
    toast.success('Comment posted successfully');
  };

  const handleAddReply = (commentId: number) => {
    if (!replyContent.trim() && replyImages.length === 0) {
      toast.error('Please enter a reply or attach an image');
      return;
    }

    const reply: Reply = {
      id: Date.now(),
      author: 'You',
      authorInitials: 'YO',
      authorRole: 'Team Member',
      authorColor: '#3B82F6',
      timestamp: 'Just now',
      content: replyContent,
      images: replyImages.length > 0 ? replyImages : undefined
    };

    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), reply]
        };
      }
      return comment;
    }));

    setReplyContent('');
    setReplyImages([]);
    setReplyToId(null);
    setExpandedReplies({ ...expandedReplies, [commentId]: true });
    toast.success('Reply posted successfully');
  };

  const openPhotoViewer = (image: GalleryImage, allImages: GalleryImage[]) => {
    const index = allImages.findIndex(img => img.url === image.url);
    setCurrentPhotoSet(allImages);
    setCurrentPhotoIndex(index);
    setPhotoViewerOpen(true);
    setZoomLevel(1);
  };

  const closePhotoViewer = () => {
    setPhotoViewerOpen(false);
  };

  const handleImageUpload = (isReply: boolean = false) => {
    const mockImageUrl = `https://images.unsplash.com/photo-${Date.now()}?w=800`;
    if (isReply) {
      setReplyImages([...replyImages, mockImageUrl]);
    } else {
      setNewCommentImages([...newCommentImages, mockImageUrl]);
    }
    toast.success('Image attached');
  };

  const removeImage = (index: number, isReply: boolean = false) => {
    if (isReply) {
      setReplyImages(replyImages.filter((_, i) => i !== index));
    } else {
      setNewCommentImages(newCommentImages.filter((_, i) => i !== index));
    }
  };

  const toggleReplies = (commentId: number) => {
    setExpandedReplies({
      ...expandedReplies,
      [commentId]: !expandedReplies[commentId]
    });
  };

  const handleExportToPDF = () => {
    toast.success('A download link will be sent to your email: michael.gainey@zauner.com');
  };

  const handleDeleteComment = (commentId: number) => {
    setComments(comments.filter(comment => comment.id !== commentId));
    toast.success('Comment deleted successfully');
  };

  const handleDeleteReply = (commentId: number, replyId: number) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: comment.replies?.filter(reply => reply.id !== replyId)
        };
      }
      return comment;
    }));
    toast.success('Reply deleted successfully');
  };

  return (
    <>
      <div style={{ padding: '20px 32px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header with Sub-Tabs */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
              Discussion
            </h2>
            <button
              onClick={handleExportToPDF}
              title="Download Zip"
              style={{
                width: '32px',
                height: '32px',
                border: '1px solid #E5E7EB',
                backgroundColor: '#FFFFFF',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6B7280'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F9FAFB';
                e.currentTarget.style.color = '#374151';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.color = '#6B7280';
              }}
            >
              <Download size={16} />
            </button>
          </div>

          {/* Sub-Tabs */}
          <div style={{
            display: 'flex',
            gap: '24px',
            borderBottom: '2px solid #F3F4F6'
          }}>
            <button
              onClick={() => setActiveSubTab('comments')}
              style={{
                padding: '10px 0',
                border: 'none',
                backgroundColor: 'transparent',
                fontSize: '14px',
                fontWeight: activeSubTab === 'comments' ? '600' : '500',
                color: activeSubTab === 'comments' ? '#FD4314' : '#6B7280',
                cursor: 'pointer',
                borderBottom: activeSubTab === 'comments' ? '2px solid #FD4314' : '2px solid transparent',
                marginBottom: '-2px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <MessageCircle size={16} />
              Comments ({comments.length})
            </button>
            <button
              onClick={() => setActiveSubTab('gallery')}
              style={{
                padding: '10px 0',
                border: 'none',
                backgroundColor: 'transparent',
                fontSize: '14px',
                fontWeight: activeSubTab === 'gallery' ? '600' : '500',
                color: activeSubTab === 'gallery' ? '#FD4314' : '#6B7280',
                cursor: 'pointer',
                borderBottom: activeSubTab === 'gallery' ? '2px solid #FD4314' : '2px solid transparent',
                marginBottom: '-2px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <ImageIcon size={16} />
              Gallery ({getAllImages().length})
            </button>
          </div>
        </div>

        {/* COMMENTS TAB */}
        {activeSubTab === 'comments' && (
          <>
            {/* Quick Comment Input */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #E5E7EB',
              borderRadius: '8px',
              padding: '14px',
              marginBottom: '28px',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#FD4314',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: '600',
                  flexShrink: 0
                }}>
                  YO
                </div>
                <div style={{ flex: 1, position: 'relative' }}>
                  <textarea
                    ref={textareaRef}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    style={{
                      width: '100%',
                      minHeight: '48px',
                      maxHeight: '200px',
                      padding: '10px 12px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '6px',
                      fontSize: '14px',
                      color: '#111827',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                  
                  {/* Image Previews */}
                  {newCommentImages.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                      {newCommentImages.map((img, idx) => (
                        <div key={idx} style={{ position: 'relative' }}>
                          <img
                            src={img}
                            alt="Preview"
                            style={{
                              width: '56px',
                              height: '56px',
                              objectFit: 'cover',
                              borderRadius: '6px',
                              border: '1px solid #E5E7EB'
                            }}
                          />
                          <button
                            onClick={() => removeImage(idx)}
                            style={{
                              position: 'absolute',
                              top: '-6px',
                              right: '-6px',
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              backgroundColor: '#DC2626',
                              color: '#FFFFFF',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => handleImageUpload(false)}
                        style={{
                          width: '32px',
                          height: '32px',
                          border: '1px solid #D1D5DB',
                          backgroundColor: '#FFFFFF',
                          borderRadius: '6px',
                          color: '#6B7280',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Attach Photo"
                      >
                        <Paperclip size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => !isProjectReadOnly && handleAddComment()}
                      disabled={isProjectReadOnly || (!newComment.trim() && newCommentImages.length === 0)}
                      title={isProjectReadOnly ? "Post disabled - Project is On Hold" : ""}
                      style={{
                        height: '32px',
                        padding: '0 18px',
                        border: 'none',
                        backgroundColor: isProjectReadOnly ? '#D1D5DB' : (newComment.trim() || newCommentImages.length > 0) ? '#FD4314' : '#D1D5DB',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#FFFFFF',
                        cursor: isProjectReadOnly ? 'not-allowed' : (newComment.trim() || newCommentImages.length > 0) ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        opacity: isProjectReadOnly ? 0.5 : 1
                      }}
                      onMouseEnter={(e) => {
                        if (!isProjectReadOnly && (newComment.trim() || newCommentImages.length > 0)) {
                          e.currentTarget.style.backgroundColor = '#E03A0F';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isProjectReadOnly && (newComment.trim() || newCommentImages.length > 0)) {
                          e.currentTarget.style.backgroundColor = '#FD4314';
                        }
                      }}
                    >
                      <Send size={14} />
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {comments.map((comment) => (
                <div key={comment.id}>
                  {/* Main Comment Card */}
                  <div style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        {/* Avatar */}
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: comment.authorColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF',
                          fontSize: '14px',
                          fontWeight: '600',
                          flexShrink: 0
                        }}>
                          {comment.authorInitials}
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          {/* Author Info */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                              {comment.author}
                            </span>
                            <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
                              {comment.authorRole}
                            </span>
                            <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
                              • {comment.timestamp}
                            </span>
                          </div>

                          {/* Comment Text */}
                          <p style={{ fontSize: '14px', color: '#374151', margin: '0 0 12px 0', lineHeight: '1.6' }}>
                            {comment.content}
                          </p>
                          
                          {/* Comment Images */}
                          {comment.images && comment.images.length > 0 && (
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                              {comment.images.map((img, idx) => (
                                <img
                                  key={idx}
                                  src={img}
                                  alt="Attachment"
                                  onClick={() => openPhotoViewer({
                                    url: img,
                                    commentId: comment.id,
                                    isReply: false,
                                    author: comment.author,
                                    authorInitials: comment.authorInitials,
                                    authorColor: comment.authorColor,
                                    timestamp: comment.timestamp,
                                    content: comment.content
                                  }, getAllImages())}
                                  style={{
                                    width: '120px',
                                    height: '120px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    border: '1px solid #E5E7EB',
                                    cursor: 'pointer'
                                  }}
                                />
                              ))}
                            </div>
                          )}

                          {/* Reply Button */}
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => setReplyToId(replyToId === comment.id ? null : comment.id)}
                              style={{
                                padding: '6px 12px',
                                border: '1px solid #D1D5DB',
                                backgroundColor: replyToId === comment.id ? '#F9FAFB' : '#FFFFFF',
                                borderRadius: '6px',
                                fontSize: '13px',
                                fontWeight: '500',
                                color: '#6B7280',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}
                            >
                              <Reply size={14} />
                              Reply
                            </button>
                            {comment.author === 'You' && (
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                style={{
                                  padding: '6px 12px',
                                  border: '1px solid #FCA5A5',
                                  backgroundColor: '#FFFFFF',
                                  borderRadius: '6px',
                                  fontSize: '13px',
                                  fontWeight: '500',
                                  color: '#DC2626',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = '#FEF2F2';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                                }}
                              >
                                <Trash2 size={14} />
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Replies Section */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div style={{
                        borderTop: '1px solid #F3F4F6',
                        backgroundColor: '#FAFBFC'
                      }}>
                        <button
                          onClick={() => toggleReplies(comment.id)}
                          style={{
                            width: '100%',
                            padding: '10px 16px',
                            border: 'none',
                            backgroundColor: 'transparent',
                            fontSize: '13px',
                            fontWeight: '500',
                            color: '#6B7280',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            textAlign: 'left'
                          }}
                        >
                          {expandedReplies[comment.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                        </button>

                        {expandedReplies[comment.id] && (
                          <div style={{ padding: '0 16px 16px 16px' }}>
                            {comment.replies.map((reply) => (
                              <div key={reply.id} style={{
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                                padding: '12px',
                                marginBottom: '10px',
                                marginLeft: '32px'
                              }}>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                  {/* Reply Avatar */}
                                  <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    backgroundColor: reply.authorColor,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#FFFFFF',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    flexShrink: 0
                                  }}>
                                    {reply.authorInitials}
                                  </div>

                                  {/* Reply Content */}
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    {/* Reply Author Info */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', flexWrap: 'wrap' }}>
                                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>
                                        {reply.author}
                                      </span>
                                      <span style={{ fontSize: '11px', color: '#9CA3AF' }}>
                                        {reply.authorRole}
                                      </span>
                                      <span style={{ fontSize: '11px', color: '#9CA3AF' }}>
                                        • {reply.timestamp}
                                      </span>
                                    </div>

                                    {/* Reply Text */}
                                    <p style={{ fontSize: '13px', color: '#374151', margin: '0 0 8px 0', lineHeight: '1.6' }}>
                                      {reply.content}
                                    </p>

                                    {/* Reply Images */}
                                    {reply.images && reply.images.length > 0 && (
                                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                                        {reply.images.map((img, idx) => (
                                          <img
                                            key={idx}
                                            src={img}
                                            alt="Attachment"
                                            onClick={() => openPhotoViewer({
                                              url: img,
                                              commentId: comment.id,
                                              isReply: true,
                                              replyId: reply.id,
                                              author: reply.author,
                                              authorInitials: reply.authorInitials,
                                              authorColor: reply.authorColor,
                                              timestamp: reply.timestamp,
                                              content: reply.content
                                            }, getAllImages())}
                                            style={{
                                              width: '80px',
                                              height: '80px',
                                              objectFit: 'cover',
                                              borderRadius: '6px',
                                              border: '1px solid #E5E7EB',
                                              cursor: 'pointer'
                                            }}
                                          />
                                        ))}
                                      </div>
                                    )}

                                    {/* Delete Reply Button */}
                                    {reply.author === 'You' && (
                                      <button
                                        onClick={() => handleDeleteReply(comment.id, reply.id)}
                                        style={{
                                          padding: '4px 10px',
                                          border: '1px solid #FCA5A5',
                                          backgroundColor: '#FFFFFF',
                                          borderRadius: '4px',
                                          fontSize: '12px',
                                          fontWeight: '500',
                                          color: '#DC2626',
                                          cursor: 'pointer',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '4px'
                                        }}
                                        onMouseEnter={(e) => {
                                          e.currentTarget.style.backgroundColor = '#FEF2F2';
                                        }}
                                        onMouseLeave={(e) => {
                                          e.currentTarget.style.backgroundColor = '#FFFFFF';
                                        }}
                                      >
                                        <Trash2 size={12} />
                                        Delete
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Reply Input */}
                    {replyToId === comment.id && (
                      <div style={{
                        borderTop: '1px solid #F3F4F6',
                        padding: '14px 16px',
                        backgroundColor: '#FAFBFC'
                      }}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: '#3B82F6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF',
                            fontSize: '12px',
                            fontWeight: '600',
                            flexShrink: 0
                          }}>
                            YO
                          </div>
                          <div style={{ flex: 1, position: 'relative' }}>
                            <textarea
                              ref={replyTextareaRef}
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              placeholder="Write a reply..."
                              style={{
                                width: '100%',
                                minHeight: '40px',
                                maxHeight: '150px',
                                padding: '8px 10px',
                                border: '1px solid #D1D5DB',
                                borderRadius: '6px',
                                fontSize: '13px',
                                color: '#111827',
                                fontFamily: 'inherit',
                                resize: 'vertical'
                              }}
                            />

                            {/* Reply Image Previews */}
                            {replyImages.length > 0 && (
                              <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                                {replyImages.map((img, idx) => (
                                  <div key={idx} style={{ position: 'relative' }}>
                                    <img
                                      src={img}
                                      alt="Preview"
                                      style={{
                                        width: '48px',
                                        height: '48px',
                                        objectFit: 'cover',
                                        borderRadius: '4px',
                                        border: '1px solid #E5E7EB'
                                      }}
                                    />
                                    <button
                                      onClick={() => removeImage(idx, true)}
                                      style={{
                                        position: 'absolute',
                                        top: '-4px',
                                        right: '-4px',
                                        width: '16px',
                                        height: '16px',
                                        borderRadius: '50%',
                                        backgroundColor: '#DC2626',
                                        color: '#FFFFFF',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '10px'
                                      }}
                                    >
                                      <X size={10} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}

                            <div style={{ display: 'flex', gap: '6px', marginTop: '8px', justifyContent: 'space-between', alignItems: 'center' }}>
                              <button
                                onClick={() => handleImageUpload(true)}
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  border: '1px solid #D1D5DB',
                                  backgroundColor: '#FFFFFF',
                                  borderRadius: '4px',
                                  color: '#6B7280',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                                title="Attach Photo"
                              >
                                <Paperclip size={14} />
                              </button>
                              <button
                                onClick={() => !isProjectReadOnly && handleAddReply(comment.id)}
                                disabled={isProjectReadOnly || (!replyContent.trim() && replyImages.length === 0)}
                                title={isProjectReadOnly ? "Reply disabled - Project is On Hold" : ""}
                                style={{
                                  height: '28px',
                                  padding: '0 14px',
                                  border: 'none',
                                  backgroundColor: isProjectReadOnly ? '#D1D5DB' : (replyContent.trim() || replyImages.length > 0) ? '#FD4314' : '#D1D5DB',
                                  borderRadius: '4px',
                                  fontSize: '13px',
                                  fontWeight: '600',
                                  color: '#FFFFFF',
                                  cursor: isProjectReadOnly ? 'not-allowed' : (replyContent.trim() || replyImages.length > 0) ? 'pointer' : 'not-allowed',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  opacity: isProjectReadOnly ? 0.5 : 1
                                }}
                              >
                                <Send size={12} />
                                Reply
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* GALLERY TAB */}
        {activeSubTab === 'gallery' && (
          <div>
            {getAllImages().length === 0 ? (
              <div style={{
                backgroundColor: '#F9FAFB',
                border: '2px dashed #D1D5DB',
                borderRadius: '8px',
                padding: '48px 24px',
                textAlign: 'center'
              }}>
                <ImageIcon size={48} style={{ color: '#D1D5DB', margin: '0 auto 16px' }} />
                <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>
                  No images yet. Images from comments and replies will appear here.
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '16px'
              }}>
                {getAllImages().map((image, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: 'relative',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      cursor: 'pointer'
                    }}
                    onClick={() => openPhotoViewer(image, getAllImages())}
                  >
                    <img
                      src={image.url}
                      alt="Gallery"
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{
                      padding: '10px',
                      borderTop: '1px solid #E5E7EB'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: image.authorColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF',
                          fontSize: '10px',
                          fontWeight: '600',
                          flexShrink: 0
                        }}>
                          {image.authorInitials}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '12px', fontWeight: '600', color: '#111827' }}>
                            {image.author}
                          </div>
                          <div style={{ fontSize: '11px', color: '#9CA3AF' }}>
                            {image.timestamp}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Photo Viewer Modal */}
      {photoViewerOpen && currentPhotoSet.length > 0 && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Top Bar */}
          <div style={{
            height: '60px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: currentPhotoSet[currentPhotoIndex].authorColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {currentPhotoSet[currentPhotoIndex].authorInitials}
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#FFFFFF' }}>
                  {currentPhotoSet[currentPhotoIndex].author}
                </div>
                <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
                  {currentPhotoSet[currentPhotoIndex].timestamp}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}
                style={{
                  width: '36px',
                  height: '36px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Zoom Out"
              >
                <ZoomOut size={18} />
              </button>
              <span style={{ fontSize: '14px', color: '#FFFFFF', minWidth: '50px', textAlign: 'center' }}>
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.25))}
                style={{
                  width: '36px',
                  height: '36px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Zoom In"
              >
                <ZoomIn size={18} />
              </button>

              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = currentPhotoSet[currentPhotoIndex].url;
                  link.download = 'image.jpg';
                  link.click();
                  toast.success('Download started');
                }}
                style={{
                  width: '36px',
                  height: '36px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Download"
              >
                <Download size={18} />
              </button>
              <button
                onClick={closePhotoViewer}
                style={{
                  width: '36px',
                  height: '36px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Main Image Area */}
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Previous Button */}
            {currentPhotoIndex > 0 && (
              <button
                onClick={() => {
                  setCurrentPhotoIndex(currentPhotoIndex - 1);
                  setZoomLevel(1);
                }}
                style={{
                  position: 'absolute',
                  left: '20px',
                  width: '48px',
                  height: '48px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  borderRadius: '50%',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10
                }}
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {/* Image */}
            <img
              src={currentPhotoSet[currentPhotoIndex].url}
              alt="Full size"
              style={{
                maxWidth: '90%',
                maxHeight: '90%',
                objectFit: 'contain',
                transform: `scale(${zoomLevel})`,
                transition: 'transform 0.2s'
              }}
            />

            {/* Next Button */}
            {currentPhotoIndex < currentPhotoSet.length - 1 && (
              <button
                onClick={() => {
                  setCurrentPhotoIndex(currentPhotoIndex + 1);
                  setZoomLevel(1);
                }}
                style={{
                  position: 'absolute',
                  right: '20px',
                  width: '48px',
                  height: '48px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  borderRadius: '50%',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10
                }}
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>

          {/* Bottom Info Bar */}
          <div style={{
            height: '80px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontSize: '14px',
                color: '#FFFFFF',
                margin: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {currentPhotoSet[currentPhotoIndex].content}
              </p>
            </div>
            <div style={{ fontSize: '14px', color: '#9CA3AF', marginLeft: '20px', flexShrink: 0 }}>
              {currentPhotoIndex + 1} / {currentPhotoSet.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};