const { MongoClient, ObjectId } = require("mongodb");
const fs = require("fs");
const path = require("path");

// Kết nối MongoDB
async function importData() {
  const uri = "mongodb://localhost:27017/";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("heart_connection");
    console.log("Using database:", db.databaseName);

    // Import campaigns
    try {
      const campaignsPath = path.join(__dirname, "../data/campaigns.json");
      console.log("Reading campaigns from:", campaignsPath);
      let campaigns = JSON.parse(fs.readFileSync(campaignsPath, "utf8"));
      console.log("Found campaigns:", campaigns.length);

      // Chuyển đổi các chuỗi ID thành ObjectId
      campaigns = campaigns.map((item) => ({
        ...item,
        _id: new ObjectId(item._id),
      }));

      // Xóa dữ liệu cũ (tùy chọn)
      await db.collection("campaigns").deleteMany({});

      // Import dữ liệu mới
      const campaignResult = await db
        .collection("campaigns")
        .insertMany(campaigns);
      console.log(`${campaignResult.insertedCount} campaigns were inserted`);
    } catch (err) {
      console.error("Error importing campaigns:", err);
    }

    // Import member campaigns
    try {
      const memberCampaignsPath = path.join(
        __dirname,
        "../data/memberCampaigns.json"
      );
      console.log("Reading member campaigns from:", memberCampaignsPath);
      let memberCampaigns = JSON.parse(
        fs.readFileSync(memberCampaignsPath, "utf8")
      );
      console.log("Found member campaigns:", memberCampaigns.length);

      // Chuyển đổi các chuỗi ID thành ObjectId
      memberCampaigns = memberCampaigns.map((item) => ({
        ...item,
        UserID: new ObjectId(item.UserID),
        CampID: new ObjectId(item.CampID),
      }));

      // Xóa dữ liệu cũ (tùy chọn)
      await db.collection("membercampaigns").deleteMany({});

      // Import dữ liệu mới
      const memberResult = await db
        .collection("membercampaigns")
        .insertMany(memberCampaigns);

      console.log(
        `${memberResult.insertedCount} member campaigns were inserted`
      );
    } catch (err) {
      console.error("Error importing member campaigns:", err);
    }

    // Import image campaigns
    try {
      const imgCampaignsPath = path.join(
        __dirname,
        "../data/imgCampaigns.json"
      );
      console.log("Reading image campaigns from:", imgCampaignsPath);
      let imgCampaigns = JSON.parse(fs.readFileSync(imgCampaignsPath, "utf8"));
      console.log("Found image campaigns:", imgCampaigns.length);

      // Chuyển đổi các chuỗi ID thành ObjectId
      imgCampaigns = imgCampaigns.map((item) => ({
        ...item,
        CampID: new ObjectId(item.CampID),
      }));

      // Xóa dữ liệu cũ (tùy chọn)
      await db.collection("imgcampaigns").deleteMany({});

      // Import dữ liệu mới
      const imgResult = await db
        .collection("imgcampaigns")
        .insertMany(imgCampaigns);

      console.log(`${imgResult.insertedCount} image campaigns were inserted`);
    } catch (err) {
      console.error("Error importing image campaigns:", err);
    }
  } catch (err) {
    console.error("General error:", err);
  } finally {
    await client.close();
    console.log("Connection closed");
  }
}

importData().catch(console.error);
