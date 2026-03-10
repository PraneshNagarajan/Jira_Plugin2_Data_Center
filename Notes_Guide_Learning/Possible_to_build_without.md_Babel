You have a small mix-up — it's not `.babelrc` that does the moving, it's **webpack + atlassian-webresource-webpack-plugin**. Let me clarify:

---

## Why `webpack.config.js`?

`react-scripts` uses its own **hidden webpack config** — you can't control:
- where the output goes
- what the filename is
- any Jira-specific settings

```
react-scripts build
      ↓
output → build/         ← fixed, can't change
         static/js/
         static/css/
```

With your own `webpack.config.js`:
```
webpack --mode production
      ↓
output → backend/src/main/resources/frontend/   ← you control this
         js/bundled.app.js
         css/app.css
         images/
```

---

## Why `atlassian-webresource-webpack-plugin`?

Without it — **manual work every build:**
```
1. run build
2. copy js/css/images to backend/resources/  ← manual
3. open atlassian-plugin.xml
4. add <web-resource> entries               ← manual
5. add <resource> for each file             ← manual
```

With it — **fully automatic:**
```
webpack build
      ↓
atlassian-webresource-webpack-plugin
      ↓
✅ copies js/css/images → backend/resources/frontend/
✅ auto-generates META-INF/plugin-descriptors/wr-defs.xml
✅ wr-defs.xml has all <web-resource> entries ready
```

---

## Why `.babelrc`?

`react-scripts` already includes babel — **but only for its own pipeline**.

When you switch to your own `webpack.config.js`, babel is no longer called automatically. You need `.babelrc` to tell webpack's `babel-loader` how to compile your `.tsx`/`.jsx`:

```
WITHOUT .babelrc                  WITH .babelrc
────────────────────              ────────────────────
webpack sees .tsx                 webpack sees .tsx
      ↓                                 ↓
babel-loader has no config        babel-loader reads .babelrc
      ↓                                 ↓
❌ doesn't know how to            ✅ compiles TSX → JS
   handle JSX/TS                  ✅ handles spread operator
                                  ✅ handles modern JS syntax
```

---

## Full picture

```
create-react-app
      ↓
installs babel automatically ✅
installs react-scripts ✅
      ↓
BUT react-scripts hidden webpack:
  ❌ output goes to build/  (wrong place for Jira)
  ❌ no wr-defs.xml
  ❌ no auto web-resource registration
      ↓
SO we replace react-scripts webpack with our own:

webpack.config.js
  ✅ output → backend/resources/frontend/
  ✅ atlassian-webresource-webpack-plugin → wr-defs.xml

.babelrc
  ✅ tells babel-loader how to compile TSX/JSX
  ✅ handles all modern JS/TS syntax

RESULT
  ✅ one command: npm run build
  ✅ js/css/images → correct backend folder
  ✅ wr-defs.xml auto-generated
  ✅ atlassian-plugin.xml picks it up automatically
```
