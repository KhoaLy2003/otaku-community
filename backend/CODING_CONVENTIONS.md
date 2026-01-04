# Otaku Community Backend - Coding Conventions

## 1. Introduction

This document outlines the coding conventions and best practices to be followed when developing the Otaku Community
backend. Adhering to these conventions ensures that the codebase remains clean, consistent, readable, and maintainable.

## 2. General Principles

- **Language**: Java 17
- **Framework**: Spring Boot 3.2.1
- **Build Tool**: Maven
- **Guiding Philosophy**: Write code that is simple, clear, and easy for other developers to understand.

## 3. Formatting

- **Indentation**: Use 4 spaces for indentation. Do not use tabs.
- **Line Length**: Keep lines to a maximum of 120 characters.
- **Braces**: Use the "One True Brace Style" (OTBS), where the opening brace is on the same line as the statement.

  ```java
  // Correct
  public class MyClass {
      public void myMethod() {
          // method body
      }
  }

  // Incorrect
  public class MyClass
  {
      public void myMethod()
      {
          // method body
      }
  }
  ```
- **Blank Lines**: Use single blank lines to separate methods and logical blocks of code within methods for readability.

## 4. Naming Conventions

- **Packages**: `com.otaku.community.feature.<feature_name>.<layer>`. For example:
  `com.otaku.community.feature.post.service`.
- **Classes & Interfaces**: `PascalCase`. Examples: `PostController`, `UserService`, `ResourceNotFoundException`.
- **Methods**: `camelCase`. Examples: `getUserById`, `createPost`.
- **Variables**: `camelCase`. Constants (static final fields) should be in `UPPER_SNAKE_CASE`.
  ```java
  // Variable
  String userName = "test";

  // Constant
  public static final int MAX_POST_LENGTH = 500;
  ```
- **DTOs (Data Transfer Objects)**:
    - Requests: Suffix with `Request`. Example: `CreatePostRequest`.
    - Responses: Suffix with `Response` or `Record`. Example: `PostDetailResponse`, `PostAuthorRecord`.
- **Entities**: Use clear, singular nouns. Example: `Post`, `User`, `Comment`.
- **REST Endpoints**: Use plural nouns and `kebab-case` for resource paths. Example: `/api/users`,
  `/api/posts/{postId}/comments`.

## 5. Architectural Style

The project follows a modular, layered architecture.

- **Modular Architecture**: Each distinct feature (e.g., `post`, `user`, `notification`) resides in its own package
  under `com.otaku.community.feature`. This promotes separation of concerns and maintainability.
- **Layered Architecture**: Within each feature module, the code is organized into the following layers:
    - `controller`: Handles HTTP requests, performs validation, and delegates to the service layer. Should be
      lightweight.
    - `service`: Contains the core business logic.
    - `repository`: Manages data access using Spring Data JPA.
    - `entity`: Defines the JPA entities for database mapping.
    - `dto`: Contains Data Transfer Objects for API requests and responses.
    - `mapper`: Contains MapStruct interfaces for mapping between Entities and DTOs.
    - `exception`: Custom exceptions specific to the feature.

**Key Rule**: Controllers should only interact with Services. Services can interact with other Services and
Repositories. Entities should **never** be directly returned by controllers. Always map them to DTOs.

## 6. Library and Framework Usage

- **Spring Boot**:
    - **Dependency Injection**: Always use constructor-based injection. This makes dependencies explicit and classes
      easier to test.
      ```java
      // Correct
      private final PostService postService;

      public PostController(PostService postService) {
          this.postService = postService;
      }
      ```
    - **Annotations**: Use standard Spring stereotype annotations: `@RestController`, `@Service`, `@Repository`,
      `@Configuration`.
- **Lombok**: Use Lombok to reduce boilerplate code.
    - `@Data`: Use with caution, as it includes `@ToString`, `@EqualsAndHashCode`, and `@RequiredArgsConstructor`.
      Often, a more specific set of annotations is better.
    - `@Getter`, `@Setter`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@Builder` are commonly used on DTOs and
      Entities.
- **MapStruct**: Used for all DTO-to-Entity and Entity-to-DTO mappings.
    - Mappers should be defined as interfaces annotated with `@Mapper(componentModel = "spring")`.
    - This ensures type-safe, performant, and boilerplate-free mappings.
- **Springdoc OpenAPI (Swagger)**:
    - All API endpoints in controllers should be documented with `@Operation` and `@ApiResponse`.
    - DTO properties should be documented with `@Schema`.

## 7. Error Handling

- **Custom Exceptions**: Create specific, unchecked exceptions for known error conditions (e.g.,
  `ResourceNotFoundException`).
- **Global Exception Handler**: A class annotated with `@ControllerAdvice` (`GlobalExceptionHandler.java`) is used to
  catch these custom exceptions and translate them into a standardized `ApiResponse` format for the client. This keeps
  controller code clean of exception-handling logic.

## 8. API Response & Error Structure

All API responses, both for success and errors, should conform to the standardized `ApiResponse<T>` structure.

- **Success Response**:
    - `status`: "success"
    - `message`: A brief, informative message.
    - `data`: The payload of the response. This can be a single object, a list of objects, or a `PageResponse<T>` for
      paged results.

  ```json
  {
    "status": "success",
    "message": "Post created successfully.",
    "data": {
      "id": 123,
      "title": "My New Post"
    }
  }
  ```

  ```json
  {
    "status": "success",
    "message": "Posts retrieved successfully.",
    "data": {
      "content": [
        { "id": 1, "title": "Post 1" },
        { "id": 2, "title": "Post 2" }
      ],
      "pageNumber": 0,
      "pageSize": 10,
      "totalElements": 25,
      "totalPages": 3,
      "isLast": false
    }
  }
  ```

- **Error Response**:
    - `status`: "error"
    - `message`: A clear, user-friendly error message.
    - `debugMessage`: (Optional) A more technical message for debugging, typically populated from the exception message.

  ```json
  {
    "status": "error",
    "message": "The requested resource was not found.",
    "debugMessage": "Post with ID 999 not found."
  }
  ```
  The `GlobalExceptionHandler` is responsible for formatting all exceptions into this structure.

## 9. Validation

- **Location**: Validation is performed at the controller layer on incoming request DTOs.
- **Mechanism**: Use Jakarta Bean Validation (`jakarta.validation.constraints.*`) annotations on DTO fields.
- **Trigger**: Add the `@Valid` annotation to the `@RequestBody` parameter in the controller method.

  ```java
  // In a DTO
  public class CreatePostRequest {
      @NotBlank(message = "Title cannot be empty.")
      @Size(max = 100, message = "Title cannot exceed 100 characters.")
      private String title;

      // ... other fields and getters/setters
  }

  // In a Controller
  @PostMapping
  public ApiResponse<PostResponse> createPost(@Valid @RequestBody CreatePostRequest request) {
      // ... service call
  }
  ```
- **Error Response**: Validation failures automatically trigger a `MethodArgumentNotValidException`, which the
  `GlobalExceptionHandler` intercepts and formats into a 400 Bad Request response with details about the validation
  errors.

## 10. DTO Granularity

DTOs should be purpose-built for a specific API endpoint or use case. Avoid creating large, generic DTOs.

- **Read vs. Write**: Use different DTOs for reads (responses) and writes (requests).
    - `CreatePostRequest` should only contain fields a user can create.
    - `UpdatePostRequest` might contain a subset of fields that are updatable.
- **List vs. Detail**: Use different response DTOs for list views and detailed views.
    - `PostSummaryResponse`: For a list of posts, containing only essential fields like ID, title, author, and creation
      date.
    - `PostDetailResponse`: For a single post view, containing the full content, comments, likes, etc.

This approach prevents over-exposing or over-fetching data and provides a clean, intentional API contract.

## 11. Security & Authorization

- **Configuration**: All security rules, including protected routes and public routes, are defined in
  `SecurityConfig.java`.
- **Authentication**: The system uses JWTs provided by Auth0. A filter validates the token on every request to a
  protected endpoint.
- **Authorization**: Use method-level security with Spring Security's `@PreAuthorize` annotation on service or
  controller methods.
    - **Role-Based**: `@PreAuthorize("hasRole('ADMIN')")`
    - **Ownership/Custom Logic**: `@PreAuthorize("@customSecurityService.isPostOwner(#postId, principal.name)")`
- **User Injection**: Use the custom `@CurrentUserId` annotation in controller methods to safely inject the
  authenticated user's ID. This avoids manual parsing of the `Principal` object and tight coupling to the security
  context.

  ```java
  // In a Controller
  @DeleteMapping("/{postId}")
  public ApiResponse<Void> deletePost(@PathVariable Long postId, @CurrentUserId UUID userId) {
      postService.deletePost(postId, userId);
      return ApiResponse.success("Post deleted successfully.");
  }
  ```

## 12. Transaction Management

- **Boundary**: Transactions must be managed at the **service layer**. The controller should not be aware of transaction
  boundaries.
- **Annotation**: Use the `@Transactional` annotation from `org.springframework.transaction.annotation` on public
  service methods.
- **Read-Only Optimization**: For methods that only read data (e.g., `get`, `find`, `list`), use
  `@Transactional(readOnly = true)`. This provides a performance optimization hint to the persistence provider.
- **Default Propagation**: The default propagation level (`REQUIRED`) is sufficient for most use cases. A new
  transaction will be started if one doesn't already exist.

  ```java
  // In a Service
  @Service
  public class PostService {

      @Transactional
      public PostResponse createPost(CreatePostRequest request, UUID userId) {
          // ... logic involving multiple repository saves
      }

      @Transactional(readOnly = true)
      public PostDetailResponse getPostById(Long postId) {
          // ... logic to find and return a post
      }
  }
  ```

## 13. Testing

- **Frameworks**: Use JUnit 5 and Mockito for testing.
- **Unit Tests**: Should test a single class in isolation. Use `@Mock` to mock dependencies. Test file location should
  mirror the source file location (e.g., `src/test/java/com/otaku/community/feature/post/service/PostServiceTest.java`).
- **Integration Tests**: Can be created using `@SpringBootTest` to test the interaction between multiple layers.
- **Test Naming**: Use a descriptive naming convention, such as `should<DoSomething>_when<Condition>`.
  ```java
  @Test
  void shouldReturnPost_whenPostExists() {
      // test logic
  }
  ```

## 14. Database

- **Migrations**: The project uses `spring.jpa.hibernate.ddl-auto=update` for development. **This is not suitable for
  production.** For production environments, a dedicated database migration tool like Flyway or Liquibase should be
  integrated.
- **Table Naming**: JPA will automatically generate table names from entity classes in `snake_case`. (e.g., `User`
  entity becomes `user` table).
- **Column Naming**: JPA will automatically generate column names from entity fields in `snake_case`. (e.g., `userName`
  field becomes `user_name` column).

## 15. Git and Version Control

- **Branching**:
    - `main`: Represents the production-ready code.
    - `develop`: Integration branch for features.
    - Feature Branches: `feature/<feature-name>` (e.g., `feature/user-profile`).
    - Bugfix Branches: `bugfix/<issue-description>` (e.g., `bugfix/fix-login-error`).
- **Commit Messages**: Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.
    - Example: `feat(post): add endpoint to fetch comments for a post`
    - Example: `fix(user): correct password validation logic`
    - Example: `docs(readme): update setup instructions`
