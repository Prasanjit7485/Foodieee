import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // ── LOGIN ──────────────────────────────────────────────────────────
        const res = await axios.post("http://localhost:8080/auth/login", {
          username,
          password,
        });

        if (res.status === 200) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("userId", res.data.userId);

          // Show welcome toast before navigating
          toast({
            title: `Welcome back, ${username}! 👋`,
            description: "You've signed in successfully.",
          });

          navigate("/");
        }
      } else {
        // ── REGISTER ───────────────────────────────────────────────────────

        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }

        if (password.length < 4) {
          setError("Password must be at least 4 characters");
          setLoading(false);
          return;
        }

        // Check if username is already taken
        // Backend returns 200 + true if taken, 404 if free
        let usernameTaken = false;
        try {
          const existRes = await axios.get(
            `http://localhost:8080/api/userExist/${username.trim()}`
          );
          // 200 response — check the body
          usernameTaken = existRes.data === true || existRes.data === "true";
        } catch (existErr: any) {
          if (existErr?.response?.status === 404) {
            // 404 means user does NOT exist — username is free, continue
            usernameTaken = false;
          } else {
            // Unexpected error hitting /userExist
            setError("Could not verify username. Please try again.");
            setLoading(false);
            return;
          }
        }

        if (usernameTaken) {
          setError("Username already exists. Try a different one.");
          setLoading(false);
          return;
        }

        // Username is free — proceed with registration
        await axios.post("http://localhost:8080/api/user-register", {
          username,
          password,
          roles: "USER",
        });

        toast({
          title: "Account created!",
          description: "You can now sign in with your new account.",
        });

        // Switch to login and prefill username
        setIsLogin(true);
        setPassword("");
        setConfirmPassword("");
      }
    } catch (err: any) {
      // Handle 404 / specific HTTP errors from /userExist or login
      if (err?.response?.status === 404) {
        // /userExist returned 404 → username is free, but treat unexpected 404s safely
        setError("Something went wrong. Please try again.");
      } else if (!isLogin) {
        setError("Registration failed. Please try again.");
      } else {
        setError("Invalid username or password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center mb-3">
            <UtensilsCrossed className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-extrabold text-foreground">FoodieApp</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isLogin ? "Welcome back! Sign in to continue" : "Create a new account"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="text-sm font-semibold text-foreground mb-1 block">
              Username
            </label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="bg-search-bg border-border"
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground mb-1 block">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="bg-search-bg border-border"
              disabled={loading}
            />
          </div>

          {!isLogin && (
            <div>
              <label className="text-sm font-semibold text-foreground mb-1 block">
                Confirm Password
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="bg-search-bg border-border"
                disabled={loading}
              />
            </div>
          )}

          {error && (
            <p className="text-sm text-destructive font-medium">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 text-base font-bold rounded-xl"
          >
            {loading
              ? isLogin ? "Signing in…" : "Creating account…"
              : isLogin ? "Sign In" : "Create Account"}
          </Button>
        </form>

        {/* Switch Login / Register */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setPassword("");
              setConfirmPassword("");
            }}
            className="text-primary font-bold hover:underline"
          >
            {isLogin ? "Register" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;