import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (isLogin) {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find(
        (u: { username: string; password: string }) =>
          u.username === username && u.password === password
      );
      if (!user) {
        setError("Invalid username or password");
        return;
      }
      localStorage.setItem("currentUser", JSON.stringify(user));
      navigate("/");
    } else {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      if (password.length < 4) {
        setError("Password must be at least 4 characters");
        return;
      }
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      if (users.some((u: { username: string }) => u.username === username)) {
        setError("Username already exists");
        return;
      }
      const newUser = { username, password };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      navigate("/");
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
            <label className="text-sm font-semibold text-foreground mb-1 block">Username</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="bg-search-bg border-border"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-foreground mb-1 block">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="bg-search-bg border-border"
            />
          </div>
          {!isLogin && (
            <div>
              <label className="text-sm font-semibold text-foreground mb-1 block">Confirm Password</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="bg-search-bg border-border"
              />
            </div>
          )}

          {error && <p className="text-sm text-destructive font-medium">{error}</p>}

          <Button type="submit" className="w-full h-12 text-base font-bold rounded-xl">
            {isLogin ? "Sign In" : "Create Account"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => { setIsLogin(!isLogin); setError(""); }}
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
