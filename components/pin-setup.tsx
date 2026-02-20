"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

export function PinSetup() {
  const [pin, setPin] = useState(["", "", "", ""]);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Move to next input
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 4);
    if (!/^\d+$/.test(pastedData)) return;

    const newPin = [...pin];
    for (let i = 0; i < pastedData.length && i < 4; i++) {
      newPin[i] = pastedData[i];
    }
    setPin(newPin);

    const nextIndex = Math.min(pastedData.length, 3);
    inputRefs[nextIndex].current?.focus();
  };

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center p-8">
      <div className="flex w-full max-w-md flex-col items-center text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#1d9bf0]/10">
          <Lock className="h-10 w-10 text-[#1d9bf0]" />
        </div>
        <h2 className="mb-3 text-2xl font-bold">Secure your messages</h2>
        <p className="mb-8 text-muted-foreground">
          Set up a 4-digit PIN to protect your private conversations. This adds
          an extra layer of security to your messages.
        </p>

        <div className="mb-8 flex gap-4">
          {pin.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="h-16 w-16 rounded-lg border-2 border-border bg-background text-center text-2xl font-bold outline-none transition-colors focus:border-[#1d9bf0]"
            />
          ))}
        </div>

        <Button
          className="w-full rounded-full bg-[#1d9bf0] px-6 py-6 font-bold text-white hover:bg-[#1a8cd8]"
          disabled={pin.some((digit) => !digit)}
        >
          Continue
        </Button>
        <button className="mt-4 text-sm text-muted-foreground hover:underline">
          Skip for now
        </button>
      </div>
    </div>
  );
}
