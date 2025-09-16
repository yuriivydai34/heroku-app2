interface TaskResponse {
  success: boolean;
  data?: TaskData | TaskData[];
  message?: string;
}