# Form Builder

A self-contained web tool for building offline questionnaires. Create a custom form visually, see a live preview, and export two ready-to-deploy pages: a patient page that collects answers and encodes them into a QR code on the device, and a provider page that reads the code and produces a paste-ready note plus trends across visits. Nothing is transmitted at any stage, by the builder or by the pages it produces.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The form builder. Single self-contained file. Open it and start building. |
| `build/generator-template.html` | The builder UI, before the runtime and libraries are embedded. |
| `build/runtime-template.html` | The runtime that becomes the exported patient and provider pages. |
| `build/vendor/qrcode.js` | QR encoder (Kazuhiko Arase, MIT), embedded for patient pages. |
| `build/vendor/jsQR.js` | QR decoder (cozmo, Apache-2.0), embedded for provider pages. |
| `build/build-generator.js` | Assembles `index.html` by base64-embedding the runtime and libraries. |

`index.html` already contains everything (the runtime and both QR libraries are embedded), so it works offline from a local file or any static host. The `build/` folder is only needed to change the runtime or update the libraries.

## Using the builder

1. Open `index.html`.
2. Set the form title, add sections, and add questions. For each question pick a type, and for choice types add the options.
3. Watch the live preview on the right update as you edit. Toggle the preview between the patient and provider views.
4. Export:
   - Export patient page downloads `index.html` (the questionnaire the patient fills in).
   - Export provider page downloads `provider.html` (the decoder and trends view).
   - Save form (.json) downloads the form definition so you can reload and keep editing it later.
   - Export FHIR downloads a FHIR R4 Questionnaire mirroring the form, for an Epic build team.
   - Load form re-imports a saved `.json` definition.

The patient and provider pages you export always share the exact same form, so a code produced by one decodes in the other.

## Field types

- Yes / No
- Short text, Long text
- Number (with optional min, max, step). Every numeric field is automatically chartable over visits in the provider trends view.
- Date, Time
- Dropdown (choose one)
- Radio buttons (choose one)
- Checkboxes (choose many)
- Table (repeating rows over named columns, up to a row limit)

Any question can be marked required, and any question can be shown only when an earlier Yes/No question is answered Yes (the "Show" control).

## Multi-code display for scanning

When a response is long enough to need more than one QR code, the patient page shows all the codes as a grid with a note to tap one. Tapping a code enlarges it and hides the others, so only one code is on screen at a time and a handheld or camera scanner cannot lock onto the wrong one. Previous and Next step through the codes while keeping only one visible, and Show all returns to the grid. Short responses produce a single code with no isolation step.

## Deploying an exported form

Host the patient page (`index.html`) publicly; the provider page (`provider.html`) does not need to be public and can live on an authenticated path or as a local file on the workstation. Camera scanning requires HTTPS (or localhost); the paste, photo, and handheld-scanner paths work anywhere.

## Rebuild from source

Edit `build/generator-template.html` (the builder) or `build/runtime-template.html` (the exported-page behavior), then:

```bash
node build/build-generator.js
```

This regenerates `index.html` (the builder) with the current runtime and libraries embedded. To update the QR libraries, replace the files in `build/vendor/` and rebuild.

## License

The bundled QR libraries are third-party and retain their own licenses (MIT and Apache-2.0); see `THIRD-PARTY-NOTICES.md` and `licenses/`. This repository does not declare a license for its own code, which by default reserves all rights. If you intend others to reuse it, add a `LICENSE` file with the terms you choose.

## Privacy

The builder makes no network calls, and neither do the pages it exports. Answers stay on the device that runs the patient page; the QR code or text code is the only thing that carries them, and it passes directly from the patient screen to the provider. A completed code encodes the patient's answers, so treat it as protected health information: control the code, and do not host completed responses.