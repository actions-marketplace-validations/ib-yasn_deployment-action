import * as core from "@actions/core";
import * as github from "@actions/github";
import { ReposCreateDeploymentResponseData } from "@octokit/types";
import githubClient from './githubClient';
import deactivateDeployments from "./deactivateDeployments";

type DeploymentState =
  | "error"
  | "failure"
  | "inactive"
  | "in_progress"
  | "queued"
  | "pending"
  | "success";

async function run() {
  try {
    const context = github.context;
    const logUrl = `https://github.com/${context.repo.owner}/${context.repo.repo}/commit/${context.sha}/checks`;

    const ref = core.getInput("ref", { required: false }) || context.payload.pull_request!.head.ref;
    const url = core.getInput("target_url", { required: false }) || logUrl;
    const environment =
      core.getInput("environment", { required: false }) || "production";
    const description = core.getInput("description", { required: false });
    const initialStatus =
      (core.getInput("initial_status", {
        required: false
      }) as DeploymentState) || "pending";
    const autoMergeStringInput = core.getInput("auto_merge", {
      required: false
    });

    const auto_merge: boolean = autoMergeStringInput === "true";

    await deactivateDeployments(context.repo, environment);

    const deployment = await githubClient.repos.createDeployment({
      ...context.repo,
      ref: ref,
      required_contexts: [],
      environment,
      transient_environment: true,
      auto_merge,
      description
    });
    if (isSuccessResponse(deployment.data)) {
      await githubClient.repos.createDeploymentStatus({
        ...context.repo,
        deployment_id: deployment.data.id,
        state: initialStatus,
        log_url: logUrl,
        environment_url: url
      });
  
      core.setOutput("deployment_id", deployment.data.id.toString());
    }
    
  } catch (error) {
    core.error(error);
    core.setFailed(error.message);
  }
}

run();

function isSuccessResponse(
  object: any
): object is ReposCreateDeploymentResponseData {
  return "id" in object;
}