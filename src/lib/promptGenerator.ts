import { Project } from '@/types/project';

function buildProjectHeader(project: Project): string {
    return `PROJECT CONTEXT
Title: ${project.config.title}
Genre: ${project.config.genre}
Tone: ${project.config.tone}
Length target: ${project.config.length_target}
Logline: ${project.config.logline}`;
}

function stage1Prompt(project: Project): string {
    return `You are working on a new ${project.config.genre} story.

${buildProjectHeader(project)}

Your task is to develop the full creative foundation for this story. Go beyond the logline — find what the story is really about underneath the surface.

Produce the following sections:

PREMISE
Expand the logline into a 2-3 sentence premise. Identify the central irony: the gap between what the protagonist wants and what they actually need. What do they believe about the world that this story will test?

CHARACTERS
Define 3-4 characters. For each provide:
- Name and role
- What they want (surface goal)
- What they need (deeper, often opposite to what they want)
- Their wound (what shaped them before the story begins)
- Their contradiction (what they believe vs how they actually behave)
- One secret they're keeping

DRAMATIC QUESTION
State the single question the entire story is building toward. It must be answerable with yes or no, but feel genuinely impossible to predict from the start.

STRUCTURE
Describe the shape of the story in 3-5 sentences. Not a chapter breakdown — the emotional and dramatic arc. How does tension escalate? Where does the story turn? What does the ending do to everything that came before?

THEMES
List 2-3 thematic oppositions the story explores (e.g. loyalty vs survival, memory vs presence). For each, note which side the story ultimately comes down on — or whether it refuses to choose.

Do not add any preamble, sign-off, or meta-commentary. Respond with the five sections only.`;
}

function stage2Prompt(project: Project): string {
    let chapterCount: string | number = 10;
    if (project.config.length_target === 'short_story') chapterCount = '5-8';
    else if (project.config.length_target === 'novella') chapterCount = '10-14';
    else if (project.config.length_target === 'novel') chapterCount = '16-24';

    return `You are outlining a ${project.config.genre} story.

${buildProjectHeader(project)}

FOUNDATION
${project.foundation || ''}

Your task is to produce a full chapter-by-chapter outline. Target ${chapterCount} chapters for a ${project.config.length_target}.

For each chapter provide:
- Chapter number and title
- POV character
- Location
- Beats (3-5 bullet points of what happens)
- Emotional arc (where the POV character starts emotionally and where they end)
- What the reader learns in this chapter
- What the reader does NOT learn yet (what is being withheld)
- The chapter's narrative function (e.g. "establishes false safety", "forces the first real choice", "reveals the cost of the protagonist's flaw")

The outline as a whole must include:
- A moment of false resolution at or near the midpoint
- A reversal that recontextualises earlier events
- At least one moment of genuine character choice (where the outcome is not inevitable)

Do not add any preamble or sign-off. Respond with the chapter outline only.`;
}

function stage3Prompt(project: Project): string {
    const current_chapter = project.current_chapter || 1;

    // Extract current chapter section from outline text
    const outline = project.outline || '';
    let chapterSection = '';
    const chapterRegex = new RegExp(`Chapter ${current_chapter}\\b`, 'i');
    const nextChapterRegex = new RegExp(`Chapter ${current_chapter + 1}\\b`, 'i');
    const startIdx = outline.search(chapterRegex);
    if (startIdx !== -1) {
        const remaining = outline.slice(startIdx);
        const nextIdx = remaining.search(nextChapterRegex);
        chapterSection = nextIdx !== -1
            ? remaining.slice(0, nextIdx).trim()
            : remaining.trim();
    } else {
        chapterSection = `(Could not extract Chapter ${current_chapter} section from outline)`;
    }

    // Continuity anchor: last 3 sentences of previous chapter
    let previousChapterBlock = '';
    if (current_chapter > 1 && project.chapters.length >= current_chapter - 1) {
        const prevChapter = project.chapters[current_chapter - 2];
        const content = prevChapter.sharp || prevChapter.draft || '';
        if (content) {
            const sentences = content.match(/[^.!?]+[.!?]+/g) || [];
            const tail = sentences.length <= 3
                ? content
                : sentences.slice(-3).join(' ').trim();
            previousChapterBlock = `\nCONTINUITY — final lines of Chapter ${current_chapter - 1}:\n${tail}\n`;
        }
    }

    // Reader response from previous chapter — inject as creative signal, not instruction
    let readerBlock = '';
    if (current_chapter > 1 && project.chapters.length >= current_chapter - 1) {
        const prevReader = project.chapters[current_chapter - 2].reader;
        if (prevReader) {
            readerBlock = `\nREADER RESPONSE TO CHAPTER ${current_chapter - 1} (for context — what a reader felt and wanted after the last chapter):\n${prevReader}\nWrite Chapter ${current_chapter} knowing this is where the reader's head is. You may satisfy, subvert, or complicate those expectations — but be aware of them.\n`;
        }
    }

    return `You are writing Chapter ${current_chapter} of a ${project.config.genre} story.

${buildProjectHeader(project)}

FOUNDATION
${project.foundation || ''}

FULL OUTLINE (for context)
${project.outline || ''}

YOUR CHAPTER
${chapterSection}
${previousChapterBlock}${readerBlock}
Write Chapter ${current_chapter} in full. Target 1,500-2,500 words.

Guidelines:
- Write in the tone established in the project (${project.config.tone})
- Honour the beats in your chapter outline — they are a floor, not a ceiling. The texture around them is where the prose lives.
- Include at least one moment of unexpected specificity: a detail, image, or observation that could only exist in this story
- Let characters speak and behave in ways that are true to their contradictions and wounds
- Do not resolve the chapter too cleanly — leave something open

Respond with the chapter prose only. No title header, no commentary, no sign-off.`;
}

function stage4Prompt(project: Project): string {
    const current_chapter = project.current_chapter || 1;
    const draft = project.chapters[current_chapter - 1]?.draft || '';

    return `You are editing Chapter ${current_chapter} of a ${project.config.genre} story.

${buildProjectHeader(project)}

CHAPTER DRAFT
${draft}

Your task is targeted surgical editing — not a full rewrite.

Step 1: Identify the 2-3 weakest moments in this draft. For each:
- Quote the passage (as written)
- Explain in one sentence why it is weak (on-the-nose emotion, flat dialogue, over-explained beat, missed opportunity, etc.)

Step 2: Rewrite each identified passage. Keep everything else exactly as it is.

Step 3: Check the opening line and the closing line specifically. If either can be stronger, rewrite them.

Step 4: Deliver the full chapter with your improvements applied. Do not summarise what you changed — just give the chapter.

Format your response as:
DIAGNOSIS
[your 2-3 identified weak moments with quotes and one-line explanations]

REVISED CHAPTER
[the full chapter with improvements applied]`;
}

function stage5Prompt(project: Project): string {
    const current_chapter = project.current_chapter || 1;
    const chapter = project.chapters[current_chapter - 1];
    const content = chapter?.sharp || chapter?.draft || '';

    return `You have just read Chapter ${current_chapter} of a ${project.config.genre} story.

${buildProjectHeader(project)}

CHAPTER
${content}

Respond as an engaged reader — not an editor, not a critic. No suggestions, no craft analysis.

Tell me:
- What you are feeling right now
- What you are worried about (for a character, for the outcome, for something unresolved)
- What you want to happen next

2-3 paragraphs. No headers. Pure reader response.`;
}

function stage7Prompt(project: Project): string {
    const firstChapter = project.chapters[0];
    const firstChapterContent = firstChapter?.sharp || firstChapter?.draft || '';
    const finalChapter = project.chapters[project.chapters.length - 1];
    const finalChapterContent = finalChapter?.sharp || finalChapter?.draft || '';

    return `You have just finished reading a ${project.config.genre} story.

${buildProjectHeader(project)}

FOUNDATION
${project.foundation || ''}

FIRST CHAPTER
${firstChapterContent}

FINAL CHAPTER
${finalChapterContent}

Produce the following:

TITLE OPTIONS
Four possible titles. For each, one sentence on what it emphasises.

BLURB
A back-cover blurb of 80-120 words. Establish the world and protagonist in the first sentence. Create tension. Do not reveal the ending.

OPENING / ENDING ASSESSMENT
Does the ending recontextualise the opening? Is the dramatic question answered, deliberately withheld, or complicated? 2-3 sentences.

VERDICT
One sentence. What kind of reader is this story for?

Do not add any preamble or sign-off.`;
}

export function generateLoadout(stage: number, project: Project): string {
    switch (stage) {
        case 1: return stage1Prompt(project);
        case 2: return stage2Prompt(project);
        case 3: return stage3Prompt(project);
        case 4: return stage4Prompt(project);
        case 5: return stage5Prompt(project);
        case 6: return ''; // Assembler: auto-advance, no prompt needed
        case 7: return stage7Prompt(project);
        default: return '';
    }
}
