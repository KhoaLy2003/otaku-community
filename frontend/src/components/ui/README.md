# UI Component Library

This directory contains a collection of reusable UI components that form the building blocks of our application's user interface. The purpose of this library is to ensure a consistent look and feel, improve development efficiency, and reduce code duplication.

## Guiding Principles

- **Consistency**: All components are designed to work together seamlessly, providing a uniform user experience across the application.
- **Reusability**: Components are built to be flexible and adaptable for use in various contexts.
- **Accessibility**: We strive to make our components accessible to all users by following ARIA standards.
- **Developer Experience**: Components are designed to be easy to use with clear and concise APIs.

## When to Use

Instead of creating custom styles or components for common UI elements, always check this directory first. If a component exists that meets your needs, you should use it. If you need a new component or a variation of an existing one, consider whether it can be added to this library for future use.

## Component Documentation

### Alert

- **Purpose**: To display important messages to the user, such as success, error, or warning notifications.
- **When to Use**: Use alerts to provide feedback to the user after an action, or to draw attention to important information.
- **Example Usage**:
  ```tsx
  <Alert type="success" message="Your profile has been updated successfully." />
  ```

### Avatar

- **Purpose**: To display a user's profile picture or a placeholder image.
- **When to Use**: Use avatars in user profiles, comments, or any other place where a user is represented.
- **Example Usage**:
  ```tsx
  <Avatar src={user.profilePicture} alt={user.name} />
  ```

### Badge

- **Purpose**: To display a small piece of information, such as a notification count or a status label.
- **When to Use**: Use badges to add extra information to an element without taking up too much space.
- **Example Usage**:
  ```tsx
  <Badge count={5} />
  ```

### Button

- **Purpose**: To trigger an action when clicked.
- **When to Use**: Use buttons for all clickable actions, such as submitting forms, opening modals, or navigating to another page.
- **Example Usage**:
  ```tsx
  <Button onClick={handleSubmit}>Submit</Button>
  ```

### Card

- **Purpose**: To group related content in a container.
- **When to Use**: Use cards to display posts, user profiles, or any other content that needs to be visually separated from the rest of the page.
- **Example Usage**:
  ```tsx
  <Card>
    <h2>Post Title</h2>
    <p>Post content...</p>
  </Card>
  ```

### ConfirmDialog

- **Purpose**: To prompt the user for confirmation before performing a critical action.
- **When to Use**: Use confirmation dialogs when the user is about to perform an action that cannot be undone, such as deleting a post or blocking a user.
- **Example Usage**:
  ```tsx
  <ConfirmDialog
    isOpen={isConfirmOpen}
    onClose={() => setConfirmOpen(false)}
    onConfirm={handleDelete}
    title="Delete Post"
    message="Are you sure you want to delete this post?"
  />
  ```

### Dropdown

- **Purpose**: To display a list of options when clicked.
- **When to Use**: Use dropdowns for menus, navigation, or any other situation where you need to display a list of options in a compact way.
- **Example Usage**:
  ```tsx
  <Dropdown>
    <Dropdown.Trigger>
      <Button>Open Menu</Button>
    </Dropdown.Trigger>
    <Dropdown.Content>
      <Dropdown.Item>Option 1</Dropdown.Item>
      <Dropdown.Item>Option 2</Dropdown.Item>
    </Dropdown.Content>
  </Dropdown>
  ```

### IconButton

- **Purpose**: To create a button with only an icon.
- **When to Use**: Use icon buttons when space is limited or when the action is universally understood by the icon.
- **Example Usage**:
  ```tsx
  <IconButton icon={<FiEdit />} onClick={handleEdit} />
  ```

### Modal

- **Purpose**: To display content in a layer above the main page.
- **When to Use**: Use modals to display forms, settings, or any other content that requires the user's full attention.
- **Example Usage**:
  ```tsx
  <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
    <h2>Modal Title</h2>
    <p>Modal content...</p>
  </Modal>
  ```

### Popover

- **Purpose**: To display additional information or actions in a small overlay.
- **When to Use**: Use popovers to provide extra context or actions for an element without cluttering the UI.
- **Example Usage**:
  ```tsx
  <Popover>
    <Popover.Trigger>
      <Button>Hover Me</Button>
    </Popover.Trigger>
    <Popover.Content>
      <p>This is a popover.</p>
    </Popover.Content>
  </Popover>
  ```

### Tabs

- **Purpose**: To switch between different views or sections of content.
- **When to Use**: Use tabs to organize content into logical groups, such as in a user's profile page (e.g., "Posts", "Comments", "Likes").
- **Example Usage**:
  ```tsx
  <Tabs>
    <Tabs.List>
      <Tabs.Trigger value="posts">Posts</Tabs.Trigger>
      <Tabs.Trigger value="comments">Comments</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="posts">
      <p>Posts content...</p>
    </Tabs.Content>
    <Tabs.Content value="comments">
      <p>Comments content...</p>
    </Tabs.Content>
  </Tabs>
  ```

### TextArea

- **Purpose**: To allow users to enter multi-line text.
- **When to Use**: Use text areas for forms that require long-form text, such as post creation or editing.
- **Example Usage**:
  ```tsx
  <TextArea
    value={text}
    onChange={(e) => setText(e.target.value)}
    placeholder="Write your post here..."
  />
  ```

### TextInput

- **Purpose**: To allow users to enter a single line of text.
- **When to Use**: Use text inputs for forms that require short-form text, such as usernames, passwords, or search queries.
- **Example Usage**:
  ```tsx
  <TextInput
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    placeholder="Enter your username"
  />
  ```

### Toast

- **Purpose**: To display a brief, non-intrusive notification to the user.
- **When to Use**: Use toasts to provide feedback to the user after an action, such as "Post created" or "Settings saved."
- **Example Usage**:
  ```tsx
  import { useToast } from './useToast';

  const { toast } = useToast();

  <Button onClick={() => toast({ title: 'Success!', description: 'Your post has been created.' })}>
    Show Toast
  </Button>
  ```

### ToastProvider

- **Purpose**: To provide the context for the `Toast` component.
- **When to Use**: Wrap your application with the `ToastProvider` to enable the toast functionality. This is typically done in the root component of your application.
- **Example Usage**:
  ```tsx
  // In your main App component
  <ToastProvider>
    <YourApp />
  </ToastProvider>
  ```
