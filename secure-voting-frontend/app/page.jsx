import Link from "next/link";
import "./homepage.css";

export default function HomePage() {
  return (
    <>
      <div className="hero-section">

        <h1 className="logo">
          Election Voting
        </h1>

        <div className="hero-content">

          <h1 className="hero-title">
            Blockchain based Secure E-Voting
            with Homomorphic Encryption
          </h1>

          <h3 className="hero-subtitle">
            Make your vote count!
          </h3>

          <div className="login-grid">

            <div className="login-card">
              <h4>
                Register / Sign in for Company
              </h4>

              <Link
                href="/login/company"
                className="primary-btn"
              >
                Company
              </Link>
            </div>

            <div className="login-card">
              <h4>
                Sign in for Candidates
              </h4>

              <Link
                href="/login/candidate"
                className="primary-btn"
              >
                Candidate
              </Link>
            </div>

            <div className="login-card">
              <h4>
                Sign in for Voters
              </h4>

              <Link
                href="/login/voter"
                className="primary-btn"
              >
                Voter
              </Link>
            </div>

          </div>

        </div>

      </div>

      <section className="features">

        <div className="feature-column">

          <h2>Private</h2>

          <p>
            Doesn't give any information
            regarding personal data.
          </p>

          <h2>Secure</h2>

          <p>
            No single point of failure
            in the voting system.
          </p>

        </div>

        <div className="feature-image">

          <img
            src="/ether2.png"
            alt="Ethereum"
          />

        </div>

        <div className="feature-column">

          <h2>Decentralized</h2>

          <p>
            Blockchain technology distributes
            trust across the network.
          </p>

          <h2>Immutable</h2>

          <p>
            Votes cannot be modified
            after submission.
          </p>

        </div>

      </section>

      <section className="quote-section">

        <h2>
          A Fascinating Quote
        </h2>

        <p>
          "We have elected to put our money and faith in a
          mathematical framework that is free of politics
          and human error."
        </p>

        <h3>
          Tyler Winklevoss
        </h3>

      </section>
    </>
  );
}