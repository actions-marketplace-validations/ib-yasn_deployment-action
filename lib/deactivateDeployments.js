"use strict";
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
const githubClient_1 = __importDefault(require("./githubClient"));
exports.default = (repo, environment) => __awaiter(void 0, void 0, void 0, function* () {
    const deployments = yield githubClient_1.default.repos.listDeployments({
        repo: repo.repo,
        owner: repo.owner,
        environment,
    });
    const existing = deployments.data.length;
    if (existing < 1) {
        console.log(`No exiting deployments found for pull request`);
        return;
    }
    for (const deployment of deployments.data) {
        console.log(`Deactivating existing deployment - ${deployment.id}`);
        yield githubClient_1.default.repos.createDeploymentStatus(Object.assign(Object.assign({}, repo), { deployment_id: deployment.id, state: 'inactive' }));
    }
});
