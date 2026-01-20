import { useEffect, useState } from "react";
import { PinModal } from "./PinModal";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Schedule data - same as in App.tsx (will be moved to shared location later)
const schedule = [
  { month: "Feb", day: 21, year: 2026, title: "Vision & Invitation", description: "The year begins. Dream about what 2026 could be.", category: "Kickoff", valueId: null },
  { month: "Mar", day: 21, year: 2026, title: "Intimacy", description: "I have a personal connection to the Lord", category: "Foundations", valueId: "intimacy" },
  { month: "Apr", day: 18, year: 2026, title: "Identity", description: "I know what the Father says about me", category: "Foundations", valueId: "identity" },
  { month: "May", day: 16, year: 2026, title: "Integrity", description: "I live with integrity no matter the cost", category: "Foundations", valueId: "integrity" },
  { month: "Jun", day: 13, year: 2026, title: "Husband", description: "Sacrificial Love", category: "Leadership", valueId: "husband" },
  { month: "Jul", day: 18, year: 2026, title: "Father", description: "Inheritance", category: "Leadership", valueId: "father" },
  { month: "Aug", day: 15, year: 2026, title: "Worker", description: "Avodah & Shamar", category: "Leadership", valueId: "worker" },
  { month: "Sep", day: 19, year: 2026, title: "Member", description: "Compassion", category: "Leadership", valueId: "member" },
  { month: "Oct", day: 17, year: 2026, title: "Growing", description: "Language of Invitation", category: "Alignment", valueId: "growing" },
  { month: "Nov", day: 14, year: 2026, title: "Fruitful", description: "Fruit that lasts", category: "Alignment", valueId: "fruitful" },
  { month: "Dec", day: 12, year: 2026, title: "On Earth as in Heaven", description: "The ultimate aim", category: "Inheritance", valueId: "heaven" },
];

export function Admin() {
  const [pin, setPin] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string>("");
  const [verifying, setVerifying] = useState(false);

  // Load saved PIN from localStorage
  useEffect(() => {
    const savedPin = localStorage.getItem("admin_pin");
    const savedAt = localStorage.getItem("admin_pin_saved_at");

    if (savedPin && savedAt) {
      const thirtyDays = 30 * 24 * 60 * 60 * 1000;
      const isExpired = Date.now() - parseInt(savedAt, 10) > thirtyDays;

      if (isExpired) {
        localStorage.removeItem("admin_pin");
        localStorage.removeItem("admin_pin_saved_at");
      } else {
        // Verify the saved PIN is still valid
        verifyPin(savedPin);
      }
    }
  }, []);

  const verifyPin = async (enteredPin: string) => {
    setVerifying(true);
    setAuthError("");

    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: {
          "x-admin-pin": enteredPin,
        },
      });

      if (res.ok) {
        setPin(enteredPin);
        localStorage.setItem("admin_pin", enteredPin);
        localStorage.setItem("admin_pin_saved_at", Date.now().toString());
      } else {
        setAuthError("Invalid PIN");
        localStorage.removeItem("admin_pin");
        localStorage.removeItem("admin_pin_saved_at");
      }
    } catch {
      setAuthError("Failed to verify PIN");
    } finally {
      setVerifying(false);
    }
  };

  const handlePinSubmit = (enteredPin: string) => {
    verifyPin(enteredPin);
  };

  const handleLogout = () => {
    setPin(null);
    localStorage.removeItem("admin_pin");
    localStorage.removeItem("admin_pin_saved_at");
  };

  // Show PIN modal if not authenticated
  if (!pin) {
    if (verifying) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-zinc-400">Verifying...</div>
        </div>
      );
    }
    return <PinModal onSuccess={handlePinSubmit} error={authError} />;
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Site
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-zinc-500 text-sm">Admin</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-zinc-700 text-zinc-400 hover:text-white"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Manage Schedule</h1>

        {/* Schedule List */}
        <div className="space-y-4">
          {schedule.map((item, index) => (
            <div
              key={index}
              className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-6">
                <div className="text-center w-16">
                  <div className="text-xs uppercase tracking-wide text-zinc-500">
                    {item.month}
                  </div>
                  <div className="text-2xl font-bold text-white">{item.day}</div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="text-zinc-400 text-sm">{item.description}</p>
                  <span className="text-xs uppercase tracking-wide text-blue-500 mt-1 inline-block">
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-zinc-700 text-zinc-400 hover:text-white"
                  disabled
                >
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon */}
        <div className="mt-12 p-6 bg-zinc-900/50 border border-zinc-800 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Coming Soon</h2>
          <p className="text-zinc-400">
            Editing schedule items, managing values, and ICS calendar generation.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Admin;
