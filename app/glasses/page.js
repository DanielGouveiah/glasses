import Image from "next/image";
import banner from "../../assets/Banner.png";

const workflows = [
  {
    index: "01",
    name: "Glasses",
    command: "/glasses:glasses",
    description:
      "Challenge a plan, remove unsupported machinery, and keep implementation inside the evidence-backed design.",
  },
  {
    index: "02",
    name: "Pointer",
    command: "/glasses:pointer",
    description:
      "Inspect an implementation, point to evidenced problems, and recommend the smallest targeted correction.",
  },
  {
    index: "03",
    name: "Homework",
    command: "/glasses:homework",
    description:
      "Research technical decisions with reliable sources and propose the cheapest validation that can change the answer.",
  },
  {
    index: "04",
    name: "Scribe",
    command: "/glasses:scribe",
    description:
      "Capture approved decisions, handoffs, and project knowledge as visible, reviewable documentation.",
  },
];

const harnesses = [
  "Claude Code",
  "Codex",
  "Gemini CLI",
  "GitHub Copilot",
  "OpenCode",
];

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20">
      <path d="M4 10h11M11 5l5 5-5 5" />
    </svg>
  );
}

export default function Home() {
  return (
    <main>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <nav className="nav shell" aria-label="Primary navigation">
        <a className="wordmark" href="#top" aria-label="Glasses home">
          <Image
            className="wordmark-icon"
            src="/glasses-icon.svg"
            alt=""
            width={30}
            height={30}
          />
          Glasses
        </a>
        <div className="nav-actions">
          <span className="version">v1.1.0</span>
          <a
            className="nav-link"
            href="https://github.com/DanielGouveiah/glasses"
          >
            GitHub
            <ArrowIcon />
          </a>
        </div>
      </nav>

      <section className="hero shell" id="top">
        <div className="hero-copy">
          <p className="eyebrow">
            <span />
            Evidence before architecture
          </p>
          <h1>
            Put your glasses on
            <em>before the code gets expensive.</em>
          </h1>
          <p className="hero-description">
            Glasses gives AI coding agents a simple rule: complexity has to earn
            its place. Challenge assumptions, protect necessary quality, and
            ship the smallest design supported by evidence.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#install">
              Install Glasses
              <ArrowIcon />
            </a>
            <a
              className="button button-secondary"
              href="https://github.com/DanielGouveiah/glasses"
            >
              View source
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="image-frame">
            <Image
              src={banner}
              alt="Glasses by Daniel Barbosa"
              priority
              sizes="(max-width: 900px) 100vw, 48vw"
            />
          </div>
          <div className="visual-note">
            <span>Current mode</span>
            <strong>High evidence</strong>
          </div>
        </div>
      </section>

      <section className="manifesto shell">
        <p className="section-label">The rule</p>
        <div className="manifesto-grid">
          <h2>No evidence means no extra machinery.</h2>
          <div>
            <p>
              Glasses removes speculative abstractions, dependencies, services,
              configuration, and extension points.
            </p>
            <p>
              It never trades away correctness, security, accessibility, data
              integrity, observability, or useful tests.
            </p>
          </div>
        </div>
      </section>

      <section className="workflows shell" id="workflows">
        <div className="section-heading">
          <div>
            <p className="section-label">Four focused workflows</p>
            <h2>Choose the nerd you need.</h2>
          </div>
          <p>
            Each workflow owns one decision and hands off without repeating the
            same conversation.
          </p>
        </div>

        <div className="workflow-grid">
          {workflows.map((workflow) => (
            <article className="workflow-card" key={workflow.name}>
              <span className="card-index">{workflow.index}</span>
              <div>
                <h3>{workflow.name}</h3>
                <code>{workflow.command}</code>
              </div>
              <p>{workflow.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="install shell" id="install">
        <div className="install-copy">
          <p className="section-label">Start with Claude Code</p>
          <h2>Two commands. Better questions.</h2>
          <p>
            Add the marketplace, install Glasses, and restart Claude Code. The
            default evidence threshold is high.
          </p>
          <div className="harnesses" aria-label="Supported coding agents">
            {harnesses.map((harness) => (
              <span key={harness}>{harness}</span>
            ))}
          </div>
        </div>

        <div className="terminal" aria-label="Installation commands">
          <div className="terminal-bar">
            <span />
            <span />
            <span />
            <p>terminal</p>
          </div>
          <pre>
            <code>
              <span className="prompt">$</span> claude plugin marketplace add{" "}
              <span className="accent">DanielGouveiah/glasses</span>
              {"\n\n"}
              <span className="prompt">$</span> claude plugin install{" "}
              <span className="accent">glasses@daniskills</span>
            </code>
          </pre>
        </div>
      </section>

      <section className="closing shell">
        <div>
          <p className="section-label">Glasses v1.1.0</p>
          <h2>Write less machinery. Keep what matters.</h2>
        </div>
        <a
          className="button button-primary"
          href="https://github.com/DanielGouveiah/glasses"
        >
          Explore on GitHub
          <ArrowIcon />
        </a>
      </section>

      <footer className="footer shell">
        <a className="wordmark" href="#top">
          <Image
            className="wordmark-icon"
            src="/glasses-icon.svg"
            alt=""
            width={30}
            height={30}
          />
          Glasses
        </a>
        <p>Evidence-first workflows for AI coding agents.</p>
        <p>By Daniel Barbosa · MIT License</p>
      </footer>
    </main>
  );
}
