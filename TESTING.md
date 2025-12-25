# Test Coverage Report

## Test Suite Summary

This project uses Jest and React Testing Library for unit and component testing.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Files

- **Utility Tests**
  - `lib/__tests__/utils.test.ts` - Tests for utility functions
  - `lib/__tests__/techColors.test.ts` - Tests for technology color mapping

- **Component Tests**
  - `components/__tests__/PixelIcon.test.tsx` - Pixel icon component tests
  - `components/__tests__/TechBadge.test.tsx` - Technology badge tests
  - `components/__tests__/About.test.tsx` - About section tests
  - `components/__tests__/Achievements.test.tsx` - Achievements section tests
  - `components/__tests__/Experience.test.tsx` - Experience section tests
  - `components/__tests__/Contact.test.tsx` - Contact section tests
  - `components/__tests__/Footer.test.tsx` - Footer component tests
  - `components/__tests__/Navigation.test.tsx` - Navigation component tests
  - `components/__tests__/ScrollToTop.test.tsx` - Scroll to top button tests

### Test Configuration

- **Jest Config**: `jest.config.ts`
- **Setup File**: `jest.setup.ts`
- **Coverage Threshold**: 50% for all metrics (branches, functions, lines, statements)

### Mocking

- **Next/Image**: Mocked to return a simple img tag for testing
- **Window Methods**: scrollTo, scrollIntoView mocked for navigation tests
- **Scroll Events**: Window scroll properties mocked for scroll-dependent components

### Current Status

✅ **41 tests passing**

- All static component rendering tests
- Data validation tests
- Utility function tests
- UI interaction tests

⚠️ **Some tests require additional mocking**

- Client-side hooks (useState, useEffect) with scroll listeners
- Complex user interactions with state changes

### Notes

- Tests use `@testing-library/react` best practices
- All components are tested for:
  - Correct rendering
  - Expected text content
  - Proper data display
  - Basic user interactions
- Image components use simplified mocks to avoid Next.js Image optimization in tests
