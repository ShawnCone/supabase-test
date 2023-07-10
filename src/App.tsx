import { useEffect } from "react";
import "./App.css";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PROJECT_ANON_KEY
);

function App() {
  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({
      email: "test@test.com",
      password: "123123123",
    });
    if (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const ret = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log({ event, session });

      if (session === null) {
        return;
      }

      const { data, error } = await supabase.from("test").select();
      console.log({ data, error });
    });

    return () => ret.data.subscription.unsubscribe();
  }, []);

  return (
    <>
      <h2>Test login supabase</h2>
      <button
        onClick={() => {
          handleLogin();
        }}
      >
        Login
      </button>
      <button
        onClick={() => {
          supabase.auth.signOut();
        }}
      >
        Sign out
      </button>
    </>
  );
}

export default App;
