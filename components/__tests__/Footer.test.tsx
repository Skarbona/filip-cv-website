import { render, screen } from "@testing-library/react";
import Footer from "../Footer";

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

describe("Footer", () => {
  it("should render footer heading", () => {
    render(<Footer />);
    expect(screen.getByText("Filip Sokołowski")).toBeInTheDocument();
  });

  it("should render tagline", () => {
    render(<Footer />);
    expect(screen.getByText("Senior Software Engineer")).toBeInTheDocument();
  });

  it("should render Quick Links section", () => {
    render(<Footer />);
    expect(screen.getByText("Quick Links")).toBeInTheDocument();
  });

  it("should render all quick links", () => {
    render(<Footer />);
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Achievements")).toBeInTheDocument();
    expect(screen.getByText("Experience")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });

  it("should render Follow Me section", () => {
    render(<Footer />);
    expect(screen.getByText("Follow Me")).toBeInTheDocument();
  });

  it("should render social media links", () => {
    render(<Footer />);
    const socialLinks = screen.getAllByRole("link", { name: /github|linkedin|instagram/i });
    expect(socialLinks.length).toBeGreaterThanOrEqual(3);
  });

  it("should render copyright notice", () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear} Filip Sokołowski`)).toBeInTheDocument();
  });

  it("should render GDPR compliance text", () => {
    render(<Footer />);
    expect(screen.getByText(/This website is fully GDPR compliant/i)).toBeInTheDocument();
  });

  it("should render Made with love text", () => {
    render(<Footer />);
    expect(screen.getByText(/Made with/i)).toBeInTheDocument();
    expect(screen.getByText(/in Wrocław/i)).toBeInTheDocument();
  });
});
