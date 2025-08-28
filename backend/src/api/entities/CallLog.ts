// Base44/ai-caseclerk/API/CallLog

/**
 * CallLog API service for CaseClerk AI backend.
 * Handles CRUD operations for call log entities including case associations,
 * call metadata, transcripts, summaries, and action items.
 * Integrates with Base44 platform for data persistence.
 */

// JavaScript Example: Reading Entities
// Filterable fields: case_id, to_number, from_number, started_at, ended_at, duration, recording_url, transcript, summary, call_status, call_purpose, notes, action_items
async function fetchCallLogEntities() {
    const response = await fetch(`https://app.base44.com/api/apps/68a362a1664b8f811bac8895/entities/CallLog`, {
        headers: {
            'api_key': '0fdc722fdcac4237a61e75148cf3f8b1', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);
}

// JavaScript Example: Updating an Entity
// Filterable fields: case_id, to_number, from_number, started_at, ended_at, duration, recording_url, transcript, summary, call_status, call_purpose, notes, action_items
async function updateCallLogEntity(entityId, updateData) {
    const response = await fetch(`https://app.base44.com/api/apps/68a362a1664b8f811bac8895/entities/CallLog/${entityId}`, {
        method: 'PUT',
        headers: {
            'api_key': '0fdc722fdcac4237a61e75148cf3f8b1', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    console.log(data);
}