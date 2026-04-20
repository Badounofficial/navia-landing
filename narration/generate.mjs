#!/usr/bin/env node
/**
 * Ozaia Narration Generator
 *
 * Reads sections.json, sends each section's text to ElevenLabs TTS,
 * saves the resulting MP3 files to Website/audio/.
 *
 * Usage:
 *   cd ~/Desktop/Ozaia\ App/Website/narration
 *   node generate.mjs
 *
 * Requires:
 *   - ElevenLabs API key in ../../navia-voice/.env.local
 *     (reads ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID)
 *   - Node.js 18+ (for native fetch)
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const AUDIO_DIR = join(__dirname, '..', 'audio');
const SECTIONS_FILE = join(__dirname, 'sections.json');

// ─── Load env from navia-voice/.env.local ───
function loadEnv() {
  const envPath = join(__dirname, '..', '..', 'navia-voice', '.env.local');
  if (!existsSync(envPath)) {
    console.error('Cannot find navia-voice/.env.local');
    console.error('Expected at:', envPath);
    process.exit(1);
  }
  const lines = readFileSync(envPath, 'utf-8').split('\n');
  const env = {};
  for (const line of lines) {
    const match = line.match(/^([A-Z_]+)=(.+)$/);
    if (match) env[match[1]] = match[2].trim();
  }
  return env;
}

// ─── Generate one MP3 via ElevenLabs ───
async function generateAudio(text, voiceId, apiKey) {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          speed: 0.85,
          stability: 0.45,
          similarity_boost: 0.64,
          style: 0.18,
          use_speaker_boost: false,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ElevenLabs API error ${response.status}: ${errorText}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

// ─── Main ───
async function main() {
  const env = loadEnv();
  const apiKey = env.ELEVENLABS_API_KEY;
  const voiceId = env.ELEVENLABS_VOICE_ID;

  if (!apiKey || !voiceId) {
    console.error('Missing ELEVENLABS_API_KEY or ELEVENLABS_VOICE_ID in .env.local');
    process.exit(1);
  }

  // Create audio output directory
  mkdirSync(AUDIO_DIR, { recursive: true });

  // Load sections
  const sections = JSON.parse(readFileSync(SECTIONS_FILE, 'utf-8'));

  console.log(`\nGenerating ${sections.length} audio sections...\n`);
  console.log(`Voice ID: ${voiceId}`);
  console.log(`Output:   ${AUDIO_DIR}\n`);

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const filename = `${String(i + 1).padStart(2, '0')}-${section.id}.mp3`;
    const filepath = join(AUDIO_DIR, filename);

    // Skip if already generated
    if (existsSync(filepath)) {
      console.log(`  [skip] ${filename} (already exists)`);
      continue;
    }

    console.log(`  [${i + 1}/${sections.length}] Generating ${filename}...`);
    console.log(`          "${section.text.substring(0, 60)}..."`);

    try {
      const audioBuffer = await generateAudio(section.text, voiceId, apiKey);
      writeFileSync(filepath, audioBuffer);
      console.log(`          Done (${(audioBuffer.length / 1024).toFixed(0)} KB)\n`);

      // Brief pause between requests to be respectful to the API
      if (i < sections.length - 1) {
        await new Promise(r => setTimeout(r, 1000));
      }
    } catch (error) {
      console.error(`          FAILED: ${error.message}\n`);
    }
  }

  console.log('\nGeneration complete.');
  console.log(`Audio files are in: ${AUDIO_DIR}`);
  console.log('\nNext step: deploy the Website folder to Vercel.');
}

main();
