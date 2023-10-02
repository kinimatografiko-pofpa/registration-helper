import { defineConfig } from 'vite';
import * as child from 'child_process';

const commitHash = child.execSync('git rev-parse --short HEAD').toString();

export default defineConfig({
	define: {
		'import.meta.env.VITE_COMMIT_HASH': JSON.stringify(commitHash),
	},
	build: {
		sourcemap: true,
	},
});
