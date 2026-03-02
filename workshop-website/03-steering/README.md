# Steering - Guide AI dengan Context

## Apa itu Steering?

Steering adalah cara untuk include additional context dan instructions dalam interactions dengan Kiro. Ini seperti "rules" atau "guidelines" yang selalu diingat AI saat membantu Anda.

## Lokasi

Steering files disimpan di `.kiro/steering/*.md`

## Inclusion Types

### Always Included (Default)
File akan selalu included dalam setiap interaction
```markdown
---
# No front-matter needed, default behavior
---

# Your steering content
```

### Conditional (File Match)
Include hanya saat file tertentu dibuka
```markdown
---
inclusion: fileMatch
fileMatchPattern: 'README*'
---

# This will only be included when README files are in context
```

### Manual
Include hanya saat user explicitly reference dengan `#`
```markdown
---
inclusion: manual
---

# This requires manual activation
```

## Use Cases untuk Vibe Coding

1. **Team Standards** - Coding conventions, naming patterns
2. **Project Context** - Architecture decisions, tech stack info
3. **Workflow Instructions** - How to build, test, deploy
4. **API References** - Link to OpenAPI specs dengan `#[[file:api-spec.yaml]]`
5. **Best Practices** - Security guidelines, performance tips

## File References

Steering files bisa reference file lain:
```markdown
Refer to our API spec: #[[file:openapi.yaml]]
Follow patterns in: #[[file:../examples/user-service.js]]
```

## Best Practices

- Keep steering files focused dan specific
- Use conditional inclusion untuk context-specific rules
- Update steering saat standards berubah
- Don't overload dengan terlalu banyak rules
