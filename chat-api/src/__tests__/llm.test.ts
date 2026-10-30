/** @jest-environment node */
import { CONTACT_TOOL, LlmError, createOpenRouter } from "../llm.ts";

function fakeFetch(status: number, body: unknown) {
  return jest.fn(async () => new Response(JSON.stringify(body), { status })) as jest.Mock &
    typeof fetch;
}

const turns = [{ role: "user" as const, content: "Hi!" }];
const options = {
  apiKey: "test-key",
  models: ["model/a", "model/b"],
  dataCollection: "deny" as const,
};

describe("createOpenRouter", () => {
  it("asks the first model for a short answer, without thinking or data collection", async () => {
    const fetchImpl = fakeFetch(200, { choices: [{ message: { content: "Hello!" } }] });
    await createOpenRouter({ ...options, fetchImpl }).reply("SYSTEM", turns);

    const [url, init] = fetchImpl.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://openrouter.ai/api/v1/chat/completions");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer test-key");
    expect(JSON.parse(init.body as string)).toMatchObject({
      model: "model/a",
      messages: [{ role: "system", content: "SYSTEM" }, ...turns],
      max_completion_tokens: 400,
      reasoning: { effort: "none" },
      tools: [CONTACT_TOOL],
      provider: { data_collection: "deny" },
    });
  });

  it("keeps the lowest thinking setting for a model that can't switch it off", async () => {
    const fetchImpl = fakeFetch(200, { choices: [{ message: { content: "Hello!" } }] });
    await createOpenRouter({ ...options, models: ["z-ai/glm-5.3-flash"], fetchImpl }).reply(
      "SYSTEM",
      turns
    );

    const [, init] = fetchImpl.mock.calls[0] as [string, RequestInit];
    expect(JSON.parse(init.body as string).reasoning).toEqual({ effort: "minimal" });
  });

  it("returns the answer with the model and its cost", async () => {
    const fetchImpl = fakeFetch(200, {
      model: "model/a",
      choices: [{ message: { content: "  I'm Filip's AI twin.  " } }],
      usage: { prompt_tokens: 5000, completion_tokens: 20, cost: 0.0004 },
    });

    expect(await createOpenRouter({ ...options, fetchImpl }).reply("SYSTEM", turns)).toEqual({
      reply: { text: "I'm Filip's AI twin." },
      model: "model/a",
      cost: 0.0004,
      promptTokens: 5000,
      completionTokens: 20,
    });
  });

  it("turns the contact tool call into a contact card with the visitor's draft", async () => {
    const fetchImpl = fakeFetch(200, {
      choices: [
        {
          message: {
            content: null,
            tool_calls: [
              {
                function: {
                  name: "request_contact",
                  arguments: JSON.stringify({
                    message: "Hi Filip, I'd like a call about a lead role in my team.",
                  }),
                },
              },
            ],
          },
        },
      ],
    });

    const { reply } = await createOpenRouter({ ...options, fetchImpl }).reply("SYSTEM", turns);
    expect(reply.card).toEqual({
      type: "contact",
      draft: { message: "Hi Filip, I'd like a call about a lead role in my team." },
    });
    expect(reply.text).toMatch(/Leave your details/);
  });

  it("survives broken tool arguments", async () => {
    const fetchImpl = fakeFetch(200, {
      choices: [
        {
          message: { tool_calls: [{ function: { name: "request_contact", arguments: "{oops" } }] },
        },
      ],
    });
    const { reply } = await createOpenRouter({ ...options, fetchImpl }).reply("SYSTEM", turns);
    expect(reply.card).toEqual({ type: "contact", draft: { message: "" } });
  });

  it("passes the status of an OpenRouter error on, without trying again", async () => {
    const fetchImpl = fakeFetch(403, { error: { message: "Key limit exceeded" } });
    const reply = createOpenRouter({ ...options, fetchImpl }).reply("SYSTEM", turns);
    await expect(reply).rejects.toEqual(new LlmError(403, "Key limit exceeded"));
    await expect(reply).rejects.toHaveProperty("status", 403);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("tries the fallback model once when a provider fails after taking the request", async () => {
    const fetchImpl = jest
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            error: { message: "Provider returned error", metadata: { provider_name: "SlowCloud" } },
          }),
          { status: 200 }
        )
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ model: "model/b", choices: [{ message: { content: "Hi!" } }] })
        )
      ) as jest.Mock & typeof fetch;

    const result = await createOpenRouter({ ...options, fetchImpl }).reply("SYSTEM", turns);

    expect(result).toMatchObject({
      reply: { text: "Hi!" },
      model: "model/b",
      retried: "Provider returned error (SlowCloud)",
    });
    const models = fetchImpl.mock.calls.map(([, init]) => JSON.parse(init.body).model);
    expect(models).toEqual(["model/a", "model/b"]);
  });

  it("tries the same model again when there is no second one", async () => {
    const fetchImpl = jest
      .fn()
      .mockRejectedValueOnce(new Error("socket hang up"))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ choices: [{ message: { content: "Hi!" } }] }))
      ) as jest.Mock & typeof fetch;

    const result = await createOpenRouter({ ...options, models: ["model/a"], fetchImpl }).reply(
      "SYSTEM",
      turns
    );

    expect(result.retried).toBe("OpenRouter did not answer: socket hang up");
    const models = fetchImpl.mock.calls.map(([, init]) => JSON.parse(init.body).model);
    expect(models).toEqual(["model/a", "model/a"]);
  });

  it("calls a provider that stalls after taking the request a timeout", async () => {
    // OpenRouter has already sent 200, but the body never finishes
    const fetchImpl = jest.fn(async (_url: string, init: RequestInit) => {
      const body = new ReadableStream({
        start(controller) {
          init.signal?.addEventListener("abort", () => controller.error(init.signal?.reason));
        },
      });
      return new Response(body, { status: 200 });
    }) as unknown as typeof fetch;

    const reply = createOpenRouter({ ...options, fetchImpl, timeoutMs: 20 }).reply("SYSTEM", turns);

    await expect(reply).rejects.toEqual(
      new LlmError(
        504,
        "OpenRouter timed out after 0.02 s; retry: OpenRouter timed out after 0.02 s"
      )
    );
    await expect(reply).rejects.toHaveProperty("status", 504);
  });

  it("treats an empty answer as an error", async () => {
    const fetchImpl = fakeFetch(200, { choices: [{ message: { content: "   " } }] });
    await expect(
      createOpenRouter({ ...options, fetchImpl }).reply("SYSTEM", turns)
    ).rejects.toHaveProperty("status", 502);
  });

  it("reports a network failure as 504 after one more try", async () => {
    const fetchImpl = jest.fn(async () => {
      throw new Error("socket hang up");
    }) as unknown as typeof fetch;
    await expect(
      createOpenRouter({ ...options, fetchImpl }).reply("SYSTEM", turns)
    ).rejects.toHaveProperty("status", 504);
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });
});
