import { render, screen } from "@testing-library/react";
import Experience from "../Experience";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe("Experience", () => {
  it("should render Professional Experience heading", () => {
    render(<Experience />);
    expect(screen.getByText("Professional Experience")).toBeInTheDocument();
  });

  it("should render all companies", () => {
    render(<Experience />);
    expect(screen.getByText("Notch")).toBeInTheDocument();
    expect(screen.getByText("Toptal")).toBeInTheDocument();
    expect(screen.getByText("Beeline")).toBeInTheDocument();
    expect(screen.getByText("UBS")).toBeInTheDocument();
    expect(screen.getByText("Sofomo")).toBeInTheDocument();
    expect(screen.getByText("Chili IT Expert Filip Sokolowski")).toBeInTheDocument();
  });

  it("should render job positions", () => {
    render(<Experience />);
    expect(screen.getByText("Frontend Lead")).toBeInTheDocument();
    expect(screen.getByText("Senior Software Engineer")).toBeInTheDocument();
  });

  it("should render job periods", () => {
    render(<Experience />);
    expect(screen.getByText("September 2025 - Present")).toBeInTheDocument();
    expect(screen.getByText("May 2025 - September 2025")).toBeInTheDocument();
  });

  it("should render job locations", () => {
    render(<Experience />);
    const remoteLocations = screen.getAllByText("Remote");
    expect(remoteLocations.length).toBeGreaterThan(0);
  });

  it("should render technology badges", () => {
    render(<Experience />);
    expect(screen.getAllByText("React").length).toBeGreaterThan(0);
    expect(screen.getAllByText("TypeScript").length).toBeGreaterThan(0);
  });

  it("should render job descriptions", () => {
    render(<Experience />);
    expect(screen.getByText(/Spearheaded the discovery phase/i)).toBeInTheDocument();
  });
});
