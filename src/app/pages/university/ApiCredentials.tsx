import { useState } from "react";
import { Key, Copy, Eye, EyeOff, RefreshCw, CheckCircle, Shield } from "lucide-react";

export default function ApiCredentials() {
  const [showSecret, setShowSecret] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);

  const apiKey = "cc_live_pk_thammasat_7f8e9d2a3b4c5f6e7d8c9b0a1f2e3d4c";
  const apiSecret = "cc_live_sk_thammasat_1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p";

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleRegenerate = () => {
    setRegenerating(true);
    setTimeout(() => setRegenerating(false), 1500);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-foreground" style={{ fontSize: "1.75rem", fontWeight: 800 }}>API Credentials</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Use these credentials to integrate UniPath with your student information system.
        </p>
      </div>

      {/* Security notice */}
      <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 flex items-start gap-3">
        <Shield className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
        <div className="text-sm text-foreground">
          <strong className="font-black">Security Notice:</strong> Never share your Secret Key publicly. Store it securely in environment variables. If you suspect your credentials are compromised, regenerate them immediately.
        </div>
      </div>

      {/* Credentials */}
      <div className="bg-card rounded-2xl border border-border p-6 space-y-5">
        <h2 className="text-foreground" style={{ fontWeight: 700 }}>Your API Keys</h2>

        {/* API Key */}
        <div>
          <label className="text-sm text-foreground block mb-2" style={{ fontWeight: 500 }}>
            Public API Key
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-3 bg-muted border border-border rounded-xl px-4 py-3">
              <Key className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <code className="text-sm text-foreground font-mono flex-1 overflow-x-auto">{apiKey}</code>
            </div>
            <button
              onClick={() => copyToClipboard(apiKey, "key")}
              className={`p-2.5 rounded-xl border transition-all ${copied === "key" ? "border-success/30 bg-success/10 text-foreground" : "border-border text-muted-foreground hover:bg-muted"}`}
            >
              {copied === "key" ? <CheckCircle className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">Safe to include in client-side code and configuration files.</p>
        </div>

        {/* Secret Key */}
        <div>
          <label className="text-sm text-foreground block mb-2" style={{ fontWeight: 500 }}>
            Secret API Key
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-3 bg-muted border border-border rounded-xl px-4 py-3">
              <Key className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <code className="text-sm text-foreground font-mono flex-1 overflow-x-auto">
                {showSecret ? apiSecret : "••••••••••••••••••••••••••••••••"}
              </code>
              <button onClick={() => setShowSecret(!showSecret)} className="text-muted-foreground hover:text-foreground flex-shrink-0">
                {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <button
              onClick={() => copyToClipboard(apiSecret, "secret")}
              className={`p-2.5 rounded-xl border transition-all ${copied === "secret" ? "border-success/30 bg-success/10 text-foreground" : "border-border text-muted-foreground hover:bg-muted"}`}
            >
              {copied === "secret" ? <CheckCircle className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
            <Shield className="w-3 h-3 text-destructive" />
            Never expose this key publicly. Use server-side only.
          </p>
        </div>

        <div className="border-t border-border pt-4">
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="flex items-center gap-2 text-sm text-foreground border border-destructive/30 px-4 py-2.5 rounded-xl hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${regenerating ? "animate-spin" : ""}`} />
            {regenerating ? "Regenerating…" : "Regenerate keys"}
          </button>
          <p className="text-xs text-muted-foreground mt-2">Regenerating will invalidate your current keys immediately.</p>
        </div>
      </div>

      {/* Quick start */}
      <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
        <h2 className="text-foreground" style={{ fontWeight: 700 }}>Quick Start</h2>

        <div>
          <div className="text-sm text-foreground mb-2" style={{ fontWeight: 500 }}>1. Sync student enrollment</div>
          <div className="bg-[#0d1117] rounded-xl p-4 font-mono text-xs text-green-400 overflow-x-auto border border-border/50">
            <div className="text-[#6e7681] mb-1"># Push new enrollment</div>
            <div>curl -X POST https://api.careercompass.io/v1/sync \</div>
            <div className="ml-4">-H "Authorization: Bearer {"{"}API_SECRET{"}"}" \</div>
            <div className="ml-4">-H "Content-Type: application/json" \</div>
            <div className="ml-4">-d '{"{"}"students": [...], "semester": "2025-1"{"}"}'</div>
          </div>
        </div>

        <div>
          <div className="text-sm text-foreground mb-2" style={{ fontWeight: 500 }}>2. Fetch analytics</div>
          <div className="bg-[#0d1117] rounded-xl p-4 font-mono text-xs text-green-400 overflow-x-auto border border-border/50">
            <div className="text-[#6e7681] mb-1"># Get aggregated interest data</div>
            <div>curl https://api.careercompass.io/v1/analytics \</div>
            <div className="ml-4">-H "Authorization: Bearer {"{"}API_KEY{"}"}"</div>
          </div>
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm text-foreground">
          Full API documentation available at{" "}
          <a href="#" className="underline font-mono text-primary hover:text-primary/80">docs.careercompass.io</a>
        </div>
      </div>
    </div>
  );
}