import React, { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const togglePass = () => setShowPass(!showPass);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          password: pass,
        }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        localStorage.setItem("is_admin", "true");
        window.location.href = "/create-blog";
      } else {
        alert(result.message || "Unauthorized");
      }
    } catch (err) {
      console.error("Connection failed", err);
      alert("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center w-full h-screen">
      <form onSubmit={handleLogin} className="flex flex-col items-center w-full">
        <h1 className="font-dogica text-2xl font-bold text-accent uppercase">Login</h1>
        
        <input
          type="text"
          placeholder="type username..."
          value={username} 
          onChange={(e) => setUsername(e.target.value)}
          className="font-plex text-white px-4 py-2 border border-accent/50 rounded-xl mt-10 w-1/4 bg-white/10 outline-none focus:border-accent transition-all"
        />

        <div className="relative w-1/4 mt-4">
          <input
            type={showPass ? "text" : "password"}
            placeholder="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)} 
            className="font-plex text-white px-4 py-2 pr-12 border border-accent/50 rounded-xl w-full bg-white/10 outline-none focus:border-accent transition-all"
          />
          <button
            type="button"
            onClick={togglePass}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-accent/70 hover:text-accent transition-colors"
          >
            <i className={`fa-solid ${showPass ? 'fa-eye-slash' : 'fa-eye'}`}></i>
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="font-plex bg-accent-secondary w-1/4 mt-4 px-4 py-2 rounded-xl text-white font-semibold hover:bg-accent hover:text-bg hover:cursor-pointer disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Submit"}
        </button>
      </form>
    </section>
  );
}