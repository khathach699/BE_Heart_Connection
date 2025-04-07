const { MongoClient } = require("mongodb");

async function checkData() {
  const uri = "mongodb://localhost:27017/";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("heart_connection");

    // Check campaigns collection
    const campaignsCount = await db.collection("campaigns").countDocuments();
    console.log(`Campaigns count: ${campaignsCount}`);

    // Check membercampaigns collection
    const memberCampaignsCount = await db
      .collection("membercampaigns")
      .countDocuments();
    console.log(`Member campaigns count: ${memberCampaignsCount}`);

    // Check imgcampaigns collection
    const imgCampaignsCount = await db
      .collection("imgcampaigns")
      .countDocuments();
    console.log(`Image campaigns count: ${imgCampaignsCount}`);

    // Check one member campaign with actual userId
    const memberCampaign = await db
      .collection("membercampaigns")
      .findOne({ UserID: { $exists: true } });
    if (memberCampaign) {
      console.log("Sample member campaign:", memberCampaign);

      // Find campaigns for this UserID
      const userCampaigns = await db
        .collection("membercampaigns")
        .find({ UserID: memberCampaign.UserID })
        .toArray();
      console.log(
        `Found ${userCampaigns.length} campaigns for user ${memberCampaign.UserID}`
      );
    } else {
      console.log("No member campaigns found");
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
    console.log("Connection closed");
  }
}

checkData().catch(console.error);
