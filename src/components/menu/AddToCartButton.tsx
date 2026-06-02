"use client";

import { useEffect, useState } from "react";
import type { MenuItem } from "@/types";
import { useCart } from "@/lib/cart";

export function AddToCartButton({ item }: { item: MenuItem }) {
  const { add } = useCart();
  const [open, setOpen] = useState(false);
  const [selectedMods, setSelectedMods] = useState<Set<string>>(new Set());
  const [note, setNote] = useState("");
  const [confirmation, setConfirmation] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open]);

  if (item.comingSoon) {
    return (
      <button
        disabled
        className="w-full bg-(--bg) text-(--text-muted) text-sm font-medium px-4 py-3 rounded-lg cursor-not-allowed border border-(--color-line)"
      >
        Coming soon
      </button>
    );
  }

  const modifierTotal = (item.modifiers ?? [])
    .filter((m) => selectedMods.has(m.id))
    .reduce((s, m) => s + (m.price ?? 0), 0);
  const total = item.price + modifierTotal;

  function toggleMod(id: string) {
    setSelectedMods((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleAdd() {
    add({
      itemId: item.id,
      qty: 1,
      modifierIds: Array.from(selectedMods),
      note: note.trim() || undefined,
    });
    setConfirmation(`Added · $${total.toFixed(2)}`);
    setTimeout(() => {
      setOpen(false);
      setConfirmation(null);
      setSelectedMods(new Set());
      setNote("");
    }, 900);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full bg-(--russet) hover:bg-(--russet-deep) text-(--text) text-sm font-semibold tracking-wide uppercase px-4 py-3 rounded-lg transition-colors"
      >
        Add · ${item.price}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-(--bg-raised) w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl border border-(--color-line) overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 sm:p-7">
              <div className="flex items-start justify-between gap-3 mb-1">
                <h3 className="font-serif text-2xl text-(--text)">{item.name}</h3>
                <button
                  onClick={() => setOpen(false)}
                  className="text-(--text-muted) hover:text-(--text) text-2xl leading-none -mt-1"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
              <p className="text-(--text-soft) text-sm mb-6">{item.description}</p>

              {item.modifiers && item.modifiers.length > 0 && (
                <div className="mb-6">
                  <div className="text-xs uppercase tracking-[0.18em] font-semibold text-(--amber) mb-3">
                    Customize
                  </div>
                  <div className="space-y-2">
                    {item.modifiers.map((mod) => {
                      const checked = selectedMods.has(mod.id);
                      return (
                        <label
                          key={mod.id}
                          className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-colors ${
                            checked
                              ? "border-(--amber)/50 bg-(--amber)/10"
                              : "border-(--color-line) bg-(--bg-card) hover:bg-(--bg-card-hover)"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleMod(mod.id)}
                              className="accent-(--amber)"
                            />
                            <span className="text-sm">{mod.name}</span>
                          </div>
                          {mod.price ? (
                            <span className="text-(--amber) text-sm font-medium">
                              +${mod.price.toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-(--text-muted) text-xs">no charge</span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <div className="text-xs uppercase tracking-[0.18em] font-semibold text-(--amber) mb-2">
                  Notes (optional)
                </div>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Allergies, special instructions…"
                  className="w-full px-4 py-3 bg-(--bg-card) border border-(--color-line) rounded-lg text-sm text-(--text) placeholder:text-(--text-muted) focus:border-(--amber) outline-hidden resize-none"
                  rows={2}
                />
              </div>

              <button
                onClick={handleAdd}
                className="w-full bg-(--russet) hover:bg-(--russet-deep) text-(--text) text-sm font-semibold tracking-wide uppercase py-4 rounded-lg transition-colors"
              >
                {confirmation ?? `Add to cart · $${total.toFixed(2)}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
