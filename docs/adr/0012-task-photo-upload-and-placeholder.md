# 0012. Task Photo Local File Upload, Drag-and-Drop, and Default Placeholder

Date: 2026-08-31
Status: Accepted

## Context
Users required the ability to directly upload task machinery and on-site photos from their local machine or mobile camera (without requiring pre-hosted public URLs), with a clear and inviting placeholder stating "รอใส่รูปภาพ" when no image is uploaded.

## Decisions
1. **Default "รอใส่รูปภาพ" Placeholder**:
   - When `task.imageUrl` is not provided or empty, display an Apple-inspired dashed placeholder with a camera icon and the text "รอใส่รูปภาพ / คลิกหรือลากรูปมาวางที่นี่".
2. **Comprehensive Upload Capabilities**:
   - **Local File / Mobile Camera**: Direct upload via hidden `<input type="file" accept="image/*">`.
   - **Drag and Drop**: Support dropping image files directly onto the placeholder card or the edit modal.
   - **Base64 Data URL Encoding**: Instant local persistence via Data URLs across task store and API endpoints.
   - **Remove / Reset**: One-click "ลบรูป" action to revert back to the "รอใส่รูปภาพ" placeholder anytime.
   - **External URL Fallback**: Secondary text input for pasting direct web image URLs.

## Consequences
- Site technicians can instantly upload workshop photos from mobile devices or workstations.
- Empty states are clean, intuitive, and clearly indicate that a photo is pending.
