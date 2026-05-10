import { useMemo, useState } from 'react';
import { Beaker, Save, SendHorizontal } from 'lucide-react';
import {
  GRAM_NEGATIVE_ANTIBIOTICS,
  GRAM_POSITIVE_ANTIBIOTICS,
  LAB_TEST_CONFIG,
  MALARIA_DENSITY_INFO,
  MALARIA_SPECIES,
  ORGANISM_SUGGESTIONS,
  WIDAL_DILUTIONS,
} from '../../data/labTestConfig';
import { useAuth } from '../../context/AuthContext';

type SensitivityGrade = 'S' | 'I' | 'R';
type GramType = 'gram_positive' | 'gram_negative' | 'fungal' | 'other';

function parseRange(range?: string): [number, number] | null {
  if (!range) return null;
  const parts = range.replace(/\s/g, '').split('-');
  if (parts.length !== 2) return null;
  const low = Number(parts[0]);
  const high = Number(parts[1]);
  if (Number.isNaN(low) || Number.isNaN(high)) return null;
  return [low, high];
}

export default function ResultsEntryPage() {
  const { user } = useAuth();
  const [selectedTestId, setSelectedTestId] = useState(LAB_TEST_CONFIG[0].id);
  const [quantValues, setQuantValues] = useState<Record<string, string>>({});
  const [comments, setComments] = useState('');
  const [resultFlag, setResultFlag] = useState<'normal' | 'abnormal' | 'critical'>('normal');
  const [verifiedBy, setVerifiedBy] = useState(user?.name ?? '');

  const [urinalysis, setUrinalysis] = useState<Record<string, string>>({});
  const [descriptiveText, setDescriptiveText] = useState('');
  const [cultureType, setCultureType] = useState<'no_growth' | 'organism_isolated' | 'pending'>('pending');
  const [organismName, setOrganismName] = useState('');
  const [gramType, setGramType] = useState<GramType>('gram_negative');
  const [sensitivityMethod, setSensitivityMethod] = useState('Kirby-Bauer Disc Diffusion');
  const [antibiotics, setAntibiotics] = useState<{ name: string; grade: SensitivityGrade }[]>(
    GRAM_NEGATIVE_ANTIBIOTICS.map(name => ({ name, grade: 'S' })),
  );
  const [prelimSensitivity, setPrelimSensitivity] = useState(false);

  const [malariaResult, setMalariaResult] = useState<'negative' | 'positive'>('negative');
  const [malariaSpecies, setMalariaSpecies] = useState('');
  const [malariaDensity, setMalariaDensity] = useState<'1+' | '2+' | '3+' | '4+'>('1+');
  const [malariaStage, setMalariaStage] = useState('');

  const [widalTitres, setWidalTitres] = useState<Record<string, string>>({});
  const [rapidResult, setRapidResult] = useState<'positive' | 'negative'>('negative');

  const selectedTest = LAB_TEST_CONFIG.find(test => test.id === selectedTestId) ?? LAB_TEST_CONFIG[0];

  const suggestedFlag = useMemo(() => {
    if (!selectedTest.parameters?.length) return 'normal' as const;
    let hasAbnormal = false;
    let hasCritical = false;
    selectedTest.parameters.forEach(param => {
      const value = Number(quantValues[param.key]);
      if (Number.isNaN(value)) return;
      const sexRange = user?.name?.toLowerCase().includes('mrs') ? param.reference.female : param.reference.male;
      const parsed = parseRange(sexRange);
      if (parsed && (value < parsed[0] || value > parsed[1])) hasAbnormal = true;
      if ((param.criticalLow !== undefined && value <= param.criticalLow) || (param.criticalHigh !== undefined && value >= param.criticalHigh)) {
        hasCritical = true;
      }
    });
    if (hasCritical) return 'critical' as const;
    if (hasAbnormal) return 'abnormal' as const;
    return 'normal' as const;
  }, [quantValues, selectedTest, user?.name]);

  const defaultAntibiotics = gramType === 'gram_positive' ? GRAM_POSITIVE_ANTIBIOTICS : GRAM_NEGATIVE_ANTIBIOTICS;

  const setQuant = (key: string, value: string) => {
    setQuantValues(prev => ({ ...prev, [key]: value }));
    setResultFlag(suggestedFlag);
  };

  return (
    <div className="app-container mx-auto max-w-5xl">
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-foreground">Dynamic Results Entry</h1>
        <p className="text-sm text-muted-foreground">Form fields adapt automatically by test type using centralized lab config.</p>
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <label className="mb-2 block text-sm font-medium text-foreground">Select test</label>
        <select
          value={selectedTestId}
          onChange={event => setSelectedTestId(event.target.value)}
          className="min-h-11 w-full rounded-md border border-border bg-background px-3 text-sm"
        >
          {LAB_TEST_CONFIG.map(test => (
            <option key={test.id} value={test.id}>{test.name} ({test.department})</option>
          ))}
        </select>
      </div>

      <div className="mt-4 space-y-4 rounded-lg border border-border bg-card p-4">
        {selectedTest.category === 'quantitative_panel' && selectedTest.parameters ? (
          <div className="space-y-3">
            {selectedTest.parameters.map(param => {
              const rangeText = param.reference.male ?? param.reference.female ?? param.reference.pediatric;
              const range = parseRange(rangeText);
              const raw = quantValues[param.key];
              const numeric = Number(raw);
              const outOfRange = range && !Number.isNaN(numeric) ? numeric < range[0] || numeric > range[1] : false;
              return (
                <div key={param.key} className="grid gap-2 rounded-md border border-border p-3 sm:grid-cols-[1fr_auto]">
                  <div>
                    <label className="block text-sm font-medium text-foreground">{param.label}</label>
                    <p className="text-xs text-muted-foreground">Reference: {rangeText} {param.unit}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      value={raw ?? ''}
                      onChange={event => setQuant(param.key, event.target.value)}
                      className={`min-h-11 w-full rounded-md border px-3 text-sm sm:w-36 ${outOfRange ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`}
                    />
                    <span className="text-xs text-muted-foreground">{param.unit}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}

        {selectedTest.category === 'descriptive' ? (
          <div className="space-y-3">
            {selectedTest.id === 'urinalysis' ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {['Colour', 'Appearance', 'pH', 'Protein', 'Glucose', 'Ketones', 'Blood', 'Nitrites', 'Leucocytes', 'RBCs', 'WBCs', 'Casts', 'Crystals', 'Epithelial cells']
                  .map(field => (
                    <div key={field}>
                      <label className="mb-1 block text-sm font-medium text-foreground">{field}</label>
                      <input
                        value={urinalysis[field] ?? ''}
                        onChange={event => setUrinalysis(prev => ({ ...prev, [field]: event.target.value }))}
                        className="min-h-11 w-full rounded-md border border-border bg-background px-3 text-sm"
                      />
                    </div>
                  ))}
              </div>
            ) : null}
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Structured report narrative</label>
              <textarea
                value={descriptiveText}
                onChange={event => setDescriptiveText(event.target.value)}
                rows={5}
                className="w-full rounded-md border border-border bg-background p-3 text-sm"
              />
            </div>
          </div>
        ) : null}

        {selectedTest.category === 'microbiology' ? (
          <div className="space-y-3">
            <div className="grid gap-2 sm:grid-cols-3">
              {[
                { id: 'no_growth', label: 'No Growth after 48hrs' },
                { id: 'organism_isolated', label: 'Organism Isolated' },
                { id: 'pending', label: 'Culture Pending' },
              ].map(option => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setCultureType(option.id as typeof cultureType)}
                  className={`min-h-11 rounded-md border px-3 text-sm ${cultureType === option.id ? 'border-primary bg-primary/10 text-foreground' : 'border-border bg-background text-muted-foreground'}`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {cultureType === 'organism_isolated' ? (
              <div className="space-y-3 rounded-md border border-border p-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Organism name</label>
                  <input
                    list="organism-suggestions"
                    value={organismName}
                    onChange={event => setOrganismName(event.target.value)}
                    className="min-h-11 w-full rounded-md border border-border bg-background px-3 text-sm"
                  />
                  <datalist id="organism-suggestions">
                    {ORGANISM_SUGGESTIONS.map(item => <option key={item} value={item} />)}
                  </datalist>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Organism class</label>
                  <select
                    value={gramType}
                    onChange={event => {
                      const nextType = event.target.value as GramType;
                      setGramType(nextType);
                      const nextDefaults = (nextType === 'gram_positive' ? GRAM_POSITIVE_ANTIBIOTICS : GRAM_NEGATIVE_ANTIBIOTICS)
                        .map(name => ({ name, grade: 'S' as const }));
                      setAntibiotics(nextDefaults);
                    }}
                    className="min-h-11 w-full rounded-md border border-border bg-background px-3 text-sm"
                  >
                    <option value="gram_positive">Gram positive</option>
                    <option value="gram_negative">Gram negative</option>
                    <option value="fungal">Fungal</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">AST method</label>
                  <select
                    value={sensitivityMethod}
                    onChange={event => setSensitivityMethod(event.target.value)}
                    className="min-h-11 w-full rounded-md border border-border bg-background px-3 text-sm"
                  >
                    <option>Kirby-Bauer Disc Diffusion</option>
                    <option>MIC</option>
                    <option>E-test</option>
                  </select>
                </div>

                <div className="rounded-md bg-muted p-3">
                  <p className="mb-2 text-sm font-medium text-foreground">Suggested antibiotics</p>
                  <div className="mb-3 flex flex-wrap gap-2">
                    {defaultAntibiotics.map(item => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          if (!antibiotics.some(a => a.name === item)) setAntibiotics(prev => [...prev, { name: item, grade: 'S' }]);
                        }}
                        className="min-h-11 rounded-full bg-background px-3 text-xs text-foreground"
                      >
                        + {item}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    {antibiotics.map(item => (
                      <div key={item.name} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border bg-background p-2">
                        <span className="text-sm text-foreground">{item.name}</span>
                        <div className="flex items-center gap-1">
                          {(['S', 'I', 'R'] as SensitivityGrade[]).map(grade => (
                            <button
                              key={grade}
                              type="button"
                              onClick={() => setAntibiotics(prev => prev.map(a => (a.name === item.name ? { ...a, grade } : a)))}
                              className={`min-h-11 rounded px-2 text-xs ${item.grade === grade ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                            >
                              {grade}
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => setAntibiotics(prev => prev.filter(a => a.name !== item.name))}
                            className="min-h-11 rounded px-2 text-xs text-destructive"
                          >
                            remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={prelimSensitivity}
                    onChange={event => setPrelimSensitivity(event.target.checked)}
                  />
                  Antibiotic sensitivity testing in progress
                </label>
              </div>
            ) : null}
          </div>
        ) : null}

        {selectedTest.category === 'malaria_parasite' ? (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {(['negative', 'positive'] as const).map(state => (
                <button
                  key={state}
                  type="button"
                  onClick={() => setMalariaResult(state)}
                  className={`min-h-11 rounded-md border px-3 text-sm ${malariaResult === state ? 'border-primary bg-primary/10' : 'border-border bg-background'}`}
                >
                  {state.toUpperCase()}
                </button>
              ))}
            </div>
            {malariaResult === 'positive' ? (
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Species</label>
                  <input
                    list="mp-species"
                    value={malariaSpecies}
                    onChange={event => setMalariaSpecies(event.target.value)}
                    className="min-h-11 w-full rounded-md border border-border bg-background px-3 text-sm"
                  />
                  <datalist id="mp-species">
                    {MALARIA_SPECIES.map(item => <option key={item} value={item} />)}
                  </datalist>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Parasite density</label>
                  <div className="grid gap-2 sm:grid-cols-4">
                    {(['1+', '2+', '3+', '4+'] as const).map(level => (
                      <button
                        key={level}
                        title={MALARIA_DENSITY_INFO[level]}
                        type="button"
                        onClick={() => setMalariaDensity(level)}
                        className={`min-h-11 rounded-md border px-2 text-sm ${malariaDensity === level ? 'border-primary bg-primary/10' : 'border-border bg-background'}`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{MALARIA_DENSITY_INFO[malariaDensity]}</p>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Stage (optional)</label>
                  <select
                    value={malariaStage}
                    onChange={event => setMalariaStage(event.target.value)}
                    className="min-h-11 w-full rounded-md border border-border bg-background px-3 text-sm"
                  >
                    <option value="">Not specified</option>
                    <option>Trophozoites</option>
                    <option>Schizonts</option>
                    <option>Gametocytes</option>
                  </select>
                </div>
              </>
            ) : null}
          </div>
        ) : null}

        {selectedTest.category === 'serology_titre' ? (
          <div className="space-y-3">
            {(selectedTest.titreAntigens ?? []).map(antigen => (
              <div key={antigen}>
                <label className="mb-1 block text-sm font-medium text-foreground">{antigen}</label>
                <select
                  value={widalTitres[antigen] ?? WIDAL_DILUTIONS[0]}
                  onChange={event => setWidalTitres(prev => ({ ...prev, [antigen]: event.target.value }))}
                  className="min-h-11 w-full rounded-md border border-border bg-background px-3 text-sm"
                >
                  {WIDAL_DILUTIONS.map(value => <option key={value}>{value}</option>)}
                </select>
              </div>
            ))}
            <p className="text-xs text-muted-foreground">{selectedTest.significantTitre}</p>
          </div>
        ) : null}

        {selectedTest.category === 'rapid_test' ? (
          <div className="flex flex-wrap gap-2">
            {(['positive', 'negative'] as const).map(state => (
              <button
                key={state}
                type="button"
                onClick={() => setRapidResult(state)}
                className={`min-h-11 rounded-md border px-4 text-sm ${rapidResult === state ? 'border-primary bg-primary/10' : 'border-border bg-background'}`}
              >
                {state.toUpperCase()}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-4 rounded-lg border border-border bg-card p-4">
        <h2 className="mb-3 text-base font-semibold text-foreground">Result metadata</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Result flag</label>
            <select
              value={resultFlag}
              onChange={event => setResultFlag(event.target.value as typeof resultFlag)}
              className="min-h-11 w-full rounded-md border border-border bg-background px-3 text-sm"
            >
              <option value="normal">Normal</option>
              <option value="abnormal">Abnormal</option>
              <option value="critical">Critical</option>
            </select>
            <p className="mt-1 text-xs text-muted-foreground">Auto-suggested: {suggestedFlag}</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Verified by</label>
            <input
              value={verifiedBy}
              onChange={event => setVerifiedBy(event.target.value)}
              className="min-h-11 w-full rounded-md border border-border bg-background px-3 text-sm"
            />
          </div>
        </div>
        <div className="mt-3">
          <label className="mb-1 block text-sm font-medium text-foreground">Comments (optional)</label>
          <textarea
            value={comments}
            onChange={event => setComments(event.target.value)}
            rows={4}
            className="w-full rounded-md border border-border bg-background p-3 text-sm"
          />
        </div>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button type="button" className="safe-button inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm text-foreground">
            <Save size={16} /> Save Draft
          </button>
          <button type="button" className="safe-button inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">
            <SendHorizontal size={16} className="dark-surface-icon" /> Submit / Authorize
          </button>
          <button type="button" className="safe-button inline-flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm text-secondary-foreground">
            <Beaker size={16} /> Validate Preview
          </button>
        </div>
      </div>
    </div>
  );
}
