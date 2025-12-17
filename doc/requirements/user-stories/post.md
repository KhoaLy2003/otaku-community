## US-001: Create Post

### When
- A user clicks the **Create Post** button.
- The system navigates the user to the **Create Post** page.
- The user enters post details:
  - **Tab 1:** Title (required) and Content (optional)
  - **Tab 2:** Upload Image(s) or Video(s) (optional)
- When uploading files:
  - After a file is uploaded successfully, the system displays a **preview thumbnail** (image or video), not just the file name.
  - Each preview has:
    - A **Trash Bin icon button** on the right to delete/remove the file.
    - An **Add (+) icon button** on the left that allows uploading **more files**.
  - If the user uploads more than one image, the previews are shown inside a **slider/carousel**.
- The user can choose:
  - **Save Draft**
  - **Post**
- A **Back to Feed** button is shown at the top (replacing the previous text link).

### Then
- The system validates that the **Title** is not empty.
- If the user clicks **Save Draft**:
  - The post is saved as a **draft**.
  - The system navigates back to the **Feed page**.
  - A **success message** appears (e.g., "Draft saved successfully").
- If the user clicks **Post**:
  - The post is created and set to **published** status.
  - The system navigates back to the **Feed page**.
  - A **success message** appears (e.g., "Post published successfully").
- The system correctly stores:
  - Title
  - Content
  - Uploaded media files (images/videos)
  - Selected topic (optional)
- Removed files are not included in the final post submission.

## US-002: Comment Post

### When
- A user clicks the **Comment** button on a post in the feed.  
- The system navigates the user to the **Post Detail** page and scrolls/highlights the **Add Comment** section.  
- The user inputs a comment in the text box.  
- The user can either:  
  - Click **Comment** to post their comment, or  
  - Click **Cancel** to discard the comment and remain on the post detail page.  
- For each existing comment, the user can perform the following actions (if permitted):  
  - **Edit** their own comment  
  - **Delete** their own comment  
  - **Reply** to a comment  
  - **Like** or **Unlike** a comment  

### Then
- If the user clicks **Comment**, the comment is added under the post immediately.  
- If the user clicks **Cancel**, the comment input is cleared and no comment is saved.  
- If the user edits a comment, the updated comment replaces the old one immediately.  
- If the user deletes a comment, the comment is removed from the list immediately.  
- Replies are nested under the parent comment and displayed in real-time.  
- Liking/unliking a comment updates the like count instantly.  
- The system may optionally scroll to the newly added comment or show a brief confirmation (e.g., "Comment added successfully").

---

## US-003: Share Post

### When
- A user clicks the **Share** button on a post.  

### Then
- The system copies the **post link** to the clipboard.  
- A **success alert message** is displayed (e.g., "Link copied to clipboard").  
- Optionally, the system can offer **other sharing options** (social media, messaging apps) for better UX.

---

## US-004: Detail Post

### When
- A user clicks on a post (anywhere on the post card) in the feed.  

### Then
- The system navigates the user to the **Post Detail** page.  
- The post shows:  
  - Full **Title** and **Content**  
  - **Images/Videos**  
  - **Topic**  
  - **Comments** (with option to add new comment)  
  - **Like**, **Share**, and **Comment** buttons  
  - **Back to Feed** button to return to the home feed page  
- The user can interact with the post:  
  - Add a comment  
  - Like/unlike the post  
  - Share the post  
  - Perform actions on each comment: **Edit**, **Delete**, **Reply**, **Like/Unlike**  
- The system should display interactions in real-time where possible (e.g., new comment appears immediately after posting).  
- Clicking **Back to Feed** navigates the user back to the home feed without losing scroll position if possible.
