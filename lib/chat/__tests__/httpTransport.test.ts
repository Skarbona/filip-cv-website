import { ChatApiError, createHttpTransports } from "../httpTransport";

const { chat, contact } = createHttpTransports("http://api.test");
const history = [{ role: "user" as const, content: "Hi!" }];

function respond(status: number, body: unknown) {
  global.fetch = jest.fn(async () => ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  })) as unknown as typeof fetch;
}

describe("http chat transport", () => {
  it("posts the history and returns the answer", async () => {
    respond(200, { text: "Hello!", card: { type: "contact", draft: { message: "" } } });

    expect(await chat.send(history)).toEqual({
      text: "Hello!",
      card: { type: "contact", draft: { message: "" } },
    });
    expect(global.fetch).toHaveBeenCalledWith(
      "http://api.test/api/chat",
      expect.objectContaining({ method: "POST", body: JSON.stringify({ messages: history }) })
    );
  });

  it("shows the friendly text that comes with a rate limit", async () => {
    respond(429, { text: "Give me a minute." });
    expect(await chat.send(history)).toEqual({ text: "Give me a minute.", card: undefined });
  });

  it("drops cards it doesn't know", async () => {
    respond(200, { text: "Hi", card: { type: "launch-missiles" } });
    expect((await chat.send(history)).card).toBeUndefined();
  });

  it("throws on server errors", async () => {
    respond(502, { error: "Something went wrong" });
    await expect(chat.send(history)).rejects.toEqual(new ChatApiError(502, "Something went wrong"));
  });
});

describe("http contact transport", () => {
  const request = { name: "Anna", email: "anna@example.com", message: "Hi", website: "" };

  it("posts the request", async () => {
    respond(200, { ok: true });
    await expect(contact.send(request)).resolves.toBeUndefined();
    expect(global.fetch).toHaveBeenCalledWith("http://api.test/api/contact", expect.anything());
  });

  it("passes the reason of a refusal on", async () => {
    respond(429, { error: "That's enough messages for today." });
    await expect(contact.send(request)).rejects.toHaveProperty(
      "message",
      "That's enough messages for today."
    );
  });
});
