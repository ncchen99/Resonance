🎨 Organic Minimal UI Design System
1. Overview
This design system defines a hybrid visual language that combines:
* Emotional expression through illustration (Organic Layer)
* Functional clarity through standard UI components (Functional Layer)
Core Philosophy
Emotion through visuals, clarity through structure.

2. Design Keywords
Use these as primary prompts or guiding principles:
* Warm Color Palette
* Flat Design
* Organic Curves
* Playful / Light Doodle Style
* Minimal UI
* Handcrafted Imperfection
* Soft & Friendly Interface

3. Visual Layer Structure
3.1 Layered Architecture
[ Illustration / Organic Layer ]
        ↓
[ Component Layer (Button, Card, Input) ]
        ↓
[ Content Layer (Text, Data) ]

4. Organic Visual Style (Core)
4.1 Hand-drawn Boundaries
Description
* Edges are not perfectly geometric
* Slight irregularity in curvature
* Each corner may have different radius
* Feels "human-made" rather than machine-perfect
Prompt Keywords
hand-drawn edges
imperfect rounded corners
organic uneven border
slightly irregular shape
natural curvature variation
soft asymmetry

4.2 Implementation Strategies
Preferred Methods
1. SVG Path (Recommended)
    * Best control over shape
    * Can reuse templates
    * Optimizable
2. Clip-path (Advanced)
    * Good for dynamic shapes
    * Use sparingly
3. Border-radius variation (Lightweight fallback)
border-radius: 24px 30px 26px 20px;

Performance Constraints
* Limit complex shapes per screen: max 2–3
* Avoid high node-count SVG paths
* Use reusable shape tokens
* Prefer static assets over dynamic generation

5. Fill & Texture System
5.1 Grain / Noise Texture
Description
* Subtle "grainy" or "chalk-like" texture
* Mimics illustration brush strokes
* Not too strong — should feel soft
Prompt Keywords
subtle grain texture
fine noise overlay
paper-like texture
chalk brush fill
soft illustration grain

5.2 Flat Rendering Style
Principles
* No heavy shadows
* No skeuomorphic depth
* Depth comes from:
    * color variation
    * layering
    * spacing
Avoid
* strong drop shadows
* glassmorphism
* neumorphism

5.3 Uneven Color Fill (Important)
Description
Simulate hand-painted feeling:
* Slight color inconsistency
* Brush-like variation
* Occasional white gaps or edges
* Non-uniform saturation

Prompt Keywords (Highly Important)
uneven color fill
slightly inconsistent color application
hand-painted texture
imperfect fill edges
subtle color variation
organic color distribution
soft brush strokes
visible painting irregularities
slight white gaps
natural paint bleeding edges

Optional Enhancement
* Add noise overlay layer (5~10% opacity)
* Use gradient with slight randomness

6. Component System

6.1 Organic Card
Structure
* Base: rectangle (functional)
* Overlay: organic distortion
Variants
A. Soft Organic Card (Recommended)
border-radius: 24px 32px 28px 20px;
B. Blob-backed Card
* Card is normal
* Organic shape behind it
C. Full Organic Shape (Advanced)
* SVG / clip-path
* Use sparingly

Rules
* Max 1 decorative element per card
* Maintain readability
* Padding: 20–28px

6.2 Organic Button
Concept
Keep button recognizable, enhance with organic wrapping

Structure
[ Blob / Organic Background ]
        ↓
[ Standard Button Shape ]
        ↓
[ Label ]

Properties
* Shape: rounded-full (important for affordance)
* High contrast color
* Organic background offset

Interaction
Instead of shadow:
* slight scale
* small rotation
* soft movement

Prompt Keywords
organic button with soft blob background
playful rounded button
minimal flat button with organic decoration
friendly CTA button

6.3 Input Fields
Strategy
👉 Keep clean, minimal organic touch only

Style
* rounded corners
* soft focus glow (not shadow)
* no distortion

7. Section Layout (Wave / Organic Dividers)
Description
* Use wave or blob shapes to divide sections
* Create flow instead of rigid blocks

Rules
* Max 2–3 pe下面這份我幫你整理成可以直接丟給 AI 設計工具 / 生成 UI 的 Markdown 規格文件，同時也兼顧「設計語言 + 技術實現 + prompt 描述」。

🎨 Organic Minimal UI Design System
1. Overview
This design system defines a hybrid visual language that combines:
* Emotional expression through illustration (Organic Layer)
* Functional clarity through standard UI components (Functional Layer)
Core Philosophy
Emotion through visuals, clarity through structure.

2. Design Keywords
Use these as primary prompts or guiding principles:
* Warm Color Palette
* Flat Design
* Organic Curves
* Playful / Light Doodle Style
* Minimal UI
* Handcrafted Imperfection
* Soft & Friendly Interface

3. Visual Layer Structure
3.1 Layered Architecture
[ Illustration / Organic Layer ]
        ↓
[ Component Layer (Button, Card, Input) ]
        ↓
[ Content Layer (Text, Data) ]

4. Organic Visual Style (Core)
4.1 Hand-drawn Boundaries
Description
* Edges are not perfectly geometric
* Slight irregularity in curvature
* Each corner may have different radius
* Feels "human-made" rather than machine-perfect
Prompt Keywords
hand-drawn edges
imperfect rounded corners
organic uneven border
slightly irregular shape
natural curvature variation
soft asymmetry

4.2 Implementation Strategies
Preferred Methods
1. SVG Path (Recommended)
    * Best control over shape
    * Can reuse templates
    * Optimizable
2. Clip-path (Advanced)
    * Good for dynamic shapes
    * Use sparingly
3. Border-radius variation (Lightweight fallback)
border-radius: 24px 30px 26px 20px;

Performance Constraints
* Limit complex shapes per screen: max 2–3
* Avoid high node-count SVG paths
* Use reusable shape tokens
* Prefer static assets over dynamic generation

5. Fill & Texture System
5.1 Grain / Noise Texture
Description
* Subtle "grainy" or "chalk-like" texture
* Mimics illustration brush strokes
* Not too strong — should feel soft
Prompt Keywords
subtle grain texture
fine noise overlay
paper-like texture
chalk brush fill
soft illustration grain

5.2 Flat Rendering Style
Principles
* No heavy shadows
* No skeuomorphic depth
* Depth comes from:
    * color variation
    * layering
    * spacing
Avoid
* strong drop shadows
* glassmorphism
* neumorphism

5.3 Uneven Color Fill (Important)
Description
Simulate hand-painted feeling:
* Slight color inconsistency
* Brush-like variation
* Occasional white gaps or edges
* Non-uniform saturation

Prompt Keywords (Highly Important)
uneven color fill
slightly inconsistent color application
hand-painted texture
imperfect fill edges
subtle color variation
organic color distribution
soft brush strokes
visible painting irregularities
slight white gaps
natural paint bleeding edges

Optional Enhancement
* Add noise overlay layer (5~10% opacity)
* Use gradient with slight randomness

6. Component System

6.1 Organic Card
Structure
* Base: rectangle (functional)
* Overlay: organic distortion
Variants
A. Soft Organic Card (Recommended)
border-radius: 24px 32px 28px 20px;
B. Blob-backed Card
* Card is normal
* Organic shape behind it
C. Full Organic Shape (Advanced)
* SVG / clip-path
* Use sparingly

Rules
* Max 1 decorative element per card
* Maintain readability
* Padding: 20–28px

6.2 Organic Button
Concept
Keep button recognizable, enhance with organic wrapping

Structure
[ Blob / Organic Background ]
        ↓
[ Standard Button Shape ]
        ↓
[ Label ]

Properties
* Shape: rounded-full (important for affordance)
* High contrast color
* Organic background offset

Interaction
Instead of shadow:
* slight scale
* small rotation
* soft movement

Prompt Keywords
organic button with soft blob background
playful rounded button
minimal flat button with organic decoration
friendly CTA button

6.3 Input Fields
Strategy
👉 Keep clean, minimal organic touch only

Style
* rounded corners
* soft focus glow (not shadow)
* no distortion

7. Section Layout (Wave / Organic Dividers)
Description
* Use wave or blob shapes to divide sections
* Create flow instead of rigid blocks

Rules
* Max 2–3 per page
* Avoid overuse

Prompt Keywords
wave section divider
organic layout flow
soft curved section transition
fluid layout shapes

8. Color System
Palette Direction
* Warm tones
* Pastel / soft saturation

Example Range
* Beige / Cream
* Soft Yellow
* Light Orange
* Muted Purple
* Soft Blue

Keywords
warm pastel palette
soft neutral colors
earth tone UI
friendly color scheme

9. Design Balance Rule
70 / 30 Rule
* 70% Functional UI (clean, structured)
* 30% Organic / expressive visuals

10. Anti-Patterns (Avoid)
❌ Overusing organic shapes❌ Making buttons unrecognizable❌ Too much noise texture❌ Heavy shadows / realism❌ Full illustration replacing UI
