# Coding Standards

## JavaScript/TypeScript

### Naming Conventions
- Files: kebab-case (`user-service.js`)
- Classes: PascalCase (`UserService`)
- Functions: camelCase (`getUserData`)
- Constants: UPPER_SNAKE_CASE (`API_KEY`)

### Code Style
- Use const/let, never var
- Prefer arrow functions untuk callbacks
- Use async/await over promises chains
- Destructure objects dan arrays
- Early returns untuk guard clauses

### Error Handling
```javascript
// Always handle errors explicitly
try {
  const data = await fetchData();
  return processData(data);
} catch (error) {
  logger.error('Failed to fetch data', error);
  throw new AppError('Data fetch failed', 500);
}
```

### Comments
- Comment "why", not "what"
- Use JSDoc untuk public functions
- Keep comments up-to-date

## Testing
- Write tests untuk business logic
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

## Git
- Commit messages: `type(scope): message`
- Small, focused commits
- Always pull before push
