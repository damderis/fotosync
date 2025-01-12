import {onRequest} from "firebase-functions/v2/https";
import {onValueCreated} from "firebase-functions/v2/database";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

// Initialize Firebase Admin
admin.initializeApp();

// Simple test function to verify HTTPS endpoints
export const testEndpoint = onRequest(async (request, response) => {
  try {
    response.json({
      success: true,
      message: "Firebase Functions is working!",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Test endpoint error:", error);
    response.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Simple test function to verify database triggers
export const onNewSlot = onValueCreated("/available_slots/{slotId}",
  async (event) => {
    const slotData = event.data.val();
    const slotId = event.params.slotId;

    // Just log the new slot creation
    logger.info(`New slot created with ID: ${slotId}`, slotData);
  });
