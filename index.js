// Appwrite Function: Add User to Team
// Environment variables required: APPWRITE_API_KEY, APPWRITE_PROJECT_ID

import * as sdk from "node-appwrite";

export default async function (req, res) {
  const body = req.body || {};
  const { userId, teamId, email, name, roles } = body;

  if (!userId || !teamId || !email) {
    return {
      json: { error: "Missing required fields: userId, teamId, email" },
      status: 400
    };
  }

  const client = new sdk.Client();
  client
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const teams = new sdk.Teams(client);

  try {
    const membership = await teams.createMembership(
      teamId,
      email,
      roles || ["ALIADO"],
      undefined, // URL for invitation (not needed for direct add)
      userId,
      name || undefined
    );
    return {
      json: { success: true, membership },
      status: 200
    };
  } catch (error) {
    return {
      json: { error: error.message },
      status: 500
    };
  }
}
