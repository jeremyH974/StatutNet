'use client';

import type { SimulationInputs, ActivityType } from '@/engine/types';
import { MICRO_PLAFONDS } from '@/engine/constants';
import { NumberInput } from '@/components/ui/NumberInput';
import { Slider } from '@/components/ui/Slider';
import { formatCurrency } from '@/lib/formatters';

interface SimulatorFormProps {
  inputs: SimulationInputs;
  updateInput: <K extends keyof SimulationInputs>(key: K, value: SimulationInputs[K]) => void;
  onSubmit: () => void;
}

const ACTIVITY_OPTIONS: { value: ActivityType; label: string; description: string }[] = [
  { value: 'BNC', label: 'BNC', description: 'Libéral / Prestation intellectuelle' },
  { value: 'BIC_SERVICES', label: 'BIC Services', description: 'Artisan / Prestation de service' },
  { value: 'BIC_VENTE', label: 'BIC Vente', description: 'Commerce / Vente de marchandises' },
];

const PARTS_OPTIONS = [1, 1.5, 2, 2.5, 3, 3.5, 4];

export function SimulatorForm({ inputs, updateInput, onSubmit }: SimulatorFormProps) {
  const plafondMicro = MICRO_PLAFONDS[inputs.activityType];
  const depassePlafond = inputs.chiffreAffaires > plafondMicro;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-6"
    >
      {/* CA */}
      <NumberInput
        label="Chiffre d'affaires annuel HT"
        value={inputs.chiffreAffaires}
        onChange={(v) => updateInput('chiffreAffaires', v)}
        min={0}
        step={1000}
        suffix="€"
        helpText="Votre CA annuel hors taxes prévu"
      />

      {depassePlafond && (
        <p className="text-xs text-accent-dark bg-accent/10 px-3 py-2 rounded-lg">
          Le plafond micro-entreprise pour cette activité est de {formatCurrency(plafondMicro)}.
          Le calcul micro sera limité à ce plafond.
        </p>
      )}

      {/* Type d'activité */}
      <div>
        <p className="text-sm font-medium text-foreground mb-2">Type d&apos;activité</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {ACTIVITY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateInput('activityType', opt.value)}
              className={`px-3 py-3 rounded-lg border text-left transition-all ${
                inputs.activityType === opt.value
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                  : 'border-border hover:border-primary/40'
              }`}
            >
              <span className="block text-sm font-semibold">{opt.label}</span>
              <span className="block text-xs text-muted mt-0.5">{opt.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Parts fiscales */}
      <div>
        <p className="text-sm font-medium text-foreground mb-2">Parts fiscales (quotient familial)</p>
        <div className="flex flex-wrap gap-2">
          {PARTS_OPTIONS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => updateInput('partsFiscales', p)}
              className={`px-3 py-2 rounded-lg border text-sm transition-all ${
                inputs.partsFiscales === p
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20 font-semibold'
                  : 'border-border hover:border-primary/40'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted mt-1">
          1 = célibataire, 2 = couple, +0.5 par enfant à charge
        </p>
      </div>

      {/* Charges réelles (EURL/SASU) */}
      <NumberInput
        label="Charges réelles annuelles (EURL/SASU)"
        value={inputs.chargesReelles}
        onChange={(v) => updateInput('chargesReelles', v)}
        min={0}
        step={500}
        suffix="€"
        helpText="Loyer, matériel, comptable, assurances... (hors rémunération)"
      />

      {/* Options avancées */}
      <details className="group">
        <summary className="cursor-pointer text-sm font-medium text-primary hover:text-primary-dark transition-colors list-none flex items-center gap-1">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="transition-transform group-open:rotate-90"
          >
            <path d="M6 4l4 4-4 4" />
          </svg>
          Options avancées
        </summary>

        <div className="mt-4 space-y-5 pl-1">
          {/* ACRE */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={inputs.withACRE}
              onChange={(e) => updateInput('withACRE', e.target.checked)}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
            />
            <div>
              <span className="text-sm font-medium">ACRE (1re année)</span>
              <p className="text-xs text-muted">Réduction de 50% des cotisations sociales</p>
            </div>
          </label>

          {/* Versement libératoire */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={inputs.withVersementLiberatoire}
              onChange={(e) => updateInput('withVersementLiberatoire', e.target.checked)}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
            />
            <div>
              <span className="text-sm font-medium">Versement libératoire IR (micro)</span>
              <p className="text-xs text-muted">Prélèvement forfaitaire de l&apos;IR avec les cotisations</p>
            </div>
          </label>

          {/* Imposition des dividendes */}
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Imposition des dividendes</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => updateInput('dividendeTaxMode', 'pfu')}
                className={`px-3 py-2.5 rounded-lg border text-left text-sm transition-all ${
                  inputs.dividendeTaxMode === 'pfu'
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-border hover:border-primary/40'
                }`}
              >
                <span className="block font-semibold">Flat tax 30%</span>
                <span className="block text-xs text-muted">PFU (défaut)</span>
              </button>
              <button
                type="button"
                onClick={() => updateInput('dividendeTaxMode', 'bareme')}
                className={`px-3 py-2.5 rounded-lg border text-left text-sm transition-all ${
                  inputs.dividendeTaxMode === 'bareme'
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-border hover:border-primary/40'
                }`}
              >
                <span className="block font-semibold">Barème IR</span>
                <span className="block text-xs text-muted">Abattement 40%</span>
              </button>
            </div>
          </div>

          {/* Capital social EURL */}
          <NumberInput
            label="Capital social EURL"
            value={inputs.capitalSocialEURL}
            onChange={(v) => updateInput('capitalSocialEURL', v)}
            min={0}
            step={100}
            suffix="€"
            helpText="Dividendes > 10% du capital soumis aux cotisations TNS"
          />

          {/* Sliders rémunération/dividendes */}
          <Slider
            label="Rémunération vs Dividendes (EURL)"
            value={inputs.remunerationPctEURL}
            onChange={(v) => updateInput('remunerationPctEURL', v)}
            leftLabel="100% dividendes"
            rightLabel="100% rémunération"
          />

          <Slider
            label="Rémunération vs Dividendes (SASU)"
            value={inputs.remunerationPctSASU}
            onChange={(v) => updateInput('remunerationPctSASU', v)}
            leftLabel="100% dividendes"
            rightLabel="100% rémunération"
          />
        </div>
      </details>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-primary text-white py-3 px-6 rounded-xl font-semibold text-lg
                   hover:bg-primary-dark active:scale-[0.98] transition-all
                   shadow-lg shadow-primary/20"
      >
        Comparer les 3 statuts
      </button>
    </form>
  );
}
