# deployment-action

A GitHub action to create [Deployments](https://developer.github.com/v3/repos/deployments/) as part of your GitHub CI workflows.

## Action inputs

| name             | description                                                                                                                                                                                                                                                                                                                                                                                                   |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `initial_status` | (Optional) Initial status for the deployment. Must be one of the [accepted strings](https://developer.github.com/v3/repos/deployments/#create-a-deployment-status)                                                                                                                                                                                                                                                                                                                                                                                                  |
| `target_url`     | (Optional) The target URL. This should be the URL of the app once deployed                                                                                                                                                                                                                                                                                                                                    |
| `description`    | (Optional) A description to give the environment                                                                                                                                                                                                                                                                                                                                                              |
| `auto_merge`     | (Optional - default is `false`) Whether to attempt to auto-merge the default branch into the branch that the action is running on if set to `"true"`. More details in the [GitHub deployments API](https://developer.github.com/v3/repos/deployments/#parameters-1). Warning - setting this to `"true"` has caused this action to [fail in some cases](https://github.com/chrnorm/deployment-action/issues/1) |
| `ref`            | (Optional) The ref to deploy. This can be a branch, tag, or SHA. More details in the [GitHub deployments API](https://developer.github.com/v3/repos/deployments/#parameters-1). |

## Action outputs

| name            | description                                            |
| --------------- | ------------------------------------------------------ |
| `deployment_id` | The ID of the deployment as returned by the GitHub API |

## Required Enrivonment variables

| name            | description                                            |
| --------------- | ------------------------------------------------------ |
| `GITHUB_TOKEN` | GitHub token |
## Example usage

```yaml
name: Deploy

on: [push]

jobs:
  deploy:
    name: Deploy my app

    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v1

      - uses: ib-yasn/deployment-action@releases/v1
        name: Create GitHub deployment
        id: deployment
        with:
          target_url: http://my-app-url.com
          environment: staging
        env:
          GITHUB_TOKEN: "${{ github.token }}"
      - name: Deploy my app
        run: |
          # add your deployment code here
      - name: Update deployment status (success)
        if: success()
        uses: ib-yasn/deployment-status@releases/v1
        with:
          target_url: http://my-app-url.com
          state: "success"
          environment: staging
        env:
          GITHUB_TOKEN: "${{ github.token }}"
          
      - name: Update deployment status (failure)
        if: failure()
        uses: ib-yasn/deployment-status@releases/v1
        with:
          target_url: http://my-app-url.com
          state: "failure"
          environment: staging
        env:
          GITHUB_TOKEN: "${{ github.token }}"
```
