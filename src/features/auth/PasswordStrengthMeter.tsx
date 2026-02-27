"use client";

interface PasswordStrengthMeterProps {
  password: string;
}

interface PasswordCriteria {
  length: boolean;
  longLength: boolean;
  uppercase: boolean;
  lowercase: boolean;
  special: boolean;
  digit: boolean;
}

type Strength = "faible" | "moyen" | "fort";

function evaluateCriteria(password: string): PasswordCriteria {
  return {
    length: password.length >= 8,
    longLength: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    special: /[#&%*!@$^()_\-+=]/.test(password),
    digit: /[0-9]/.test(password),
  };
}

function evaluateStrength(
  _password: string,
  criteria: PasswordCriteria
): Strength {
  const score = Object.values(criteria).filter(Boolean).length;
  if (score <= 2) return "faible";
  if (score === 6) return "fort";
  return "moyen";
}

const strengthConfig: Record<
  Strength,
  { bars: number; color: string; label: string; message: string }
> = {
  faible: {
    bars: 1,
    color: "#F14662",
    label: "Faible",
    message: "Ce mot de passe est trop facile à deviner.",
  },
  moyen: {
    bars: 2,
    color: "#F4922B",
    label: "Moyen",
    message:
      "Vous pouvez augmenter la sécurité de ce mot de passe avec plus de 12 caractères.",
  },
  fort: {
    bars: 3,
    color: "#0B8A4D",
    label: "Fort",
    message: "Ce mot de passe est excellent ! Vous pouvez continuer.",
  },
};

const criteriaLabels = [
  { key: "length" as const, label: "8 caractères" },
  { key: "longLength" as const, label: "12 caractères" },
  { key: "uppercase" as const, label: "1 lettre majuscule" },
  { key: "lowercase" as const, label: "1 lettre minuscule" },
  { key: "special" as const, label: "1 caractère spécial (#&%*#...)" },
  { key: "digit" as const, label: "1 chiffre" },
];

export default function PasswordStrengthMeter({
  password,
}: PasswordStrengthMeterProps) {
  const criteria = evaluateCriteria(password);
  const strength = evaluateStrength(password, criteria);
  const config = strengthConfig[strength];

  if (!password) return null;

  return (
    <div className="flex flex-col gap-[2px] w-full" data-testid="password-strength">
      {/* Segmented bar */}
      <div className="flex gap-[10px] w-full" data-testid="strength-bar">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex-1 h-1 rounded-full"
            style={{
              backgroundColor:
                i < config.bars ? config.color : "#e1e1e0",
            }}
          />
        ))}
      </div>

      {/* Label */}
      <p
        className="text-sm font-bold leading-5"
        style={{ color: config.color }}
        data-testid="strength-label"
      >
        {config.label}
      </p>

      {/* Message */}
      <p className="text-sm text-content-secondary leading-5">
        {config.message}
      </p>

      {/* Checklist */}
      <p className="text-sm text-content-secondary leading-5 mt-1">
        Il doit contenir au moins :
      </p>
      <div className="flex flex-col gap-[2px]" data-testid="criteria-list">
        {criteriaLabels.map(({ key, label }) => (
          <div key={key} className="flex items-center gap-1" data-testid={`criteria-${key}`}>
            {criteria[key] ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 1.333A6.667 6.667 0 1 0 14.667 8 6.674 6.674 0 0 0 8 1.333Zm-1.333 9.61L3.724 8.001l.942-.943 1.999 2 4.667-4.667.943.943-5.608 5.609Z"
                  fill="#0B8A4D"
                />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 1.333A6.667 6.667 0 1 0 14.667 8 6.674 6.674 0 0 0 8 1.333Zm3.333 8.39-.943.944L8 8.277l-2.39 2.39-.943-.943L7.057 7.333l-2.39-2.39.943-.943L8 6.39l2.39-2.39.943.943-2.39 2.39 2.39 2.39Z"
                  fill="#F14662"
                />
              </svg>
            )}
            <span
              className="text-sm text-content-secondary leading-5"
              style={{ fontWeight: criteria[key] ? 400 : 600 }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export { evaluateCriteria, evaluateStrength };
export type { Strength };
