import { render, screen } from "@testing-library/react";
import Achievements from "../Achievements";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe("Achievements", () => {
  it("should render Key Achievements heading", () => {
    render(<Achievements />);
    expect(screen.getByText("Key Achievements")).toBeInTheDocument();
  });

  it("should render all 8 achievements", () => {
    render(<Achievements />);
    expect(screen.getByText("AI Framework Development")).toBeInTheDocument();
    expect(screen.getByText("LLM-Generated Applications Enhancement")).toBeInTheDocument();
    expect(screen.getByText("Leadership in Internal Projects")).toBeInTheDocument();
    expect(screen.getByText("UX/UI Collaboration Excellence")).toBeInTheDocument();
    expect(screen.getByText("Successful Migration Leadership")).toBeInTheDocument();
    expect(screen.getByText("Performance Optimization")).toBeInTheDocument();
    expect(screen.getByText("Product Development Impact")).toBeInTheDocument();
    expect(screen.getByText("Stakeholder Management")).toBeInTheDocument();
  });

  it("should render company names for achievements", () => {
    render(<Achievements />);
    expect(screen.getAllByText("Mercor").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Beeline").length).toBeGreaterThan(0);
    expect(screen.getAllByText("UBS").length).toBeGreaterThan(0);
    expect(screen.getByText("Notch")).toBeInTheDocument();
  });

  it("should render achievement descriptions", () => {
    render(<Achievements />);
    expect(screen.getByText(/reducing the task cycle by 30%/i)).toBeInTheDocument();
    expect(screen.getByText(/reduced processing time by 90%/i)).toBeInTheDocument();
  });

  it("should render numbered badges for achievements", () => {
    render(<Achievements />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
  });
});
