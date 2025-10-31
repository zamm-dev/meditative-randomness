import eslint from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import svelte from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import prettier from 'eslint-config-prettier';

export default [
	{
		ignores: [
			'build/',
			'.svelte-kit/',
			'dist/',
			'node_modules/',
			'playwright-report/',
			'test-results/'
		]
	},
	eslint.configs.recommended,
	{
		files: ['**/*.{ts,js}'],
		languageOptions: {
			parser: typescriptParser,
			parserOptions: {
				ecmaVersion: 2020,
				sourceType: 'module'
			},
			globals: {
				console: 'readonly',
				process: 'readonly',
				navigator: 'readonly',
				WakeLockSentinel: 'readonly',
				EventTarget: 'readonly',
				Audio: 'readonly',
				HTMLAudioElement: 'readonly'
			}
		},
		plugins: {
			'@typescript-eslint': typescript
		},
		rules: {
			...typescript.configs.recommended.rules
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: typescriptParser
			},
			globals: {
				HTMLElement: 'readonly',
				HTMLInputElement: 'readonly',
				HTMLAudioElement: 'readonly',
				Event: 'readonly',
				Audio: 'readonly',
				AudioContext: 'readonly',
				setTimeout: 'readonly',
				setInterval: 'readonly',
				clearInterval: 'readonly',
				requestAnimationFrame: 'readonly',
				console: 'readonly',
				Math: 'readonly',
				Date: 'readonly'
			}
		},
		plugins: {
			svelte
		},
		rules: {
			...svelte.configs.recommended.rules
		}
	},
	prettier
];
