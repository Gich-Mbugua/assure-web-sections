# Assure Solutions project-enquiry section

A dependency-free, responsive HTML/CSS/JavaScript section for WordPress and Elementor. It prepares a plain-text brief for the client to review and copy into WhatsApp. It does not submit an enquiry, contact Assure, open WhatsApp, call APIs, use cookies or browser storage, or upload files. Refreshing loses the entered details. Clipboard access occurs only after pressing Copy.

## Files

- `elementor.html`: complete paste-ready fragment with scoped styles and script.
- `demo.html`: standalone preview; open locally in a modern browser.
- `../tests/enquiry.cjs`: Playwright browser regression checks (development only).

## Elementor installation

1. Review and merge the pull request when ready. Merging alone does **not** install or publish anything on WordPress.
2. Use a staging site or an unpublished draft Elementor page first. Add a full-width container and an **HTML** widget (not a Text Editor widget).
3. Open `elementor.html` as text and copy its entire contents, including `<style>` and `<script>`, into that one widget. Do not paste the standalone `demo.html` document into Elementor.
4. Preview the page in a separate browser tab. Inline scripts may not execute reliably inside the Elementor editing canvas. Use a WordPress account allowed to retain script tags; sanitizers or security plugins can remove them. If scripts are stripped the Generate button stays disabled. Do not disable security protections globally; have the site administrator approve a narrowly scoped script-loading method instead.
5. Check desktop, tablet and mobile previews, keyboard navigation and the checks below against the site's actual theme. All styling uses the `.asl-enquiry` namespace; no global CSS or third-party fonts are added.
6. Publish only after separate website approval. This repository change does not alter the live Assure website.

For another page or multiple copies, reuse the whole fragment. Instances have independent forms and no fixed element IDs. To remove it, delete the widget. No database cleanup is needed.

## Customisation

Edit the text, project guidance and the CSS variables inside the fragment. `--asl-ink` is Assure blue (`#1c2541`); `--asl-accent` is gold (`#f8d79f`). Gold is used for decorative details and blue-on-gold hover states, not small text on white. `--asl-muted`, `--asl-border` and `--asl-surface` provide supporting neutral colours. Preserve field names, class names and script selectors. When changing the fragment, update the embedded section in `demo.html` too. No Assure phone number is hardcoded: clients paste the summary into their existing WhatsApp conversation. No automatic sending or external destination is configured.

Required: name, project name, phone, email and location. Project type defaults to exhibition booth. Width, depth/length and height are optional positive numbers with an explicit shared unit. Measurement status distinguishes estimated, confirmed and unmeasured sizes. Date and budget become required when their status indicates a known value; dates before the visitor's local today are rejected. Budget is in KSh with an explicit, initially unconfirmed VAT basis. Supply-only enquiries use the date for delivery. Materials, quantity, artwork, access and other project details can be entered in the two free-text fields.

The summary is regenerated after validation and hidden on edits to prevent copying an outdated brief. User text is assigned as textarea content, never interpreted as HTML. Automatic clipboard copy requires browser support/permission and a secure context (normally HTTPS); when blocked, the text is selected and manual copy instructions appear. A success message means copied, never sent.

## Verification

Open `demo.html` locally, or preview the widget in staging:

- Try an empty form, whitespace-only name, malformed email/phone and negative dimensions; generation should be blocked with browser validation feedback.
- Try all four types and check the guidance and summary labels.
- Leave unknown measurements/date/budget blank. The summary must retain TBC/estimated status instead of inventing specifications.
- Select a fixed date or available budget and leave the related value empty; verify it is required. Reject a past date.
- Enter a complete brief, generate, review, copy and paste into a private text editor. Test manual copy where clipboard permission is denied.
- Edit a field after generation; the previous summary must disappear. Clear the form and regenerate.
- Check at 320, 375, 768 and 1280 px widths with no horizontal scrolling, and use Tab/Shift+Tab to reach controls with visible focus.
- Disable JavaScript: the Generate button must remain disabled and the notice explain why.
- Add two widgets to a draft page and verify their fields and summaries stay independent.

Run the dependency-free script checks with `node tests/logic.cjs`. These exercise the actual embedded script in a minimal DOM harness; native input constraints, rendering and real clipboard permissions require a browser.

Browser checks need Node.js, Playwright and its Chromium browser on the development machine only:

```sh
npm install --no-save playwright
npx playwright install chromium
node tests/enquiry.cjs
```

Run from the repository root. Runtime users download no dependencies. These checks cover validation, type selection, summary values, HTML-safe user text, clipboard success/fallback, stale summaries, reset, responsive overflow, independent instances and disabled-JavaScript behaviour. Real WordPress/theme interaction still needs staging verification before website publication.

## Brand alignment — 1 November 2026

The existing [Assure homepage](https://assure.co.ke/) stylesheet was read without modifying WordPress. It explicitly defines `--assure-blue:#1c2541` under its “Assure brand blue” rule and `--ap-gold:#f8d79f` in the portfolio styling. These verified colours replace the earlier green palette in both HTML files.

The section uses a white surface, blue headings and buttons, gold dividers, rounded controls and restrained shadows. Typography inherits the host site's font; the standalone demo supplies a system-font fallback. Inputs use 16px text and at least 48px height. Blue focus outlines remain visible against white, with gold field halos. Hover effects apply only to hover-capable devices, and reduced-motion preferences disable transitions and movement. Mobile layouts use one column and full-width action buttons. CSS remains scoped to `.asl-enquiry`; no external fonts or runtime dependencies were introduced.

This is a presentation-only update on PR #1's existing branch. Form markup, validation and JavaScript are unchanged. The repository's open PRs, branches and PR discussion were checked before editing; no other proposed changes or outstanding review requests were present.

## Validation for this change

- `node tests/logic.cjs` passed: required text/phone logic, all four project types, conditional date/budget requirements, summary values, safe text, both copy paths, stale summary invalidation and reset.
- Both files' form markup and JavaScript were verified byte-for-byte against the prior commit, and the demo embeds the exact updated Elementor fragment.
- `git diff --check` passed. Text and control contrast were checked against the new palette.
- The Playwright suite could not run: Chromium is absent, and the browser download returned an invalid/truncated archive. Rendered layout, native validation, focus and multi-instance browser behaviour still need the supplied browser suite and Elementor staging checklist before publication.

No WordPress page was changed. PR #1 remains unmerged and nothing has been installed or deployed.
