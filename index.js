// Appwrite Function: Add User to Team
// Environment variables required: APPWRITE_API_KEY, APPWRITE_PROJECT_ID


export default async ({ req, log, error }) => {
  log("Function started");
  log("Request body:", req.body);

  // Defensive: parse body if needed
  let body = req.body;
  if (typeof body === "string") {
    if (!body.trim()) {
      error("Empty request body");
      return {
        json: { error: "Request body is empty" },
        status: 400
      };
    }
    try {
      body = JSON.parse(body);
      log("Parsed body:", body);
    } catch (e) {
      error("Failed to parse body as JSON", e);
      return {
        json: { error: "Invalid JSON body" },
        status: 400
      };
    }
  }

  const { userId, teamId, email, name, roles } = body || {};
  log(
    "userId:", userId,
    "teamId:", teamId,
    "email:", email,
    "name:", name,
    "roles:", roles
  );

  if (!userId || !teamId || !email) {
    error("Missing required fields", { userId, teamId, email });
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
      undefined, // No invite URL
      userId,
      name || undefined
    );
    log("Membership created:", membership);
    return {
      json: { success: true, membership },
      status: 200
    };
  } catch (err) {
    error("Team assignment failed:", err.message, err);
    return {
      json: { error: err.message },
      status: 500
    };
  }
};


