import type { ImgHTMLAttributes } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChatWidget from "../ChatWidget";
import { ChatApiError } from "@/lib/chat/httpTransport";
import type { ChatTransport, ContactTransport } from "@/lib/chat/types";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

beforeAll(() => {
  // jsdom has no modal dialogs
  HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) {
    this.open = true;
  };
  HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement) {
    this.open = false;
  };
});

function setup() {
  const transport: ChatTransport = {
    send: jest.fn(async () => ({ text: "I lead AI Labs projects at Mercor." })),
  };
  const contact: ContactTransport = { send: jest.fn(async () => {}) };
  const user = userEvent.setup();
  render(<ChatWidget transport={transport} contact={contact} />);
  return { transport, contact, user };
}

async function openChat(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: "Open chat with Filip" }));
  return screen.getByLabelText("Your message");
}

describe("ChatWidget", () => {
  it("opens from the launcher with a greeting and suggestions", async () => {
    const { user } = setup();
    await openChat(user);

    expect(screen.getByText(/Filip's pixel twin/)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Pixel-art Filip" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Contact Filip" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Open chat with Filip" })).not.toBeInTheDocument();
  });

  it("sends the question with the history and shows the answer", async () => {
    const { transport, user } = setup();
    const input = await openChat(user);

    await user.type(input, "What do you do at Mercor?{Enter}");

    expect(await screen.findByText("I lead AI Labs projects at Mercor.")).toBeInTheDocument();
    expect(transport.send).toHaveBeenCalledWith(
      [{ role: "user", content: "What do you do at Mercor?" }],
      expect.any(AbortSignal)
    );
    expect(input).toHaveValue("");
  });

  it("turns pasted code into an invoice and a contact form, without asking the model", async () => {
    const { transport, contact, user } = setup();
    const input = await openChat(user);

    fireEvent.change(input, { target: { value: "function add(a, b) {\n  return a + b;\n}" } });
    await user.click(screen.getByRole("button", { name: "Send" }));

    expect(screen.getByText(/Where should Filip send the invoice/)).toBeInTheDocument();
    expect(transport.send).not.toHaveBeenCalled();

    await user.type(screen.getByLabelText("Invoice to"), "ACME, Kraków");
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(screen.getByLabelText("Message")).toHaveValue(
      "Hi Filip, I'd like paid help with this code.\nInvoice to: ACME, Kraków\n\nMy code:\nfunction add(a, b) {\n  return a + b;\n}"
    );
    const send = screen.getByRole("button", { name: "Send to Filip" });
    expect(send).toBeDisabled();

    await user.type(screen.getByLabelText("Your name"), "Anna");
    await user.type(screen.getByLabelText("Your email"), "anna@example.com");
    await user.click(send);

    expect(await screen.findByText(/Filip usually replies within 24-48 hours/)).toBeInTheDocument();
    expect(contact.send).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Anna", email: "anna@example.com", website: "" })
    );
  });

  it("sends nothing when the contact form is cancelled", async () => {
    const { contact, user } = setup();
    await openChat(user);

    await user.click(screen.getByRole("button", { name: "Contact Filip" }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.getByText("Okay, nothing was sent.")).toBeInTheDocument();
    expect(contact.send).not.toHaveBeenCalled();
  });

  it("keeps pasted code out of the history sent with later questions", async () => {
    const { transport, user } = setup();
    const input = await openChat(user);

    fireEvent.change(input, { target: { value: "function add(a, b) {\n  return a + b;\n}" } });
    await user.click(screen.getByRole("button", { name: "Send" }));
    await user.type(input, "Are you available?{Enter}");

    await screen.findByText("I lead AI Labs projects at Mercor.");
    expect(transport.send).toHaveBeenCalledWith(
      [{ role: "user", content: "Are you available?" }],
      expect.any(AbortSignal)
    );
  });

  it("explains the daily contact limit", async () => {
    const { contact, user } = setup();
    jest
      .mocked(contact.send)
      .mockRejectedValueOnce(new ChatApiError(429, "That's enough messages for today."));
    await openChat(user);

    await user.click(screen.getByRole("button", { name: "Contact Filip" }));
    await user.type(screen.getByLabelText("Your name"), "Anna");
    await user.type(screen.getByLabelText("Your email"), "anna@example.com");
    await user.type(screen.getByLabelText("Message"), "Hi!");
    await user.click(screen.getByRole("button", { name: "Send to Filip" }));

    expect(await screen.findByText("That's enough messages for today.")).toBeInTheDocument();
  });

  it("closes with the close button and with Escape, keeping the conversation", async () => {
    const { user } = setup();
    const input = await openChat(user);
    await user.type(input, "Hi!{Enter}");
    await screen.findByText("I lead AI Labs projects at Mercor.");

    await user.click(screen.getByRole("button", { name: "Close chat" }));
    expect(screen.queryByLabelText("Your message")).not.toBeInTheDocument();

    await openChat(user);
    expect(screen.getByText("I lead AI Labs projects at Mercor.")).toBeInTheDocument();

    fireEvent(document.querySelector("dialog")!, new Event("cancel", { cancelable: true }));
    expect(screen.queryByLabelText("Your message")).not.toBeInTheDocument();
  });
});
