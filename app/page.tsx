'use client';

import { useMemo, useState } from 'react';
import {
  Check,
  CheckCircle2,
  Grid2X2,
  ImageOff,
  List,
  PackageCheck,
  RotateCcw,
  Search,
  Sparkles,
} from 'lucide-react';

import cardsJson from './cards-data.json';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';

type CardStatus = 'missing' | 'ordered' | 'owned';
type StatusFilter = CardStatus | 'all';
type SpeciesFilter = 'All' | 'Chansey' | 'Happiny' | 'Blissey';
type View = 'cards' | 'compact';
type Sort = 'oldest' | 'newest' | 'set';

type CardRecord = {
  id: number;
  species: Exclude<SpeciesFilter, 'All'>;
  language: string;
  set_name: string;
  set_orig: string | null;
  number: string;
  variant: string;
  year: number | null;
  rarity: string | null;
  era: string;
  status: CardStatus;
  image: string | null;
};

const cards = cardsJson as CardRecord[];
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const statusCounts = cards.reduce(
  (counts, card) => ({ ...counts, [card.status]: counts[card.status] + 1 }),
  { missing: 0, ordered: 0, owned: 0 },
);
const languages = Array.from(new Set(cards.map((card) => card.language))).sort();
const speciesOptions: SpeciesFilter[] = ['All', 'Chansey', 'Happiny', 'Blissey'];

export default function Home() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('missing');
  const [species, setSpecies] = useState<SpeciesFilter>('Chansey');
  const [language, setLanguage] = useState('All');
  const [view, setView] = useState<View>('compact');
  const [sort, setSort] = useState<Sort>('oldest');

  const filteredCards = useMemo(() => {
    const needle = normalize(query);
    return cards
      .filter((card) => status === 'all' || card.status === status)
      .filter((card) => species === 'All' || card.species === species)
      .filter((card) => language === 'All' || card.language === language)
      .filter((card) => !needle || searchableText(card).includes(needle))
      .sort((a, b) => compareCards(a, b, sort));
  }, [language, query, sort, species, status]);

  const filtersActive = query || status !== 'missing' || species !== 'Chansey' || language !== 'All' || sort !== 'oldest';

  function resetFilters() {
    setQuery('');
    setStatus('missing');
    setSpecies('Chansey');
    setLanguage('All');
    setSort('oldest');
    setView('compact');
  }

  return (
    <main className="min-h-screen pb-20">
      <header className="border-b border-rose-950/10 bg-[#fffaf1]/95">
        <div className="mx-auto max-w-6xl px-4 pb-5 pt-6 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Pocket checklist · Updated 3 Sep 2026</p>
              <h1 className="mt-1 font-heading text-3xl font-bold tracking-[-0.04em] text-[#4d2133] sm:text-4xl">Chansey Event List</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#765866]">Show vendors what you need. Search any card to see whether it is wanted, on the way, or already yours.</p>
            </div>
            <div className="egg-mark" aria-hidden="true"><Sparkles className="size-5" /></div>
          </div>

          <div className="relative mt-5">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#9a7081]" />
            <Input
              aria-label="Search the ledger"
              autoCapitalize="off"
              autoCorrect="off"
              className="h-13 rounded-2xl border-[#e7cbd3] bg-white pl-12 pr-11 text-base shadow-sm placeholder:text-[#a78694] focus-visible:border-[#b54870] focus-visible:ring-[#b54870]/20"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try 76/123, Polish, Base Set…"
              spellCheck={false}
              value={query}
            />
            {query && <Button aria-label="Clear search" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl" onClick={() => setQuery('')} size="icon" variant="ghost"><RotateCcw /></Button>}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 pt-5 sm:px-6">
        <div aria-label="Card status" className="status-tabs">
          <StatusButton active={status === 'missing'} count={statusCounts.missing} label="Wanted" onClick={() => setStatus('missing')} />
          <StatusButton active={status === 'ordered'} count={statusCounts.ordered} label="On the way" onClick={() => setStatus('ordered')} />
          <StatusButton active={status === 'owned'} count={statusCounts.owned} label="In collection" onClick={() => setStatus('owned')} />
          <StatusButton active={status === 'all'} count={cards.length} label="All cards" onClick={() => setStatus('all')} />
        </div>

        <div className="filter-panel">
          <div>
            <p className="filter-label">Pokémon</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {speciesOptions.map((option) => <Button className="rounded-full" key={option} onClick={() => setSpecies(option)} size="sm" variant={species === option ? 'default' : 'outline'}>{option}</Button>)}
            </div>
          </div>
          <label>
            <span className="filter-label">Language</span>
            <NativeSelect aria-label="Filter by language" className="mt-2 w-full" onChange={(event) => setLanguage(event.target.value)} value={language}>
              <NativeSelectOption value="All">All languages</NativeSelectOption>
              {languages.map((item) => <NativeSelectOption key={item} value={item}>{item}</NativeSelectOption>)}
            </NativeSelect>
          </label>
          <label>
            <span className="filter-label">Order</span>
            <NativeSelect aria-label="Sort cards" className="mt-2 w-full" onChange={(event) => setSort(event.target.value as Sort)} value={sort}>
              <NativeSelectOption value="oldest">Oldest first</NativeSelectOption>
              <NativeSelectOption value="newest">Newest first</NativeSelectOption>
              <NativeSelectOption value="set">Set name</NativeSelectOption>
            </NativeSelect>
          </label>
        </div>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">At the table</p>
            <h2 className="mt-1 text-xl font-bold tracking-tight text-[#4d2133]">{headingFor(status)}</h2>
            <p className="mt-1 text-sm text-[#765866]">{filteredCards.length} {filteredCards.length === 1 ? 'card' : 'cards'} shown</p>
          </div>
          <div className="flex items-center gap-2">
            {filtersActive && <Button className="rounded-xl" onClick={resetFilters} size="sm" variant="ghost"><RotateCcw /> Reset</Button>}
            <div className="view-switch" role="group" aria-label="View style">
              <Button aria-label="Compact booth list" className="rounded-lg" onClick={() => setView('compact')} size="icon-sm" variant={view === 'compact' ? 'default' : 'ghost'}><List /></Button>
              <Button aria-label="Card grid" className="rounded-lg" onClick={() => setView('cards')} size="icon-sm" variant={view === 'cards' ? 'default' : 'ghost'}><Grid2X2 /></Button>
            </div>
          </div>
        </div>

        <div className={view === 'cards' ? 'mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3' : 'mt-4 overflow-hidden rounded-2xl border border-rose-950/10 bg-white/80 shadow-sm'}>
          {filteredCards.map((card) => view === 'cards' ? <CardTile card={card} key={card.id} /> : <CompactRow card={card} key={card.id} />)}
        </div>

        {filteredCards.length === 0 && <div className="mt-4 rounded-3xl border border-dashed border-[#d8b7c2] bg-white/60 px-6 py-14 text-center"><Check className="mx-auto size-7 text-[#a45976]" /><p className="mt-3 font-bold text-[#4d2133]">No matching cards</p><p className="mt-1 text-sm text-[#765866]">Try another number, language, or status.</p></div>}

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-5 text-[#8a6976]">Images help identify the printing and may show a different language. Match the set, card number, language, and variant before buying.</p>
      </section>
    </main>
  );
}

function StatusButton({ active, count, label, onClick }: { active: boolean; count: number; label: string; onClick: () => void }) {
  return <Button aria-pressed={active} className="h-12 rounded-xl px-2" onClick={onClick} variant={active ? 'default' : 'ghost'}><span className="truncate">{label}</span><span className="tab-count">{count}</span></Button>;
}

function CardTile({ card }: { card: CardRecord }) {
  return (
    <article className="card-tile">
      <CardImage card={card} className="card-image" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div><p className="text-xs font-bold uppercase tracking-[0.09em] text-[#a04a6b]">{card.species} · {card.year ?? 'Year unknown'}</p><h3 className="mt-1 font-bold leading-tight text-[#4d2133]">{card.set_name}</h3><p className="mt-1 text-sm font-semibold text-[#765866]">{card.number}</p></div>
          <StatusBadge status={card.status} />
        </div>
        <div className="mt-4"><p className="text-sm font-bold text-[#4d2133]">{card.language}</p><p className="mt-0.5 text-xs leading-5 text-[#8a6976]">{card.variant}{card.rarity ? ` · ${card.rarity}` : ''}</p></div>
      </div>
    </article>
  );
}

function CompactRow({ card }: { card: CardRecord }) {
  return (
    <article className="compact-row">
      <CardImage card={card} className="compact-image" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2"><p className="truncate text-sm font-bold text-[#4d2133]">{card.set_name}</p><span className="shrink-0 text-sm font-semibold text-[#765866]">{card.number}</span></div>
        <p className="mt-1 truncate text-xs text-[#8a6976]">{card.species} · {card.language} · {card.variant}{card.year ? ` · ${card.year}` : ''}</p>
      </div>
      <StatusBadge status={card.status} />
    </article>
  );
}

function CardImage({ card, className }: { card: CardRecord; className: string }) {
  if (!card.image) return <div aria-label="No card image available" className={`${className} image-placeholder`}><ImageOff /></div>;
  return <img alt={`${card.species}, ${card.set_name}, ${card.number}`} className={className} loading="lazy" src={`${basePath}${card.image}`} />;
}

function StatusBadge({ status }: { status: CardStatus }) {
  if (status === 'missing') return <Badge className="status-wanted">Wanted</Badge>;
  if (status === 'ordered') return <Badge className="status-ordered"><PackageCheck data-icon="inline-start" /><span className="badge-wide">On the way</span><span className="badge-short">Ordered</span></Badge>;
  return <Badge className="status-owned"><CheckCircle2 data-icon="inline-start" /><span className="badge-wide">In collection</span><span className="badge-short">Owned</span></Badge>;
}

function normalize(value: string) {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function searchableText(card: CardRecord) {
  return normalize([card.species, card.language, card.set_name, card.set_orig, card.number, card.variant, card.year, card.rarity, card.era].filter(Boolean).join(' '));
}

function compareCards(a: CardRecord, b: CardRecord, sort: Sort) {
  if (sort === 'set') return a.set_name.localeCompare(b.set_name) || a.number.localeCompare(b.number) || a.language.localeCompare(b.language);
  const direction = sort === 'newest' ? -1 : 1;
  return direction * ((a.year ?? 0) - (b.year ?? 0)) || a.set_name.localeCompare(b.set_name) || a.number.localeCompare(b.number) || a.language.localeCompare(b.language);
}

function headingFor(status: StatusFilter) {
  if (status === 'missing') return 'Cards I am looking for';
  if (status === 'ordered') return 'Already bought, not arrived';
  if (status === 'owned') return 'Cards in my collection';
  return 'Check any card';
}
