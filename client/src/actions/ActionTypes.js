// Data load actions
export const LOAD_POSTS = "LOAD_POSTS";
export const LOAD_POST = "LOAD_POST";
export const UPDATE_COMMENTS = "UPDATE_COMMENTS";

// CommentTree actions
export const UPDATE_COMMENT = "UPDATE_COMMENT";

// CommentForm's input actions
export const UPDATE_AUTHOR = "UPDATE_AUTHOR";
export const UPDATE_EMAIL = "UPDATE_EMAIL";
export const CLEAN_COMMENT_FORM = "CLEAN_COMMENT_FORM";
export const COMMENT_INVALID = "COMMENT_INVALID";
export const REPLY_COMMENT = "REPLY_COMMENT";
export const QUOTE_COMMENT = "QUOTE_COMMENT";
export const RESET_FOCUS = "RESET_FOCUS";

// Page load errors
export const NOT_FOUND = "NOT_FOUND";
export const LOAD_ERROR = "LOAD_ERROR";
export const RESET_PAGE_STATE = "RESET_PAGE_STATE";

// We don't want loosing comment by user then sending error
// happens. So handle this situation in a special way.
export const SEND_COMMENT_ERROR = "SEND_COMMENT_ERROR";

// Admin login actions
export const UPDATE_LOGIN = "UPDATE_LOGIN";
export const UPDATE_PASSWORD = "UPDATE_PASSWORD";
export const SIGN_IN = "SIGN_IN";
export const FAIL_SIGN_IN = "FAIL_SIGN_IN";

// PostsList actions
export const LOAD_POSTS_DESC = "LOAD_POSTS_DESC";
export const OPEN_POST = "OPEN_POST";
export const OPEN_POSTS_LIST = "OPEN_POSTS_LIST";

// PostData actions
export const UPDATE_HEADER = "UPDATE_HEADER";
export const UPDATE_CONTENT = "UPDATE_CONTENT";
export const POST_SAVE_SUCCESS = "POST_SAVE_SUCCESS";
export const POST_SAVE_ERROR = "POST_SAVE_ERROR";

export const FILE_LOAD_INFO_CLEANUP = "FILE_LOAD_INFO_CLEANUP";
export const FILE_LOAD_SUCCESS = "FILE_LOAD_SUCCESS";
export const FILE_LOAD_ERROR = "FILE_LOAD_ERROR";
export const UPDATE_IMAGES_LIST = "UPDATE_IMAGES_LIST";