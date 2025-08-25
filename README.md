# prettygit

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/hiacbakfjladopdjbdlbbncidjnngjlb.svg)](https://chromewebstore.google.com/detail/prettygit/hiacbakfjladopdjbdlbbncidjnngjlb)
![Chrome Web Store Stars](https://img.shields.io/chrome-web-store/stars/hiacbakfjladopdjbdlbbncidjnngjlb)
![Chrome Web Store Users](https://img.shields.io/chrome-web-store/users/hiacbakfjladopdjbdlbbncidjnngjlb)
![Chrome Web Store Last Updated](https://img.shields.io/chrome-web-store/last-updated/hiacbakfjladopdjbdlbbncidjnngjlb)

Transform GitHub pull requests and issues into professional, formatted snippets for easy sharing in Slack, Teams, or documentation. While providing tools for better experience on GitHub.

![Screenshot](./extension/screenshot-2.png)

## Generating a New Version

To generate a new version of the plugin, follow these steps:

1. Make sure all your changes are committed to git
2. Run one of the following commands depending on the type of version bump you need:
   ```bash
   npm version patch # for bug fixes (1.1.3 -> 1.1.4)
   npm version minor # for new features (1.1.3 -> 1.2.0)
   npm version major # for breaking changes (1.1.3 -> 2.0.0)
   ```

This will automatically:

- Update the version in `package.json`
- Update the version in `manifest.json`
- Build the project
- Generate a new zip file in the `extension/` directory
- Stage all changes in git

After running the version command, you can:

1. Push the changes: `git push && git push --tags`
2. Upload the new zip file from the `extension/` directory to the Chrome Web Store

### Manual Build Process

If you need to build without versioning:

```bash
npm run build        # Build the project
npm run build:watch  # Build and watch for changes
npm run compress     # Generate the extension zip file
```
