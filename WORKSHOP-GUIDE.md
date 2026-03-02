# Workshop Guide: Optimizing Solana Development dengan Kiro

## Workshop Overview

**Duration**: 3-4 hours
**Level**: Intermediate to Advanced
**Prerequisites**: 
- Basic Solana knowledge
- JavaScript/TypeScript experience
- Familiarity with React

## Workshop Structure

### Part 1: Introduction (30 min)

#### 1.1 What is Kiro? (10 min)
- AI-powered IDE features
- Automation capabilities
- Integration with Solana development

#### 1.2 Kiro Features Overview (20 min)
- **Skills**: On-demand expertise
- **Specs**: Structured development
- **Hooks**: Automation
- **Steering**: Best practices
- **MCP**: External integrations

### Part 2: Skills - Solana Expertise (45 min)

#### 2.1 Understanding Skills (15 min)
- How skills work
- Available Solana skills
- Automatic vs manual activation

**Exercise**: Activate solana-dev skill
```
"Activate solana-dev skill and show me wallet connection patterns"
```

#### 2.2 Hands-on: Using Skills (30 min)

**Exercise 1**: Build transaction with solana-kit
```
"Show me how to build a SOL transfer transaction using @solana/kit"
```

**Exercise 2**: Setup Helius RPC
```
"Configure Helius RPC for my dApp with priority fees"
```

**Exercise 3**: Create AI agent
```
"Create an AI agent that can check token balances"
```

### Part 3: Specs - Structured Development (45 min)

#### 3.1 Introduction to Specs (15 min)
- What are specs?
- When to use specs
- Spec structure

**Demo**: Review `example-swap-dapp-spec.md`

#### 3.2 Hands-on: Create Your First Spec (30 min)

**Exercise**: Create a simple token transfer dApp spec

```markdown
# Spec: Token Transfer dApp

## Requirements
- User can connect wallet
- User can transfer SPL tokens
- Show transaction status

## Design
- Next.js frontend
- @solana/kit for transactions
- Helius RPC

## Tasks
### Task 1: Wallet Connection
- [ ] Setup wallet provider
- [ ] Create connect button
- [ ] Handle connection states

### Task 2: Transfer Interface
- [ ] Token selection
- [ ] Amount input
- [ ] Recipient address input

### Task 3: Transaction Execution
- [ ] Build transaction
- [ ] Sign and send
- [ ] Show confirmation
```

### Part 4: Hooks - Automation (45 min)

#### 4.1 Understanding Hooks (15 min)
- Event types
- Action types
- Use cases for Solana

**Demo**: Show existing hooks

#### 4.2 Hands-on: Create Hooks (30 min)

**Exercise 1**: Auto-test hook
```json
{
  "name": "Test on Save",
  "version": "1.0.0",
  "when": {
    "type": "fileEdited",
    "patterns": ["src/**/*.ts"]
  },
  "then": {
    "type": "runCommand",
    "command": "npm test"
  }
}
```

**Exercise 2**: Security review hook
```json
{
  "name": "Security Review",
  "version": "1.0.0",
  "when": {
    "type": "preToolUse",
    "toolTypes": ["write"]
  },
  "then": {
    "type": "askAgent",
    "prompt": "Review for security issues"
  }
}
```

### Part 5: Steering - Best Practices (30 min)

#### 5.1 Understanding Steering (10 min)
- Always included vs conditional
- File references
- Use cases

#### 5.2 Hands-on: Create Steering (20 min)

**Exercise**: Create custom steering for your project

```markdown
# My Project Standards

## Transaction Building
- Always use @solana/kit pipe
- Set compute budget
- Use priority fees from Helius

## Error Handling
- Simulate before sending
- Handle all error cases
- Show user-friendly messages

## Testing
- Test on devnet first
- Verify all transactions
- Check compute units
```

### Part 6: Complete Workflow (45 min)

#### 6.1 Putting It All Together (15 min)
- How features work together
- Example workflows
- Best practices

#### 6.2 Hands-on: Build a Mini dApp (30 min)

**Project**: Token Balance Checker

1. Create spec
2. Activate skills (solana-kit, helius)
3. Setup hooks (lint, test)
4. Add steering (security)
5. Build incrementally
6. Test and deploy

### Part 7: Advanced Topics (30 min)

#### 7.1 MCP Integration (15 min)
- What is MCP?
- Use cases
- Example configurations

#### 7.2 Modern Design-to-Code Workflow (15 min)
- The paradigm shift (handoff is dead)
- Generate → Experience → Critique → Regenerate
- Design as jazz (improvisation within constraints)
- Branching, not perfecting
- Live demo: Iterate on UI in real-time

## Workshop Exercises

### Exercise 1: Quick Setup (15 min)
Follow `06-complete-setup/solana-quick-start.md`

### Exercise 2: Activate Skills (10 min)
Practice activating different skills with various prompts

### Exercise 3: Create Spec (20 min)
Create a spec for a feature you want to build

### Exercise 4: Setup Hooks (15 min)
Create 3 hooks for your workflow

### Exercise 5: Add Steering (10 min)
Create steering file with your team's standards

### Exercise 6: Build Mini Project (45 min)
Build a simple dApp using all features

## Post-Workshop

### Next Steps
1. Complete full setup on your machine
2. Build a real project with specs
3. Customize hooks for your workflow
4. Share your experience

### Resources
- Workshop materials: This repository
- Solana docs: https://docs.solana.com
- Helius docs: https://docs.helius.dev
- @solana/kit: https://solanakit.com

### Community
- Share your specs and hooks
- Contribute improvements
- Help others learn

## Troubleshooting

### Common Issues

**Skills not activating**
- Use specific keywords
- Try manual activation
- Check skill availability

**Hooks not working**
- Verify JSON syntax
- Check file patterns
- Test command manually

**Specs too complex**
- Start simple
- Break into smaller tasks
- Iterate and improve

## Feedback

Please provide feedback on:
- Workshop pace
- Content clarity
- Exercise difficulty
- Missing topics
- Suggestions for improvement

---

**Instructor Notes**:
- Adjust timing based on audience
- Provide more examples if needed
- Encourage questions throughout
- Share real-world experiences
