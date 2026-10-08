# plasticproject

**Engineers Without Borders (EWB) Norway – Plastic Detection**

An interactive "Plastic Detection" feature for the EWB Norway website ([iug.no](https://iug.no/)). It helps users identify different types of plastics (PET, HDPE, PVC, LDPE, PP, PS, and OTHER) using simple household tests like floating or sinking in fresh water, vegetable oil, ethanol, and salt water.

> This is a prototype, intended to be integrated into the official iug.no website later.

## Project Structure

```
plasticproject/
├── index.html         # Page markup (header, quiz container, footer)
├── styles.css         # EWB design system + responsive layout
├── script.js          # Quiz state machine and rendering logic
├── plasticData.json   # Plastic info: descriptions, uses, recyclability, links
├── quizSteps.json     # Flowchart: each step and its Float/Sink transitions
├── EWB Logo.png       # Logo (header, footer)
└── ewb favicon.png    # Square favicon
```

## Running Locally

The app loads its data with `fetch()`, so opening `index.html` directly via `file://` will fail due to browser CORS restrictions. Run a simple local server instead:

```bash
python3 -m http.server 8080
```

Then navigate to `http://localhost:8080`.

## Features & Implementation Details

1. **Design System Integration**
   - Extracted and applied the exact visual identity from the original EWB Norway website.
   - Utilized the `Inter` font, custom green color palette (`#E0EADF`, `#3D7844`), and exact header/footer styling.
   - `ewb favicon.png` is used as the site favicon.

2. **Interactive Step-by-Step Quiz Logic (The "Backend")**
   - The entire quiz runs directly in the browser using Vanilla JavaScript. There is no external database or server; the logic is handled by a state machine in `script.js`.
   - **State Machine:** The flowchart logic is defined in `quizSteps.json`. Every step (e.g., `fresh-water`, `veg-oil`) knows what the next step should be depending on whether the user clicks "Float" or "Sink".
   - **Progress Tracking:** Variables like `currentStep` and `currentResult` track where the user is in the test. When a user clicks a button, a function updates the state and re-renders the DOM with the next question.
   - **Data Storage:** The plastic information (descriptions, uses, recyclability) and the quiz flow live in `plasticData.json` and `quizSteps.json`. The application loads these asynchronously with `fetch()` on startup, which also sets the project up for future backend integration. To change any quiz text or links, just edit the JSON files.

3. **External Resources & Contact Info**
   - For plastic categories 1–6, the "Learn more" buttons link directly to their respective Wikipedia articles for detailed reading.
   - For category 7 (OTHER), a custom modal overlay is displayed. This modal contains specific contact information for recycling questions, including local (Trondheim Renholdsverk) and national (sortere.no) support emails.

4. **Responsive Footer Updates**
   - Redesigned the mobile footer to exactly match a provided mockup.
   - On small screens, text links stack neatly on the left while large, dark-green social icons stack vertically on the right with a transparent background.

5. **Link and Navigation Cleanup**
   - Replaced all placeholder navigation and header/footer links with actual URLs pointing to `https://iug.no/` (e.g., Login, Sign Up, Privacy Policy, About Us).
   - Removed unnecessary navigation tabs for a more focused user experience.
   - Removed emojis from buttons and icons for a cleaner, more professional look.

## Technologies Used

- HTML5
- CSS3 (Custom Variables, Flexbox, Media Queries)
- Vanilla JavaScript
- JSON (quiz and plastic data)

## Contributing

Clone the repository:

```
git clone https://github.com/aidportaliug/plasticproject.git
cd plasticproject
```

Create a branch where you will develop from:
```
git checkout -b name-of-change
```

Once you are satisfied with your change, create a commit as follows (how to write a commit message https://chris.beams.io/git-commit):

```
git add file1.py file2.py ...
git commit -m "Your commit message"
```

Push the changes to the repository:

```
git push origin name-of-change
```