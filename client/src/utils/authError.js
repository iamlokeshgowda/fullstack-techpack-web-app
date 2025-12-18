export const getAuthErrorMessage = (error) => {
  if (!error.response) return "Network error";

  const { message, code } = error.response.data;

  if (code === "GOOGLE_ACCOUNT") return "This account uses Google login";

  if (code === "EMAIL_NOT_VERIFIED") return "Please verify your email";

  return message || "Something went wrong";
};
