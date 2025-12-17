// Appwrite Function: Add User to Team
// Environment variables required: APPWRITE_API_KEY, APPWRITE_PROJECT_ID

const sdk = require("node-appwrite");

module.exports = async function (req, res) {
  const { userId, teamId, email, name, roles } = req.body;

  if (!userId || !teamId || !email) {
    return res.json(
      { error: "Missing required fields: userId, teamId, email" },
      400
    );
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
    return res.json({ success: true, membership });
  } catch (error) {
    return res.json({ error: error.message }, 500);
  }
};
