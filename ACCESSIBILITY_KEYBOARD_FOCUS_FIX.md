# Accessibility Keyboard Focus Fix Specification

## 1. Scope

This document records the fix for the delete confirmation modal keyboard-focus defect in the Advanced Finance Tracker project.

Branch: `KefanWu`

Affected files:

- `index.html`
- `main.js`
- `style.css`

## 2. Defect Summary

Before the fix, opening the delete confirmation modal did not move keyboard focus into the dialog and did not trap focus inside the dialog. Keyboard users could press `Tab` and move focus to background page controls such as `Light Mode`, `Export CSV`, and `Reset Filters` while the modal remained open.

Expected behavior:

- When the modal opens, focus moves into the dialog.
- `Tab` and `Shift + Tab` cycle only through modal controls.
- `Escape` closes the modal.
- When the modal closes, focus returns to the control that opened it, or to a safe fallback if that control no longer exists.

## 3. Reproduction Before Fix

1. Open `index.html` in a browser.
2. Add one transaction.
3. Use keyboard navigation to focus the transaction `Delete` button.
4. Press `Enter` to open the delete confirmation modal.
5. Press `Tab` several times.

Actual result before fix:

- Focus moved from the modal buttons to background controls.
- The background page remained keyboard-reachable while `aria-modal="true"` was active.

## 4. Root Cause

The previous `openConfirmModal` implementation only changed visual and ARIA state:

```js
const openConfirmModal = (id) => {
  state.pendingDeleteId = id;
  dom.confirmModal.classList.add("is-open");
  dom.confirmModal.setAttribute("aria-hidden", "false");
};
```

There was no initial focus placement, no `Tab` loop, no `Escape` handling, and no focus restoration after closing the modal.

## 5. Implementation Changes

### 5.1 JavaScript

Added modal focus-management utilities in `main.js`:

- `FOCUSABLE_SELECTOR` to identify keyboard-focusable elements.
- `modalTriggerElement` to remember the element that opened the modal.
- `getConfirmModalFocusableElements()` to list active modal controls.
- `focusConfirmModal()` to move focus into the dialog when opened.
- `restoreFocusAfterModal()` to return focus on close.
- `handleConfirmModalKeydown()` to trap `Tab` / `Shift + Tab` and close on `Escape`.

After fix:

```js
const openConfirmModal = (id) => {
  modalTriggerElement = document.activeElement;
  state.pendingDeleteId = id;
  dom.confirmModal.classList.add("is-open");
  dom.confirmModal.setAttribute("aria-hidden", "false");
  focusConfirmModal();
};
```

### 5.2 HTML

Updated the modal dialog markup in `index.html`:

- Added `tabindex="-1"` to `.modal__content` so it can receive programmatic focus if needed.
- Added `aria-describedby="confirmDescription"` and an `id` on the description text.

After fix:

```html
<div
  class="modal__content"
  tabindex="-1"
  role="dialog"
  aria-modal="true"
  aria-labelledby="confirmTitle"
  aria-describedby="confirmDescription"
>
```

### 5.3 CSS

Added visible keyboard focus styling in `style.css` for form controls, buttons, transaction action buttons, and modal fallback focus.

After fix:

```css
.btn:focus-visible,
.edit-btn:focus-visible,
.delete-btn:focus-visible,
.modal__content:focus-visible {
  outline: 3px solid rgba(56, 189, 248, 0.85);
  outline-offset: 3px;
}
```

## 6. Verification Steps

Manual verification:

1. Open `index.html`.
2. Add one transaction.
3. Focus the transaction `Delete` button with `Tab`.
4. Press `Enter`.
5. Confirm focus moves to the modal `Cancel` button.
6. Press `Tab`; focus should move to modal `Delete`.
7. Press `Tab` again; focus should cycle back to modal `Cancel`.
8. Press `Shift + Tab`; focus should cycle backward to modal `Delete`.
9. Press `Escape`; the modal should close and focus should return to the original delete button when it still exists.
10. Reopen the modal and confirm deletion; focus should move to a safe fallback because the original delete button was removed.

Acceptance criteria:

- Focus cannot escape to background controls while the modal is open.
- `Escape` closes the modal.
- Focus is restored after closing.
- Visible focus indicators are present during keyboard navigation.

## 7. Merge Guidance

Recommended GitHub flow:

1. Commit the fix on branch `KefanWu`.

```bash
git status
git add index.html main.js style.css ACCESSIBILITY_KEYBOARD_FOCUS_FIX.md
git commit -m "Fix delete modal keyboard focus trap"
```

2. Push the branch.

```bash
git push origin KefanWu
```

3. Open a pull request:

```text
https://github.com/DavidMo666/group/pull/new/KefanWu
```

4. Ask at least one teammate to review the accessibility behavior.

5. Merge the pull request into `main` after review and verification.

Optional local merge flow:

```bash
git switch main
git pull origin main
git merge --no-ff KefanWu
git push origin main
```

If merge conflicts occur, resolve conflicts in `index.html`, `main.js`, or `style.css`, then rerun the verification steps before pushing.