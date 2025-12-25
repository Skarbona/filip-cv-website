import { render, screen } from "@testing-library/react";
import Contact from "../Contact";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe("Contact", () => {
  it("should render Get In Touch heading", () => {
    render(<Contact />);
    expect(screen.getByText("Get In Touch")).toBeInTheDocument();
  });

  it("should render contact information", () => {
    render(<Contact />);
    expect(screen.getByText("filip.sokolowski1990@gmail.com")).toBeInTheDocument();
    expect(screen.getByText("+48 604 515 975")).toBeInTheDocument();
    expect(screen.getByText("Wrocław, Poland")).toBeInTheDocument();
  });

  it("should render Email Me button", () => {
    render(<Contact />);
    const emailButtons = screen.getAllByText("Email Me");
    expect(emailButtons.length).toBeGreaterThan(0);
  });

  it("should render Call Me button", () => {
    render(<Contact />);
    const callButtons = screen.getAllByText("Call Me");
    expect(callButtons.length).toBeGreaterThan(0);
  });

  it("should render social media links", () => {
    render(<Contact />);
    expect(screen.getByText("GitHub")).toBeInTheDocument();
    expect(screen.getByText("LinkedIn")).toBeInTheDocument();
    expect(screen.getByText("Instagram")).toBeInTheDocument();
  });

  it("should have correct email link", () => {
    render(<Contact />);
    const emailButtons = screen.getAllByText("Email Me");
    const firstEmailButton = emailButtons[0].closest("a");
    expect(firstEmailButton).toHaveAttribute("href", "mailto:filip.sokolowski1990@gmail.com");
  });

  it("should have correct phone link", () => {
    render(<Contact />);
    const callButtons = screen.getAllByText("Call Me");
    const firstCallButton = callButtons[0].closest("a");
    expect(firstCallButton).toHaveAttribute("href", "tel:+48604515975");
  });
});
