import { apiClient } from "./client";
import type { ApiResponse } from "@/types/api";
import type {
  FeedbackType,
  FeedbackTargetType,
  ReportReason,
  FeedbackPriority,
} from "@/types/admin";

export interface FeedbackRequest {
  type: FeedbackType;
  title?: string;
  content: string;
  targetType?: FeedbackTargetType;
  targetId?: string;
  priority?: FeedbackPriority;
  reason?: ReportReason;
  reporterEmail?: string;
  reporterName?: string;
  anonymous?: boolean;
}

export interface FeedbackResponse {
  id: string;
  type: FeedbackType;
  title: string | null;
  content: string;
  status: string;
  createdAt: string;
}

export const feedbackApi = {
  submit: (data: FeedbackRequest) =>
    apiClient.post<ApiResponse<FeedbackResponse>>("/v1/feedbacks", data),
};
