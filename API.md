# API Documentation - Teşekkürvar

Base URL: `http://localhost:3000/api`

## Authentication

Protected endpoints require authentication via NextAuth session cookie. Include credentials in requests:

```javascript
fetch('/api/endpoint', {
  credentials: 'include'
})
```

## Error Responses

All endpoints return consistent error formats:

```json
{
  "error": "Error message",
  "details": [] // Optional, for validation errors
}
```

Status codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

---

## Companies

### GET /api/companies

Search and list companies with pagination.

**Query Parameters:**
- `q` (optional): Search term for name, slug, or category
- `page` (optional, default: 1): Page number
- `size` (optional, default: 20, max: 100): Items per page

**Example:**
```bash
GET /api/companies?q=migros&page=1&size=20
```

**Response:**
```json
{
  "companies": [
    {
      "id": "clxxx",
      "name": "Migros",
      "slug": "migros",
      "logoUrl": "https://...",
      "category": "Market",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "_count": {
        "thanks": 42
      }
    }
  ],
  "pagination": {
    "page": 1,
    "size": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### POST /api/companies

Create a new company. **Requires authentication.**

**Request Body:**
```json
{
  "name": "Migros",
  "category": "Market",
  "logoUrl": "https://..." // optional
}
```

**Response (201):**
```json
{
  "id": "clxxx",
  "name": "Migros",
  "slug": "migros",
  "logoUrl": "https://...",
  "category": "Market",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Error (409):** Company with same name already exists

---

## Thanks

### GET /api/thanks

List thanks posts with filters and cursor-based pagination.

**Query Parameters:**
- `mode` (optional, default: 'latest'): Sort mode
  - `latest`: Sort by creation date (newest first)
  - `popular`: Sort by like count (highest first)
- `companySlug` (optional): Filter by company slug
- `media` (optional): Filter by media type ('image' | 'video')
- `take` (optional, default: 20, max: 50): Items per page
- `cursor` (optional): Cursor for pagination (format: `createdAt_id`)

**Example:**
```bash
GET /api/thanks?mode=popular&companySlug=migros&take=20
```

**Response:**
```json
{
  "thanks": [
    {
      "id": "clxxx",
      "text": "Harika hizmet!",
      "mediaUrl": "https://...",
      "mediaType": "image",
      "likeCount": 42,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "user": {
        "id": "clxxx",
        "name": "Ahmet Yılmaz",
        "email": "ahmet@example.com",
        "image": "https://..."
      },
      "company": {
        "id": "clxxx",
        "name": "Migros",
        "slug": "migros",
        "logoUrl": "https://...",
        "category": "Market"
      },
      "_count": {
        "likes": 42,
        "comments": 5
      }
    }
  ],
  "pagination": {
    "nextCursor": "2024-01-01T00:00:00.000Z_clxxx",
    "hasNextPage": true
  }
}
```

### POST /api/thanks

Create a new thanks post. **Requires authentication.**

**Request Body:**
```json
{
  "companyId": "clxxx",
  "text": "Çok güzel hizmet aldım, teşekkürler!",
  "mediaUrl": "https://...", // optional
  "mediaType": "image" // optional, required if mediaUrl is provided
}
```

**Validation:**
- `text`: min 10 chars, max 1000 chars
- `mediaUrl` and `mediaType` must be provided together
- `mediaType`: 'image' or 'video'

**Response (201):**
```json
{
  "id": "clxxx",
  "text": "Çok güzel hizmet aldım, teşekkürler!",
  "mediaUrl": "https://...",
  "mediaType": "image",
  "likeCount": 0,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "user": { ... },
  "company": { ... }
}
```

---

## Likes

### POST /api/thanks/[id]/like

Toggle like on a thanks post. **Requires authentication.**

**Example:**
```bash
POST /api/thanks/clxxx/like
```

**Response:**
```json
{
  "liked": true,
  "likeCount": 43
}
```

If already liked, it will unlike:
```json
{
  "liked": false,
  "likeCount": 42
}
```

---

## Comments

### GET /api/thanks/[id]/comments

List comments for a thanks post.

**Query Parameters:**
- `page` (optional, default: 1): Page number
- `size` (optional, default: 20, max: 100): Items per page

**Example:**
```bash
GET /api/thanks/clxxx/comments?page=1&size=20
```

**Response:**
```json
{
  "comments": [
    {
      "id": "clxxx",
      "text": "Ben de çok memnun kaldım!",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "user": {
        "id": "clxxx",
        "name": "Ayşe Demir",
        "email": "ayse@example.com",
        "image": "https://..."
      }
    }
  ],
  "pagination": {
    "page": 1,
    "size": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

### POST /api/thanks/[id]/comments

Add a comment to a thanks post. **Requires authentication.**

**Request Body:**
```json
{
  "text": "Ben de çok memnun kaldım!"
}
```

**Validation:**
- `text`: min 1 char, max 500 chars

**Response (201):**
```json
{
  "id": "clxxx",
  "text": "Ben de çok memnun kaldım!",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "user": { ... }
}
```

---

## Top Rankings

### GET /api/top/companies

Get top 100 companies by thanks count in the last 30 days.

**Response:**
```json
{
  "companies": [
    {
      "id": "clxxx",
      "name": "Migros",
      "slug": "migros",
      "logoUrl": "https://...",
      "category": "Market",
      "thanksCount": 150,
      "totalLikeCount": 2500,
      "lastThanksDate": "2024-01-01T00:00:00.000Z"
    }
  ],
  "period": {
    "start": "2023-12-01T00:00:00.000Z",
    "end": "2024-01-01T00:00:00.000Z",
    "days": 30
  }
}
```

**Sorting:** Companies are sorted by `thanksCount` (descending)

### GET /api/top/users

Get top 100 users by total likes received in the last 30 days.

**Response:**
```json
{
  "users": [
    {
      "id": "clxxx",
      "name": "Ahmet Yılmaz",
      "email": "ahmet@example.com",
      "image": "https://...",
      "totalLikes": 500,
      "thanksCount": 25
    }
  ],
  "period": {
    "start": "2023-12-01T00:00:00.000Z",
    "end": "2024-01-01T00:00:00.000Z",
    "days": 30
  }
}
```

**Sorting:** Users are sorted by `totalLikes` (descending)

---

## Example Usage

### JavaScript/TypeScript

```typescript
// List popular thanks
const response = await fetch('/api/thanks?mode=popular&take=10', {
  credentials: 'include'
});
const data = await response.json();

// Create a thanks post
const response = await fetch('/api/thanks', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  body: JSON.stringify({
    companyId: 'clxxx',
    text: 'Harika bir deneyim!',
    mediaUrl: 'https://...',
    mediaType: 'image'
  })
});

// Toggle like
const response = await fetch('/api/thanks/clxxx/like', {
  method: 'POST',
  credentials: 'include'
});
const { liked, likeCount } = await response.json();

// Search companies
const response = await fetch('/api/companies?q=migros&page=1&size=20');
const { companies, pagination } = await response.json();
```

### cURL

```bash
# List companies
curl "http://localhost:3000/api/companies?q=migros"

# Create company (with auth)
curl -X POST "http://localhost:3000/api/companies" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"name":"Yeni Şirket","category":"Teknoloji"}'

# Get top companies
curl "http://localhost:3000/api/top/companies"

# Toggle like (with auth)
curl -X POST "http://localhost:3000/api/thanks/clxxx/like" \
  -b cookies.txt
```

---

## Pagination Strategies

### Offset-based (Companies, Comments)
- Use `page` and `size` parameters
- Good for: Small datasets, static content
- Pros: Simple, supports jumping to any page
- Cons: Performance degradation with large offsets

### Cursor-based (Thanks Feed)
- Use `cursor` and `take` parameters
- Good for: Real-time feeds, large datasets
- Pros: Consistent performance, efficient
- Cons: Can't jump to arbitrary page

**Cursor format:** `{createdAt}_{id}`

Example workflow:
```javascript
// First request
const page1 = await fetch('/api/thanks?take=20');
const { thanks, pagination } = await page1.json();

// Next page
if (pagination.hasNextPage) {
  const page2 = await fetch(`/api/thanks?take=20&cursor=${pagination.nextCursor}`);
}
```
