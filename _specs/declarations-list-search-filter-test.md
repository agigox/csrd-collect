# Spec for Declarations List Search and Filter Testing

branch: claude/feature/declarations-list-search-filter-test

## Summary

This spec focuses on implementing and testing the search and filter functionality for the declarations list. The user journey being tested starts when a user arrives on the Declarations page and interacts with the search and filter features in the Header component.

The goal is to ensure users can effectively search declarations by name and filter them by status, team, and author, with comprehensive E2E tests covering all scenarios.

## Functional Requirements

### Search Functionality

- Add a search input field that allows users to search declarations by `formData.name`
- Search should be case-insensitive
- Search should update the displayed list in real-time or on button click
- Clear search functionality should reset the list to show all declarations

### Filter Functionality

- **Filter by Status**: Allow filtering declarations by their `status` field (draft, pending, validated)
- **Filter by Team**: Allow filtering declarations by `teamId`
- **Filter by Author**: Allow filtering declarations by `authorName`
- Multiple filters should work together (AND logic)
- Filters should be toggleable via the filter button in the Header (and add close icon to close filter by toggling isFilterOpen)
- Clear filters functionality should reset all filters

### Header Component

The Header displays:

- Title: "Déclarations"
- Search button/input (onSearch handler)
- Filter toggle button (onFilter handler) - shows active state when filters are open
- "Déclarer" button (onDeclarer handler) - opens FormSelectionDialog

### Integration

- When search is active, the filtered results should be displayed in the DeclarationsList
- When filters are applied, only matching declarations should be shown
- Empty state should be displayed when no declarations match the search/filter criteria

## Possible Edge Cases

- Empty search query should show all declarations
- No declarations match search criteria
- No declarations match filter criteria
- Multiple filters applied simultaneously
- Search and filters applied at the same time
- Filter panel open/close state management
- Special characters in search query
- Very long declaration names in search results
- User clears individual filter chips vs clearing all filters
- API returns empty declarations array
- Loading state during declaration fetch
- Error state when API fails

## Acceptance Criteria

### Search

- [ ] User can type in search input and results filter by formData.name
- [ ] Search is case-insensitive
- [ ] Empty search shows all declarations
- [ ] Clear search button resets the list

### Filters

- [ ] Filter button toggles the filter panel open/closed
- [ ] Filter by status shows draft/pending/validated options
- [ ] Filter by team shows available teams (from teamId)
- [ ] Filter by author shows available authors (from authorName)
- [ ] Multiple filters work together correctly
- [ ] Selected filters display as chips
- [ ] Individual filter chips can be removed
- [ ] Clear all filters button resets all selections

### UI/UX

- [ ] Filter button shows active state when filters panel is open
- [ ] Loading state shown while declarations are being fetched
- [ ] Empty state shown when no declarations match criteria
- [ ] Header remains sticky/visible when scrolling (if applicable)

### Integration

- [ ] Déclarer button opens FormSelectionDialog modal
- [ ] All functionality works with real API data from db.json
- [ ] State persists correctly during user interactions

## Open Questions

- Should search be triggered on every keystroke or on Enter/button click? no
- Should filters persist when user navigates away and comes back? no
- Should filter options be dynamically generated from available declarations? no
- What should be the behavior when a user has both search and filters active? only one can be active
- Should there be a "Clear all" button that resets both search and filters? no

## Testing Guidelines

Create E2E test file(s) in the `e2e-tests/member/` folder for this feature. Tests should cover:

### Search Tests

- Search by exact declaration name
- Search by partial declaration name
- Search with no results
- Clear search functionality
- Search with special characters

### Filter Tests

- Filter by single status value
- Filter by multiple status values
- Filter by team
- Filter by author
- Combine multiple filter types (status + team + author)
- Clear individual filter chips
- Clear all filters
- Filter panel open/close toggle

### Integration Tests

- Search + filters combined
- Déclarer button opens modal correctly
- Empty state when no results
- Loading state during API fetch
- Error handling when API fails

### Testing Strategy

- If a bug or missing functionality is discovered during test writing:
  1. STOP test writing
  2. Fix the bug or implement the missing functionality
  3. Verify the fix works
  4. RESUME test writing from where you left off
- Use mocked API responses for consistent test data
- Test with edge case data (empty arrays, special characters, etc.)
- Verify accessibility of search and filter controls
