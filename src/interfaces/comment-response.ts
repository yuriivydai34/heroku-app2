interface CommentResponse {
  success: boolean;
  data?: CommentData | CommentData[];
  message?: string;
}