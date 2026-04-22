# Mine Site Safety Audit App - Implementation Plan

## Objective
To develop a mobile application (Native - React Native/Expo) that assists mine site auditors in identifying, documenting, and resolving safety and health hazards. The app will allow users to take a photo of a potential hazard, leverage Gemini Pro Vision AI to analyze the image, suggest the top 3 likely citation references (e.g., MSHA/OSHA), and provide possible solutions. Users can add manual context, and the app will generate a professional PDF report.

## Key Features & Requirements
1. **Platform:** Native Mobile Application using React Native (Expo).
2. **Camera Integration:** Seamlessly capture photos of hazards directly within the app.
3. **AI Integration:** Use Google Gemini Pro Vision to analyze the captured photo.
   - Output: Top 3 likely citation references (MSHA/OSHA context).
   - Output: Actionable solutions or remediation steps.
4. **User Context Input:** A form for the auditor to add location details, severity, and custom notes alongside the AI suggestions.
5. **PDF Generation:** Compile the photo, AI analysis, user notes, and timestamp/location into a professional-looking PDF report.
6. **Connectivity:** Version 1 assumes an always-online connection (no complex offline queuing required initially).

## Proposed Solution Stack
*   **Frontend / Mobile App:** React Native with Expo (for rapid development and easy camera/file system access).
*   **Backend / API:** Node.js with Express (or Next.js API routes) to securely handle the Gemini API calls and orchestrate PDF generation.
*   **AI Service:** Google Gemini API (specifically the multimodal vision capabilities).
*   **PDF Generation:** `react-native-html-to-pdf` (or an equivalent server-side generator like `puppeteer` if client-side is too restrictive).
*   **Storage (Optional V1):** Local device storage for saving the generated PDFs, with an option to share via native sharing dialogue (email, Slack, etc.).

## Implementation Steps

### Phase 1: Setup and Basic UI
1. Initialize the Expo project (`npx create-expo-app mine-safety-auditor`).
2. Set up navigation (e.g., React Navigation) with main screens: Dashboard, Camera/Capture, Review & Edit, and Report View.
3. Integrate the `expo-camera` module to allow users to snap photos of hazards.

### Phase 2: AI Integration
1. Set up a secure backend service (e.g., a simple Express server or serverless function) to handle API keys.
2. Implement the integration with the Google Gemini API.
3. Craft a strict prompt for the Gemini model: *"You are an expert mine safety auditor. Analyze this image for hazards. Provide the top 3 likely MSHA/OSHA citation references related to what you see. Then, provide 3 practical solutions to address the issue. Format the response cleanly."*
4. Connect the React Native frontend to send the captured image (base64 or upload) to the backend service.

### Phase 3: User Input & Review
1. Build the "Review & Edit" screen where the AI's suggestions are displayed.
2. Add text input fields for the user to override or append to the AI's findings (e.g., Location, Specific Notes, Auditor Name).

### Phase 4: PDF Generation & Sharing
1. Implement PDF generation. Design a clean, professional HTML template (Logo, Date, Location, Photo, Citations, Solutions, Auditor Notes).
2. Use a library to convert this structured data/HTML into a PDF document.
3. Integrate `expo-sharing` to allow the user to easily email the PDF or save it to their device's files.

## Verification & Testing
*   **Camera Tests:** Verify camera permissions and photo capture on both iOS and Android simulators/devices.
*   **AI Accuracy:** Test the Gemini prompt with various sample images of common mine hazards (e.g., un-bermed edges, missing machine guards, poor housekeeping) to ensure the prompt consistently returns structured citation references.
*   **PDF Rendering:** Ensure the generated PDF handles long text gracefully, embeds the image correctly, and looks professional.
*   **End-to-End Flow:** Run through the entire process—snap photo -> analyze -> add notes -> generate PDF -> share—to ensure a smooth user experience.

## Migration & Rollback Strategies
*   Since this is a greenfield project (V1), rollback is not applicable. Version control (Git) will be used to manage features.
*   If device-side PDF generation fails or is inconsistent, we will migrate the PDF generation logic to the Node.js backend to ensure consistency across all devices.