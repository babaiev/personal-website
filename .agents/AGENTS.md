# Quality Assurance Rules

## Deployment Checklist
With every feature or change we release, the agent MUST explicitly perform the following steps before concluding the task:
1. **Version Bump**: Update the `VERSION` file in the root directory.
2. **Mandatory Test Writing**: Before deploying, you MUST write unit tests for any new features or changes you made. Do not deploy untested code.
3. **Run Tests & Verify Coverage**: Run all backend and frontend tests. Ensure code coverage is maintained or increased. If a test fails, STOP and fix it before trying to deploy again.

# Versioning Rules
- The project version follows the format `x.y.a.bb`.
- `bb`: Used for fixes, typos, and small styling changes.
- `a`: Used for medium-sized features (e.g., 'adding likes', 'sorting fixes').
- `y`: Used for all other big features.
- `x`: Used for huge site changes like full redesigns.
- The current version is stored in the `VERSION` file at the root of the workspace. Always bump this file according to these rules when making changes.
