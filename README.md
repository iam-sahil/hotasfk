### Coomer.st API Summary – Endpoints Related to Creators, Posts, Attachments, and Random Selection

The Coomer.st API provides public read-only access to archived content from platforms like OnlyFans, Fansly, and Candfans. All endpoints are **GET** requests and return JSON data. Below is a structured overview of the documented endpoints focused on creators, profiles, posts, attachments, and random selection.

#### 1. Creators List

- **Endpoint**: `GET https://coomer.st/api/v1/creators`
- **Description**: Returns the full list of archived creators across all supported services.
- **Response Example** (array of objects):
  ```json
  [
    {
      "id": "anabel_joness",
      "name": "anabel_joness",
      "service": "onlyfans",
      "indexed": 1758303035,
      "updated": 1760922468,
      "favorited": 1
    },
    {
      "id": "1081761",
      "name": "Kaito",
      "service": "candfans",
      "indexed": 1715066205,
      "updated": 1715066331,
      "favorited": 13
    }
  ]
  ```

#### 2. Creator Profile

- **Endpoint**: `GET https://coomer.st/api/v1/{service}/user/{username}/profile`
  - `{service}`: e.g., `onlyfans`, `fansly`, `candfans`
  - `{username}`: creator's username or numeric ID
- **Description**: Retrieves basic profile information and statistics for a specific creator.
- **Response Example**:
  ```json
  {
    "id": "moodyfeet",
    "name": "moodyfeet",
    "service": "onlyfans",
    "indexed": "2022-12-02T16:38:02.521035",
    "updated": "2025-09-27T09:11:53.694994",
    "public_id": "8680823",
    "relation_id": null,
    "post_count": 2325,
    "dm_count": 0,
    "share_count": 0,
    "chat_count": 0
  }
  ```

#### 3. Creator Posts List

- **Endpoint**: `GET https://coomer.st/api/v1/{service}/user/{username}/posts?o={offset}&q={query}`
- **Description**: Returns a paginated list of the creator's posts.
- **Parameters**:
  - `o`: Offset for pagination (increments of 50).
  - `q`: Search query to filter posts by title or content.
- **Key Fields in Each Post**:
  - `id`, `title`, `substring` (truncated text), `published`
  - `file`: primary media (image/video) object with `name` and `path`
  - `attachments`: array of additional media files
- **Response**: Array of post objects.

#### 4. Single Post Details (Including Full Attachments)

- **Endpoint**: `GET https://coomer.st/api/v1/{service}/user/{username}/post/{post_id}`
- **Description**: Returns complete details for a specific post, including full content, all attachments, thumbnails/previews, and sometimes video metadata.
- **Response Structure**:
  - `post`: full post object (title, content, published date, file, attachments, next/prev post IDs)
  - `attachments`: processed attachment list
  - `previews`: thumbnail objects with server URLs
  - `videos`: array for video-specific info (if applicable)
  - `props`: additional metadata (revisions, flagged status)
- **Example Notes**:
  - Photo-heavy posts: primary `file` + many `attachments`
  - Video posts: media often in `attachments` or dedicated `videos` array

#### 5. Random Creator

- **Endpoint**: `GET https://coomer.st/api/v1/artists/random`
- **Description**: Returns a random archived creator.
- **Response Example**:
  ```json
  {
    "service": "onlyfans",
    "artist_id": "rennatababy"
  }
  ```
- **Usage**: Can be chained with the profile endpoint:
  `GET https://coomer.st/api/v1/onlyfans/user/rennatababy/profile`

#### 6. Global Recent Posts

- **Endpoint**: `GET https://coomer.st/api/v1/posts?o={offset}&q={query}`
- **Description**: Returns a list of recent posts across all creators and services.
- **Parameters**:
  - `o`: Offset for pagination (increments of 50).
  - `q`: Search query to filter posts globally.
- **Response**:
  - `count`, `true_count`: pagination/total stats
  - `posts`: array of post summaries (similar structure to creator posts list)

#### 7. Popular Posts

- **Endpoint**: `GET https://coomer.st/api/v1/posts/popular?period={period}`
- **Description**: Returns the most popular posts within a specific timeframe.
- **Parameters**:
  - `period`: Timeframe for popularity (e.g., `day`, `week`, `month`, `recent`).
- **Response**: Object containing an array of `posts`.

#### 8. Recommended Creators

- **Endpoint**: `GET https://coomer.st/api/v1/{service}/user/{username}/recommended`
- **Description**: Returns a list of creators similar to the specified creator.
- **Response**: Array of creator objects.

#### 9. Random Post

- **Endpoint**: `GET https://coomer.st/api/v1/posts/random`
- **Description**: Returns a single random post from the entire archive.
- **Response Example**:
  ```json
  {
    "service": "onlyfans",
    "artist_id": "stormyyyangel",
    "post_id": "1343225606"
  }
  ```

### Media Access Notes

- Files are hosted on coomer.st and kemono.cr servers.
- Paths are relative (e.g., `/c7/24/...mp4`).
- Full URLs can be constructed as: `https://[n1-n4].coomer.st/[path]` or `https://n1.kemono.cr/[path]`.
- Videos and images are directly downloadable via their `path`.
