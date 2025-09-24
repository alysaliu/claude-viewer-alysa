# Artifacts Documentation

This directory contains React component prototypes and examples that can be previewed using the Claude Artifact Runner.

## Available Artifacts

### agentic-drafting-m1.tsx
This is a highly simplified version of the agentic drafting UX that contains only the basic chat interactions and none of the advanced tabbing and asynchronous task management features.

### agentic-drafting-m2.tsx
This is a more complex version of the agentic drafting UX that contains the basic chat interactions and the advanced tabbing features, but not the asynchronous task management features.

### agentic-drafting-m3.tsx
This is the full-complexity version of the agentic drafting UX that contains the basic chat interactions and the advanced tabbing and asynchronous task management features.

## Adding New Artifacts

To add a new artifact:

1. Save your `.tsx` file to this directory
2. Refresh the artifact runner page
3. Update this README with a description

## File Requirements

Artifacts should be the as-is typescript (.tsx) files produced by Claude. You can modify them further (e.g. using Claude Code), but don't drastically modify their structure, as the artifact runner is designed to work with the original files.