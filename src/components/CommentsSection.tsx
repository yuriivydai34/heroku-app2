import { useRouter } from "next/navigation";

interface CommentData {
  id?: string;
  content: string;
  taskId?: number;
  userId?: number;
  createdAt?: string;
}

interface UserData {
  id: string;
  username: string;
}

interface CommentsSectionProps {
  comments: CommentData[];
  users: UserData[];
  commentsError: string | null;
  newComment: string;
  isSubmittingComment: boolean;
  commentsLoading: boolean;
  setCommentsError: (error: string | null) => void;
  setNewComment: (comment: string) => void;
  handleSubmitComment: (e: React.FormEvent) => void;
  loadComments: () => void;
  handleDeleteComment: (commentId: string) => void;
}

const CommentsSection = ({
  comments,
  users,
  commentsError,
  newComment,
  isSubmittingComment,
  commentsLoading,
  setCommentsError,
  setNewComment,
  handleSubmitComment,
  loadComments,
  handleDeleteComment
}: CommentsSectionProps) => {
  const router = useRouter();

  const handleCommentFilesClick = (commentId: string) => {
    router.push(`/comment-upload/${commentId}`);
  };

  return (
    <div className="mt-6 bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Коментарі ({comments.length})
        </h3>

        {/* Comments Error */}
        {commentsError && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-red-500">⚠️</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{commentsError}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setCommentsError(null)}
                  className="text-red-400 hover:text-red-600"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Comment Form */}
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Додайте коментар
            </label>
            <textarea
              id="comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Напишіть коментар..."
              disabled={isSubmittingComment}
              style={{ color: 'black' }}
            />
          </div>
          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={isSubmittingComment || !newComment.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {isSubmittingComment ? 'Додається...' : 'Додати коментар'}
            </button>
          </div>
        </form>

        {/* Comments List */}
        {commentsLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Завантажується...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Немає коментарів.</p>
            <p className="text-sm text-gray-400 mt-1">Додайте коментар.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-gray-900 whitespace-pre-wrap">{comment.content}</p>
                    <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                      {comment.userId && (
                        <span>
                          By: {users.find(u => String(u.id) === String(comment.userId))?.username || comment.userId}
                        </span>
                      )}
                      {comment.createdAt && (
                        <span>{new Date(comment.createdAt).toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleCommentFilesClick(comment.id!)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Файли
                  </button>
                  {comment.id && (
                    <button
                      onClick={() => handleDeleteComment(comment.id!)}
                      className="text-red-500 hover:text-red-700 text-sm ml-4"
                      title="Видалити коментар"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Refresh Comments Button */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={loadComments}
            disabled={commentsLoading}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium disabled:text-gray-400"
          >
            🔄 {commentsLoading ? 'Завантажується...' : 'Оновити'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentsSection;