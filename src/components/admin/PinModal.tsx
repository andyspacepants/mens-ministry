import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PinModalProps {
  onSuccess: (pin: string) => void;
  error?: string;
}

export function PinModal({ onSuccess, error: externalError }: PinModalProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) {
      setError("Please enter a PIN");
      return;
    }
    onSuccess(pin);
  };

  const displayError = externalError || error;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-zinc-900 p-8 rounded-lg max-w-md w-full mx-4 border border-zinc-800">
        <h2 className="text-2xl font-semibold text-white mb-6">Admin Access</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="pin" className="block mb-2 text-zinc-300">
              Enter PIN
            </label>
            <Input
              id="pin"
              type="password"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError("");
              }}
              placeholder="*****"
              autoFocus
              className="bg-zinc-800 border-zinc-700 text-white"
            />
            {displayError && (
              <p className="mt-2 text-sm text-red-400">{displayError}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Enter
          </Button>
        </form>
      </div>
    </div>
  );
}
