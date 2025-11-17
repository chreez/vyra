# Project Instructions

This workspace was created for AI-assisted development using Claude Code.

## Steering Rules

<!--
Add discovered steering rules here as you work with Claude.
When Claude discovers patterns, preferences, or constraints that should guide future work,
document them in this section.
-->

## Documentation Location

**Important**: All agentic documentation should be stored in the `docs/` folder.

- `docs/` - All AI-generated guides, specifications, and technical documentation
- Root `README.md` - High-level project overview (can be populated by Claude based on project scope)
- `CLAUDE.md` - This file - steering rules and project instructions for Claude Code

## Agent Skills

Claude Code supports [Agent Skills](https://docs.claude.com/en/docs/claude-code/skills) - modular capabilities that extend Claude's functionality.

**Personal Skills**: `~/.claude/skills/` - Available across all your projects
**Project Skills**: `.claude/skills/` - Shared with your team via git
**Plugin Skills**: Bundled with installed Claude Code plugins

Skills are model-invoked (Claude decides when to use them based on context) and can include:
- Custom workflows and automation
- Domain-specific expertise
- Project conventions and standards
- Utility scripts and templates

To view available skills, ask Claude: "What Skills are available?"

## Memory Management

This project follows Claude Code's memory hierarchy:

1. **Enterprise policy** - Organization-wide standards (if applicable)
2. **Project memory** - This CLAUDE.md file (shared with team)
3. **User memory** - `~/.claude/CLAUDE.md` (your personal preferences)
4. **Imports** - Use `@path/to/file` to import additional instructions

### Best Practices

- **Be specific**: Use concrete examples rather than vague instructions
- **Use structure**: Organize related rules under clear markdown headings
- **Keep it current**: Update this file as the project evolves
- **Add memories quickly**: Use `#` shortcut in Claude Code to add new steering rules

## Project Context

<!-- Add project-specific information here as it develops -->

