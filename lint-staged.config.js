export default {
  '*.{js,mjs,cjs,jsx,ts,tsx}': ['oxlint --fix', 'oxfmt'],
  '*.{css,scss,html,json,jsonc,md,yaml,yml}': ['oxfmt'],
}
