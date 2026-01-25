#!/usr/bin/env bun
/**
 * Deploy script that pushes to GitHub AND deploys to Fly.io in parallel.
 *
 * GitHub push ensures code is backed up and visible.
 * Local Fly deploy is faster than waiting for GitHub Actions.
 *
 * Usage: bun run deploy
 */

const startTime = Date.now();

console.log("\n🚀 Starting parallel deploy...\n");

// Run git push and fly deploy in parallel
const [gitResult, flyResult] = await Promise.allSettled([
  // Push to GitHub
  (async () => {
    console.log("📤 Pushing to GitHub...");
    const proc = Bun.spawn(["git", "push"], {
      stdout: "pipe",
      stderr: "pipe",
    });
    const exitCode = await proc.exited;
    const stdout = await new Response(proc.stdout).text();
    const stderr = await new Response(proc.stderr).text();

    if (exitCode !== 0) {
      throw new Error(stderr || stdout);
    }
    return { stdout, stderr };
  })(),

  // Deploy to Fly.io locally
  (async () => {
    console.log("🪰 Deploying to Fly.io (local build)...\n");
    const proc = Bun.spawn(["flyctl", "deploy", "--local-only"], {
      stdout: "inherit",
      stderr: "inherit",
    });
    const exitCode = await proc.exited;

    if (exitCode !== 0) {
      throw new Error(`Fly deploy failed with exit code ${exitCode}`);
    }
    return { success: true };
  })(),
]);

console.log("\n" + "─".repeat(50) + "\n");

// Report results
const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

if (gitResult.status === "fulfilled") {
  console.log("✅ GitHub push: Success");
} else {
  console.log("❌ GitHub push: Failed");
  console.log(`   ${gitResult.reason}`);
}

if (flyResult.status === "fulfilled") {
  console.log("✅ Fly deploy: Success");
} else {
  console.log("❌ Fly deploy: Failed");
  console.log(`   ${flyResult.reason}`);
}

console.log(`\n⏱️  Total time: ${elapsed}s\n`);

// Exit with error if either failed
if (gitResult.status === "rejected" || flyResult.status === "rejected") {
  process.exit(1);
}
