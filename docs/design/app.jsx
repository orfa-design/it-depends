// app.jsx — state machine + prompt modal + tweaks

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "typo": "geometric",
  "mapStyle": "vertical",
  "density": "balanced"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => {
    document.body.dataset.typo    = t.typo;
    document.body.dataset.density = t.density;
  }, [t.typo, t.density]);

  const [phase,    setPhase]    = React.useState('intro'); // 'intro' | 'story' | 'analysis' | 'map' | 'complete'
  const [storyIdx, setStoryIdx] = React.useState(0);
  const [reactions, setReactions] = React.useState([]);
  const [modal,    setModal]    = React.useState(null);   // null | 'prompt'
  const [promptStepIdx, setPromptStepIdx] = React.useState(CUR_IDX);

  const pickReaction = (v) => {
    const next = [...reactions, v];
    setReactions(next);
    if (storyIdx + 1 < STORIES.length) {
      setStoryIdx(storyIdx + 1);
    } else {
      setPhase('analysis');
      setModal(null);
    }
  };

  const reset = () => {
    setReactions([]);
    setStoryIdx(0);
    setPhase('intro');
    setModal(null);
  };

  return (
    <div className="app">
      <Chrome phase={phase} storyIdx={storyIdx} modal={modal} />

      {phase === 'intro' && (
        <IntroScreen onStart={() => setPhase('story')} />
      )}

      {phase === 'story' && (
        <StoryScreen idx={storyIdx} onPick={pickReaction} />
      )}

      {phase === 'analysis' && (
        <AnalysisScreen
          reactions={reactions}
          onDone={() => { setPhase('map'); setModal(null); }}
        />
      )}

      {phase === 'map' && (
        <>
          <MapScreen
            style={t.mapStyle}
            onStartPrompt={(idx) => { setPromptStepIdx(idx != null ? idx : CUR_IDX); setModal('prompt'); }}
          />
          {modal === 'prompt' && (
            <StepModal
              stepIdx={promptStepIdx}
              onClose={() => setModal(null)}
              onDone={() => { setModal(null); setPhase('complete'); }}
            />
          )}
        </>
      )}

      {phase === 'complete' && (
        <CompleteScreen onReset={reset} />
      )}

      <TweaksPanel title="It Depends · tweaks">
        <TweakSection label="Typography" />
        <TweakRadio
          label="System"
          value={t.typo}
          options={[
            { value: 'geometric', label: 'Geo'  },
            { value: 'editorial', label: 'Edit' },
            { value: 'mono',      label: 'Mono' },
          ]}
          onChange={(v) => setTweak('typo', v)} />

        <TweakSection label="Map" />
        <TweakRadio
          label="Visual"
          value={t.mapStyle}
          options={[
            { value: 'vertical',      label: 'Path'  },
            { value: 'constellation', label: 'Const' },
            { value: 'typographic',   label: 'List'  },
          ]}
          onChange={(v) => setTweak('mapStyle', v)} />

        <TweakSection label="Density" />
        <TweakRadio
          label="Pacing"
          value={t.density}
          options={[
            { value: 'spacious', label: 'Wide'  },
            { value: 'balanced', label: 'Mid'   },
            { value: 'compact',  label: 'Tight' },
          ]}
          onChange={(v) => setTweak('density', v)} />

        <TweakSection label="Jump to" />
        <TweakButton label="Restart" onClick={reset} />
        <TweakButton secondary label="Intro"        onClick={() => { setPhase('intro'); setModal(null); }} />
        <TweakButton secondary label="Story 01"     onClick={() => { setPhase('story'); setStoryIdx(0); setModal(null); }} />
        <TweakButton secondary label="Analysis"     onClick={() => { setPhase('analysis'); setModal(null); }} />
        <TweakButton secondary label="Map"          onClick={() => { setPhase('map'); setModal(null); }} />
        <TweakButton secondary label="Prompt modal" onClick={() => { setPhase('map'); setModal('prompt'); }} />
        <TweakButton secondary label="Completion"   onClick={() => { setPhase('complete'); setModal(null); }} />
      </TweaksPanel>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
