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

Edit the text, project guidance and the CSS variables `--asl-ink` and `--asl-accent` inside the fragment. Preserve field names, class names and script selectors. When changing the fragment, update the embedded section in `demo.html` too. No Assure phone number is hardcoded: clients paste the summary into their existing WhatsApp conversation. No automatic sending or external destination is configured.

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

## Validation for this change

Dependency-free logic checks passed locally. The Playwright suite is included but could not run in the preparation environment: Chromium was absent and its download returned a truncated archive. Responsive CSS and markup were reviewed; visual layout and native browser validation remain to be verified using the supplied suite and Elementor staging checklist. No WordPress page was changed.
