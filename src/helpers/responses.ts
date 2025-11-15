const errorResponse = (message: string, error?: Error) => ({
  error: message || "Something went wrong. Please try again.",
  error_message:
    error?.message || message || "Something went wrong. Please try again.",
});

const successResponse = (message: string, data?: any) => ({
  message: message || "API success",
  data: data ?? "",
});

export { errorResponse, successResponse };
