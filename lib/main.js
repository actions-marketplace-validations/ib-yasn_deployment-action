"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const githubClient_1 = __importDefault(require("./githubClient"));
const deactivateDeployments_1 = __importDefault(require("./deactivateDeployments"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const context = github.context;
            const logUrl = `https://github.com/${context.repo.owner}/${context.repo.repo}/commit/${context.sha}/checks`;
            const ref = core.getInput("ref", { required: false }) || context.payload.pull_request.head.ref;
            const url = core.getInput("target_url", { required: false }) || logUrl;
            const environment = core.getInput("environment", { required: false }) || "production";
            const description = core.getInput("description", { required: false });
            const initialStatus = core.getInput("initial_status", {
                required: false
            }) || "pending";
            const autoMergeStringInput = core.getInput("auto_merge", {
                required: false
            });
            const auto_merge = autoMergeStringInput === "true";
            yield deactivateDeployments_1.default(context.repo, environment);
            const deployment = yield githubClient_1.default.repos.createDeployment(Object.assign(Object.assign({}, context.repo), { ref: ref, required_contexts: [], environment, transient_environment: true, auto_merge,
                description }));
            if (isSuccessResponse(deployment.data)) {
                yield githubClient_1.default.repos.createDeploymentStatus(Object.assign(Object.assign({}, context.repo), { deployment_id: deployment.data.id, state: initialStatus, log_url: logUrl, environment_url: url }));
                core.setOutput("deployment_id", deployment.data.id.toString());
            }
        }
        catch (error) {
            core.error(error);
            core.setFailed(error.message);
        }
    });
}
run();
function isSuccessResponse(object) {
    return "id" in object;
}
