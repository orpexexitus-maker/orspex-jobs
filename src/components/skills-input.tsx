"use client";

import { useState, KeyboardEvent } from "react";

export function SkillsInput({
  name = "skills",
  defaultValue = [],
}: {
  name?: string;
  defaultValue?: string[];
}) {
  const [skills, setSkills] = useState<string[]>(defaultValue);
  const [input, setInput] = useState("");

  function addSkill(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed) return;
    if (skills.includes(trimmed)) return;
    if (skills.length >= 20) return; // max 20 skills
    setSkills([...skills, trimmed]);
    setInput("");
  }

  function removeSkill(skill: string) {
    setSkills(skills.filter((s) => s !== skill));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(input);
    }
    if (e.key === "Backspace" && input === "" && skills.length > 0) {
      removeSkill(skills[skills.length - 1]);
    }
  }

  return (
    <div className="w-full border rounded px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-blue-500">
      <div className="flex flex-wrap gap-2 mb-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="text-blue-600 hover:text-blue-900 font-bold"
              aria-label={`Remove ${skill}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => addSkill(input)}
        placeholder={skills.length === 0 ? "Type a skill and press Enter (e.g. React)" : "Add another skill..."}
        className="w-full outline-none text-sm"
      />
      <input type="hidden" name={name} value={skills.join(",")} />
    </div>
  );
}