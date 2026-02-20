# Spec for FormCard Design Redesign

branch: claude/feature/formcard-design-redesign
figma_component: carte_liste_complete (node 477:163653)

## Summary

Redesign the `FormCard` component (`src/features/forms-management/FormCard.tsx`) to match the Figma design. The card uses a horizontal 3-column layout separated by vertical dividers: title+code on the left, description in the middle, and status/actions on the right.

## Functional Requirements

- The card layout is a single horizontal row with 3 sections separated by vertical `Divider` components
- **Left section (Title)**: Form name (heading, semibold, 16px) on top, form code (gray, 14px) below
- **Middle section (Description)**: Description text (regular, 14px) taking remaining space
- **Right section (Status/Actions)**: Fixed width (~80px), contains:
  - A status `Chip` showing the current publish state ("Draft" in light blue when unpublished, "Publie" in green when published)
  - A "Publier" `Button` (primary, size s) shown only when the form is **not** published
- Clicking the card navigates to the form editor (existing behavior)
- Clicking "Publier" publishes the form without navigating (use `e.stopPropagation()`)
- The card has a subtle shadow (shadow-2) and 4px border-radius, matching the design system `Card` component

## Figma Design Reference

- File: https://www.figma.com/design/22XagL30mehDXPnRkwEtO8/CSRD-Copy?node-id=477-163653&m=dev
- Component name: `carte_liste_complete`
- Key visual constraints:
  - Card width: full (572px in Figma, but should be responsive / `size="full"`)
  - Padding: 12px horizontal, 7px vertical
  - Title: Nunito SemiBold 16px, color #201f1f, letter-spacing -0.5px
  - Code: 14px semibold, color #696969
  - Description: Nunito Sans Regular 14px, color #11161a, line-height 18px
  - Vertical dividers between each section
  - Right section: 80px fixed width, status chip + publish button stacked vertically

## Possible Edge Cases

- Long form names should not break the layout (truncate or wrap gracefully)
- Long descriptions should be clamped (line-clamp-2 or similar)
- When the form is already published, the "Publier" button is hidden and only the chip is shown
- If publishing fails, an error should be logged (existing behavior via store)

## Acceptance Criteria

- The FormCard visually matches the Figma design (3-column layout with dividers)
- Title and code are displayed in the left column
- Description is displayed in the middle column
- Status chip reflects `isPublished` state
- Publish button is only visible for unpublished forms
- Clicking publish does not trigger card navigation
- Existing props (`onClick`, `pressed`, `code`, `title`, `description`, `isPublished`, `onPublish`) are preserved

## Open Questions

- Should the status chip show different states beyond "Draft" and "Publie" (e.g. "Archive")?
- Should the publish button have a loading state during the API call?

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- Card renders title, code, and description in correct positions
- Publish button is visible when `isPublished` is false
- Publish button is hidden when `isPublished` is true
- Status chip shows "Draft" when unpublished and "Publie" when published
- Clicking publish calls `onPublish` without triggering `onClick`
