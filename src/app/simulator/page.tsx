import { ComingSoon } from "@/components/ComingSoon";
import { CandidateOutcomes } from "@/components/simulator/CandidateOutcomes";
import { loadLatest } from "@/lib/simulator-store";

export const metadata = { title: "Decision Simulator" };

// Freshness contract: without this line, Next.js may serve a cached copy of
// this page, and the grader would see stale numbers seconds after your API
// answered. force-dynamic re-renders the page on every request.
export const dynamic = "force-dynamic";

export default async function SimulatorPage() {
  const latest = await loadLatest();

  if (!latest) {
    return (
      <ComingSoon
        lane={3}
        title="Decision Simulator"
        description="A service that simulates investment games and recommends the stake that is best for the typical investor. Built after Lane 3."
      />
    );
  }

  const { problem, answer, candidates } = latest;
  const stakePct = Math.round(Number(answer.recommendedFraction) * 100);
  const lossPct = Math.round(Number(answer.probLoss) * 100);

  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
        Lane 3 · live decision service
      </p>
      <h1 className="mt-3 text-4xl font-bold">
        Stake {stakePct}% each year: it leaves the typical investor best off
      </h1>
      <p className="mt-4 max-w-prose text-muted">
        I play the latest game thousands of times for every stake on the list, then
        pick the one that leaves the typical investor with the most. That is the
        median path, not the lucky screenshot.
      </p>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">The latest game</h2>
        <p className="mt-2 max-w-prose text-muted">{String(problem.scenario)}</p>
        <p className="mt-2 text-sm text-muted">
          Heads: the staked part grows {Number(problem.upPct)}%. Tails: it shrinks{" "}
          {Number(problem.downPct)}%. {Number(problem.horizonYears)} years, starting from $
          {Number(problem.buyIn).toLocaleString("en-US")}.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">The recommendation</h2>
        <ul className="mt-3 space-y-1 text-lg">
          <li>
            Recommended stake fraction:{" "}
            <strong data-simulator="recommended-fraction" className="text-accent">
              {Number(answer.recommendedFraction).toFixed(2)}
            </strong>
          </li>
          <li>
            Typical (median) final balance: $
            <strong data-simulator="median-final" className="text-accent">
              {Math.round(Number(answer.medianFinalBalance)).toLocaleString("en-US")}
            </strong>
          </li>
          <li>
            Probability of ending below the buy-in:{" "}
            <strong data-simulator="prob-loss" className="text-accent">
              {Number(answer.probLoss).toFixed(3)}
            </strong>
            <span className="text-base text-muted"> (about {lossPct}% of simulated investors)</span>
          </li>
        </ul>
        <p className="mt-3 max-w-prose text-muted">{String(answer.reasoning)}</p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">How every stake turned out</h2>
        <CandidateOutcomes
          candidates={candidates}
          buyIn={Number(problem.buyIn)}
          recommended={Number(answer.recommendedFraction)}
        />
        <p className="mt-3 max-w-prose text-sm text-muted">
          The biggest stake looks like the aggressive sales pitch, but tails years
          compound too. A few simulated investors get rich; the typical one often
          ends worse than someone who staked less. I recommend the row whose typical
          result sits farthest to the right, not the row with the longest lucky tail.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">The model behind it</h2>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-simulator="dag"
          src="/images/dag.png"
          alt="DAG of the investment game: initial wealth and the stake fraction (a decision) feed wealth after each year, which also depends on that year's coin flip."
          className="mt-3 w-full max-w-xl rounded-lg border border-line bg-white p-3"
        />
        <p className="mt-3 max-w-prose text-sm text-muted">
          The yellow box is the choice I make: the stake fraction. The coin flip is
          the random part I cannot pick. Wealth after each year is just those two
          things applied to last year&apos;s balance, over and over.
        </p>
      </section>
    </main>
  );
}
