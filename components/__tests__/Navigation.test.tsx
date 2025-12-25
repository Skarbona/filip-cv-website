import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navigation from "../Navigation";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

describe("Navigation", () => {
  beforeEach(() => {
    // Reset scroll position
    Object.defineProperty(window, "scrollY", {
      writable: true,
      configurable: true,
      value: 0,
    });
  });

  it("should render logo/name", () => {
    render(<Navigation />);
    expect(screen.getByText("Filip")).toBeInTheDocument();
  });

  it("should render all navigation items", () => {
    render(<Navigation />);
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Achievements")).toBeInTheDocument();
    expect(screen.getByText("Experience")).toBeInTheDocument();
    expect(screen.getByText("Consulting")).toBeInTheDocument();
    expect(screen.getByText("Skills")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });

  it("should handle scroll to top on logo click", async () => {
    const user = userEvent.setup();
    const scrollToSpy = jest.fn();
    window.scrollTo = scrollToSpy;

    render(<Navigation />);
    const logo = screen.getByText("Filip");

    await user.click(logo);

    expect(scrollToSpy).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });

  it("should handle navigation item clicks", async () => {
    const user = userEvent.setup();
    const scrollIntoViewSpy = jest.fn();
    Element.prototype.scrollIntoView = scrollIntoViewSpy;

    // Create mock section
    document.body.innerHTML = '<div id="about"></div>';

    render(<Navigation />);
    const aboutButton = screen.getAllByText("About")[0];

    await user.click(aboutButton);

    expect(scrollIntoViewSpy).toHaveBeenCalledWith({ behavior: "smooth" });
  });
});
