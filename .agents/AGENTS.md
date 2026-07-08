# Quality Assurance Rules

## Deployment Checklist
With every feature or change we release, the agent MUST explicitly perform the following steps before concluding the task:
1. **Version Bump**: Update the `VERSION` file in the root directory.
2. **Code Coverage**: Ensure all new modules and dependencies are covered by tests.
3. **Run Tests**: Check the code coverage and add tests if needed to maintain our standard.
