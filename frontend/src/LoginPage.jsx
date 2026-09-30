import { useState } from "react";
import "./App.css";

function App() {
  const [page, setPage] = useState("home");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [student, setStudent] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    event: "",
  });

  const [employee, setEmployee] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    password: "",
    event: "",
  });

  const handleLogin = (e) => {
    e.preventDefault();
    alert("Login successful!");
  };

  const handleStudent = (e) => {
    e.preventDefault();
    alert("Student registration successful!");
  };

  const handleEmployee = (e) => {
    e.preventDefault();
    alert("Employee registration successful!");
  };

  return (
    <main className="login-page">

      {/* ================= HOME ================= */}
      {page === "home" && (
        <>
          <section className="brand-section">
            <div className="brand-mark">E</div>

            <h1>EventSphere</h1>

            <p>Event management made simple.</p>

            <div className="brand-line"></div>

            <span>
              Discover events. Register. Connect.
            </span>
          </section>

          <section className="login-card">

            <div className="card-header">
              <span className="eyebrow">
                Welcome
              </span>

              <h2>Welcome to EventSphere</h2>

              <p>
                Login or create an account to continue.
              </p>
            </div>

            <button
              className="primary-button"
              onClick={() => setPage("login")}
            >
              Sign in
            </button>

            <button
              className="secondary-button"
              onClick={() => setPage("signup")}
            >
              Create new account
            </button>

          </section>
        </>
      )}


      {/* ================= LOGIN ================= */}
      {page === "login" && (
        <section className="login-card">

          <button
            className="back-button"
            onClick={() => setPage("home")}
          >
            ← Back
          </button>

          <div className="card-header">

            <span className="eyebrow">
              Welcome back
            </span>

            <h2>Sign in to EventSphere</h2>

            <p>
              Enter your details to continue.
            </p>

          </div>

          <form onSubmit={handleLogin}>

            <div className="input-group">

              <label>Email address</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

            </div>

            <div className="input-group">

              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

            </div>

            <button
              type="submit"
              className="primary-button"
            >
              Sign in
            </button>

          </form>

          <div className="divider">
            <span>or</span>
          </div>

          <button
            className="secondary-button"
            onClick={() => setPage("signup")}
          >
            Create new account
          </button>

        </section>
      )}


      {/* ================= SIGN UP ================= */}
      {page === "signup" && (
        <section className="login-card">

          <button
            className="back-button"
            onClick={() => setPage("home")}
          >
            ← Back
          </button>

          <div className="card-header">

            <span className="eyebrow">
              Create account
            </span>

            <h2>Choose your account type</h2>

            <p>
              Select how you want to use EventSphere.
            </p>

          </div>

          <button
            className="primary-button"
            onClick={() => setPage("event-register")}
          >
            Event Register
          </button>

          <button
            className="secondary-button"
            onClick={() => setPage("event-host")}
          >
            Event Host
          </button>

        </section>
      )}


      {/* ================= EVENT REGISTER ================= */}
      {page === "event-register" && (
        <section className="login-card">

          <button
            className="back-button"
            onClick={() => setPage("signup")}
          >
            ← Back
          </button>

          <div className="card-header">

            <span className="eyebrow">
              Event Register
            </span>

            <h2>Who are you?</h2>

            <p>
              Select your registration category.
            </p>

          </div>

          <button
            className="primary-button"
            onClick={() => setPage("student")}
          >
            Student Registration
          </button>

          <button
            className="secondary-button"
            onClick={() => setPage("employee")}
          >
            Employee Registration
          </button>

        </section>
      )}


      {/* ================= STUDENT ================= */}
      {page === "student" && (
        <section className="login-card">

          <button
            className="back-button"
            onClick={() => setPage("event-register")}
          >
            ← Back
          </button>

          <div className="card-header">

            <span className="eyebrow">
              Student
            </span>

            <h2>Student Registration</h2>

            <p>
              Enter your details to register.
            </p>

          </div>

          <form onSubmit={handleStudent}>

            <div className="input-group">
              <label>Name</label>

              <input
                type="text"
                placeholder="Enter your name"
                value={student.name}
                onChange={(e) =>
                  setStudent({
                    ...student,
                    name: e.target.value
                  })
                }
                required
              />
            </div>

            <div className="input-group">
              <label>Email ID</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={student.email}
                onChange={(e) =>
                  setStudent({
                    ...student,
                    email: e.target.value
                  })
                }
                required
              />
            </div>

            <div className="input-group">
              <label>Phone Number</label>

              <input
                type="tel"
                placeholder="Enter phone number"
                value={student.phone}
                onChange={(e) =>
                  setStudent({
                    ...student,
                    phone: e.target.value
                  })
                }
                required
              />
            </div>

            <div className="input-group">
              <label>Registration Password</label>

              <input
                type="password"
                placeholder="Create password"
                value={student.password}
                onChange={(e) =>
                  setStudent({
                    ...student,
                    password: e.target.value
                  })
                }
                required
              />
            </div>

            <div className="input-group">
              <label>Event Name</label>

              <input
                type="text"
                placeholder="Enter event name"
                value={student.event}
                onChange={(e) =>
                  setStudent({
                    ...student,
                    event: e.target.value
                  })
                }
                required
              />
            </div>

            <button
              type="submit"
              className="primary-button"
            >
              Register Event
            </button>

          </form>

        </section>
      )}


      {/* ================= EMPLOYEE ================= */}
      {page === "employee" && (
        <section className="login-card">

          <button
            className="back-button"
            onClick={() => setPage("event-register")}
          >
            ← Back
          </button>

          <div className="card-header">

            <span className="eyebrow">
              Employee
            </span>

            <h2>Employee Registration</h2>

            <p>
              Enter your professional details.
            </p>

          </div>

          <form onSubmit={handleEmployee}>

            <div className="input-group">
              <label>Employee Name</label>

              <input
                type="text"
                placeholder="Enter employee name"
                value={employee.name}
                onChange={(e) =>
                  setEmployee({
                    ...employee,
                    name: e.target.value
                  })
                }
                required
              />
            </div>

            <div className="input-group">
              <label>Company Name</label>

              <input
                type="text"
                placeholder="Enter company name"
                value={employee.company}
                onChange={(e) =>
                  setEmployee({
                    ...employee,
                    company: e.target.value
                  })
                }
                required
              />
            </div>

            <div className="input-group">
              <label>Email ID</label>

              <input
                type="email"
                placeholder="Enter email"
                value={employee.email}
                onChange={(e) =>
                  setEmployee({
                    ...employee,
                    email: e.target.value
                  })
                }
                required
              />
            </div>

            <div className="input-group">
              <label>Phone Number</label>

              <input
                type="tel"
                placeholder="Enter phone number"
                value={employee.phone}
                onChange={(e) =>
                  setEmployee({
                    ...employee,
                    phone: e.target.value
                  })
                }
                required
              />
            </div>

            <div className="input-group">
              <label>Registration Password</label>

              <input
                type="password"
                placeholder="Create password"
                value={employee.password}
                onChange={(e) =>
                  setEmployee({
                    ...employee,
                    password: e.target.value
                  })
                }
                required
              />
            </div>

            <div className="input-group">
              <label>Event Name</label>

              <input
                type="text"
                placeholder="Enter event name"
                value={employee.event}
                onChange={(e) =>
                  setEmployee({
                    ...employee,
                    event: e.target.value
                  })
                }
                required
              />
            </div>

            <button
              type="submit"
              className="primary-button"
            >
              Register Event
            </button>

          </form>

        </section>
      )}


      {/* ================= EVENT HOST ================= */}
      {page === "event-host" && (
        <section className="login-card">

          <button
            className="back-button"
            onClick={() => setPage("signup")}
          >
            ← Back
          </button>

          <div className="card-header">

            <span className="eyebrow">
              Event Host
            </span>

            <h2>Host an Event</h2>

            <p>
              Create your EventSphere host account.
            </p>

          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Event Host registration successful!");
            }}
          >

            <div className="input-group">
              <label>Host Name</label>

              <input
                type="text"
                placeholder="Enter host name"
                required
              />
            </div>

            <div className="input-group">
              <label>Email ID</label>

              <input
                type="email"
                placeholder="Enter email"
                required
              />
            </div>

            <div className="input-group">
              <label>Phone Number</label>

              <input
                type="tel"
                placeholder="Enter phone number"
                required
              />
            </div>

            <div className="input-group">
              <label>Registration Password</label>

              <input
                type="password"
                placeholder="Create password"
                required
              />
            </div>

            <button
              type="submit"
              className="primary-button"
            >
              Create Host Account
            </button>

          </form>

        </section>
      )}

    </main>
  );
}

export default App;