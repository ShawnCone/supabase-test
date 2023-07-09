import { useState } from "react";
import "./App.css";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PROJECT_ANON_KEY
);

const phoneNumber = ""; // Change to your phone number, or other authentication method

supabase.auth.onAuthStateChange(async (event, session) => {
  console.log({ event, session });
  if (event === "TOKEN_REFRESHED") {
    console.log("Token is refreshed! trying to get users data...");
    const { data, error } = await supabase.from("users").select("*"); // Change users to your table
    console.log({ data, error });
  }
});

function App() {
  const [otpValue, setOtpValue] = useState("");

  async function handleSendOtp() {
    const { error } = await supabase.auth.signInWithOtp({
      phone: phoneNumber,
      options: {
        //   channel: "whatsapp",
        channel: "sms",
      },
    });
    if (error) {
      console.error(error);
    }
  }

  async function handleVerifyOtp() {
    const { error } = await supabase.auth.verifyOtp({
      phone: phoneNumber,
      token: otpValue,
      type: "sms",
    });

    if (error !== null) {
      console.error(error);
    }
  }

  return (
    <>
      <h2>Test login supabase</h2>
      <button
        onClick={() => {
          handleSendOtp();
        }}
      >
        Send OTP
      </button>
      <div>
        <input
          value={otpValue}
          onChange={(e) => setOtpValue(e.currentTarget.value)}
        />
        <button
          onClick={() => {
            handleVerifyOtp();
          }}
        >
          Verify
        </button>
      </div>
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
