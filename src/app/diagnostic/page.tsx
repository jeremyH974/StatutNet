'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Question {
  text: string;
  options: [string, string, string];
}

const QUESTIONS: Question[] = [
  {
    text: 'Quel est votre CA annuel prévu ?',
    options: ['Moins de 30 000 €', 'Entre 30 000 € et 80 000 €', 'Plus de 80 000 €'],
  },
  {
    text: 'Avez-vous des charges professionnelles importantes ?',
    options: ['Moins de 5 % du CA', 'Entre 5 % et 20 % du CA', 'Plus de 20 % du CA'],
  },
  {
    text: 'La protection sociale est-elle prioritaire pour vous ?',
    options: ['Pas important', 'Moyennement important', 'Essentiel'],
  },
  {
    text: 'Souhaitez-vous optimiser via des dividendes ?',
    options: ['Non', 'Peut-être', 'Oui, absolument'],
  },
  {
    text: 'Quel niveau de complexité administrative acceptez-vous ?',
    options: ['Minimum absolu', 'Modéré', 'Pas de problème'],
  },
  {
    text: "Prévoyez-vous d'embaucher dans les 2 ans ?",
    options: ['Non', 'Peut-être', 'Oui'],
  },
  {
    text: 'Avez-vous besoin de crédibilité auprès de grands comptes ?',
    options: ['Non', 'Un peu', 'Oui, c\'est essentiel'],
  },
  {
    text: 'Votre activité est-elle en forte croissance ?',
    options: ['Stable', 'Croissance modérée', 'Forte croissance'],
  },
  {
    text: 'Souhaitez-vous lever des fonds ?',
    options: ['Non', 'Peut-être', 'Oui'],
  },
  {
    text: 'Quel est votre rapport au risque administratif et fiscal ?',
    options: ['Prudent', 'Modéré', 'Aventurier'],
  },
];

interface Scores {
  micro: number;
  eurl: number;
  sasu: number;
}

function computeScores(answers: number[]): Scores {
  const scores: Scores = { micro: 0, eurl: 0, sasu: 0 };

  for (const answer of answers) {
    if (answer === 0) {
      scores.micro += 2;
      scores.eurl += 1;
    } else if (answer === 1) {
      scores.micro += 1;
      scores.eurl += 1;
      scores.sasu += 1;
    } else {
      scores.sasu += 2;
      scores.eurl += 1;
    }
  }

  return scores;
}

function getRecommendation(scores: Scores) {
  const max = Math.max(scores.micro, scores.eurl, scores.sasu);
  if (max === scores.sasu) return 'sasu';
  if (max === scores.eurl) return 'eurl';
  return 'micro';
}

const STATUS_INFO: Record<string, { label: string; description: string }> = {
  micro: {
    label: 'Micro-entreprise',
    description:
      'Votre profil correspond à une activité simple avec un chiffre d\'affaires modéré. La micro-entreprise vous offre la simplicité administrative maximale avec des charges forfaitaires prévisibles.',
  },
  eurl: {
    label: 'EURL à l\'IS',
    description:
      'Votre profil suggère un besoin d\'équilibre entre simplicité et optimisation. L\'EURL vous permet de déduire vos charges réelles et d\'optimiser votre rémunération tout en gardant une structure accessible.',
  },
  sasu: {
    label: 'SASU à l\'IS',
    description:
      'Votre profil indique des ambitions de croissance et un besoin de crédibilité. La SASU offre la meilleure protection sociale dirigeant, la possibilité de lever des fonds et une image professionnelle forte.',
  },
};

function ScoreBar({ label, score, maxScore }: { label: string; score: number; maxScore: number }) {
  const pct = Math.round((score / maxScore) * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-muted">{score} pts</span>
      </div>
      <div className="h-3 rounded-full bg-background overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function DiagnosticPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const progress = showResult
    ? 100
    : Math.round((currentIndex / QUESTIONS.length) * 100);

  function handleAnswer(optionIndex: number) {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    if (currentIndex + 1 >= QUESTIONS.length) {
      setShowResult(true);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  }

  function handleRestart() {
    setCurrentIndex(0);
    setAnswers([]);
    setShowResult(false);
  }

  const scores = showResult ? computeScores(answers) : null;
  const recommendation = scores ? getRecommendation(scores) : null;
  const maxScore = scores
    ? Math.max(scores.micro, scores.eurl, scores.sasu, 1)
    : 1;

  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground text-center">
          Diagnostic statut juridique
        </h1>
        <p className="mt-3 text-muted text-center">
          Répondez à 10 questions pour découvrir le statut le plus adapté à
          votre situation.
        </p>

        {/* Progress bar */}
        <div className="mt-8 h-2 rounded-full bg-background overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-muted text-right">
          {showResult
            ? 'Terminé'
            : `Question ${currentIndex + 1} sur ${QUESTIONS.length}`}
        </p>

        {/* Question card */}
        {!showResult && (
          <div
            key={currentIndex}
            className="mt-8 rounded-2xl border border-border bg-surface p-6 sm:p-8"
            style={{ animation: 'fadeSlideIn 0.3s ease-out' }}
          >
            <h2 className="text-lg font-semibold text-foreground">
              {QUESTIONS[currentIndex].text}
            </h2>

            <div className="mt-6 space-y-3">
              {QUESTIONS[currentIndex].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-left text-sm text-foreground transition-colors hover:border-primary hover:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Result card */}
        {showResult && scores && recommendation && (
          <div
            className="mt-8 rounded-2xl border border-border bg-surface p-6 sm:p-8"
            style={{ animation: 'fadeSlideIn 0.4s ease-out' }}
          >
            <p className="text-sm font-medium text-success uppercase tracking-wide">
              Statut recommandé
            </p>
            <h2 className="mt-2 text-2xl font-bold text-foreground">
              {STATUS_INFO[recommendation].label}
            </h2>
            <p className="mt-3 text-muted leading-relaxed">
              {STATUS_INFO[recommendation].description}
            </p>

            <div className="mt-8 space-y-4">
              <ScoreBar label="Micro-entreprise" score={scores.micro} maxScore={maxScore} />
              <ScoreBar label="EURL à l'IS" score={scores.eurl} maxScore={maxScore} />
              <ScoreBar label="SASU à l'IS" score={scores.sasu} maxScore={maxScore} />
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/simulateur"
                className="flex-1 rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:opacity-90"
              >
                Simuler avec vos chiffres
              </Link>
              <button
                onClick={handleRestart}
                className="flex-1 rounded-lg border border-border px-4 py-3 text-center text-sm font-medium text-foreground transition-colors hover:bg-background"
              >
                Recommencer le diagnostic
              </button>
            </div>
          </div>
        )}

        {/* Back link */}
        <div className="mt-10 text-center">
          <Link
            href="/simulateur"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M10 2L4 8l6 6" />
            </svg>
            Retour au simulateur
          </Link>
        </div>
      </div>

      {/* Inline keyframes for the fade-slide animation */}
      <style>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
