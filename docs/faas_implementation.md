# FaaS Platform: Implementation Plan

This plan outlines the steps to replicate and scale the **Funnel-as-a-Service (FaaS)** architecture developed for the Aurum ecosystem. This setup allows you to create unlimited marketing projects and sales angles using a single codebase.

## 1. Directory Architecture
Create the following structure to support modularity:

```bash
src/
  app/
    f/[projectId]/[angleId]/page.js  # The Dynamic Engine
  components/
    funnel/
      blocks/                       # Reusable UI sections
        HeroPitch.js
        CustomTicker.js
        BotEarningsBadge.js
        FAQ.js
      angles/                       # High-level sales frameworks
        PitchAngle.js
        ConsultativeAngle.js
      AngleRegistry.js              # The "Brain" (Central mapping)
```

## 2. Phase 1: Modularizing Blocks
Convert hardcoded sections from existing funnels into **Functional Blocks** that accept a `content` prop.

### Key Blocks to Create:
1.  **`HeroBlock`**: Accepts `title`, `subtitle`, `videoUrl`.
2.  **`StatsBlock`**: Accepts verified yield data.
3.  **`TrustBlock`**: Accepts testimonials and logos.
4.  **`OptInBlock`**: Handles lead capture via the existing `OptInBadge`.

## 3. Phase 2: Setting up the Angle Registry
The **Angle Registry** allows you to decouple the "Psychology" of the page from the "Code."

### `src/components/funnel/AngleRegistry.js`
```javascript
import PitchAngle from './angles/PitchAngle';
import ConsultativeAngle from './angles/ConsultativeAngle';

const AngleRegistry = {
  'pitch': PitchAngle,
  'consultative': ConsultativeAngle,
  // Add future angles (e.g., 'fear', 'logic', 'social') here
};

export default AngleRegistry;
```

## 4. Phase 3: Implementing the Dynamic Engine
Create the dynamic route to resolve projects and angles on the fly.

### `src/app/f/[projectId]/[angleId]/page.js`
- **Logic**: 
  1. Extract `projectId` and `angleId` from the URL.
  2. Fetch project-specific content (from Supabase or a local JSON).
  3. Look up the `angleId` in the `AngleRegistry`.
  4. Render the resolved `AngleComponent` with the project data.

## 5. Phase 4: Scaling Data (Supabase)
To run this at scale, move project data into a database.

### Recommended Schema:
- **`projects` table**:
  - `id` (UUID)
  - `slug` (e.g., "aurum-main")
  - `name` (String)
  - `content_json` (JSONB): Stores all headlines, video URLs, and button text.
  - `config_json` (JSONB): Stores API keys (Brevo/Telegram) and colors.

## 6. How to add a new "Sales Angle"
1.  **Design**: Create a new file in `src/components/funnel/angles/`.
2.  **Build**: Sequence your existing blocks or create new ones for that specific angle.
3.  **Register**: Add the new angle to `AngleRegistry.js`.
4.  **Test**: Visit `/[projectId]/[newAngleId]` immediately.

## 7. Development Workflow
To run this on a new machine:
1.  `npm install`
2.  Ensure environment variables (`.env.local`) match the original setup (Brevo API, etc.).
3.  Run `npm run dev`.
4.  Use the `/f/` prefix to test dynamic project routing.

---
> [!TIP]
> Use the **Dynamic Engine** to run A/B tests by sending 50% of traffic to `/[projectId]/pitch` and 50% to `/[projectId]/consultative` to see which angle converts higher.
