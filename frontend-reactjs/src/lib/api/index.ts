// Export all API modules for easy importing
export { apiClient, type ApiError } from "./client";
export {
  usersApi,
  type UserSyncRequest,
  type UserSyncResponse,
  type UpdateProfileData,
} from "./users";
export {
  postsApi,
  type CreatePostRequest,
  type UpdatePostRequest,
} from "./posts";
export { topicsApi } from "./topics";
export {
  commentsApi,
  type CreateCommentData,
  type UpdateCommentData,
} from "./comments";
export { interactionsApi, type LikeResponse } from "./interactions";
export { chatApi } from "./chat";

// Re-export common types
export type { ApiResponse, PaginatedResponse } from "../../types/api";
