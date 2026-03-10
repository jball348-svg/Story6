# Story6

Story6 is a brutalist, copy-paste-driven pipeline for generating long-form ficiton with an LLM. It manages the state, chapter progression, and compilation of the manuscript across seven distinct structural stages, focusing on a minimalist interface that keeps you in the flow of the story.

## How It Works

Story6 uses a "conveyor" mechanic rather than direct API integrations. In the left panel, you see your progress through the 7 stages of writing. The center top panel provides a "Loadout" (a prompt to be copied to your clipboard), which you paste into an LLM like Claude. You then paste the LLM's output into the center bottom panel ("Loadin") and submit. This advances the pipeline state, saves the output to the local file system (`projects/{uuid}/project.json`), and prepares the next loadout.

*(Note: Phase 1 focuses on scaffolding this UI and the state management. Phase 2 will add the actual generated prompts to the Loadout panel.)*

## The 7 Stages

1. **Architect**: Establish the core foundation based on your genre and logline.
2. **Cartographer**: Map out the detailed chapter-by-chapter outline.
3. **Writer**: Generate the first draft of a specific chapter. *(Repeats per chapter)*
4. **Sharpener**: Refine and edit the chapter draft. *(Repeats per chapter)*
5. **Reader** *(Optional)*: Provide high-level feedback or critique for the chapter. *(Repeats per chapter)*
6. **Assembler**: Automatically compiles completed chapters into a full manuscript.
7. **Closer**: Final review and completion.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.
4. Click **New Project** to create a story and enter the pipeline view.
