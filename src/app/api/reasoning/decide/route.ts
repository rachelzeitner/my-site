import { NextResponse } from "next/server";
import { notBuiltYet } from "@/lib/not-built-yet";
import { saveLatest, type ProblemType } from "@/lib/reasoning-store";

/**
 * ── Challenge 2, step 4: the brain ────────────────────────────────────────
 * Why this route exists: this is the decision endpoint. The grader POSTs a
 * JSON problem here (one of three types) and your code must answer it,
 * correctly, in under 10 seconds, with no human involved. Everything Lane 2
 * taught your brain, this route teaches your website.
 *
 * The three blocks below map one-to-one onto stations you have already
 * passed. The build guide (course book, end of Lane 2) walks through each
 * one; the wire contract with example problems lives on the Challenge 2 page.
 *
 * The plumbing (parse, save, respond) is already written. Until you fill in
 * an answer, unanswered problems return 501: honestly unfinished, never
 * faked.
 */
export async function POST(req: Request) {
  const problem = await req.json().catch(() => null);
  if (!problem || typeof problem.type !== "string") {
    return NextResponse.json(
      { error: "expected a JSON problem with a `type` field" },
      { status: 400 }
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let answer: Record<string, any> | undefined;

  if (problem.type === "syllogism") {
    // Station 2.1's truth table as a lookup. observation.asserts is the
    // canonical form; no need to parse the English statements.
    const forms: Record<string, Record<string, string>> = {
      A: { verdict: "valid" },
      "not-B": { verdict: "valid" },
      B: { verdict: "invalid", fallacy: "affirming the consequent" },
      "not-A": { verdict: "invalid", fallacy: "denying the antecedent" },
    };
    const form = forms[problem.observation?.asserts];
    if (form) answer = { ...form };
  }

  if (problem.type === "plausibility") {
    // Station 2.3's counting method. N cancels in the division; it is
    // here so the names tell the truth: these are counts of cases.
    const N = 10_000;
    const trueFlags = N * problem.baseRate * problem.hitRate;
    const falseFlags = N * (1 - problem.baseRate) * problem.falseAlarmRate;
    answer = { posterior: trueFlags / (trueFlags + falseFlags) };
  }

  if (problem.type === "bernoulli") {
    // Station 2.4's Bernoulli read: support, expected value, P(X = x).
    const { theta, payoffs, probabilityOf } = problem;
    answer = {
      support: [0, 1],
      expectedValue: theta * payoffs.onSuccess + (1 - theta) * payoffs.onFailure,
      probabilityStatement: probabilityOf === 1 ? theta : 1 - theta,
    };
  }

  if (answer === undefined) {
    return notBuiltYet(2, "Reasoning & Uncertainty Service");
  }

  await saveLatest(problem.type as ProblemType, problem, answer);

  return NextResponse.json(answer);
}
