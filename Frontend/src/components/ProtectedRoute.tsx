import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [valid, setValid] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setValid(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:8080/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setValid(res.status === 200);
      } catch {
        setValid(false);
      }
    };

    checkAuth();
  }, []);

  if (valid === null) return <div>Checking authentication...</div>;

  if (!valid) return <Navigate to="/auth" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;