"use client";

export default function LoginForm({ onSignIn }) {
  return (
    <div id="tab-login" className="auth-form">
      <h3>Welcome back!</h3>
      <p className="subtitle">Sign in to continue your travel journey</p>
      <div className="form-group">
        <label>Email Address</label>
        <input type="email" placeholder="you@example.com" />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input type="password" placeholder="Enter password" />
      </div>
      <div className="forgot-link">Forgot password?</div>
      <button className="btn-teal" onClick={onSignIn}>
        Sign In
      </button>
      <div className="auth-divider">or continue with</div>
      <div className="social-btns">
        <button type="button" className="social-btn"> Google</button>
        <button type="button" className="social-btn"> Apple</button>
        <button type="button" className="social-btn"> Facebook</button>
      </div>
    </div>
  );
}
