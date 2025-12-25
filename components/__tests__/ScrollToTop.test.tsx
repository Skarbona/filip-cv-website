import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import ScrollToTop from "../ScrollToTop";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe("ScrollToTop", () => {
  beforeEach(() => {
    // Reset scroll position
    Object.defineProperty(window, "scrollY", {
      writable: true,
      configurable: true,
      value: 0,
    });
  });

  it("should not render button when at top of page", () => {
    render(<ScrollToTop />);
    const button = screen.queryByLabelText("Scroll to top");
    expect(button).not.toBeInTheDocument();
  });

  it("should render button when scrolled down", async () => {
    render(<ScrollToTop />);

    // Simulate scroll
    await act(async () => {
      Object.defineProperty(window, "scrollY", {
        writable: true,
        configurable: true,
        value: 500,
      });
      fireEvent.scroll(window);
    });

    await waitFor(
      () => {
        const button = screen.queryByLabelText("Scroll to top");
        expect(button).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });

  it("should scroll to top when button clicked", async () => {
    const scrollToSpy = jest.fn();
    window.scrollTo = scrollToSpy;

    render(<ScrollToTop />);

    // Simulate scroll down
    await act(async () => {
      Object.defineProperty(window, "scrollY", {
        writable: true,
        configurable: true,
        value: 500,
      });
      fireEvent.scroll(window);
    });

    await waitFor(
      () => {
        const button = screen.getByLabelText("Scroll to top");
        fireEvent.click(button);
      },
      { timeout: 1000 }
    );

    expect(scrollToSpy).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });
});
