---
inclusion: fileMatch
fileMatchPattern: '**/api/**/*.js'
---

# API Development Guidelines

This steering is automatically included when working on API files.

## REST Conventions

### HTTP Methods
- GET: Retrieve data (idempotent)
- POST: Create new resource
- PUT: Update entire resource
- PATCH: Partial update
- DELETE: Remove resource

### Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

### Response Format
```javascript
// Success
{
  "success": true,
  "data": { ... }
}

// Error
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

## Security
- Always validate input
- Use rate limiting
- Sanitize user data
- Use HTTPS only
- Implement proper authentication

## Performance
- Use pagination untuk large datasets
- Cache when appropriate
- Optimize database queries
- Use compression
