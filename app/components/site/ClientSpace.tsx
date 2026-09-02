'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../../context/LanguageContext';
import styles from './ClientSpace.module.css';
import ClientSignIn from './ClientSignIn';
import { clientAuth, ClientSession, ProjectAccess } from '../../utils/clientAuth';

const disciplines = [
  { slug: 'film' as const, en: 'Film', fr: 'Film', detail: 'Narrative · Direction · Production', detailFr: 'Narration · Réalisation · Production' },
  { slug: 'photoshoot' as const, en: 'Photoshoot', fr: 'Séance photo', detail: 'Theater · Dance · Fashion', detailFr: 'Théâtre · Danse · Mode' },
  { slug: 'installation' as const, en: 'Installation', fr: 'Installation', detail: 'Exhibition · Gesture · Experience', detailFr: 'Exposition · Geste · Expérience' },
  { slug: 'identity' as const, en: 'Identity', fr: 'Identité', detail: 'Digital · Edition · Brand', detailFr: 'Digital · Édition · Marque' },
];
const allProjectAccess: ProjectAccess[] = disciplines.map(item => item.slug);
const visualOptions = ['Solo portrait', 'Ensemble tableau', 'Aerial suspension', 'Motion in fabric', 'Colour collision', 'Architectural wide', 'Sculptural silhouette', 'Intimate detail'];
const movementOptions = ['Contemporary', 'Modern', 'Lyrical', 'Acrobat', 'Aerial', 'Neoclassical', 'Cabaret', 'Jazz'];
const frameDefaults = [
  ['Ensemble tableau', '30', '5', 'Contemporary', '30', '5'],
  ['Aerial suspension', '30', '1', 'Aerial', '30', '5'],
  ['Motion in fabric', '15', '2', 'Modern', '15', '8'],
  ['Colour collision', '30', '3', 'Contemporary', '30', '5'],
  ['Sculptural silhouette', '15', '1', 'Neoclassical', '15', '5'],
  ['Architectural wide', '45', '5', 'Lyrical', '45', '3'],
].map(([visual, duration, dancers, movement, phrase, repetitions]) => ({ visual, duration, dancers, movement, phrase, repetitions }));
type FramePlanItem = typeof frameDefaults[number];
type FrameBrief = { vision: string; space: string; set: string; props: string; ambience: string; lighting: string; styling: string; hair: string; makeup: string };
type FrameBriefTab = keyof FrameBrief;
const emptyFrameBrief: FrameBrief = { vision: '', space: '', set: '', props: '', ambience: '', lighting: '', styling: '', hair: '', makeup: '' };
const frameBriefTabs: { key: FrameBriefTab; en: string; fr: string; prompt: string; promptFr: string }[] = [
  { key: 'vision', en: 'Vision', fr: 'Vision', prompt: 'Describe what you envision—and what you desire to capture.', promptFr: 'Décrivez ce que vous imaginez—et ce que vous souhaitez saisir.' },
  { key: 'space', en: 'Location', fr: 'Lieu', prompt: 'Where do you imagine it? Theatre, museum, studio, architecture, scale and viewpoint.', promptFr: 'Où l’imaginez-vous ? Théâtre, musée, studio, architecture, échelle et point de vue.' },
  { key: 'set', en: 'Set', fr: 'Décor', prompt: 'Describe the stage, surfaces, backdrop, scenic construction and spatial layers.', promptFr: 'Décrivez la scène, les surfaces, le fond, la construction et les plans du décor.' },
  { key: 'props', en: 'Props', fr: 'Accessoires', prompt: 'Describe the objects, furniture, fabrics and apparatus that must appear within the frame.', promptFr: 'Décrivez les objets, le mobilier, les tissus et les agrès qui doivent apparaître dans l’image.' },
  { key: 'ambience', en: 'Ambience', fr: 'Ambiance', prompt: 'Define the atmosphere: intimate or monumental, energetic or still, polished or raw.', promptFr: 'Définissez l’atmosphère : intime ou monumentale, énergique ou calme, polie ou brute.' },
  { key: 'lighting', en: 'Lighting', fr: 'Lumière', prompt: 'Spotlight colours, direction, contrast, shadows, haze, reflections and time of day.', promptFr: 'Couleurs, direction, contraste, ombres, brume, reflets et moment de la journée.' },
  { key: 'styling', en: 'Styling', fr: 'Style', prompt: 'Define the wardrobe silhouette, colours, materials, fabric movement and visual references.', promptFr: 'Définissez la silhouette, les couleurs, les matières, le mouvement des tissus et les références.' },
  { key: 'hair', en: 'Hair', fr: 'Coiffure', prompt: 'Describe the hair direction, shape, texture, movement and level of finish.', promptFr: 'Décrivez la direction, la forme, la texture, le mouvement et la finition de la coiffure.' },
  { key: 'makeup', en: 'Make-up', fr: 'Maquillage', prompt: 'Describe the make-up: skin, eyes, lips, colour, intensity and finish.', promptFr: 'Décrivez le maquillage : peau, yeux, lèvres, couleur, intensité et finition.' },
];
type FrameChoiceKey = 'duration' | 'dancers' | 'movement' | 'phrase' | 'repetitions';
type FrameChoiceOption = { value: string; label: string };
function FrameChoice({ label, value, options, open, onToggle, onChange }: { label: string; value: string; options: FrameChoiceOption[]; open: boolean; onToggle: () => void; onChange: (value: string) => void }) {
  const current = options.find(option => option.value === value)?.label || value;
  return <label className={`${styles.frameChoice} ${open ? styles.frameChoiceOpen : ''}`}><em>{label}</em><button type="button" aria-label={label} aria-expanded={open} onClick={onToggle}><span>{current}</span><i aria-hidden="true" /></button><div className={styles.frameChoiceMenu} role="listbox" aria-label={label} aria-hidden={!open}>{options.map(option => <button type="button" role="option" aria-selected={option.value === value} tabIndex={open ? 0 : -1} key={option.value} onClick={() => onChange(option.value)}>{option.label}<i aria-hidden="true" /></button>)}</div></label>;
}
type FilmIdea = { id: string; author: string; kind: string; body: string; created_at: number };
type FilmInspiration = { id: string; author: string; owner: keyof FilmRoles; caption: string; image_data: string; selected: number; created_at: number; yes_count: number; no_count: number; my_vote: 'yes' | 'no' | null };
type FilmGear = { alex: string; benjamin: string };
type FilmRoles = { alex: string[]; benjamin: string[] };
type FilmLocation = { id: string; author: string; owner: keyof FilmRoles; idea: string; image_data: string; created_at: number };
type FilmLocationDraft = { idea: string; image: string };
type FilmSuggestionSection = 'tone' | 'image';
const filmRoleOptions = ['Director', 'Co-Director', 'Creative Director', 'Director of Photography', 'Cinematographer', 'Camera Operator', 'First Assistant Director', 'Script Supervisor', 'Storyboard Artist', 'Technical Director', 'Art Director', 'Production Designer', 'Atmospheric Survey', 'Stylist', 'Post-Production Supervisor', 'Picture Editor', 'Assistant Editor', 'Online Editor · Conform', 'Colorist', 'Finishing Artist', 'Sound Designer', 'Sound Editor', 'Re-Recording Mixer', 'VFX Supervisor', 'Producer'] as const;
const fixedFilmRoles = new Set(['Stylist', 'Producer']);
const filmIdeaKinds = ['direction', 'location', 'styling', 'sound', 'story'] as const;
const finalFilmScript = `Les pas ne mènent plus vers
l’abri des habitudes,

Car le cœur a l’horreur des masques.

Le sillage demeure, avec une force que le silence ne peut consumer.

La vérité est trop souveraine pour feindre l’indifférence,

Une croyance s’est levée, comme un voile de brume suspendu entre les heures,

Un rideau invisible qui préserve l’harmonie du temps et en interdit toute altération.

Et l’un s’efface, sans bruit, comme on se retire de la lumière, sans en troubler le souffle.

Pour que le chemin n’ait jamais le goût du regret,

L’on trace alors l’encre sur le papier, afin que le destin s’y guide et s’y déploie jusqu’à s’écrire de lui-même.`;

export default function ClientSpace() {
  const { language, setLanguage } = useLanguage();
  const fr = language === 'fr';
  const [step, setStep] = useState<'language' | 'signin' | 'project' | 'entrance' | 'brief'>('language');
  const [selected, setSelected] = useState(0);
  const [invitation, setInvitation] = useState('');
  const [logoutError, setLogoutError] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [projectAccess, setProjectAccess] = useState<ProjectAccess[]>([]);
  const [accessNotice, setAccessNotice] = useState(false);
  const [restrictedSelection, setRestrictedSelection] = useState<ProjectAccess | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [filmIdeas, setFilmIdeas] = useState<FilmIdea[]>([]);
  const [filmIdeaBody, setFilmIdeaBody] = useState('');
  const [filmIdeaKind, setFilmIdeaKind] = useState<(typeof filmIdeaKinds)[number]>('direction');
  const [filmIdeaStatus, setFilmIdeaStatus] = useState('');
  const [filmPage, setFilmPage] = useState<'studio' | 'storyboard'>('studio');
  const [filmInspirations, setFilmInspirations] = useState<FilmInspiration[]>([]);
  const [filmInspirationDrafts, setFilmInspirationDrafts] = useState<Record<keyof FilmRoles, FilmLocationDraft>>({ alex: { idea: '', image: '' }, benjamin: { idea: '', image: '' } });
  const [filmUploadStatus, setFilmUploadStatus] = useState<Record<keyof FilmRoles, string>>({ alex: '', benjamin: '' });
  const [scriptOpen, setScriptOpen] = useState(false);
  const [scriptWriterOpen, setScriptWriterOpen] = useState(false);
  const [scriptWriterLength, setScriptWriterLength] = useState(0);
  const [filmMediaOpen, setFilmMediaOpen] = useState<FilmInspiration | null>(null);
  const [filmTheme, setFilmTheme] = useState<'dark' | 'light'>('dark');
  const [filmGear, setFilmGear] = useState<FilmGear>({ alex: '', benjamin: '' });
  const [filmGearStatus, setFilmGearStatus] = useState<Record<keyof FilmGear, string>>({ alex: '', benjamin: '' });
  const [filmRoles, setFilmRoles] = useState<FilmRoles>({ alex: [], benjamin: [] });
  const [filmRoleStatus, setFilmRoleStatus] = useState<Record<keyof FilmRoles, string>>({ alex: '', benjamin: '' });
  const [filmNarratives, setFilmNarratives] = useState<FilmGear>({ alex: '', benjamin: '' });
  const [filmNarrativeStatus, setFilmNarrativeStatus] = useState<Record<keyof FilmRoles, string>>({ alex: '', benjamin: '' });
  const [filmSuggestions, setFilmSuggestions] = useState<Record<FilmSuggestionSection, FilmGear>>({ tone: { alex: '', benjamin: '' }, image: { alex: '', benjamin: '' } });
  const [filmSuggestionStatus, setFilmSuggestionStatus] = useState<Record<FilmSuggestionSection, Record<keyof FilmRoles, string>>>({ tone: { alex: '', benjamin: '' }, image: { alex: '', benjamin: '' } });
  const [filmLocations, setFilmLocations] = useState<FilmLocation[]>([]);
  const [filmLocationDrafts, setFilmLocationDrafts] = useState<Record<keyof FilmRoles, FilmLocationDraft[]>>({ alex: Array.from({ length: 3 }, () => ({ idea: '', image: '' })), benjamin: Array.from({ length: 3 }, () => ({ idea: '', image: '' })) });
  const [filmLocationStatus, setFilmLocationStatus] = useState<Record<keyof FilmRoles, string>>({ alex: '', benjamin: '' });
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const preview = new URLSearchParams(window.location.search).get('preview');
    if ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && preview === 'project') {
      setIsPreview(true);
      const requestedAccess = new URLSearchParams(window.location.search).get('access');
      const previewAccess = requestedAccess?.split(',').filter((item): item is ProjectAccess => allProjectAccess.includes(item as ProjectAccess)) || [];
      setProjectAccess(previewAccess.length ? previewAccess : allProjectAccess);
      setStep('project');
      return;
    }
    const token = new URLSearchParams(window.location.hash.slice(1)).get('invite');
    if (token && /^[a-f0-9]{64}$/.test(token)) {
      setInvitation(token);
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, []);
  useEffect(() => () => { if (noticeTimer.current) clearTimeout(noticeTimer.current); }, []);
  useEffect(() => {
    if (!scriptOpen && !scriptWriterOpen && !filmMediaOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') { setScriptOpen(false); setScriptWriterOpen(false); setFilmMediaOpen(null); } };
    document.addEventListener('keydown', closeOnEscape);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', closeOnEscape); document.body.style.overflow = ''; };
  }, [scriptOpen, scriptWriterOpen, filmMediaOpen]);
  useEffect(() => {
    if (!scriptWriterOpen || scriptWriterLength >= finalFilmScript.length) return;
    const timer = window.setTimeout(() => setScriptWriterLength(length => Math.min(length + 1, finalFilmScript.length)), finalFilmScript[scriptWriterLength] === '\n' ? 115 : 34);
    return () => window.clearTimeout(timer);
  }, [scriptWriterOpen, scriptWriterLength]);
  useEffect(() => {
    const savedTheme = window.localStorage.getItem('sanch-fashion-film-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') setFilmTheme(savedTheme);
  }, []);
  function toggleFilmTheme() {
    setFilmTheme(current => {
      const next = current === 'dark' ? 'light' : 'dark';
      window.localStorage.setItem('sanch-fashion-film-theme', next);
      return next;
    });
  }
  async function signOut() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      const session = await clientAuth();
      await clientAuth({ action: 'logout' }, session.csrf);
      setDraft({ name: '', email: '', organisation: '', location: '', timing: '', vision: '' });
      setProjectAccess([]); setPrepared(false); setStep('signin'); setLogoutError(false);
    } catch { setLogoutError(true); }
    finally { setSigningOut(false); }
  }
  const [draft, setDraft] = useState({ name: '', email: '', organisation: '', location: '', timing: '', vision: '' });
  const [prepared, setPrepared] = useState(false);
  const [framesPerDay, setFramesPerDay] = useState('6');
  const [shootDays, setShootDays] = useState('2');
  const [frames, setFrames] = useState(frameDefaults);
  const [framePlanLoaded, setFramePlanLoaded] = useState(false);
  const [framePlanSubmittedAt, setFramePlanSubmittedAt] = useState<number | null>(null);
  const [photoshootPage, setPhotoshootPage] = useState<'plan' | 'review'>('plan');
  const [frameSubmitStatus, setFrameSubmitStatus] = useState('');
  const [frameChoiceOpen, setFrameChoiceOpen] = useState<{ index: number; key: FrameChoiceKey } | null>(null);
  const [frameBriefs, setFrameBriefs] = useState<Record<number, FrameBrief>>({});
  const [frameBriefOpen, setFrameBriefOpen] = useState<number | null>(null);
  const [frameBriefClosing, setFrameBriefClosing] = useState(false);
  const [frameBriefTab, setFrameBriefTab] = useState<FrameBriefTab>('vision');
  const [frameBriefDraft, setFrameBriefDraft] = useState<FrameBrief>(emptyFrameBrief);
  const [frameBriefStatus, setFrameBriefStatus] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    heading.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [step]);
  const chooseLanguage = (value: 'en' | 'fr') => { setLanguage(value); setStep('signin'); };
  const project = disciplines[selected];
  const photoshootOnly = projectAccess.length === 1 && projectAccess[0] === 'photoshoot';
  const permittedNames = disciplines
    .filter(item => projectAccess.includes(item.slug))
    .map(item => fr ? item.fr : item.en)
    .join(' · ');
  function showAccessNotice() {
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    setAccessNotice(true);
    noticeTimer.current = setTimeout(() => {
      setAccessNotice(false);
      setRestrictedSelection(null);
    }, 7000);
  }
  useEffect(() => {
    if (step !== 'brief' || !photoshootOnly) return;
    const load = async () => {
      if (isPreview) {
        const saved = window.localStorage.getItem('sanch-grace-in-motion-frame-briefs');
        if (saved) setFrameBriefs(JSON.parse(saved));
        return;
      }
      try {
        const session = await clientAuth();
        const result = await clientAuth({ action: 'list_frame_briefs', project: 'grace-in-motion' }, session.csrf) as ClientSession & { briefs?: { frame_index: number; details: string }[] };
        const loaded: Record<number, FrameBrief> = {};
        for (const item of result.briefs || []) loaded[item.frame_index] = { ...emptyFrameBrief, ...JSON.parse(item.details) };
        setFrameBriefs(loaded);
      } catch { setFrameBriefStatus(fr ? 'Impossible de charger les détails.' : 'Could not load saved details.'); }
    };
    void load();
  }, [step, photoshootOnly, isPreview, fr]);
  useEffect(() => {
    if (step !== 'brief' || !photoshootOnly) return;
    setFramePlanLoaded(false);
    const load = async () => {
      try {
        let plan: { frames?: FramePlanItem[]; framesPerDay?: string; shootDays?: string; submittedAt?: number | null } | null = null;
        if (isPreview) {
          const saved = window.localStorage.getItem('sanch-grace-in-motion-frame-plan');
          plan = saved ? JSON.parse(saved) : null;
        } else {
          const session = await clientAuth();
          const result = await clientAuth({ action: 'list_frame_plan', project: 'grace-in-motion' }, session.csrf) as ClientSession & { plan?: string };
          plan = result.plan ? JSON.parse(result.plan) : null;
        }
        if (plan?.frames?.length) setFrames(plan.frames);
        if (plan?.framesPerDay) setFramesPerDay(plan.framesPerDay);
        if (plan?.shootDays) setShootDays(plan.shootDays);
        if (plan?.submittedAt) { setFramePlanSubmittedAt(plan.submittedAt); setPhotoshootPage('review'); }
      } catch { /* Keep the curated defaults when no saved plan is available. */ }
      finally { setFramePlanLoaded(true); }
    };
    void load();
  }, [step, photoshootOnly, isPreview]);
  useEffect(() => {
    if (!framePlanLoaded || step !== 'brief' || !photoshootOnly) return;
    const plan = { frames, framesPerDay, shootDays, submittedAt: framePlanSubmittedAt };
    const timer = window.setTimeout(async () => {
      if (isPreview) {
        window.localStorage.setItem('sanch-grace-in-motion-frame-plan', JSON.stringify(plan));
        return;
      }
      try {
        const session = await clientAuth();
        await clientAuth({ action: 'save_frame_plan', project: 'grace-in-motion', plan }, session.csrf);
      } catch { /* Preserve the editable interface if a background save is interrupted. */ }
    }, 650);
    return () => window.clearTimeout(timer);
  }, [frames, framesPerDay, shootDays, framePlanSubmittedAt, framePlanLoaded, step, photoshootOnly, isPreview]);
  useEffect(() => {
    if (frameBriefOpen === null) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') closeFrameBrief(); };
    document.addEventListener('keydown', closeOnEscape);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', closeOnEscape); document.body.style.overflow = ''; };
  }, [frameBriefOpen]);
  function closeFrameBrief() {
    if (frameBriefClosing || frameBriefOpen === null) return;
    setFrameBriefClosing(true);
    window.setTimeout(() => { setFrameBriefOpen(null); setFrameBriefClosing(false); }, 420);
  }
  function openFrameBrief(index: number) {
    setFrameBriefDraft({ ...emptyFrameBrief, ...(frameBriefs[index] || {}) });
    setFrameBriefTab('vision'); setFrameBriefStatus(''); setFrameBriefClosing(false); setFrameBriefOpen(index);
  }
  async function saveFrameBrief() {
    if (frameBriefOpen === null) return;
    const index = frameBriefOpen;
    const updated = { ...frameBriefs, [index]: frameBriefDraft };
    setFrameBriefs(updated);
    if (isPreview) {
      window.localStorage.setItem('sanch-grace-in-motion-frame-briefs', JSON.stringify(updated));
      closeFrameBrief(); return;
    }
    setFrameBriefStatus(fr ? 'ENREGISTREMENT…' : 'SAVING…');
    try {
      const session = await clientAuth();
      await clientAuth({ action: 'save_frame_brief', project: 'grace-in-motion', frame_index: index, details: frameBriefDraft }, session.csrf);
      closeFrameBrief();
    } catch { setFrameBriefStatus(fr ? 'Échec de l’enregistrement. Réessayez.' : 'Could not save. Please try again.'); }
  }
  const brief = [fr ? 'Nouveau projet — Studio Sanch' : 'New project — Studio Sanch', '', `${fr ? 'Projet' : 'Project'}: ${fr ? project.fr : project.en}`, `${fr ? 'Nom' : 'Name'}: ${draft.name}`, `Email: ${draft.email}`, `${fr ? 'Organisation' : 'Organisation'}: ${draft.organisation}`, `${fr ? 'Lieu' : 'Location'}: ${draft.location}`, `${fr ? 'Calendrier' : 'Timing'}: ${draft.timing}`, '', draft.vision].join('\n');
  function prepareEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const subject = `${fr ? 'Projet' : 'Project'} ${fr ? project.fr : project.en} — ${draft.name}`;
    window.location.href = `mailto:contact@studiosanch.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(brief)}`;
    setPrepared(true);
  }
  function downloadBrief() {
    const url = URL.createObjectURL(new Blob([brief], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url; link.download = 'studio-sanch-project-brief.txt'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const totalFrameMinutes = frames.reduce((total, frame) => total + Number(frame.duration), 0);
  const updateFrame = (index: number, key: keyof typeof frames[number], value: string) => {
    setFrames(current => current.map((frame, frameIndex) => frameIndex === index ? { ...frame, [key]: value } : frame));
    setFrameChoiceOpen(null);
  };
  const addFrame = () => {
    setFrames(current => current.length >= 25 ? current : [...current, { visual: visualOptions[0], duration: '30', dancers: '1', movement: movementOptions[0], phrase: '30', repetitions: '5' }]);
    setFrameChoiceOpen(null);
  };
  async function submitFramePlan() {
    const submittedAt = Math.floor(Date.now() / 1000);
    const plan = { frames, framesPerDay, shootDays, submittedAt };
    setFrameSubmitStatus(fr ? 'ENVOI…' : 'SUBMITTING…');
    try {
      if (isPreview) window.localStorage.setItem('sanch-grace-in-motion-frame-plan', JSON.stringify(plan));
      else {
        const session = await clientAuth();
        await clientAuth({ action: 'save_frame_plan', project: 'grace-in-motion', plan }, session.csrf);
      }
      setFramePlanSubmittedAt(submittedAt);
      setFrameSubmitStatus('');
      setPhotoshootPage('review');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch { setFrameSubmitStatus(fr ? 'ÉCHEC DE L’ENVOI · RÉESSAYEZ' : 'SUBMISSION FAILED · PLEASE TRY AGAIN'); }
  }
  async function loadFilmIdeas() {
    if (isPreview) {
      const saved = window.localStorage.getItem('sanch-fashion-film-start-ideas');
      setFilmIdeas(saved ? JSON.parse(saved) : []);
      return;
    }
    try {
      const session = await clientAuth();
      const result = await clientAuth({ action: 'list_ideas', project: 'fashion-film-start' }, session.csrf) as ClientSession & { ideas?: FilmIdea[] };
      setFilmIdeas(result.ideas || []);
      setFilmIdeaStatus('');
    } catch { setFilmIdeaStatus(fr ? 'Les idées sont momentanément indisponibles.' : 'Ideas are temporarily unavailable.'); }
  }
  async function loadFilmInspirations() {
    if (isPreview) {
      const saved = window.localStorage.getItem('sanch-fashion-film-start-inspirations');
      setFilmInspirations(saved ? JSON.parse(saved) : []);
      return;
    }
    try {
      const session = await clientAuth();
      const result = await clientAuth({ action: 'list_inspirations', project: 'fashion-film-start' }, session.csrf) as ClientSession & { inspirations?: FilmInspiration[] };
      setFilmInspirations(result.inspirations || []); setFilmUploadStatus({ alex: '', benjamin: '' });
    } catch { const message = fr ? 'Les références sont momentanément indisponibles.' : 'References are temporarily unavailable.'; setFilmUploadStatus({ alex: message, benjamin: message }); }
  }
  async function loadFilmGear() {
    if (isPreview) {
      const saved = window.localStorage.getItem('sanch-fashion-film-start-gear');
      if (saved) setFilmGear(JSON.parse(saved));
      return;
    }
    try {
      const session = await clientAuth();
      const result = await clientAuth({ action: 'list_gear', project: 'fashion-film-start' }, session.csrf) as ClientSession & { gear?: { owner: keyof FilmGear; items: string }[] };
      const next: FilmGear = { alex: '', benjamin: '' };
      result.gear?.forEach(row => { if (row.owner in next) next[row.owner] = row.items; });
      setFilmGear(next);
    } catch { setFilmGearStatus({ alex: fr ? 'Indisponible' : 'Unavailable', benjamin: fr ? 'Indisponible' : 'Unavailable' }); }
  }
  async function loadFilmRoles() {
    if (isPreview) {
      const saved = window.localStorage.getItem('sanch-fashion-film-start-roles');
      if (saved) { const parsed = JSON.parse(saved) as FilmRoles; setFilmRoles({ alex: (parsed.alex || []).filter(role => !fixedFilmRoles.has(role)), benjamin: (parsed.benjamin || []).filter(role => !fixedFilmRoles.has(role)) }); }
      return;
    }
    try {
      const session = await clientAuth();
      const result = await clientAuth({ action: 'list_roles', project: 'fashion-film-start' }, session.csrf) as ClientSession & { roles?: { owner: keyof FilmRoles; roles: string }[] };
      const next: FilmRoles = { alex: [], benjamin: [] };
      result.roles?.forEach(row => { if (row.owner in next) { try { next[row.owner] = (JSON.parse(row.roles) as string[]).filter(role => !fixedFilmRoles.has(role)); } catch { next[row.owner] = []; } } });
      setFilmRoles(next);
    } catch { setFilmRoleStatus({ alex: fr ? 'Indisponible' : 'Unavailable', benjamin: fr ? 'Indisponible' : 'Unavailable' }); }
  }
  async function loadFilmNarratives() {
    if (isPreview) {
      const saved = window.localStorage.getItem('sanch-fashion-film-start-narratives');
      if (saved) setFilmNarratives(JSON.parse(saved));
      return;
    }
    try {
      const session = await clientAuth();
      const result = await clientAuth({ action: 'list_narratives', project: 'fashion-film-start' }, session.csrf) as ClientSession & { narratives?: { owner: keyof FilmRoles; body: string }[] };
      const next: FilmGear = { alex: '', benjamin: '' };
      result.narratives?.forEach(row => { if (row.owner in next) next[row.owner] = row.body; });
      setFilmNarratives(next);
    } catch { setFilmNarrativeStatus({ alex: fr ? 'Indisponible' : 'Unavailable', benjamin: fr ? 'Indisponible' : 'Unavailable' }); }
  }
  async function loadFilmSuggestions() {
    if (isPreview) {
      const saved = window.localStorage.getItem('sanch-fashion-film-start-suggestions');
      if (saved) setFilmSuggestions(JSON.parse(saved));
      return;
    }
    try {
      const session = await clientAuth();
      const result = await clientAuth({ action: 'list_suggestions', project: 'fashion-film-start' }, session.csrf) as ClientSession & { suggestions?: { section: FilmSuggestionSection; owner: keyof FilmRoles; body: string }[] };
      const next: Record<FilmSuggestionSection, FilmGear> = { tone: { alex: '', benjamin: '' }, image: { alex: '', benjamin: '' } };
      result.suggestions?.forEach(row => { if (row.section in next && row.owner in next[row.section]) next[row.section][row.owner] = row.body; });
      setFilmSuggestions(next);
    } catch { /* The unresolved fields remain editable even if earlier suggestions are unavailable. */ }
  }
  async function loadFilmLocations() {
    if (isPreview) {
      const saved = window.localStorage.getItem('sanch-fashion-film-start-locations');
      setFilmLocations(saved ? JSON.parse(saved) : []); return;
    }
    try {
      const session = await clientAuth();
      const result = await clientAuth({ action: 'list_locations', project: 'fashion-film-start' }, session.csrf) as ClientSession & { locations?: FilmLocation[] };
      setFilmLocations(result.locations || []); setFilmLocationStatus({ alex: '', benjamin: '' });
    } catch { const message = fr ? 'Les lieux sont momentanément indisponibles.' : 'Locations are temporarily unavailable.'; setFilmLocationStatus({ alex: message, benjamin: message }); }
  }
  useEffect(() => {
    if (step === 'brief' && project.slug === 'film') { void loadFilmIdeas(); void loadFilmInspirations(); void loadFilmGear(); void loadFilmRoles(); void loadFilmNarratives(); void loadFilmSuggestions(); void loadFilmLocations(); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, selected, isPreview]);
  async function addFilmIdea(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = filmIdeaBody.trim();
    if (!body) return;
    if (isPreview) {
      const idea = { id: crypto.randomUUID(), author: 'TEAM', kind: filmIdeaKind, body, created_at: Math.floor(Date.now() / 1000) };
      const updated = [idea, ...filmIdeas];
      setFilmIdeas(updated);
      window.localStorage.setItem('sanch-fashion-film-start-ideas', JSON.stringify(updated));
      setFilmIdeaBody('');
      return;
    }
    try {
      setFilmIdeaStatus(fr ? 'Enregistrement…' : 'Saving…');
      const session = await clientAuth();
      const result = await clientAuth({ action: 'add_idea', project: 'fashion-film-start', kind: filmIdeaKind, body }, session.csrf) as ClientSession & { idea?: FilmIdea };
      if (result.idea) setFilmIdeas(current => [result.idea!, ...current]);
      setFilmIdeaBody(''); setFilmIdeaStatus('');
    } catch { setFilmIdeaStatus(fr ? 'Impossible d’enregistrer pour le moment.' : 'Unable to save right now.'); }
  }
  async function prepareFilmImage(file: File, owner: keyof FilmRoles) {
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) return;
    setFilmUploadStatus(current => ({ ...current, [owner]: fr ? 'Préparation…' : 'Preparing…' }));
    if (file.type.startsWith('video/')) {
      if (file.size > 1250000) { setFilmUploadStatus(current => ({ ...current, [owner]: fr ? 'La vidéo doit faire moins de 1,25 Mo.' : 'Video must be under 1.25 MB.' })); return; }
      const data = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result || '')); reader.onerror = () => reject(reader.error); reader.readAsDataURL(file); });
      setFilmInspirationDrafts(current => ({ ...current, [owner]: { ...current[owner], image: data } })); setFilmUploadStatus(current => ({ ...current, [owner]: '' })); return;
    }
    const source = await createImageBitmap(file);
    const scale = Math.min(1, 1500 / Math.max(source.width, source.height));
    const canvas = document.createElement('canvas'); canvas.width = Math.round(source.width * scale); canvas.height = Math.round(source.height * scale);
    canvas.getContext('2d')?.drawImage(source, 0, 0, canvas.width, canvas.height); source.close();
    let quality = .82; let data = canvas.toDataURL('image/webp', quality);
    while (data.length > 1700000 && quality > .45) { quality -= .08; data = canvas.toDataURL('image/webp', quality); }
    if (data.length > 1750000) { setFilmUploadStatus(current => ({ ...current, [owner]: fr ? 'Cette image reste trop volumineuse après optimisation.' : 'This image remains too large after optimization.' })); return; }
    setFilmInspirationDrafts(current => ({ ...current, [owner]: { ...current[owner], image: data } })); setFilmUploadStatus(current => ({ ...current, [owner]: '' }));
  }
  async function prepareLocationImage(file: File, owner: keyof FilmRoles, slot: number) {
    if (!file.type.startsWith('image/')) return;
    setFilmLocationStatus(current => ({ ...current, [owner]: fr ? 'Préparation…' : 'Preparing…' }));
    const source = await createImageBitmap(file); const scale = Math.min(1, 1500 / Math.max(source.width, source.height));
    const canvas = document.createElement('canvas'); canvas.width = Math.round(source.width * scale); canvas.height = Math.round(source.height * scale);
    canvas.getContext('2d')?.drawImage(source, 0, 0, canvas.width, canvas.height); source.close();
    let quality = .82; let data = canvas.toDataURL('image/webp', quality);
    while (data.length > 480000 && quality > .45) { quality -= .08; data = canvas.toDataURL('image/webp', quality); }
    if (data.length > 500000) { setFilmLocationStatus(current => ({ ...current, [owner]: fr ? 'Choisissez une image plus légère.' : 'Please choose a lighter image.' })); return; }
    setFilmLocationDrafts(current => ({ ...current, [owner]: current[owner].map((draft, index) => index === slot ? { ...draft, image: data } : draft) })); setFilmLocationStatus(current => ({ ...current, [owner]: '' }));
  }
  function savePreviewInspirations(items: FilmInspiration[]) {
    setFilmInspirations(items); window.localStorage.setItem('sanch-fashion-film-start-inspirations', JSON.stringify(items));
  }
  async function addFilmInspiration(event: FormEvent<HTMLFormElement>, owner: keyof FilmRoles) {
    event.preventDefault(); const draft = filmInspirationDrafts[owner]; if (!draft.image) return;
    if (isPreview) {
      savePreviewInspirations([{ id: crypto.randomUUID(), author: owner.toUpperCase(), owner, caption: draft.idea.trim(), image_data: draft.image, selected: 0, created_at: Math.floor(Date.now() / 1000), yes_count: 0, no_count: 0, my_vote: null }, ...filmInspirations]);
      setFilmInspirationDrafts(current => ({ ...current, [owner]: { idea: '', image: '' } })); return;
    }
    try {
      setFilmUploadStatus(current => ({ ...current, [owner]: fr ? 'Envoi…' : 'Uploading…' })); const session = await clientAuth();
      const result = await clientAuth({ action: 'add_inspiration', project: 'fashion-film-start', owner, caption: draft.idea.trim(), image: draft.image }, session.csrf) as ClientSession & { inspiration?: FilmInspiration };
      if (result.inspiration) setFilmInspirations(current => [result.inspiration!, ...current]);
      setFilmInspirationDrafts(current => ({ ...current, [owner]: { idea: '', image: '' } })); setFilmUploadStatus(current => ({ ...current, [owner]: '' }));
    } catch { setFilmUploadStatus(current => ({ ...current, [owner]: fr ? 'Impossible d’envoyer ce média.' : 'Unable to upload this media.' })); }
  }
  async function updateInspiration(id: string, action: 'vote_inspiration' | 'select_inspiration', vote?: 'yes' | 'no') {
    if (isPreview) {
      savePreviewInspirations(filmInspirations.map(item => item.id !== id ? item : action === 'select_inspiration' ? { ...item, selected: 1 } : { ...item, yes_count: item.yes_count + (vote === 'yes' && item.my_vote !== 'yes' ? 1 : 0) - (item.my_vote === 'yes' && vote !== 'yes' ? 1 : 0), no_count: item.no_count + (vote === 'no' && item.my_vote !== 'no' ? 1 : 0) - (item.my_vote === 'no' && vote !== 'no' ? 1 : 0), my_vote: vote || null })); return;
    }
    try { const session = await clientAuth(); await clientAuth({ action, project: 'fashion-film-start', id, vote }, session.csrf); await loadFilmInspirations(); }
    catch { const message = fr ? 'Cette action n’a pas pu être enregistrée.' : 'This action could not be saved.'; setFilmUploadStatus({ alex: message, benjamin: message }); }
  }
  async function saveFilmGear(owner: keyof FilmGear) {
    if (isPreview) {
      window.localStorage.setItem('sanch-fashion-film-start-gear', JSON.stringify(filmGear));
      setFilmGearStatus(current => ({ ...current, [owner]: fr ? 'Enregistré' : 'Saved' }));
      return;
    }
    try {
      setFilmGearStatus(current => ({ ...current, [owner]: fr ? 'Enregistrement…' : 'Saving…' }));
      const session = await clientAuth();
      await clientAuth({ action: 'save_gear', project: 'fashion-film-start', owner, items: filmGear[owner] }, session.csrf);
      setFilmGearStatus(current => ({ ...current, [owner]: fr ? 'Enregistré' : 'Saved' }));
    } catch { setFilmGearStatus(current => ({ ...current, [owner]: fr ? 'Réessayer' : 'Try again' })); }
  }
  function toggleFilmRole(owner: keyof FilmRoles, role: string) {
    if (fixedFilmRoles.has(role)) return;
    setFilmRoles(current => ({ ...current, [owner]: current[owner].includes(role) ? current[owner].filter(item => item !== role) : [...current[owner], role] }));
    setFilmRoleStatus(current => ({ ...current, [owner]: '' }));
  }
  async function saveFilmRoles(owner: keyof FilmRoles) {
    if (isPreview) {
      window.localStorage.setItem('sanch-fashion-film-start-roles', JSON.stringify(filmRoles));
      setFilmRoleStatus(current => ({ ...current, [owner]: fr ? 'Crédit enregistré' : 'Credit saved' })); return;
    }
    try {
      setFilmRoleStatus(current => ({ ...current, [owner]: fr ? 'Enregistrement…' : 'Saving…' }));
      const session = await clientAuth(); await clientAuth({ action: 'save_roles', project: 'fashion-film-start', owner, roles: filmRoles[owner] }, session.csrf);
      setFilmRoleStatus(current => ({ ...current, [owner]: fr ? 'Crédit enregistré' : 'Credit saved' }));
    } catch { setFilmRoleStatus(current => ({ ...current, [owner]: fr ? 'Réessayer' : 'Try again' })); }
  }
  async function saveFilmNarrative(owner: keyof FilmRoles) {
    if (isPreview) {
      window.localStorage.setItem('sanch-fashion-film-start-narratives', JSON.stringify(filmNarratives));
      setFilmNarrativeStatus(current => ({ ...current, [owner]: fr ? 'Enregistré' : 'Saved' })); return;
    }
    try {
      setFilmNarrativeStatus(current => ({ ...current, [owner]: fr ? 'Enregistrement…' : 'Saving…' }));
      const session = await clientAuth(); await clientAuth({ action: 'save_narrative', project: 'fashion-film-start', owner, body: filmNarratives[owner] }, session.csrf);
      setFilmNarrativeStatus(current => ({ ...current, [owner]: fr ? 'Enregistré' : 'Saved' }));
    } catch { setFilmNarrativeStatus(current => ({ ...current, [owner]: fr ? 'Réessayer' : 'Try again' })); }
  }
  async function saveFilmSuggestion(section: FilmSuggestionSection, owner: keyof FilmRoles) {
    if (isPreview) {
      window.localStorage.setItem('sanch-fashion-film-start-suggestions', JSON.stringify(filmSuggestions));
      setFilmSuggestionStatus(current => ({ ...current, [section]: { ...current[section], [owner]: fr ? 'Enregistré' : 'Saved' } })); return;
    }
    try {
      setFilmSuggestionStatus(current => ({ ...current, [section]: { ...current[section], [owner]: fr ? 'Enregistrement…' : 'Saving…' } }));
      const session = await clientAuth(); await clientAuth({ action: 'save_suggestion', project: 'fashion-film-start', section, owner, body: filmSuggestions[section][owner] }, session.csrf);
      setFilmSuggestionStatus(current => ({ ...current, [section]: { ...current[section], [owner]: fr ? 'Enregistré' : 'Saved' } }));
    } catch { setFilmSuggestionStatus(current => ({ ...current, [section]: { ...current[section], [owner]: fr ? 'Réessayer' : 'Try again' } })); }
  }
  async function addFilmLocation(event: FormEvent<HTMLFormElement>, owner: keyof FilmRoles, slot: number) {
    event.preventDefault(); const { image, idea: rawIdea } = filmLocationDrafts[owner][slot]; const idea = rawIdea.trim(); if (!idea) return;
    if (isPreview) {
      const next = [...filmLocations, { id: crypto.randomUUID(), author: owner.toUpperCase(), owner, idea, image_data: image, created_at: Math.floor(Date.now() / 1000) }];
      setFilmLocations(next); window.localStorage.setItem('sanch-fashion-film-start-locations', JSON.stringify(next)); setFilmLocationDrafts(current => ({ ...current, [owner]: current[owner].map((draft, index) => index === slot ? { idea: '', image: '' } : draft) })); return;
    }
    try {
      setFilmLocationStatus(current => ({ ...current, [owner]: fr ? 'Envoi…' : 'Sharing…' })); const session = await clientAuth();
      const result = await clientAuth({ action: 'add_location', project: 'fashion-film-start', owner, idea, image }, session.csrf) as ClientSession & { location?: FilmLocation };
      if (result.location) setFilmLocations(current => [...current, result.location!]);
      setFilmLocationDrafts(current => ({ ...current, [owner]: current[owner].map((draft, index) => index === slot ? { idea: '', image: '' } : draft) })); setFilmLocationStatus(current => ({ ...current, [owner]: '' }));
    } catch { setFilmLocationStatus(current => ({ ...current, [owner]: fr ? 'Impossible d’ajouter ce lieu.' : 'Unable to add this location.' })); }
  }
  const productionGear = [...new Set(Object.values(filmGear).flatMap(items => items.split(/\n|,/).map(item => item.trim()).filter(Boolean)))];
  return (
    <main className={styles.space} lang={step === 'language' ? undefined : language}>
      <div className={`${styles.topline} ${step === 'brief' && project.slug === 'film' ? styles.filmTopline : ''}`}>
        {(step === 'project' || step === 'entrance' || step === 'brief') && <button onClick={signOut} disabled={signingOut}>{fr ? 'Se déconnecter' : 'Sign out'}</button>}
        {logoutError && <span role="status">{fr ? 'Déconnexion indisponible. Réessayez.' : 'Sign-out unavailable. Please retry.'}</span>}
      </div>
      {step === 'language' ? (
        <section className={styles.welcome} aria-labelledby="client-title">
          <div className={styles.atmosphere} aria-hidden="true" />
          <div className={styles.welcomeContent}>
            <h1 id="client-title" className={styles.visuallyHidden} ref={heading} tabIndex={-1}>Choose your language / Choisissez votre langue</h1>
            <div className={styles.languages}>
              <button onClick={() => chooseLanguage('en')} lang="en">English</button>
              <button onClick={() => chooseLanguage('fr')} lang="fr">Français</button>
            </div>
          </div>
        </section>
      ) : step === 'signin' ? (
        <section className={styles.welcome} aria-labelledby="client-title">
          <div className={styles.atmosphere} aria-hidden="true" />
          <div className={styles.welcomeContent}>
            <h1 id="client-title" className={styles.visuallyHidden} ref={heading} tabIndex={-1}>{fr ? 'Connexion' : 'Sign in'}</h1>
            <ClientSignIn fr={fr} invitation={invitation} onActivated={() => setInvitation('')} onSignedIn={user => { setProjectAccess(user.access); setStep('project'); }} />
            <button className={styles.signInBack} onClick={() => setStep('language')}>{fr ? 'Langue' : 'Language'}</button>
          </div>
        </section>
      ) : step === 'entrance' && project.slug === 'film' ? (
        <section className={styles.filmEntrance} aria-labelledby="client-title">
          <div className={styles.filmEntranceImage} aria-hidden="true" />
          <div className={styles.filmEntranceVeil} aria-hidden="true" />
          <div className={styles.filmEntranceTitle}>
            <p>STUDIO SANCH · PARIS</p>
            <h1 id="client-title" ref={heading} tabIndex={-1}>FASHION FILM<br /><span>START</span></h1>
            <button onClick={() => { setSelected(0); setStep('brief'); }}><span>{fr ? 'ENTRER' : 'ENTER'}</span><i aria-hidden="true" /></button>
          </div>
        </section>
      ) : step === 'entrance' && project.slug === 'photoshoot' ? (
        <section className={styles.photoshootEntrance} aria-labelledby="client-title">
          <div className={styles.photoshootImage} aria-hidden="true" />
          <div className={styles.photoshootGrain} aria-hidden="true" />
          <div className={styles.photoshootTitle}>
            <p>GRACE IN MOTION</p>
            <h1 id="client-title" ref={heading} tabIndex={-1}>CHROMA</h1>
            <div className={styles.photoshootCredits}>
              <span>BY JAMES D PARKHILL</span>
            </div>
            <button onClick={() => { setSelected(1); setPrepared(false); setStep('brief'); }}>
              <span>{fr ? 'ENTRER' : 'ENTER'}</span>
              <i aria-hidden="true" />
            </button>
          </div>
        </section>
      ) : step === 'project' ? (
        <section className={`${styles.content} ${styles.projectScene}`} aria-labelledby="client-title">
          <div className={`${styles.sceneReveal} ${styles.revealBottomLeft}`} aria-hidden="true" />
          <div className={`${styles.sceneReveal} ${styles.revealBottomRight}`} aria-hidden="true" />
          <div className={`${styles.sceneReveal} ${styles.revealTopLeft}`} aria-hidden="true" />
          <div className={`${styles.sceneReveal} ${styles.revealTopRight}`} aria-hidden="true" />
          <div className={`${styles.stageLaser} ${styles.laserBottomLeft}`} aria-hidden="true" />
          <div className={`${styles.stageLaser} ${styles.laserBottomRight}`} aria-hidden="true" />
          <div className={`${styles.stageLaser} ${styles.laserTopLeft}`} aria-hidden="true" />
          <div className={`${styles.stageLaser} ${styles.laserTopRight}`} aria-hidden="true" />
          <div className={styles.intro}>
            <h1 id="client-title" ref={heading} tabIndex={-1}>{fr ? 'Tout commence' : 'It begins'}<br /><span>{fr ? 'par une idée.' : 'with an idea.'}</span></h1>
            <p>{fr ? <>Certaines créations naissent d’une vision.<br />D’autres, d’une sensation.<br /><strong>Par où commencer ?</strong></> : <>Some creations begin with a vision.<br />Others, with a sensation.<br /><strong>Where shall we begin?</strong></>}</p>
          </div>
          <div className={styles.accessNoticeSlot}>
            <div className={`${styles.accessNotice} ${accessNotice ? styles.accessNoticeVisible : ''}`} role="status" aria-live="polite" aria-hidden={!accessNotice}>
              <i aria-hidden="true" />
              <p>{fr ? 'Accès privé' : 'Private access'}</p>
              <strong>{permittedNames}</strong>
              <span>{fr ? 'D’autres possibilités sur demande.' : 'Further possibilities upon request.'}</span>
            </div>
          </div>
          <div className={styles.projects} aria-label={fr ? 'Choisissez une forme de projet' : 'Choose a project form'}>{disciplines.map((item, index) => { const permitted = projectAccess.includes(item.slug); return <button key={item.en} className={`${styles.project} ${!permitted ? styles.restricted : ''} ${restrictedSelection === item.slug && accessNotice ? styles.restrictedSelection : ''}`} aria-disabled={!permitted} aria-label={!permitted ? `${fr ? item.fr : item.en} — ${fr ? 'accès non inclus' : 'access not included'}` : undefined} onClick={() => { if (!permitted) { setRestrictedSelection(item.slug); showAccessNotice(); return; } setAccessNotice(false); setRestrictedSelection(null); setSelected(index); setPrepared(false); setStep('entrance'); }}>
            <span className={styles.projectName}>{fr ? item.fr : item.en}</span>
            <span className={styles.projectDetail}>{fr ? item.detailFr : item.detail}</span>
          </button>; })}</div>
          <button className={styles.back} onClick={() => setStep('language')}>← {fr ? 'Choisir une langue' : 'Choose a language'}</button>
        </section>
      ) : step === 'brief' && project.slug === 'film' ? (
        <section className={`${styles.filmBoard} ${filmTheme === 'light' ? styles.filmBoardLight : ''}`} aria-labelledby="client-title">
          <header className={styles.filmBoardHero}>
            <button className={styles.filmBoardBack} onClick={() => setStep('project')}>← {fr ? 'Projet' : 'Project'}</button>
            <div><p>FILM / 01 · DEVELOPMENT</p><h1 id="client-title" ref={heading} tabIndex={-1}>FASHION FILM <span>START</span></h1></div>
            <div className={styles.filmBoardTools}><p className={styles.filmBoardStatus}>{fr ? 'AVANT LE TOURNAGE · EN DÉVELOPPEMENT' : 'PRE-SHOOT · IN DEVELOPMENT'}</p><button type="button" className={styles.filmThemeToggle} onClick={toggleFilmTheme} aria-label={filmTheme === 'dark' ? (fr ? 'Passer au fond clair' : 'Switch to light background') : (fr ? 'Passer au fond noir' : 'Switch to black background')} aria-pressed={filmTheme === 'light'}><span aria-hidden="true"><i /><i /></span><em>{filmTheme === 'dark' ? (fr ? 'CLAIR' : 'LIGHT') : (fr ? 'NOIR' : 'DARK')}</em></button></div>
          </header>
          <nav className={styles.filmPages} aria-label={fr ? 'Pages du projet' : 'Project pages'}><button className={filmPage === 'studio' ? styles.filmPageActive : ''} onClick={() => setFilmPage('studio')}>01 · {fr ? 'STUDIO OUVERT' : 'OPEN STUDIO'}</button><button className={filmPage === 'storyboard' ? styles.filmPageActive : ''} onClick={() => setFilmPage('storyboard')}>02 · STORYBOARD <span>{filmInspirations.filter(item => item.selected).length.toString().padStart(2, '0')}</span></button></nav>
          {filmPage === 'studio' ? <>
          <section className={styles.filmRoles}>
            <header><div><p className={styles.filmLabel}>{fr ? 'RÔLES · GÉNÉRIQUE' : 'ROLES · CREDITS'}</p><h2>{fr ? 'Qu’est-ce qui vous ressemble ?' : 'What feels like yours?'}</h2></div><p>{fr ? 'Plusieurs choix possibles' : 'Select as many as apply'}</p></header>
            <div className={styles.filmRoleColumns}>{(['benjamin', 'alex'] as const).map(owner => <div key={owner}><h3>{owner.toUpperCase()}</h3><div>{filmRoleOptions.map(role => { const fixed = fixedFilmRoles.has(role); return <button type="button" key={role} disabled={fixed} className={`${filmRoles[owner].includes(role) ? styles.filmRoleSelected : ''} ${fixed ? styles.filmRoleFixed : ''}`} aria-pressed={fixed ? undefined : filmRoles[owner].includes(role)} onClick={() => toggleFilmRole(owner, role)}><i aria-hidden="true" />{role}{fixed && <small>{fr ? 'ATTRIBUÉ' : 'ASSIGNED'}</small>}</button>; })}</div><footer><small>{filmRoleStatus[owner]}</small><button type="button" onClick={() => void saveFilmRoles(owner)}>{fr ? 'ENREGISTRER LES RÔLES' : 'SAVE ROLES'} ↗</button></footer></div>)}</div>
            <div className={styles.filmCredits}><p>{fr ? 'GÉNÉRIQUE ACTUEL' : 'CURRENT CREDITS'}</p><div>{(['benjamin', 'alex'] as const).map(owner => <article key={owner}><span>{owner === 'benjamin' ? 'Benjamin' : 'Alex'}</span><p>{filmRoles[owner].length ? filmRoles[owner].join(' · ') : (fr ? 'Rôle à définir' : 'Role to be defined')}</p></article>)}</div></div>
            <div className={styles.filmFixedRoles}><p>{fr ? 'RÔLES DÉJÀ ÉTABLIS' : 'ROLES ALREADY ESTABLISHED'}</p><div><span><small>PRODUCER</small>STUDIO SANCH</span><span><small>STYLIST</small>SANCHIT</span></div></div>
          </section>
          <section className={styles.filmGear}>
            <header><h2>{fr ? 'Équipement disponible' : 'Equipment available'}</h2><span>{productionGear.length.toString().padStart(2, '0')}</span></header>
            <div className={styles.filmGearColumns}>{(['benjamin', 'alex'] as const).map(owner => <div key={owner}><label htmlFor={`gear-${owner}`}>{owner.toUpperCase()}</label><textarea id={`gear-${owner}`} value={filmGear[owner]} onChange={event => setFilmGear(current => ({ ...current, [owner]: event.target.value }))} maxLength={2000} placeholder={fr ? 'Un élément par ligne…' : 'One item per line…'} /><footer><small>{filmGearStatus[owner]}</small><button type="button" onClick={() => void saveFilmGear(owner)}>{fr ? 'ENREGISTRER' : 'SAVE'} ↗</button></footer></div>)}</div>
            <div className={styles.filmGearSummary}><p>{fr ? 'LA PRODUCTION DISPOSE ACTUELLEMENT DE' : 'PRODUCTION CURRENTLY HAS'}</p><div>{productionGear.map(item => <span key={item}>{item}</span>)}{productionGear.length === 0 && <small>{fr ? 'L’inventaire se composera automatiquement ici.' : 'The combined inventory will appear here automatically.'}</small>}</div></div>
          </section>
          <section className={styles.filmLocations}>
            <header><div><p className={styles.filmLabel}>{fr ? 'LIEUX · DÉVELOPPEMENT' : 'LOCATIONS · DEVELOPMENT'}</p><h2>{fr ? 'Étude atmosphérique' : 'Atmospheric Survey'}</h2></div><span>{filmLocations.length.toString().padStart(2, '0')}</span></header>
            <div className={styles.filmLocationColumns}>{(['benjamin', 'alex'] as const).map(owner => { const firstNumber = filmLocations.filter(location => location.owner === owner).length + 1; return <div className={styles.filmLocationOwner} key={owner}><h3>{owner.toUpperCase()}</h3>{filmLocationDrafts[owner].map((draft, slot) => { const number = firstNumber + slot; return <form className={styles.filmLocationForm} key={slot} onSubmit={event => void addFilmLocation(event, owner, slot)}><label className={styles.filmLocationImage}>{draft.image ? <img src={draft.image} alt="" /> : <><i>＋</i><span>{fr ? 'IMAGE' : 'IMAGE'}</span></>}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={event => { const file = event.target.files?.[0]; if (file) void prepareLocationImage(file, owner, slot); }} /></label><div><label htmlFor={`location-idea-${owner}-${slot}`}>{fr ? `LIEU ${number} · IDÉE` : `LOCATION ${number} · IDEA`}</label><textarea id={`location-idea-${owner}-${slot}`} value={draft.idea} onChange={event => setFilmLocationDrafts(current => ({ ...current, [owner]: current[owner].map((item, index) => index === slot ? { ...item, idea: event.target.value } : item) }))} maxLength={800} required placeholder={fr ? 'Atmosphère, lumière, potentiel narratif…' : 'Atmosphere, light, narrative potential…'} /><footer><small>{filmLocationStatus[owner]}</small><button type="submit">{fr ? 'AJOUTER' : 'ADD'} ↗</button></footer></div></form>; })}</div>; })}</div>
            <div className={styles.filmLocationGrid}>{filmLocations.map((location, index) => <article key={location.id}>{location.image_data ? <img src={location.image_data} alt="" /> : <div className={styles.filmLocationNoImage}><span>{String(index + 1).padStart(2, '0')}</span></div>}<div><small>{location.owner?.toUpperCase()} · {fr ? 'LIEU' : 'LOCATION'} {filmLocations.filter(item => item.owner === location.owner && item.created_at <= location.created_at).length}</small><p>{location.idea}</p><span>{location.author}</span></div></article>)}{filmLocations.length === 0 && <p className={styles.filmLocationEmpty}>{fr ? 'Alex et Benjamin peuvent proposer ici leurs premiers lieux.' : 'Alex and Benjamin can propose their first locations here.'}</p>}</div>
          </section>
          <section className={styles.filmWelcome}>
            <p className={styles.filmLabel}>{fr ? 'AVANT LE CADRE' : 'BEFORE THE FRAME'}</p>
            <h2>{fr ? <><strong>LE FILM,</strong> <span>TEL QUE VOUS LE VOYEZ.</span></> : <><strong>THE FILM,</strong> <span>AS YOU SEE IT.</span></>}</h2>
          </section>
          <section className={styles.filmNarratives}>
            <header><div><p className={styles.filmLabel}>{fr ? 'SYNOPSIS · NARRATION' : 'SYNOPSIS · NARRATIVE'}</p><h2>Perspectives.</h2></div><p>{fr ? 'Une proposition chacun' : 'One proposal each'}</p></header>
            <div>{(['benjamin', 'alex'] as const).map(owner => <article key={owner}><h3>{owner.toUpperCase()}</h3><textarea value={filmNarratives[owner]} onChange={event => setFilmNarratives(current => ({ ...current, [owner]: event.target.value }))} maxLength={2400} placeholder={fr ? 'Écrivez ici votre synopsis, votre narration ou votre lecture du film…' : 'Write your synopsis, narrative, or interpretation of the film here…'} /><footer><small>{filmNarrativeStatus[owner]}</small><button type="button" onClick={() => void saveFilmNarrative(owner)}>{fr ? 'ENREGISTRER' : 'SAVE'} ↗</button></footer></article>)}</div>
          </section>
          <section className={styles.filmReference}>
            <div className={styles.filmConversationHead}><div><p className={styles.filmLabel}>{fr ? 'RECHERCHE VISUELLE' : 'VISUAL RESEARCH'}</p><h2>{fr ? 'Mur de références' : 'Reference wall'}</h2></div><span>{filmInspirations.length.toString().padStart(2, '0')}</span></div>
            <div className={styles.filmUploadColumns}>{(['benjamin', 'alex'] as const).map(owner => { const draft = filmInspirationDrafts[owner]; const isVideo = draft.image.startsWith('data:video/'); return <form className={styles.filmUpload} key={owner} onSubmit={event => void addFilmInspiration(event, owner)}><h3>{owner.toUpperCase()}</h3><label className={styles.filmUploadPicker}>{draft.image ? (isVideo ? <video src={draft.image} muted playsInline /> : <img src={draft.image} alt="" />) : <><span>＋</span>{fr ? 'IMAGE OU VIDÉO' : 'IMAGE OR VIDEO'}</>}<input type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime" onChange={event => { const file = event.target.files?.[0]; if (file) void prepareFilmImage(file, owner); }} /></label><div><input value={draft.idea} onChange={event => setFilmInspirationDrafts(current => ({ ...current, [owner]: { ...current[owner], idea: event.target.value } }))} maxLength={240} placeholder={fr ? 'Image, humeur, matière, lumière…' : 'Image, mood, texture, light…'} /><button disabled={!draft.image} type="submit">{fr ? 'PARTAGER' : 'SHARE'} ↗</button></div>{filmUploadStatus[owner] && <p role="status">{filmUploadStatus[owner]}</p>}</form>; })}</div>
            {filmInspirations.length > 0 && <div className={styles.filmInspirationGrid}>{filmInspirations.map(item => { const isVideo = item.image_data.startsWith('data:video/'); return <article key={item.id}><button type="button" className={styles.filmInspirationMedia} onClick={() => setFilmMediaOpen(item)} aria-label={fr ? 'Ouvrir la référence' : 'Open reference'}>{isVideo ? <video src={item.image_data} muted playsInline preload="metadata" /> : <img src={item.image_data} alt={item.caption || (fr ? 'Référence visuelle' : 'Visual reference')} />}<i>{isVideo ? 'PLAY' : 'VIEW'} ↗</i></button><div><p>{item.caption || (fr ? 'Sans titre' : 'Untitled')}</p><small>{item.owner?.toUpperCase() || item.author}</small><span><button className={item.my_vote === 'yes' ? styles.voted : ''} onClick={() => void updateInspiration(item.id, 'vote_inspiration', 'yes')}>{fr ? 'OUI' : 'YES'} {item.yes_count}</button><button className={item.my_vote === 'no' ? styles.voted : ''} onClick={() => void updateInspiration(item.id, 'vote_inspiration', 'no')}>{fr ? 'NON' : 'NO'} {item.no_count}</button></span><button className={styles.filmSelect} disabled={Boolean(item.selected)} onClick={() => void updateInspiration(item.id, 'select_inspiration')}>{item.selected ? (fr ? 'AU STORYBOARD ✓' : 'IN STORYBOARD ✓') : (fr ? 'PLACER AU STORYBOARD →' : 'MOVE TO STORYBOARD →')}</button></div></article>; })}</div>}
          </section>
          <div className={styles.filmBoardGrid}>
            <aside className={styles.filmDirection}>
              <dl>
                {(['tone', 'image'] as const).map(section => <div key={section}><dt>{section === 'tone' ? (fr ? 'TON' : 'TONE') : 'IMAGE'}</dt><dd>{section === 'tone' ? (fr ? 'À définir' : 'To be defined') : (fr ? 'Noir et blanc · Contraste précis · À définir' : 'Black & white · Precise contrast · To be defined')}</dd><section className={styles.filmOpenSuggestions}>{(['benjamin', 'alex'] as const).map(owner => <label key={owner}><span>{owner.toUpperCase()}</span><input value={filmSuggestions[section][owner]} onChange={event => setFilmSuggestions(current => ({ ...current, [section]: { ...current[section], [owner]: event.target.value } }))} maxLength={600} placeholder={fr ? 'Votre suggestion…' : 'Your suggestion…'} /><button type="button" onClick={() => void saveFilmSuggestion(section, owner)} aria-label={fr ? `Enregistrer la suggestion de ${owner}` : `Save ${owner}'s suggestion`}>↗</button><small>{filmSuggestionStatus[section][owner]}</small></label>)}</section></div>)}
                <div><dt>{fr ? 'LIEU' : 'LOCATION'}</dt><dd>Paris</dd></div>
                <div><dt>{fr ? 'DISTRIBUTION · FINALISÉE' : 'CAST · FINALIZED'}</dt><dd>{fr ? 'Acteur masculin · Sanchit Babbar' : 'Male Actor · Sanchit Babbar'}</dd></div>
              </dl>
              <figure className={styles.filmScript}><figcaption><span>{fr ? 'SCRIPT FINALISÉ' : 'FINAL SCRIPT'}</span><div><button type="button" onClick={() => { setScriptWriterLength(0); setScriptWriterOpen(true); }}>{fr ? 'ÉCRITURE' : 'SCRIPT MODE'} ↗</button><button type="button" onClick={() => setScriptOpen(true)}>{fr ? 'AGRANDIR' : 'ENLARGE'} ↗</button></div></figcaption><button type="button" className={styles.filmScriptImage} onClick={() => setScriptOpen(true)} aria-label={fr ? 'Agrandir le script finalisé' : 'Enlarge the final script'}><img src="/images/fashion-film-start-final-script.jpg" alt={fr ? 'Script manuscrit finalisé du film' : 'Final handwritten film script'} /></button></figure>
            </aside>
            <div className={styles.filmConversation}>
              <div className={styles.filmTextIdeas}>
              <div className={styles.filmConversationHead}><div><p className={styles.filmLabel}>{fr ? 'NOTES OUVERTES' : 'OPEN NOTES'}</p><h2>{fr ? 'Idées de l’équipe' : 'Team ideas'}</h2></div><span>{filmIdeas.length.toString().padStart(2, '0')}</span></div>
              <form className={styles.filmIdeaForm} onSubmit={addFilmIdea}>
                <div className={styles.filmIdeaKinds}>{filmIdeaKinds.map(kind => <button key={kind} type="button" className={filmIdeaKind === kind ? styles.filmIdeaKindActive : ''} onClick={() => setFilmIdeaKind(kind)}>{kind}</button>)}</div>
                <textarea value={filmIdeaBody} onChange={event => setFilmIdeaBody(event.target.value)} maxLength={1200} required placeholder={fr ? 'Ajouter une idée, une référence, une sensation…' : 'Add an idea, a reference, a feeling…'} />
                <button className={styles.filmIdeaSubmit} type="submit">{fr ? 'PARTAGER' : 'SHARE'} <span>↗</span></button>
                {filmIdeaStatus && <p className={styles.filmIdeaStatus} role="status">{filmIdeaStatus}</p>}
              </form>
              <div className={styles.filmIdeas}>{filmIdeas.map(idea => <article key={idea.id}><header><span>{idea.kind}</span><time>{new Date(idea.created_at * 1000).toLocaleDateString(fr ? 'fr-FR' : 'en-GB', { day: '2-digit', month: 'short' })}</time></header><p>{idea.body}</p><small>{idea.author}</small></article>)}{filmIdeas.length === 0 && <p className={styles.filmIdeasEmpty}>{fr ? 'La table est ouverte. Partagez la première idée.' : 'The table is open. Share the first idea.'}</p>}</div>
              </div>
            </div>
          </div>
          </> : <section className={styles.filmStoryboard}><header><p className={styles.filmLabel}>{fr ? 'PAGE 02 · SÉLECTION FINALE' : 'PAGE 02 · FINAL SELECTION'}</p><h2>{fr ? 'Le storyboard commence ici.' : 'The storyboard begins here.'}</h2><p>{fr ? 'Seules les références choisies depuis le studio ouvert apparaissent sur cette page.' : 'Only references selected in the open studio appear on this page.'}</p></header><div>{filmInspirations.filter(item => item.selected).map((item, index) => <article key={item.id}><span>{String(index + 1).padStart(2, '0')}</span>{item.image_data.startsWith('data:video/') ? <video src={item.image_data} controls playsInline preload="metadata" /> : <img src={item.image_data} alt={item.caption} />}<p>{item.caption}</p><small>{item.author}</small></article>)}{!filmInspirations.some(item => item.selected) && <p className={styles.filmStoryboardEmpty}>{fr ? 'La sélection n’a pas encore commencé.' : 'The selection has not begun yet.'}</p>}</div></section>}
          {scriptOpen && typeof document !== 'undefined' && createPortal(<div className={styles.scriptLightbox} role="dialog" aria-modal="true" aria-label={fr ? 'Script finalisé agrandi' : 'Enlarged final script'} onMouseDown={event => { if (event.target === event.currentTarget) setScriptOpen(false); }}><div><header><span>{fr ? 'SCRIPT FINALISÉ' : 'FINAL SCRIPT'}</span><button type="button" onClick={() => setScriptOpen(false)} aria-label={fr ? 'Fermer' : 'Close'}>{fr ? 'FERMER' : 'CLOSE'} <i aria-hidden="true">×</i></button></header><img src="/images/fashion-film-start-final-script.jpg" alt={fr ? 'Script manuscrit finalisé du film' : 'Final handwritten film script'} /></div></div>, document.body)}
          {scriptWriterOpen && typeof document !== 'undefined' && createPortal(<div className={styles.scriptWriterVeil} role="dialog" aria-modal="true" aria-label={fr ? 'Script en cours d’écriture' : 'Script writing mode'} onMouseDown={event => { if (event.target === event.currentTarget) setScriptWriterOpen(false); }}><section className={styles.scriptWriter}><header><span>01 · {fr ? 'ÉCRITURE' : 'WRITING ROOM'}</span><button type="button" onClick={() => setScriptWriterOpen(false)}>{fr ? 'FERMER' : 'CLOSE'} ×</button></header><div className={styles.scriptWriterPage}><p>{finalFilmScript.slice(0, scriptWriterLength)}<i aria-hidden="true" /></p></div><footer><span>{String(scriptWriterLength).padStart(3, '0')} / {finalFilmScript.length}</span><button type="button" onClick={() => setScriptWriterLength(0)}>{fr ? 'RECOMMENCER' : 'REPLAY'} ↺</button></footer></section></div>, document.body)}
          {filmMediaOpen && typeof document !== 'undefined' && createPortal(<div className={styles.filmCinemaVeil} role="dialog" aria-modal="true" aria-label={fr ? 'Référence agrandie' : 'Expanded reference'} onMouseDown={event => { if (event.target === event.currentTarget) setFilmMediaOpen(null); }}><section className={styles.filmCinema}><header><span>{filmMediaOpen.owner.toUpperCase()} · {fr ? 'RÉFÉRENCE' : 'REFERENCE'}</span><button type="button" onClick={() => setFilmMediaOpen(null)}>{fr ? 'FERMER' : 'CLOSE'} ×</button></header>{filmMediaOpen.image_data.startsWith('data:video/') ? <video src={filmMediaOpen.image_data} controls autoPlay playsInline /> : <img src={filmMediaOpen.image_data} alt={filmMediaOpen.caption || ''} />} {filmMediaOpen.caption && <p>{filmMediaOpen.caption}</p>}</section></div>, document.body)}
        </section>
      ) : step === 'brief' && photoshootOnly ? (
        <section className={styles.projectRoom} aria-labelledby="client-title">
          <div className={styles.projectRoomSlideshow} aria-hidden="true">
            <span /><span /><span /><span />
          </div>
          <div className={styles.projectRoomHeader}>
            <button className={styles.back} onClick={() => setStep('entrance')}>← {fr ? 'Retour à CHROMA' : 'Back to CHROMA'}</button>
          </div>

          <div className={styles.projectRoomHero}>
            <p className={styles.projectRoomWelcome}>GRACE IN MOTION</p>
            <h1 id="client-title" ref={heading} tabIndex={-1}>CHROMA</h1>
            <div className={styles.projectRoomMeta}>
              <span className={styles.projectRoomCredits}><span><b>ARTIST</b><strong>JAMES D PARKHILL</strong></span><span><b>{fr ? 'PRODUCTEUR' : 'PRODUCER'}</b><strong>STUDIO SANCH</strong></span></span>
              <span className={styles.projectRoomStatus}><i aria-hidden="true" /><span><b>{fr ? 'PRÉPRODUCTION' : 'PRE-PRODUCTION'}</b><small>{fr ? 'ÉTAPE 01' : 'STAGE 01'}</small></span></span>
            </div>
          </div>

          {photoshootPage === 'review' ? <section className={styles.frameReview} aria-labelledby="frame-review-title">
            <header className={styles.frameReviewHeader}>
              <div><p>{fr ? 'PRÉPRODUCTION · ÉTAPE 01' : 'PRE-PRODUCTION · STAGE 01'}</p><h2 id="frame-review-title">{fr ? 'Direction enregistrée.' : 'Direction submitted.'}</h2><span>{fr ? 'La vision complète, telle qu’elle a été composée.' : 'The complete vision, exactly as composed.'}</span></div>
              <button type="button" onClick={() => { setPhotoshootPage('plan'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>{fr ? 'MODIFIER LE PLAN' : 'EDIT PLAN'} <i aria-hidden="true">↗</i></button>
            </header>
            <div className={styles.frameReviewOverview}>
              <div><small>{fr ? 'IMAGES' : 'FRAMES'}</small><strong>{String(frames.length).padStart(2, '0')}</strong></div>
              <div><small>{fr ? 'DURÉE CIBLÉE' : 'FOCUSED DURATION'}</small><strong>{Math.floor(totalFrameMinutes / 60)}H {totalFrameMinutes % 60 ? `${totalFrameMinutes % 60}M` : ''}</strong></div>
              <div><small>{fr ? 'RYTHME' : 'SHOOTING RHYTHM'}</small><strong>{framesPerDay} × {shootDays}</strong><span>{fr ? 'images par jour × jours' : 'frames per day × days'}</span></div>
              <div><small>{fr ? 'STATUT' : 'STATUS'}</small><strong>{fr ? 'ENVOYÉ' : 'SUBMITTED'}</strong>{framePlanSubmittedAt && <span>{new Date(framePlanSubmittedAt * 1000).toLocaleDateString(fr ? 'fr-FR' : 'en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span>}</div>
            </div>
            <div className={styles.frameReviewList}>{frames.map((frame, index) => {
              const details = { ...emptyFrameBrief, ...(frameBriefs[index] || {}) };
              return <article className={styles.frameReviewCard} key={index}>
                <header><span>{String(index + 1).padStart(2, '0')}</span><div><small>{fr ? 'VISUEL SOUHAITÉ' : 'DESIRED VISUAL'}</small><h3>{frame.visual}</h3></div></header>
                <dl className={styles.frameReviewSpecs}>
                  <div><dt>{fr ? 'DURÉE' : 'DURATION'}</dt><dd>{frame.duration} min</dd></div>
                  <div><dt>{fr ? 'DANSEURS' : 'DANCERS'}</dt><dd>{frame.dancers}</dd></div>
                  <div><dt>GENRE</dt><dd>{frame.movement}</dd></div>
                  <div><dt>{fr ? 'SÉQUENCE' : 'SEQUENCE'}</dt><dd>{Number(frame.phrase) >= 60 ? `${Math.floor(Number(frame.phrase) / 60)} min${Number(frame.phrase) % 60 ? ` ${Number(frame.phrase) % 60}` : ''}` : `${frame.phrase} sec`}</dd></div>
                  <div><dt>{fr ? 'REPRISES' : 'REPEATS'}</dt><dd>{frame.repetitions}</dd></div>
                </dl>
                <div className={styles.frameReviewBrief}>{frameBriefTabs.map(tab => <section key={tab.key}><h4>{fr ? tab.fr : tab.en}</h4><p className={details[tab.key].trim() ? '' : styles.frameReviewEmpty}>{details[tab.key].trim() || (fr ? 'À définir' : 'To be defined')}</p></section>)}</div>
              </article>;
            })}</div>
            <footer className={styles.frameReviewFooter}><span>{fr ? 'ARTISTE · JAMES D PARKHILL' : 'ARTIST · JAMES D PARKHILL'}</span><span>{fr ? 'PRODUCTEUR · STUDIO SANCH' : 'PRODUCER · STUDIO SANCH'}</span></footer>
          </section> : <>
          <div className={styles.frameBuilder}>
            <div className={styles.frameBuilderIntro}>
              <div>
                <p className={styles.frameBuilderEyebrow}>{fr ? 'CADRE DE PRODUCTION' : 'PRODUCTION FRAMEWORK'}</p>
                <h2>{fr ? 'Construisez vos images.' : 'Build your frames.'}</h2>
                <p>{fr ? 'Définissez chaque image avec précision. Chaque élément affine le visuel souhaité.' : 'Define each frame with precision. Each element refines the desired visual.'}</p>
              </div>
            </div>

            <div className={styles.frameTable} role="table" aria-label={fr ? 'Plan image par image' : 'Frame-by-frame plan'}>
              <div className={`${styles.frameRow} ${styles.frameHead}`} role="row">
                <span role="columnheader">{fr ? 'IMAGE' : 'FRAME'}</span><span role="columnheader">{fr ? 'VISUEL' : 'VISUAL'}</span><span role="columnheader">{fr ? 'DURÉE' : 'DURATION'}</span><span role="columnheader">{fr ? 'DANSEURS' : 'DANCERS'}</span><span role="columnheader">GENRE</span><span role="columnheader">{fr ? 'SÉQUENCE' : 'SEQUENCE'}</span><span role="columnheader">{fr ? 'REPRISES' : 'REPEATS'}</span>
              </div>
              {frames.map((frame, index) => <div className={`${styles.frameRow} ${frameChoiceOpen?.index === index ? styles.frameRowActive : ''}`} role="row" key={index}>
                <span className={styles.frameId} role="rowheader"><i>{String(index + 1).padStart(2, '0')}</i><b>{fr ? 'Image' : 'Frame'}</b></span>
                <div className={styles.frameVisualCell} role="cell"><button type="button" onClick={() => openFrameBrief(index)} aria-label={`${fr ? 'Ouvrir le détail visuel de l’image' : 'Open visual brief for frame'} ${index + 1}`}><span>{fr ? 'Ouvrir et définir' : 'Open & define'}</span><small>{fr ? 'VISUEL SOUHAITÉ' : 'DESIRED VISUAL'}</small><i aria-hidden="true" /></button></div>
                <FrameChoice label={`${fr ? 'Temps image' : 'Frame time'} ${index + 1}`} value={frame.duration} options={['15', '30', '45'].map(value => ({ value, label: `${value} min` }))} open={frameChoiceOpen?.index === index && frameChoiceOpen.key === 'duration'} onToggle={() => setFrameChoiceOpen(current => current?.index === index && current.key === 'duration' ? null : { index, key: 'duration' })} onChange={value => updateFrame(index, 'duration', value)} />
                <FrameChoice label={`${fr ? 'Danseurs image' : 'Frame dancers'} ${index + 1}`} value={frame.dancers} options={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map(value => ({ value, label: value }))} open={frameChoiceOpen?.index === index && frameChoiceOpen.key === 'dancers'} onToggle={() => setFrameChoiceOpen(current => current?.index === index && current.key === 'dancers' ? null : { index, key: 'dancers' })} onChange={value => updateFrame(index, 'dancers', value)} />
                <FrameChoice label={`${fr ? 'Genre de danse, image' : 'Dance genre, frame'} ${index + 1}`} value={frame.movement} options={movementOptions.map(value => ({ value, label: value }))} open={frameChoiceOpen?.index === index && frameChoiceOpen.key === 'movement'} onToggle={() => setFrameChoiceOpen(current => current?.index === index && current.key === 'movement' ? null : { index, key: 'movement' })} onChange={value => updateFrame(index, 'movement', value)} />
                <FrameChoice label={`${fr ? 'Séquence image' : 'Frame sequence'} ${index + 1}`} value={frame.phrase} options={[
                  { value: '15', label: '15 sec' },
                  { value: '30', label: '30 sec' },
                  { value: '45', label: '45 sec' },
                  { value: '60', label: '1 min' },
                  { value: '75', label: '1 min 15' },
                  { value: '90', label: '1 min 30' },
                  { value: '105', label: '1 min 45' },
                  { value: '120', label: '2 min' },
                ]} open={frameChoiceOpen?.index === index && frameChoiceOpen.key === 'phrase'} onToggle={() => setFrameChoiceOpen(current => current?.index === index && current.key === 'phrase' ? null : { index, key: 'phrase' })} onChange={value => updateFrame(index, 'phrase', value)} />
                <FrameChoice label={`${fr ? 'Reprises image' : 'Frame repeats'} ${index + 1}`} value={frame.repetitions} options={['3', '5', '8', '10'].map(value => ({ value, label: value }))} open={frameChoiceOpen?.index === index && frameChoiceOpen.key === 'repetitions'} onToggle={() => setFrameChoiceOpen(current => current?.index === index && current.key === 'repetitions' ? null : { index, key: 'repetitions' })} onChange={value => updateFrame(index, 'repetitions', value)} />
              </div>)}
            </div>
            <button className={styles.addFrameButton} type="button" onClick={addFrame}>
              <i aria-hidden="true" /><span>{fr ? 'AJOUTER UNE IMAGE' : 'ADD FRAME'}</span><small>{String(frames.length + 1).padStart(2, '0')}</small>
            </button>

            <div className={styles.productionRhythm}>
              <div>
                <p>{fr ? 'ÉTAPE FINALE' : 'FINAL STEP'}</p>
                <h3>{fr ? 'Définissez le rythme de prise de vue.' : 'Set the shooting rhythm.'}</h3>
              </div>
              <div className={styles.shootPlan}>
                <label>{fr ? 'Images par jour de prise de vue' : 'Frames per shooting day'}
                  <span className={styles.numberChoices}>{['4', '6', '8', '10'].map(value => <button type="button" key={value} aria-pressed={framesPerDay === value} onClick={() => setFramesPerDay(value)}>{value}</button>)}</span>
                </label>
                <label>{fr ? 'Nombre total de jours' : 'Total shooting days'}
                  <span className={styles.numberChoices}>{['1', '2', '3', '4', '5'].map(value => <button type="button" key={value} aria-pressed={shootDays === value} onClick={() => setShootDays(value)}>{value}</button>)}</span>
                </label>
              </div>
            </div>

            <div className={styles.frameSummary}>
              <div><span>{fr ? 'IMAGES PLANIFIÉES' : 'PLANNED FRAMES'}</span><strong>{String(frames.length).padStart(2, '0')}</strong></div>
              <div><span>{fr ? 'TEMPS IMAGE CIBLÉ' : 'FOCUSED FRAME TIME'}</span><strong>{Math.floor(totalFrameMinutes / 60)}H {totalFrameMinutes % 60 ? `${totalFrameMinutes % 60}M` : ''}</strong></div>
              <div><span>{fr ? 'CAPACITÉ DU PROJET' : 'PROJECT CAPACITY'}</span><strong>{Number(framesPerDay) * Number(shootDays)}</strong><small>{fr ? 'images sur' : 'frames across'} {shootDays} {fr ? 'jours' : Number(shootDays) === 1 ? 'day' : 'days'}</small></div>
              <button className={styles.frameSubmitButton} type="button" onClick={() => void submitFramePlan()}>{frameSubmitStatus || (fr ? 'ENVOYER' : 'SUBMIT')} <span aria-hidden="true">→</span></button>
            </div>
          </div>
          {frameBriefOpen !== null && typeof document !== 'undefined' && createPortal(<div className={`${styles.frameBriefVeil} ${frameBriefClosing ? styles.frameBriefVeilClosing : ''}`} role="dialog" aria-modal="true" aria-label={fr ? `Direction visuelle de l’image ${frameBriefOpen + 1}` : `Visual direction for frame ${frameBriefOpen + 1}`} onMouseDown={event => { if (event.target === event.currentTarget) closeFrameBrief(); }}>
            <section className={styles.frameBriefModal}>
              <header><div><p>{fr ? 'VISUEL SOUHAITÉ' : 'DESIRED VISUAL'} · {String(frameBriefOpen + 1).padStart(2, '0')}</p></div><button type="button" onClick={closeFrameBrief} aria-label={fr ? 'Fermer' : 'Close'}>×</button></header>
              <div className={styles.frameBriefBody}>
                <nav aria-label={fr ? 'Sections du brief' : 'Brief sections'}>{frameBriefTabs.map(tab => <button type="button" key={tab.key} aria-pressed={frameBriefTab === tab.key} onClick={() => setFrameBriefTab(tab.key)}><span>{fr ? tab.fr : tab.en}</span><i>{frameBriefDraft[tab.key].trim() ? '●' : '○'}</i></button>)}</nav>
                <div className={styles.frameBriefEditor}>
                  <div className={styles.frameBriefVisualChoice}><label htmlFor="frame-visual-type">{fr ? 'TYPE DE VISUEL' : 'VISUAL TYPE'}</label><select id="frame-visual-type" value={frames[frameBriefOpen].visual} onChange={event => updateFrame(frameBriefOpen, 'visual', event.target.value)}>{visualOptions.map(value => <option key={value}>{value}</option>)}</select></div>
                  <p>{fr ? frameBriefTabs.find(tab => tab.key === frameBriefTab)?.promptFr : frameBriefTabs.find(tab => tab.key === frameBriefTab)?.prompt}</p>
                  <textarea autoFocus value={frameBriefDraft[frameBriefTab]} onChange={event => setFrameBriefDraft(current => ({ ...current, [frameBriefTab]: event.target.value }))} maxLength={1800} placeholder={fr ? 'Commencez par ce que vous voyez…' : 'Begin with what you see…'} />
                  <small>{frameBriefDraft[frameBriefTab].length} / 1800</small>
                </div>
              </div>
              <footer><p>{frameBriefStatus || (fr ? 'Chaque section sera composée au sein d’un même brief partagé.' : 'Every section will be composed within one shared brief.')}</p><button type="button" onClick={() => void saveFrameBrief()}>{fr ? 'ENREGISTRER ET FERMER' : 'SAVE & CLOSE'} <span>→</span></button></footer>
            </section>
          </div>, document.body)}
          </>}
        </section>
      ) : (
        <section className={`${styles.content} ${styles.brief}`} aria-labelledby="client-title">
          <div><button className={styles.back} onClick={() => setStep('project')}>← {fr ? 'Votre projet' : 'Your project'}</button><p className={styles.eyebrow}>02 / {fr ? project.fr.toUpperCase() : project.en.toUpperCase()}</p><h1 id="client-title" ref={heading} tabIndex={-1}>{fr ? 'Votre vision,' : 'Your vision,'}<br /><span>{fr ? 'en quelques mots.' : 'in your words.'}</span></h1><p className={styles.briefIntro}>{fr ? 'Partagez les premières lignes de votre projet. Les détails se dessineront ensemble.' : 'Share the first thoughts behind your project. We will shape the details together.'}</p><p className={styles.discretion}>{fr ? 'UNE CONVERSATION AVANT TOUT.' : 'A CONVERSATION, FIRST.'}</p></div>
          <form onSubmit={prepareEmail} className={styles.form}>
            <p className={styles.formNote}>{fr ? '* Champs requis' : '* Required fields'}</p>
            <div className={styles.fields}>{([
              ['name', fr ? 'Votre nom' : 'Your name', 'name'], ['email', fr ? 'Votre adresse e-mail' : 'Your email', 'email'], ['organisation', fr ? 'Maison / organisation' : 'House / organisation', 'organization'], ['location', fr ? 'Lieu envisagé' : 'Envisaged location', 'off'], ['timing', fr ? 'Calendrier envisagé' : 'Envisaged timing', 'off'],
            ] as const).map(([key, label, autocomplete]) => <label key={key}>{label}{(key === 'name' || key === 'email') && ' *'}<input name={key} type={key === 'email' ? 'email' : 'text'} autoComplete={autocomplete} required={key === 'name' || key === 'email'} maxLength={150} value={draft[key]} onChange={e => { setPrepared(false); setDraft({ ...draft, [key]: e.target.value }); }} /></label>)}</div>
            <label>{fr ? 'Racontez-nous votre idée' : 'Tell us about your idea'} *<textarea name="vision" required maxLength={1500} rows={4} value={draft.vision} onChange={e => { setPrepared(false); setDraft({ ...draft, vision: e.target.value }); }} placeholder={fr ? 'Une atmosphère, une histoire, une ambition…' : 'An atmosphere, a story, an ambition…'} /></label>
            <p className={styles.formNote}>{fr ? 'Votre messagerie s’ouvrira avec votre brief. Rien n’est envoyé ni enregistré sur ce site.' : 'Your email app will open with your brief. Nothing is sent or saved on this site.'}</p>
            <button type="submit" className={styles.submit}>{fr ? 'Préparer notre échange' : 'Begin our conversation'} <span aria-hidden="true">↗</span></button>
            {prepared && <div className={styles.status} role="status"><p>{fr ? 'Votre brief est prêt. Envoyez-le depuis votre messagerie à contact@studiosanch.com. Si elle ne s’est pas ouverte, téléchargez votre brief.' : 'Your brief is ready. Send it from your email app to contact@studiosanch.com. If it did not open, download your brief.'}</p><button type="button" className={styles.back} onClick={downloadBrief}>{fr ? 'Télécharger le brief' : 'Download your brief'} ↓</button></div>}
          </form>
        </section>
      )}
      <footer className={styles.footer}><span>STUDIO SANCH</span><span>PARIS, FRANCE</span></footer>
    </main>
  );
}
