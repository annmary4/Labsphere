/**
 * LabSphere GitHub Direct Auto-Sync Service
 * Enables parallel, real-time synchronization of component additions, edits, and quantity updates
 * directly to the GitHub repository (annmary4/Labsphere) via the official GitHub REST API.
 */

class GitHubSyncService {
  constructor() {
    this.owner = "annmary4";
    this.repo = "Labsphere";
    this.branch = "main";
    this.tokenKey = "labsphere_github_token";
    this.autoSyncKey = "labsphere_github_autosync";
    this.lastSyncKey = "labsphere_github_last_sync";
    this.debounceTimer = null;
    this.debounceDelayMs = 2500; // 2.5s debounce
    this.isSyncing = false;
    this.pendingSyncReason = null;
  }

  getToken() {
    return (localStorage.getItem(this.tokenKey) || "").trim();
  }

  setToken(token) {
    if (token) {
      localStorage.setItem(this.tokenKey, token.trim());
    } else {
      localStorage.removeItem(this.tokenKey);
    }
    this.updateStatusBadge();
  }

  isAutoSyncEnabled() {
    const val = localStorage.getItem(this.autoSyncKey);
    return val === null ? true : val === "true"; // Enabled by default if token is present
  }

  setAutoSyncEnabled(enabled) {
    localStorage.setItem(this.autoSyncKey, enabled ? "true" : "false");
    this.updateStatusBadge();
  }

  getLastSyncInfo() {
    try {
      return JSON.parse(localStorage.getItem(this.lastSyncKey)) || null;
    } catch (e) {
      return null;
    }
  }

  setLastSyncInfo(info) {
    localStorage.setItem(this.lastSyncKey, JSON.stringify(info));
  }

  updateStatusBadge(status, text) {
    const badge = document.getElementById("git-sync-badge");
    const textEl = document.getElementById("git-sync-text");
    const dotEl = document.getElementById("git-sync-dot");
    if (!badge || !textEl || !dotEl) return;

    const token = this.getToken();

    if (status === "syncing") {
      dotEl.textContent = "🟡";
      textEl.textContent = text || "Syncing...";
      badge.className = "git-sync-badge syncing";
      badge.title = "Pushing live changes to GitHub repository...";
    } else if (status === "success") {
      dotEl.textContent = "🟢";
      textEl.textContent = text || "Git: Synced";
      badge.className = "git-sync-badge synced";
      const last = this.getLastSyncInfo();
      badge.title = last ? `Synced at ${last.timestamp} (${last.commitSha ? last.commitSha.substring(0, 7) : ''})` : "Synced with GitHub repository";
    } else if (status === "error") {
      dotEl.textContent = "⚠️";
      textEl.textContent = text || "Sync Error";
      badge.className = "git-sync-badge error";
      badge.title = text || "GitHub Sync encountered an error. Click to inspect.";
    } else {
      if (!token) {
        dotEl.textContent = "⚙️";
        textEl.textContent = "Setup Git Sync";
        badge.className = "git-sync-badge setup";
        badge.title = "Click to configure GitHub Token for parallel auto-sync";
      } else {
        dotEl.textContent = "🟢";
        textEl.textContent = "Git: Connected";
        badge.className = "git-sync-badge synced";
        badge.title = "Connected to GitHub repository";
      }
    }
  }

  queueSync(reason = "Inventory update") {
    if (!this.isAutoSyncEnabled()) return;
    const token = this.getToken();
    if (!token) {
      this.updateStatusBadge("setup", "Setup Git Sync");
      return;
    }

    this.pendingSyncReason = reason;
    this.updateStatusBadge("syncing", "Queued...");

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.executeSync(this.pendingSyncReason || "Manual site edit");
    }, this.debounceDelayMs);
  }

  async testConnection(token) {
    const t = token || this.getToken();
    if (!t) return { ok: false, message: "No token provided." };

    try {
      const res = await fetch(`https://api.github.com/repos/${this.owner}/${this.repo}`, {
        headers: {
          "Authorization": `Bearer ${t}`,
          "Accept": "application/vnd.github.v3+json"
        }
      });

      if (res.ok) {
        const repo = await res.json();
        return { ok: true, repoName: repo.full_name, defaultBranch: repo.default_branch };
      } else {
        const err = await res.json().catch(() => ({}));
        return { ok: false, message: err.message || `HTTP ${res.status}: Unauthorized or repository not found.` };
      }
    } catch (e) {
      return { ok: false, message: e.message || "Network error reaching GitHub API." };
    }
  }

  async executeSync(commitMessage = "Live Site Update: Inventory details synchronized") {
    const token = this.getToken();
    if (!token) {
      console.warn("GitHub Auto-Sync skipped: No Personal Access Token configured.");
      this.updateStatusBadge("setup", "Setup Git Sync");
      return { ok: false, message: "No GitHub token configured." };
    }

    if (this.isSyncing) {
      console.log("GitHub Sync already in progress, will retry shortly.");
      return { ok: false, message: "Sync in progress" };
    }

    this.isSyncing = true;
    this.updateStatusBadge("syncing", "Syncing to Git...");

    try {
      // 1. Gather live master data from StorageService
      const components = StorageService.getComponents();
      const boxes = StorageService.getBoxes();
      const racks = StorageService.getRacks();
      const projects = StorageService.getProjects();
      const requests = StorageService.getRequests();
      const transactions = StorageService.getTransactions();

      const masterDbObj = {
        components,
        boxes,
        racks,
        projects,
        requests,
        transactions
      };

      const dbJsonContent = JSON.stringify(masterDbObj, null, 2);

      const initialDataJsContent = `// LabSphere Initial Seed Data - Master Hardware Catalog & Transaction Ledger
// Synchronized with central db.json

const INITIAL_COMPONENTS = ${JSON.stringify(components, null, 2)};

const INITIAL_BOXES = ${JSON.stringify(boxes, null, 2)};

const INITIAL_RACKS = ${JSON.stringify(racks, null, 2)};

const INITIAL_PROJECTS = ${JSON.stringify(projects, null, 2)};

const INITIAL_REQUESTS = ${JSON.stringify(requests, null, 2)};

const INITIAL_TRANSACTIONS = ${JSON.stringify(transactions, null, 2)};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    INITIAL_COMPONENTS,
    INITIAL_BOXES,
    INITIAL_RACKS,
    INITIAL_PROJECTS,
    INITIAL_REQUESTS,
    INITIAL_TRANSACTIONS
  };
}
`;

      const headers = {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/vnd.github.v3+json",
        "Content-Type": "application/json"
      };

      // 2. Get latest commit SHA on main
      const refRes = await fetch(`https://api.github.com/repos/${this.owner}/${this.repo}/git/refs/heads/${this.branch}`, { headers });
      if (!refRes.ok) {
        throw new Error(`Failed to fetch branch reference: HTTP ${refRes.status}`);
      }
      const refData = await refRes.json();
      const latestCommitSha = refData.object.sha;

      // 3. Get base tree SHA from latest commit
      const commitRes = await fetch(`https://api.github.com/repos/${this.owner}/${this.repo}/git/commits/${latestCommitSha}`, { headers });
      if (!commitRes.ok) {
        throw new Error(`Failed to fetch commit object: HTTP ${commitRes.status}`);
      }
      const commitData = await commitRes.json();
      const baseTreeSha = commitData.tree.sha;

      // 4. Create new Git Tree with both data/db.json and js/initialData.js
      const treeRes = await fetch(`https://api.github.com/repos/${this.owner}/${this.repo}/git/trees`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          base_tree: baseTreeSha,
          tree: [
            {
              path: "data/db.json",
              mode: "100644",
              type: "blob",
              content: dbJsonContent
            },
            {
              path: "js/initialData.js",
              mode: "100644",
              type: "blob",
              content: initialDataJsContent
            }
          ]
        })
      });

      if (!treeRes.ok) {
        throw new Error(`Failed to create Git tree: HTTP ${treeRes.status}`);
      }
      const treeData = await treeRes.json();
      const newTreeSha = treeData.sha;

      // 5. Create new Git Commit
      const newCommitRes = await fetch(`https://api.github.com/repos/${this.owner}/${this.repo}/git/commits`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          message: commitMessage,
          tree: newTreeSha,
          parents: [latestCommitSha]
        })
      });

      if (!newCommitRes.ok) {
        throw new Error(`Failed to create Git commit: HTTP ${newCommitRes.status}`);
      }
      const newCommitData = await newCommitRes.json();
      const newCommitSha = newCommitData.sha;

      // 6. Update reference refs/heads/main
      const updateRefRes = await fetch(`https://api.github.com/repos/${this.owner}/${this.repo}/git/refs/heads/${this.branch}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          sha: newCommitSha,
          force: false
        })
      });

      if (!updateRefRes.ok) {
        throw new Error(`Failed to update branch head: HTTP ${updateRefRes.status}`);
      }

      const syncResult = {
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        commitSha: newCommitSha,
        commitMessage
      };

      this.setLastSyncInfo(syncResult);
      this.updateStatusBadge("success", "Git: Synced");
      console.log(`✅ Parallel GitHub Auto-Sync succeeded! Commit ${newCommitSha.substring(0, 7)}: "${commitMessage}"`);

      return { ok: true, commitSha: newCommitSha };
    } catch (err) {
      console.error("❌ GitHub Auto-Sync failed:", err);
      this.updateStatusBadge("error", "Sync Error");
      return { ok: false, message: err.message || "Sync failed" };
    } finally {
      this.isSyncing = false;
    }
  }
}

// Global Singleton
window.GitHubSync = new GitHubSyncService();

document.addEventListener("DOMContentLoaded", () => {
  window.GitHubSync.updateStatusBadge();
});
