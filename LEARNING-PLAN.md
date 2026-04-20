# Ozaia — Dual Track Plan: Site + JavaScript Learning

*Chef d'orchestre: Claude | Started: April 9, 2026*

---

## How This Works

Two tracks running in parallel. Every week has a clear goal for each.

- **Track A (Site)** — We do this together in our sessions. I code, you deploy.
- **Track B (JavaScript)** — You learn solo between our sessions. I answer questions, review your code, unblock you.

---

## Week 1 (April 9-15, 2026)

### Track A — Site: Phase 1.5 Kickoff
- [ ] Scroll animations (fade-in on scroll) — IntersectionObserver
- [ ] Phone mockup in hero section (CSS-only iPhone frame with app preview)
- **We do this together now**

### Track B — JavaScript: Day 1-7
**Goal: Understand what code IS and write your first lines**

**Day 1-2: javascript.info — The Basics**
- Go to: https://javascript.info/first-steps
- Read + do exercises for:
  - "Hello, world!" (your first program)
  - Variables (`let name = "Ozaia"`)
  - Data types (text, numbers, true/false)
- **Time: 1-2 hours**

**Day 3-4: Conditions & Logic**
- https://javascript.info/ifelse
- `if / else` — how the computer makes decisions
- Think of it like Ozaia deciding: IF mood is sad THEN send comfort message
- **Time: 1-2 hours**

**Day 5-6: Functions**
- https://javascript.info/function-basics
- Functions = reusable instructions (like a recipe)
- You already know one: `toggleMenu()` in your site!
- **Time: 1-2 hours**

**Day 7: Practice**
- Open your browser → right-click → "Inspect" → "Console" tab
- Type code directly and see it run
- Try: `alert("Welcome to Ozaia")` and see what happens
- **Time: 30 min, just play**

---

## Week 2 (April 16-22)

### Track A — Site: Stats Section + Micro-interactions
- [ ] "The Numbers Speak" stats section with women's health data
- [ ] Hover effects on module cards
- [ ] Button micro-animations

### Track B — JavaScript: Arrays & Objects
**Goal: Understand how data is organized**

**Day 1-2: Arrays (lists)**
- https://javascript.info/array
- An array is a list: `let moods = ["happy", "tired", "calm"]`
- Like a list of Ozaia users or a week of mood check-ins
- **Time: 1-2 hours**

**Day 3-4: Objects (profiles)**
- https://javascript.info/object
- An object is a profile card:
  ```javascript
  let user = {
    name: "Emma",
    age: 28,
    phase: "pregnant",
    week: 24
  }
  ```
- This is EXACTLY how Ozaia will store each user's data
- **Time: 1-2 hours**

**Day 5-7: Mini-project**
- Create a "mood tracker" in the browser console:
  - An array of 7 objects (one per day)
  - Each object has: day, mood, energy, note
  - Write a function that finds the happiest day
- **Time: 2-3 hours total**

---

## Week 3 (April 23-29)

### Track A — Site: Feature Layout Redesign
- [ ] Phone mockup left + numbered features right (modules section)
- [ ] Improved visual hierarchy
- [ ] Mobile responsive adjustments

### Track B — JavaScript: DOM Manipulation
**Goal: Make JavaScript change things on a web page**

**Day 1-3: The DOM**
- https://javascript.info/document
- DOM = the page's structure that JavaScript can modify
- `document.querySelector(".hero-title")` — grab an element
- `.textContent = "New text"` — change it
- `.style.color = "red"` — style it
- **This is what makes your site interactive!**
- **Time: 3-4 hours total**

**Day 4-5: Events**
- https://javascript.info/events
- `button.addEventListener("click", function() { ... })`
- Like: when she taps "check-in", show the mood selector
- **Time: 2-3 hours**

**Day 6-7: Mini-project**
- Build a simple HTML page with:
  - A text input for "How are you feeling?"
  - A button "Submit"
  - When clicked, the text appears below in a list
  - Bonus: change the background color based on mood words
- **Time: 3-4 hours**
- **Send me your code, I'll review it!**

---

## Week 4 (April 30 - May 6)

### Track A — Site: Final Phase 1.5 Polish
- [ ] Video/animation in phone mockup (if available)
- [ ] Final responsive testing
- [ ] PageSpeed verification (must stay 95+)
- [ ] Deploy final Phase 1.5

### Track B — JavaScript: Async & APIs
**Goal: Understand how apps talk to the internet**

**Day 1-2: Promises & async/await**
- https://javascript.info/async
- When Ozaia sends a diary entry to Claude AI, it WAITS for a response
- `async/await` is how JavaScript handles waiting
- **Time: 2-3 hours**

**Day 3-4: Fetch API**
- https://javascript.info/fetch
- `fetch()` = ask the internet for something
- Try: `fetch("https://api.quotable.io/random")` — get a random quote
- This is how your app will talk to Supabase and Claude
- **Time: 2-3 hours**

**Day 5-7: Capstone project**
- Build "Ozaia Mini" — a simple HTML/JS page:
  - User types their name and mood
  - Data is stored in an array (simulating a database)
  - Page shows a history of all check-ins
  - A function analyzes: "Your most common mood this week is: calm"
- **This is literally a micro-version of the Ozaia app!**
- **Time: 4-5 hours**

---

## After Week 4: Transition to React

Once you've completed Weeks 1-4, you'll understand:
- Variables, functions, conditions, loops
- Arrays and objects (data structures)
- DOM manipulation (making pages interactive)
- Async operations (talking to servers)

Then we start React (Week 5-6) and React Native + Expo (Week 7-8), and you'll be building the actual Ozaia app.

---

## Where to Write Code

### For learning (Weeks 1-2):
- **Browser console** — right-click any page → Inspect → Console
- **javascript.info** has built-in code editors in every lesson

### For projects (Weeks 3-4):
- **VS Code** — download from https://code.visualstudio.com (free)
- Create a folder called `navia-learning/` on your Desktop
- Create `.html` files and open them in your browser

### For the app (Week 5+):
- **VS Code** + **Expo Go** app on your phone
- You'll see your app live on your phone as you code

---

## Rules of the Game

1. **Don't try to understand everything.** Understand enough to move forward.
2. **Type the code, don't copy-paste.** Your fingers need to learn the syntax.
3. **Break things on purpose.** Change a number, delete a line, see what happens.
4. **15 minutes stuck = ask me.** Don't waste hours on a single error.
5. **Every Sunday, send me your progress.** I'll adjust the plan if needed.

---

## Progress Tracker

| Week | Track A (Site) | Track B (JavaScript) | Status |
|------|---------------|---------------------|--------|
| 1 | Scroll animations + phone mockup | Variables, conditions, functions | IN PROGRESS |
| 2 | Stats section + hover effects | Arrays, objects, mini-project | — |
| 3 | Feature layout redesign | DOM manipulation, events | — |
| 4 | Final polish + deploy | Async, fetch, capstone project | — |
| 5 | — | React basics | — |
| 6 | — | React continued | — |
| 7 | — | React Native + Expo setup | — |
| 8 | — | App shell (7 screens) | — |

---

*Updated: April 9, 2026*
