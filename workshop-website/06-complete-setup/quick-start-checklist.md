# Quick Start Checklist

## Minimal Setup (5 menit)

### 1. Create Directory Structure
```bash
mkdir -p .kiro/{steering,hooks,skills,specs,settings}
```

### 2. Add One Steering File
Create `.kiro/steering/standards.md`:
```markdown
# Project Standards

- Use TypeScript
- Follow ESLint rules
- Write tests untuk business logic
- Commit format: type(scope): message
```

### 3. Add One Hook
Create `.kiro/hooks/lint-on-save.json`:
```json
{
  "name": "Lint on Save",
  "version": "1.0.0",
  "when": {
    "type": "fileEdited",
    "patterns": ["*.ts", "*.js"]
  },
  "then": {
    "type": "runCommand",
    "command": "npm run lint"
  }
}
```

### 4. Test Setup
- Edit a .ts file
- Save it
- Hook should trigger lint
- Steering should guide AI responses

## Next Steps

- [ ] Add more hooks untuk automation
- [ ] Create spec untuk next feature
- [ ] Setup MCP untuk database access
- [ ] Add skills untuk your tech stack

## Expand Gradually

Don't setup everything at once. Add features as you need them:
- Week 1: Steering + basic hooks
- Week 2: Add specs untuk complex features
- Week 3: Setup MCP untuk integrations
- Week 4: Create custom skills

## Success Metrics

You'll know it's working when:
- Code automatically lints on save
- AI follows your standards consistently
- Complex features developed incrementally
- Less context switching
- More time in flow state
