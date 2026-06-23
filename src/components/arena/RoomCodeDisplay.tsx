// src/components/arena/RoomCodeDisplay.tsx
"use client";

import { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";
import QRCode from "qrcode";

interface Props {
  code: string;
  joinUrl: string;
}

export default function RoomCodeDisplay({ code, joinUrl }: Props) {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    QRCode.toDataURL(joinUrl, {
      width: 180,
      margin: 2,
      color: { dark: "#00E5FF", light: "#060B19" },
    }).then(setQrDataUrl);
  }, [joinUrl]);

  function handleCopy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="room-code-display glass-card-cyan">
      {/* QR Code */}
      <div className="room-qr-wrap">
        {qrDataUrl ? (
          <img src={qrDataUrl} alt="Join QR code" className="room-qr-img" />
        ) : (
          <div className="room-qr-placeholder" />
        )}
      </div>

      <div className="room-code-right">
        <p className="room-code-label">Join Code</p>
        <div className="room-code-value-row">
          <span className="room-code-value">{code}</span>
          <button className="room-code-copy-btn" onClick={handleCopy}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
        <p className="room-code-url">{joinUrl}</p>
        <p className="room-code-hint">
          Share this code or scan the QR to join
        </p>
      </div>
    </div>
  );
}