export default {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  overrides: [
    {
      files: [
        "*.ts"
      ],
      extends: [
        "plugin:@typescript-eslint/disable-type-checked"
      ]
    }
  ],
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint"
  ],
  rules: {
    "max-len": ["error", { "code": 80 }]
  },
  ignores: ["*.js"],
  root: true,
}
